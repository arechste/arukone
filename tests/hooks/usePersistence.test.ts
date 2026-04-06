import { renderHook, act } from '@testing-library/react';
import { usePersistence } from '../../src/hooks/usePersistence';

describe('usePersistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default stats when no stored data', () => {
    const { result } = renderHook(() => usePersistence());
    expect(result.current.stats).toEqual({ bestTimes: {}, totalSolved: 0 });
  });

  it('loads stats from localStorage', () => {
    const stored = { bestTimes: { easy: 42 }, totalSolved: 5 };
    localStorage.setItem('arukone:stats', JSON.stringify(stored));

    const { result } = renderHook(() => usePersistence());
    expect(result.current.stats).toEqual(stored);
  });

  it('saves stats to state and localStorage', () => {
    const { result } = renderHook(() => usePersistence());
    const newStats = { bestTimes: { easy: 30 }, totalSolved: 1 };

    act(() => result.current.saveStats(newStats));

    expect(result.current.stats).toEqual(newStats);
    expect(JSON.parse(localStorage.getItem('arukone:stats')!)).toEqual(newStats);
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('arukone:stats', 'not-json');

    const { result } = renderHook(() => usePersistence());
    expect(result.current.stats).toEqual({ bestTimes: {}, totalSolved: 0 });
  });
});
