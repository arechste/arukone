import { renderHook, act } from '@testing-library/react';
import { useDrawing } from '../../src/hooks/useDrawing';
import type { Puzzle } from '../../src/lib/types';

// Minimal 3x3 puzzle with 1 pair: A at (0,0) and (2,2)
const testPuzzle: Puzzle = {
  rows: 3,
  cols: 3,
  pairs: 1,
  endpoints: [{ id: 0, start: { r: 0, c: 0 }, end: { r: 2, c: 2 } }],
  solutionGrid: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  segments: [
    [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 1, c: 2 }, { r: 1, c: 1 }, { r: 1, c: 0 }, { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }],
  ],
};

function createProps(overrides: Partial<Parameters<typeof useDrawing>[0]> = {}) {
  return {
    puzzle: testPuzzle,
    solved: false,
    onWin: vi.fn(),
    onMove: vi.fn(),
    onStart: vi.fn(),
    started: false,
    ...overrides,
  };
}

describe('useDrawing', () => {
  it('starts with empty paths and no drawing', () => {
    const { result } = renderHook(() => useDrawing(createProps()));
    expect(result.current.playerPaths.size).toBe(0);
    expect(result.current.drawing).toBeNull();
    expect(result.current.history).toHaveLength(0);
  });

  it('resetDrawing clears all state', () => {
    const { result } = renderHook(() => useDrawing(createProps()));

    act(() => result.current.resetDrawing());

    expect(result.current.playerPaths.size).toBe(0);
    expect(result.current.drawing).toBeNull();
    expect(result.current.history).toHaveLength(0);
  });

  it('exposes a gridRef', () => {
    const { result } = renderHook(() => useDrawing(createProps()));
    expect(result.current.gridRef).toBeDefined();
    expect(result.current.gridRef.current).toBeNull();
  });

  it('handleUndo is a no-op when history is empty', () => {
    const { result } = renderHook(() => useDrawing(createProps()));
    act(() => result.current.handleUndo());
    expect(result.current.playerPaths.size).toBe(0);
  });
});
