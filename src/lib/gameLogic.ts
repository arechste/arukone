import type { Cell, Puzzle } from './types';

export function cellKey(r: number, c: number): string {
  return `${r},${c}`;
}

export function isAdjacent(a: Cell, b: Cell): boolean {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;
}

export function interpolateCells(from: Cell, to: Cell): Cell[] {
  const cells: Cell[] = [];
  if (from.r === to.r && from.c !== to.c) {
    const step = to.c > from.c ? 1 : -1;
    for (let c = from.c + step; step > 0 ? c <= to.c : c >= to.c; c += step) {
      cells.push({ r: from.r, c });
    }
  } else if (from.c === to.c && from.r !== to.r) {
    const step = to.r > from.r ? 1 : -1;
    for (let r = from.r + step; step > 0 ? r <= to.r : r >= to.r; r += step) {
      cells.push({ r, c: from.c });
    }
  }
  return cells;
}

export function checkWin(playerPaths: Map<number, Cell[]>, puzzle: Puzzle): boolean {
  if (playerPaths.size !== puzzle.pairs) return false;
  const occupied = new Set<string>();
  for (const [pairId, cells] of playerPaths) {
    const ep = puzzle.endpoints[pairId];
    if (cells.length < 2) return false;
    const first = cells[0], last = cells[cells.length - 1];
    const startsOk = (first.r === ep.start.r && first.c === ep.start.c) ||
                     (first.r === ep.end.r && first.c === ep.end.c);
    const endsOk = (last.r === ep.start.r && last.c === ep.start.c) ||
                   (last.r === ep.end.r && last.c === ep.end.c);
    if (!startsOk || !endsOk) return false;
    if (first.r === last.r && first.c === last.c) return false;
    for (const cell of cells) {
      const k = cellKey(cell.r, cell.c);
      if (occupied.has(k)) return false;
      occupied.add(k);
    }
  }
  return occupied.size === puzzle.rows * puzzle.cols;
}

export function createRNG(seed: number): () => number {
  let s = seed | 0;
  return () => { s = (s * 1664525 + 1013904223) | 0; return (s >>> 0) / 4294967296; };
}

export function getDailySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
