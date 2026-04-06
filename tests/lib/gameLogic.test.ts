import { cellKey, isAdjacent, interpolateCells, checkWin, createRNG, getDailySeed } from '../../src/lib/gameLogic';
import type { Cell, Puzzle } from '../../src/lib/types';

describe('cellKey', () => {
  it('formats row,col as string', () => {
    expect(cellKey(0, 0)).toBe('0,0');
    expect(cellKey(3, 7)).toBe('3,7');
  });
});

describe('isAdjacent', () => {
  it('returns true for horizontally adjacent cells', () => {
    expect(isAdjacent({ r: 0, c: 0 }, { r: 0, c: 1 })).toBe(true);
  });

  it('returns true for vertically adjacent cells', () => {
    expect(isAdjacent({ r: 0, c: 0 }, { r: 1, c: 0 })).toBe(true);
  });

  it('returns false for diagonal cells', () => {
    expect(isAdjacent({ r: 0, c: 0 }, { r: 1, c: 1 })).toBe(false);
  });

  it('returns false for the same cell', () => {
    expect(isAdjacent({ r: 0, c: 0 }, { r: 0, c: 0 })).toBe(false);
  });

  it('returns false for cells two apart', () => {
    expect(isAdjacent({ r: 0, c: 0 }, { r: 0, c: 2 })).toBe(false);
  });
});

describe('interpolateCells', () => {
  it('fills horizontal gap going right', () => {
    const result = interpolateCells({ r: 0, c: 0 }, { r: 0, c: 3 });
    expect(result).toEqual([{ r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }]);
  });

  it('fills horizontal gap going left', () => {
    const result = interpolateCells({ r: 0, c: 3 }, { r: 0, c: 0 });
    expect(result).toEqual([{ r: 0, c: 2 }, { r: 0, c: 1 }, { r: 0, c: 0 }]);
  });

  it('fills vertical gap going down', () => {
    const result = interpolateCells({ r: 0, c: 0 }, { r: 2, c: 0 });
    expect(result).toEqual([{ r: 1, c: 0 }, { r: 2, c: 0 }]);
  });

  it('fills vertical gap going up', () => {
    const result = interpolateCells({ r: 2, c: 0 }, { r: 0, c: 0 });
    expect(result).toEqual([{ r: 1, c: 0 }, { r: 0, c: 0 }]);
  });

  it('returns empty for diagonal movement', () => {
    expect(interpolateCells({ r: 0, c: 0 }, { r: 1, c: 1 })).toEqual([]);
  });

  it('returns empty for same cell', () => {
    expect(interpolateCells({ r: 0, c: 0 }, { r: 0, c: 0 })).toEqual([]);
  });

  it('returns single cell for adjacent cells', () => {
    expect(interpolateCells({ r: 0, c: 0 }, { r: 0, c: 1 })).toEqual([{ r: 0, c: 1 }]);
  });
});

describe('checkWin', () => {
  // 2x2 puzzle with 1 pair: A at (0,0) and (1,1)
  // Solution: (0,0)->(0,1)->(1,1) won't fill all cells
  // Need a puzzle where paths can fill all cells

  // 2x3 puzzle, 1 pair: endpoints at (0,0) and (1,0)
  // Path: (0,0)->(0,1)->(0,2)->(1,2)->(1,1)->(1,0) fills all 6 cells
  const puzzle: Puzzle = {
    rows: 2,
    cols: 3,
    pairs: 1,
    endpoints: [{ id: 0, start: { r: 0, c: 0 }, end: { r: 1, c: 0 } }],
    solutionGrid: [[0, 0, 0], [0, 0, 0]],
    segments: [],
  };

  const winningPath: Cell[] = [
    { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 },
    { r: 1, c: 2 }, { r: 1, c: 1 }, { r: 1, c: 0 },
  ];

  it('returns true when all cells filled and paths connect endpoints', () => {
    const paths = new Map([[0, winningPath]]);
    expect(checkWin(paths, puzzle)).toBe(true);
  });

  it('returns false when not all pairs have paths', () => {
    expect(checkWin(new Map(), puzzle)).toBe(false);
  });

  it('returns false when path does not connect endpoints', () => {
    const badPath: Cell[] = [
      { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 },
      { r: 1, c: 2 }, { r: 1, c: 1 },
    ];
    const paths = new Map([[0, badPath]]);
    expect(checkWin(paths, puzzle)).toBe(false);
  });

  it('returns false when cells overlap between paths', () => {
    // 2x2 puzzle, 2 pairs
    const p2: Puzzle = {
      rows: 2, cols: 2, pairs: 2,
      endpoints: [
        { id: 0, start: { r: 0, c: 0 }, end: { r: 0, c: 1 } },
        { id: 1, start: { r: 1, c: 0 }, end: { r: 1, c: 1 } },
      ],
      solutionGrid: [[0, 0], [1, 1]],
      segments: [],
    };
    // Both paths share cell (0,1)
    const paths = new Map([
      [0, [{ r: 0, c: 0 }, { r: 0, c: 1 }]],
      [1, [{ r: 1, c: 0 }, { r: 1, c: 1 }, { r: 0, c: 1 }]],
    ]);
    expect(checkWin(paths, p2)).toBe(false);
  });

  it('returns false when path has fewer than 2 cells', () => {
    const paths = new Map([[0, [{ r: 0, c: 0 }]]]);
    expect(checkWin(paths, puzzle)).toBe(false);
  });

  it('returns false when first and last cell are the same', () => {
    const paths = new Map([[0, [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 0 }]]]);
    expect(checkWin(paths, puzzle)).toBe(false);
  });

  it('accepts path starting from either endpoint', () => {
    const reversedPath = [...winningPath].reverse();
    const paths = new Map([[0, reversedPath]]);
    expect(checkWin(paths, puzzle)).toBe(true);
  });
});

describe('createRNG', () => {
  it('returns deterministic sequence for same seed', () => {
    const rng1 = createRNG(42);
    const rng2 = createRNG(42);
    const seq1 = Array.from({ length: 5 }, () => rng1());
    const seq2 = Array.from({ length: 5 }, () => rng2());
    expect(seq1).toEqual(seq2);
  });

  it('returns values between 0 and 1', () => {
    const rng = createRNG(12345);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('produces different sequences for different seeds', () => {
    const rng1 = createRNG(1);
    const rng2 = createRNG(2);
    const seq1 = Array.from({ length: 5 }, () => rng1());
    const seq2 = Array.from({ length: 5 }, () => rng2());
    expect(seq1).not.toEqual(seq2);
  });
});

describe('getDailySeed', () => {
  it('returns a number in YYYYMMDD format', () => {
    const seed = getDailySeed();
    expect(seed).toBeGreaterThan(20200101);
    expect(seed).toBeLessThan(21000101);
  });

  it('returns same value within a single call context', () => {
    expect(getDailySeed()).toBe(getDailySeed());
  });
});
