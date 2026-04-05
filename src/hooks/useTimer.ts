import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer() {
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);
  const [stopped, setStopped] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    if (started && !stopped) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, stopped]);

  const start = useCallback(() => setStarted(true), []);

  const stop = useCallback(() => {
    setStopped(true);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const reset = useCallback(() => {
    setTimer(0);
    setStarted(false);
    setStopped(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return { timer, started, start, stop, reset };
}

export function formatTime(s: number): string {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}
