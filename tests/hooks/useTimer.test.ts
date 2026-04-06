import { renderHook, act } from '@testing-library/react';
import { useTimer, formatTime } from '../../src/hooks/useTimer';

describe('formatTime', () => {
  it('formats 0 seconds', () => {
    expect(formatTime(0)).toBe('0:00');
  });

  it('formats seconds under a minute', () => {
    expect(formatTime(5)).toBe('0:05');
    expect(formatTime(59)).toBe('0:59');
  });

  it('formats minutes and seconds', () => {
    expect(formatTime(60)).toBe('1:00');
    expect(formatTime(125)).toBe('2:05');
  });

  it('pads seconds with leading zero', () => {
    expect(formatTime(61)).toBe('1:01');
  });
});

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts at 0 and not started', () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.timer).toBe(0);
    expect(result.current.started).toBe(false);
  });

  it('increments timer after start', () => {
    const { result } = renderHook(() => useTimer());

    act(() => result.current.start());
    expect(result.current.started).toBe(true);

    act(() => vi.advanceTimersByTime(3000));
    expect(result.current.timer).toBe(3);
  });

  it('stops incrementing after stop', () => {
    const { result } = renderHook(() => useTimer());

    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(2000));
    act(() => result.current.stop());
    act(() => vi.advanceTimersByTime(3000));

    expect(result.current.timer).toBe(2);
  });

  it('resets to initial state', () => {
    const { result } = renderHook(() => useTimer());

    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(5000));
    act(() => result.current.reset());

    expect(result.current.timer).toBe(0);
    expect(result.current.started).toBe(false);
  });
});
