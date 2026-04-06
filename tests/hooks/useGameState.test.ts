import { renderHook, act } from '@testing-library/react';
import { useGameState } from '../../src/hooks/useGameState';

describe('useGameState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useGameState());

    expect(result.current.theme).toBe('dark');
    expect(result.current.difficulty).toBe('easy');
    expect(result.current.moves).toBe(0);
    expect(result.current.solved).toBe(false);
    expect(result.current.started).toBe(false);
    expect(result.current.hintMap).toBeNull();
    expect(result.current.showSolution).toBe(false);
  });

  it('loads a valid puzzle', () => {
    const { result } = renderHook(() => useGameState());

    expect(result.current.puzzle).toBeDefined();
    expect(result.current.puzzle.rows).toBe(7);
    expect(result.current.puzzle.cols).toBe(7);
    expect(result.current.puzzle.pairs).toBe(4);
  });

  it('toggles theme between dark and light', () => {
    const { result } = renderHook(() => useGameState());

    act(() => result.current.handleToggleTheme());
    expect(result.current.theme).toBe('light');

    act(() => result.current.handleToggleTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('changes difficulty and resets state', () => {
    const { result } = renderHook(() => useGameState());

    act(() => result.current.handleDifficulty('hard'));

    expect(result.current.difficulty).toBe('hard');
    expect(result.current.puzzle.rows).toBe(9);
    expect(result.current.puzzle.cols).toBe(9);
    expect(result.current.moves).toBe(0);
    expect(result.current.solved).toBe(false);
  });

  it('resets game state', () => {
    const { result } = renderHook(() => useGameState());

    act(() => result.current.handleReset());

    expect(result.current.moves).toBe(0);
    expect(result.current.solved).toBe(false);
    expect(result.current.hintMap).toBeNull();
    expect(result.current.showSolution).toBe(false);
  });

  it('advances to next puzzle', () => {
    const { result } = renderHook(() => useGameState());
    const firstPuzzle = result.current.puzzle;

    act(() => result.current.handleNewPuzzle());

    expect(result.current.puzzle).not.toEqual(firstPuzzle);
    expect(result.current.moves).toBe(0);
    expect(result.current.solved).toBe(false);
  });

  it('toggles solution reveal', () => {
    const { result } = renderHook(() => useGameState());

    act(() => result.current.handleRevealSolution());
    expect(result.current.showSolution).toBe(true);

    act(() => result.current.handleRevealSolution());
    expect(result.current.showSolution).toBe(false);
  });

  it('provides difficulties metadata', () => {
    const { result } = renderHook(() => useGameState());

    expect(result.current.difficulties).toHaveProperty('easy');
    expect(result.current.difficulties).toHaveProperty('medium');
    expect(result.current.difficulties).toHaveProperty('hard');
    expect(result.current.difficulties).toHaveProperty('extreme');
  });

  it('provides pair statuses starting as empty', () => {
    const { result } = renderHook(() => useGameState());

    expect(result.current.pairStatuses).toHaveLength(result.current.puzzle.pairs);
    expect(result.current.pairStatuses.every(s => s === 'empty')).toBe(true);
  });

  it('getCellContent returns endpoint info', () => {
    const { result } = renderHook(() => useGameState());
    const ep = result.current.puzzle.endpoints[0];

    const content = result.current.getCellContent(ep.start.r, ep.start.c);
    expect(content.isEndpoint).toBe(true);
    expect(content.pairId).toBe(0);
  });

  it('getCellContent returns non-endpoint info for empty cell', () => {
    const { result } = renderHook(() => useGameState());

    // Find a cell that is not an endpoint
    const endpointKeys = new Set<string>();
    for (const ep of result.current.puzzle.endpoints) {
      endpointKeys.add(`${ep.start.r},${ep.start.c}`);
      endpointKeys.add(`${ep.end.r},${ep.end.c}`);
    }

    let emptyR = -1, emptyC = -1;
    for (let r = 0; r < result.current.puzzle.rows; r++) {
      for (let c = 0; c < result.current.puzzle.cols; c++) {
        if (!endpointKeys.has(`${r},${c}`)) {
          emptyR = r;
          emptyC = c;
          break;
        }
      }
      if (emptyR >= 0) break;
    }

    const content = result.current.getCellContent(emptyR, emptyC);
    expect(content.isEndpoint).toBe(false);
    expect(content.activeColor).toBeNull();
  });
});
