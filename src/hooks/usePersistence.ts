import { useState, useCallback } from 'react';
import type { GameStats } from '../lib/types';

const STORAGE_KEY = 'arukone:stats';

const defaultStats: GameStats = { bestTimes: {}, totalSolved: 0 };

function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // no stats yet
  }
  return defaultStats;
}

export function usePersistence() {
  const [stats, setStats] = useState(loadStats);

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
