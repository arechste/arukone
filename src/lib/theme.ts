import type { ThemeColors } from './types';

export const THEMES: Record<string, ThemeColors> = {
  dark: {
    bg: '#0b0b12', surface: '#14141f', grid: '#0b0b12', gridLine: '#50508a',
    cell: '#171728', cellHover: '#2a2a4a', text: '#e0e0ea', textMuted: '#6a6a8a',
    accent: '#00d4aa', accentDim: '#00d4aa22', overlay: 'rgba(5,5,15,0.92)',
    endpointBg: '#0e0e1a', shadow: '0 4px 30px rgba(0,0,0,0.5)',
  },
  light: {
    bg: '#f0f0f5', surface: '#ffffff', grid: '#e0e0e8', gridLine: '#9090a8',
    cell: '#ffffff', cellHover: '#f0f0f5', text: '#1a1a2e', textMuted: '#8888aa',
    accent: '#00a888', accentDim: '#00a88822', overlay: 'rgba(240,240,245,0.95)',
    endpointBg: '#ffffff', shadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
};

export function getThemeVars(theme: string): Record<string, string> {
  const t = THEMES[theme];
  return {
    '--bg': t.bg, '--surface': t.surface, '--grid': t.grid,
    '--grid-line': t.gridLine, '--cell': t.cell, '--cell-hover': t.cellHover,
    '--text': t.text, '--text-muted': t.textMuted, '--accent': t.accent,
    '--accent-dim': t.accentDim, '--overlay': t.overlay,
    '--endpoint-bg': t.endpointBg, '--shadow': t.shadow,
  };
}
