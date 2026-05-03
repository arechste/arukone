import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { getThemeVars } from '../lib/theme';
import type { GameStats, PairStatus } from '../lib/types';
import { cellKey, getDailySeed } from '../lib/gameLogic';
import { loadPuzzle, getDifficulties } from '../lib/puzzles';
import { useDrawing } from './useDrawing';
import { useTimer, formatTime } from './useTimer';
import { usePersistence } from './usePersistence';
import { PATH_COLORS } from '../lib/constants';

export function useGameState() {
  const [theme, setTheme] = useState('dark');
  const [difficulty, setDifficulty] = useState('easy');
  const [puzzleIndex, setPuzzleIndex] = useState(() => getDailySeed() % 200);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const [hintMap, setHintMap] = useState<Record<string, string> | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const difficulties = useMemo(() => getDifficulties(), []);
  const { stats, saveStats } = usePersistence();
  const { timer, started, start: startTimer, stop: stopTimer, reset: resetTimer } = useTimer();

  const puzzle = useMemo(
    () => loadPuzzle(difficulty, puzzleIndex)!,
    [difficulty, puzzleIndex]
  );

  const handleWin = useCallback(() => {
    setSolved(true);
    stopTimer();
    if (navigator.vibrate) navigator.vibrate([50, 50, 50, 50, 100]);

    const newStats: GameStats = {
      ...stats,
      bestTimes: { ...stats.bestTimes },
      totalSolved: (stats.totalSolved || 0) + 1,
    };
    const prev = newStats.bestTimes[difficulty];
    if (!prev || timer < prev) newStats.bestTimes[difficulty] = timer;
    saveStats(newStats);
  }, [stopTimer, stats, saveStats, difficulty, timer]);

  const handleMove = useCallback(() => {
    setMoves(m => m + 1);
  }, []);

  const {
    playerPaths, drawing, history, gridRef,
    handlePointerDown, handlePointerMove, handlePointerUp,
    handleUndo, resetDrawing,
  } = useDrawing({
    puzzle,
    solved,
    onWin: handleWin,
    onMove: handleMove,
    onStart: startTimer,
    started,
  });

  const handleReset = useCallback(() => {
    resetDrawing();
    setMoves(0);
    setSolved(false);
    resetTimer();
    setHintMap(null);
    setShowSolution(false);
  }, [resetDrawing, resetTimer]);

  const handleNewPuzzle = useCallback(() => {
    setPuzzleIndex(s => s + 1);
    handleReset();
  }, [handleReset]);

  const handleDifficulty = useCallback((diff: string) => {
    setDifficulty(diff);
    resetDrawing();
    setMoves(0);
    setSolved(false);
    resetTimer();
    setHintMap(null);
    setShowSolution(false);
    setPuzzleIndex(getDailySeed() % 200);
  }, [resetDrawing, resetTimer]);

  const handleToggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const vars = getThemeVars(theme);
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
    root.dataset.theme = theme;
  }, [theme]);

  const handleHint = useCallback(() => {
    if (hintMap) {
      setHintMap(null);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      return;
    }

    if (playerPaths.size === 0) return;
    const results: Record<string, string> = {};

    const solNeighbors: Record<string, { pairId: number; neighbors: Set<string> }> = {};
    for (let pairId = 0; pairId < puzzle.segments.length; pairId++) {
      const seg = puzzle.segments[pairId];
      for (let i = 0; i < seg.length; i++) {
        const k = cellKey(seg[i].r, seg[i].c);
        if (!solNeighbors[k]) solNeighbors[k] = { pairId, neighbors: new Set() };
        if (i > 0) solNeighbors[k].neighbors.add(cellKey(seg[i - 1].r, seg[i - 1].c));
        if (i < seg.length - 1) solNeighbors[k].neighbors.add(cellKey(seg[i + 1].r, seg[i + 1].c));
      }
    }

    for (const [pairId, cells] of playerPaths) {
      const ep = puzzle.endpoints[pairId];
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const isEp = (cell.r === ep.start.r && cell.c === ep.start.c) ||
                     (cell.r === ep.end.r && cell.c === ep.end.c);
        if (isEp) continue;

        const k = cellKey(cell.r, cell.c);
        const sol = solNeighbors[k];

        if (!sol || sol.pairId !== pairId) {
          results[k] = 'wrong';
          continue;
        }

        let connectionsCorrect = true;
        if (i > 0) {
          const prevK = cellKey(cells[i - 1].r, cells[i - 1].c);
          if (!sol.neighbors.has(prevK)) connectionsCorrect = false;
        }
        if (i < cells.length - 1) {
          const nextK = cellKey(cells[i + 1].r, cells[i + 1].c);
          if (!sol.neighbors.has(nextK)) connectionsCorrect = false;
        }

        results[k] = connectionsCorrect ? 'correct' : 'wrong';
      }
    }

    setHintMap(results);
    if (navigator.vibrate) navigator.vibrate(20);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setHintMap(null), 5000);
  }, [hintMap, playerPaths, puzzle]);

  const handleRevealSolution = useCallback(() => {
    setShowSolution(prev => !prev);
  }, []);

  const pairStatuses = useMemo((): PairStatus[] => {
    return puzzle.endpoints.map(ep => {
      const cells = playerPaths.get(ep.id);
      if (!cells) return 'empty';
      const first = cells[0], last = cells[cells.length - 1];
      const endpoints = [ep.start, ep.end];
      const touchesStart = endpoints.some(e => e.r === first.r && e.c === first.c);
      const touchesEnd = endpoints.some(e => e.r === last.r && e.c === last.c);
      if (touchesStart && touchesEnd && (first.r !== last.r || first.c !== last.c)) return 'connected';
      return 'partial';
    });
  }, [playerPaths, puzzle]);

  const getCellContent = useCallback((r: number, c: number) => {
    const epMap: Record<string, number> = {};
    puzzle.endpoints.forEach(ep => {
      epMap[cellKey(ep.start.r, ep.start.c)] = ep.id;
      epMap[cellKey(ep.end.r, ep.end.c)] = ep.id;
    });

    const k = cellKey(r, c);
    const pairId = epMap[k];
    const isEndpoint = pairId !== undefined;

    let drawColor: string | null = null;
    let drawConnections: { up: boolean; down: boolean; left: boolean; right: boolean } | null = null;
    if (drawing) {
      const drawIdx = drawing.cells.findIndex(cell => cell.r === r && cell.c === c);
      if (drawIdx >= 0) {
        drawColor = PATH_COLORS[drawing.pairId % PATH_COLORS.length];
        drawConnections = {
          up: (drawIdx > 0 && drawing.cells[drawIdx - 1].r === r - 1 && drawing.cells[drawIdx - 1].c === c)
            || (drawIdx < drawing.cells.length - 1 && drawing.cells[drawIdx + 1].r === r - 1 && drawing.cells[drawIdx + 1].c === c),
          down: (drawIdx > 0 && drawing.cells[drawIdx - 1].r === r + 1 && drawing.cells[drawIdx - 1].c === c)
            || (drawIdx < drawing.cells.length - 1 && drawing.cells[drawIdx + 1].r === r + 1 && drawing.cells[drawIdx + 1].c === c),
          left: (drawIdx > 0 && drawing.cells[drawIdx - 1].r === r && drawing.cells[drawIdx - 1].c === c - 1)
            || (drawIdx < drawing.cells.length - 1 && drawing.cells[drawIdx + 1].r === r && drawing.cells[drawIdx + 1].c === c - 1),
          right: (drawIdx > 0 && drawing.cells[drawIdx - 1].r === r && drawing.cells[drawIdx - 1].c === c + 1)
            || (drawIdx < drawing.cells.length - 1 && drawing.cells[drawIdx + 1].r === r && drawing.cells[drawIdx + 1].c === c + 1),
        };
      }
    }

    let pathColor: string | null = null;
    let pathConnections: { up: boolean; down: boolean; left: boolean; right: boolean } | null = null;
    if (!drawColor) {
      for (const [pid, cells] of playerPaths) {
        const idx = cells.findIndex(cell => cell.r === r && cell.c === c);
        if (idx >= 0) {
          pathColor = PATH_COLORS[pid % PATH_COLORS.length];
          pathConnections = {
            up: (idx > 0 && cells[idx - 1].r === r - 1 && cells[idx - 1].c === c)
              || (idx < cells.length - 1 && cells[idx + 1].r === r - 1 && cells[idx + 1].c === c),
            down: (idx > 0 && cells[idx - 1].r === r + 1 && cells[idx - 1].c === c)
              || (idx < cells.length - 1 && cells[idx + 1].r === r + 1 && cells[idx + 1].c === c),
            left: (idx > 0 && cells[idx - 1].r === r && cells[idx - 1].c === c - 1)
              || (idx < cells.length - 1 && cells[idx + 1].r === r && cells[idx + 1].c === c - 1),
            right: (idx > 0 && cells[idx - 1].r === r && cells[idx - 1].c === c + 1)
              || (idx < cells.length - 1 && cells[idx + 1].r === r && cells[idx + 1].c === c + 1),
          };
          break;
        }
      }
    }

    return {
      isEndpoint,
      pairId,
      activeColor: drawColor || pathColor,
      connections: drawConnections || pathConnections,
      isDrawing: !!drawColor,
    };
  }, [drawing, playerPaths, puzzle]);

  return {
    theme, difficulty, puzzle, timer, moves, solved, started,
    hintMap, showSolution, stats, difficulties, pairStatuses,
    playerPaths, drawing, history, gridRef,
    handlePointerDown, handlePointerMove, handlePointerUp,
    handleUndo, handleReset, handleNewPuzzle, handleDifficulty,
    handleToggleTheme, handleHint, handleRevealSolution,
    getCellContent, formatTime,
  };
}
