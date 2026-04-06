import { loadPuzzle, getDifficulties } from '../../src/lib/puzzles';

describe('loadPuzzle', () => {
  it('loads an easy puzzle with correct dimensions', () => {
    const puzzle = loadPuzzle('easy', 0);
    expect(puzzle).not.toBeNull();
    expect(puzzle!.rows).toBe(7);
    expect(puzzle!.cols).toBe(7);
    expect(puzzle!.pairs).toBe(4);
  });

  it('loads a medium puzzle', () => {
    const puzzle = loadPuzzle('medium', 0);
    expect(puzzle).not.toBeNull();
    expect(puzzle!.rows).toBe(8);
    expect(puzzle!.cols).toBe(8);
    expect(puzzle!.pairs).toBe(5);
  });

  it('loads a hard puzzle', () => {
    const puzzle = loadPuzzle('hard', 0);
    expect(puzzle).not.toBeNull();
    expect(puzzle!.rows).toBe(9);
    expect(puzzle!.cols).toBe(9);
    expect(puzzle!.pairs).toBe(7);
  });

  it('loads an extreme puzzle', () => {
    const puzzle = loadPuzzle('extreme', 0);
    expect(puzzle).not.toBeNull();
    expect(puzzle!.rows).toBe(10);
    expect(puzzle!.cols).toBe(10);
    expect(puzzle!.pairs).toBe(8);
  });

  it('returns null for unknown difficulty', () => {
    expect(loadPuzzle('impossible', 0)).toBeNull();
  });

  it('wraps index when exceeding puzzle count', () => {
    const p1 = loadPuzzle('easy', 0);
    const p2 = loadPuzzle('easy', 200);
    expect(p1).toEqual(p2);
  });

  it('has correct number of endpoints', () => {
    const puzzle = loadPuzzle('easy', 0)!;
    expect(puzzle.endpoints).toHaveLength(puzzle.pairs);
  });

  it('endpoints have valid coordinates within grid', () => {
    const puzzle = loadPuzzle('easy', 0)!;
    for (const ep of puzzle.endpoints) {
      expect(ep.start.r).toBeGreaterThanOrEqual(0);
      expect(ep.start.r).toBeLessThan(puzzle.rows);
      expect(ep.start.c).toBeGreaterThanOrEqual(0);
      expect(ep.start.c).toBeLessThan(puzzle.cols);
      expect(ep.end.r).toBeGreaterThanOrEqual(0);
      expect(ep.end.r).toBeLessThan(puzzle.rows);
      expect(ep.end.c).toBeGreaterThanOrEqual(0);
      expect(ep.end.c).toBeLessThan(puzzle.cols);
    }
  });

  it('generates solution segments that cover all grid cells', () => {
    const puzzle = loadPuzzle('easy', 0)!;
    expect(puzzle.segments).toHaveLength(puzzle.pairs);
    const allCells = new Set<string>();
    for (const seg of puzzle.segments) {
      for (const cell of seg) {
        allCells.add(`${cell.r},${cell.c}`);
      }
    }
    expect(allCells.size).toBe(puzzle.rows * puzzle.cols);
  });

  it('segments start from start endpoint', () => {
    const puzzle = loadPuzzle('easy', 0)!;
    for (const ep of puzzle.endpoints) {
      const seg = puzzle.segments[ep.id];
      expect(seg[0]).toEqual(ep.start);
    }
  });
});

describe('getDifficulties', () => {
  it('returns all four difficulties', () => {
    const diffs = getDifficulties();
    expect(Object.keys(diffs)).toEqual(expect.arrayContaining(['easy', 'medium', 'hard', 'extreme']));
  });

  it('has correct metadata per difficulty', () => {
    const diffs = getDifficulties();
    expect(diffs.easy).toEqual({ label: 'Easy', rows: 7, cols: 7, pairs: 4 });
    expect(diffs.medium).toEqual({ label: 'Medium', rows: 8, cols: 8, pairs: 5 });
    expect(diffs.hard).toEqual({ label: 'Hard', rows: 9, cols: 9, pairs: 7 });
    expect(diffs.extreme).toEqual({ label: 'Extreme', rows: 10, cols: 10, pairs: 8 });
  });
});
