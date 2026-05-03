import { useState, useCallback } from 'react';

export type Rating = 'too_easy' | 'just_right' | 'too_hard' | 'too_linear';

export interface FeedbackEntry {
  puzzleId: string;
  difficulty: string;
  rating: Rating;
  timeSeconds: number;
  ts: number;
}

const STORAGE_KEY = 'arukone:ratings-v1';
const MAX_ENTRIES = 500;

function load(): FeedbackEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useFeedback() {
  const [entries, setEntries] = useState<FeedbackEntry[]>(load);

  const record = useCallback((entry: FeedbackEntry) => {
    setEntries(prev => {
      const next = [...prev, entry].slice(-MAX_ENTRIES);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // quota exceeded — ignore, keep in-memory copy
      }
      return next;
    });
  }, []);

  return { entries, record };
}
