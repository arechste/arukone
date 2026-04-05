import { useState, useCallback, useRef } from 'react';
import type { Cell, DrawingState, Puzzle, HistoryEntry } from '../lib/types';
import { cellKey, isAdjacent, interpolateCells, checkWin } from '../lib/gameLogic';

interface UseDrawingProps {
  puzzle: Puzzle;
  solved: boolean;
  onWin: () => void;
  onMove: () => void;
  onStart: () => void;
  started: boolean;
}

export function useDrawing({ puzzle, solved, onWin, onMove, onStart, started }: UseDrawingProps) {
  const [playerPaths, setPlayerPaths] = useState<Map<number, Cell[]>>(new Map());
  const [drawing, setDrawing] = useState<DrawingState | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const hasMovedRef = useRef(false);

  const occupiedMap = useCallback((): Record<string, number> => {
    const map: Record<string, number> = {};
    for (const [pairId, cells] of playerPaths) {
      cells.forEach(c => { map[cellKey(c.r, c.c)] = pairId; });
    }
    return map;
  }, [playerPaths]);

  const endpointMap = useCallback((): Record<string, number> => {
    const map: Record<string, number> = {};
    puzzle.endpoints.forEach(ep => {
      map[cellKey(ep.start.r, ep.start.c)] = ep.id;
      map[cellKey(ep.end.r, ep.end.c)] = ep.id;
    });
    return map;
  }, [puzzle]);

  const getCellFromPointer = useCallback((clientX: number, clientY: number): Cell | null => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const cellW = rect.width / puzzle.cols;
    const cellH = rect.height / puzzle.rows;
    const col = Math.floor(x / cellW);
    const row = Math.floor(y / cellH);
    if (row < 0 || row >= puzzle.rows || col < 0 || col >= puzzle.cols) return null;
    return { r: row, c: col };
  }, [puzzle]);

  const findPairForCell = useCallback((r: number, c: number): number | null => {
    const epMap = endpointMap();
    const k = cellKey(r, c);
    if (epMap[k] !== undefined) return epMap[k];
    return null;
  }, [endpointMap]);

  const tryAddCell = useCallback((cell: Cell, currentCells: Cell[], drawingState: DrawingState): { cells: Cell[]; changed: boolean } | null => {
    const backIdx = currentCells.findIndex(c => c.r === cell.r && c.c === cell.c);
    if (backIdx >= 0) return { cells: currentCells.slice(0, backIdx + 1), changed: true };

    if (currentCells.length >= 2) {
      const ep = puzzle.endpoints[drawingState.pairId];
      const last = currentCells[currentCells.length - 1];
      const first = currentCells[0];
      const otherEnd = (first.r === ep.start.r && first.c === ep.start.c) ? ep.end : ep.start;
      if (last.r === otherEnd.r && last.c === otherEnd.c) return null;
    }

    const k = cellKey(cell.r, cell.c);
    const occMap = occupiedMap();

    if (occMap[k] !== undefined && occMap[k] !== drawingState.pairId) return null;

    const cellPair = findPairForCell(cell.r, cell.c);
    if (cellPair !== null && cellPair !== drawingState.pairId) return null;

    return { cells: [...currentCells, cell], changed: true };
  }, [occupiedMap, findPairForCell, puzzle]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (solved) return;
    e.preventDefault();
    if (gridRef.current) gridRef.current.setPointerCapture(e.pointerId);

    const cell = getCellFromPointer(e.clientX, e.clientY);
    if (!cell) return;
    hasMovedRef.current = false;

    const k = cellKey(cell.r, cell.c);
    const pairId = findPairForCell(cell.r, cell.c);

    if (pairId !== null) {
      if (!started) onStart();
      setPlayerPaths(prev => {
        const next = new Map(prev);
        next.delete(pairId);
        return next;
      });
      setDrawing({ pairId, cells: [cell] });
    } else if (occupiedMap()[k] !== undefined) {
      setDrawing(null);
    }
  }, [solved, getCellFromPointer, findPairForCell, started, onStart, occupiedMap]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!drawing || solved) return;
    e.preventDefault();
    const cell = getCellFromPointer(e.clientX, e.clientY);
    if (!cell) return;
    hasMovedRef.current = true;

    const lastCell = drawing.cells[drawing.cells.length - 1];
    if (cell.r === lastCell.r && cell.c === lastCell.c) return;

    if (isAdjacent(cell, lastCell)) {
      const result = tryAddCell(cell, drawing.cells, drawing);
      if (result) {
        setDrawing(prev => prev ? { ...prev, cells: result.cells } : null);
        if (navigator.vibrate) navigator.vibrate(8);
      }
      return;
    }

    const intermediates = interpolateCells(lastCell, cell);
    if (intermediates.length > 0) {
      let currentCells = [...drawing.cells];
      let added = false;
      for (const mid of intermediates) {
        const result = tryAddCell(mid, currentCells, drawing);
        if (!result) break;
        currentCells = result.cells;
        added = true;
      }
      if (added) {
        setDrawing(prev => prev ? { ...prev, cells: currentCells } : null);
        if (navigator.vibrate) navigator.vibrate(8);
      }
    }
  }, [drawing, solved, getCellFromPointer, tryAddCell]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (solved) return;
    if (gridRef.current && gridRef.current.hasPointerCapture(e.pointerId)) {
      gridRef.current.releasePointerCapture(e.pointerId);
    }

    if (!drawing) {
      if (!hasMovedRef.current) {
        const cell = getCellFromPointer(e.clientX, e.clientY);
        if (cell) {
          const k = cellKey(cell.r, cell.c);
          const occMap = occupiedMap();
          if (occMap[k] !== undefined) {
            const pairToRemove = occMap[k];
            setHistory(prev => [...prev, { action: 'remove', pairId: pairToRemove, cells: playerPaths.get(pairToRemove) }]);
            setPlayerPaths(prev => {
              const next = new Map(prev);
              next.delete(pairToRemove);
              return next;
            });
            if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
          }
        }
      }
      return;
    }

    if (drawing.cells.length >= 3) {
      const ep = puzzle.endpoints[drawing.pairId];
      const first = drawing.cells[0];
      const last = drawing.cells[drawing.cells.length - 1];
      const connectsStart = (r: number, c: number) => (r === ep.start.r && c === ep.start.c);
      const connectsEnd = (r: number, c: number) => (r === ep.end.r && c === ep.end.c);
      const isComplete =
        (connectsStart(first.r, first.c) && connectsEnd(last.r, last.c)) ||
        (connectsEnd(first.r, first.c) && connectsStart(last.r, last.c));

      if (isComplete) {
        const newPaths = new Map(playerPaths);
        newPaths.set(drawing.pairId, [...drawing.cells]);
        setPlayerPaths(newPaths);
        onMove();
        setHistory(prev => [...prev, { action: 'draw', pairId: drawing.pairId }]);

        if (checkWin(newPaths, puzzle)) {
          onWin();
        }
      }
    }
    setDrawing(null);
  }, [drawing, solved, getCellFromPointer, occupiedMap, playerPaths, puzzle, onWin, onMove]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    if (last.action === 'draw') {
      setPlayerPaths(prev => { const n = new Map(prev); n.delete(last.pairId); return n; });
    } else if (last.action === 'remove' && last.cells) {
      setPlayerPaths(prev => { const n = new Map(prev); n.set(last.pairId, last.cells!); return n; });
    }
  }, [history]);

  const resetDrawing = useCallback(() => {
    setPlayerPaths(new Map());
    setHistory([]);
    setDrawing(null);
  }, []);

  return {
    playerPaths,
    drawing,
    history,
    gridRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleUndo,
    resetDrawing,
  };
}
