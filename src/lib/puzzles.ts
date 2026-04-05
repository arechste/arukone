import puzzleBank from '../data/puzzleBank.json';
import type { Puzzle, PuzzleBank, DifficultyConfig, Cell } from './types';

const PUZZLE_BANK = puzzleBank as PuzzleBank;

function tracePath(solutionGrid: number[][], rows: number, cols: number, pairId: number, startR: number, startC: number): Cell[] {
  const visited = new Set<string>();
  const path: Cell[] = [];
  let r = startR, c = startC;
  visited.add(`${r},${c}`);
  path.push({ r, c });

  let changed = true;
  while (changed) {
    changed = false;
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (visited.has(`${nr},${nc}`)) continue;
      if (solutionGrid[nr][nc] !== pairId) continue;
      visited.add(`${nr},${nc}`);
      path.push({ r: nr, c: nc });
      r = nr; c = nc;
      changed = true;
      break;
    }
  }
  return path;
}

export function loadPuzzle(difficulty: string, index: number): Puzzle | null {
  const bank = PUZZLE_BANK[difficulty];
  if (!bank || !bank.z || !bank.z.length) return null;
  const idx = index % bank.z.length;
  const p = bank.z[idx];
  const rows = bank.r, cols = bank.c, pairs = bank.p;

  const endpoints = p.e.map((ep, i) => ({
    id: i, start: { r: ep[0], c: ep[1] }, end: { r: ep[2], c: ep[3] },
  }));

  const solutionGrid = p.s;

  const segments = endpoints.map(ep =>
    tracePath(solutionGrid, rows, cols, ep.id, ep.start.r, ep.start.c)
  );

  return { rows, cols, pairs, endpoints, solutionGrid, segments };
}

export function getDifficulties(): Record<string, DifficultyConfig> {
  const labels: Record<string, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard', extreme: 'Extreme' };
  const difficulties: Record<string, DifficultyConfig> = {};
  for (const [key, data] of Object.entries(PUZZLE_BANK)) {
    difficulties[key] = { label: labels[key] || key, rows: data.r, cols: data.c, pairs: data.p };
  }
  return difficulties;
}
