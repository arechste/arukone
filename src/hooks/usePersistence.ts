import { useState, useCallback, useEffect } from 'react';
import type { GameStats } from '../lib/types';

const STORAGE_KEY = 'arukone:stats';

const defaultStats: GameStats = { bestTimes: {}, totalSolved: 0 };

export function usePersistence() {
  const [stats, setStats] = useState<GameStats>(defaultStats);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setStats(JSON.parse(raw));
    } catch {
      // no stats yet
    }
  }, []);

  const saveStats = useCallback((newStats: GameStats) => {
    setStats(newStats);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    } catch (e) {
      console.error('Stats save failed:', e);
    }
  }, []);

  return { stats, saveStats };
}
