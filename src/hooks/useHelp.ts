import { useState, useCallback } from 'react';

const STORAGE_KEY = 'arukone:help-dismissed-v1';

function shouldShowOnLoad(): boolean {
  // Escape hatch for automation (Playwright smoke, screenshots, demos).
  try {
    if (new URLSearchParams(window.location.search).has('nohelp')) return false;
  } catch {
    // ignore
  }
  try {
    return localStorage.getItem(STORAGE_KEY) !== '1';
  } catch {
    return true;
  }
}

export function useHelp() {
  const [open, setOpen] = useState(shouldShowOnLoad);

  const close = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  }, []);

  const show = useCallback(() => setOpen(true), []);

  return { open, close, show };
}
