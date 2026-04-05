import type { ThemeColors } from './types';

export const THEMES: Record<string, ThemeColors> = {
  dark: {
    bg: '#0c0c14',
    surface: '#161622',
    grid: '#0c0c14',
    gridLine: '#2e2e4a',
    cell: '#1a1a2e',
    cellHover: '#24243e',
    text: '#e8e8f0',
    textMuted: '#7878a0',
    accent: '#00d4aa',
    accentDim: '#00d4aa22',
    overlay: 'rgba(5,5,15,0.92)',
    endpointBg: '#12121e',
    shadow: '0 2px 20px rgba(0,0,0,0.4)',
  },
  light: {
    bg: '#f4f4f8',
    surface: '#ffffff',
    grid: '#e4e4ec',
    gridLine: '#c8c8d8',
    cell: '#ffffff',
    cellHover: '#f0f0f6',
    text: '#1a1a2e',
    textMuted: '#6e6e8e',
    accent: '#00a080',
    accentDim: '#00a08018',
    overlay: 'rgba(244,244,248,0.95)',
    endpointBg: '#ffffff',
    shadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
};

export function getThemeVars(theme: string): Record<string, string> {
  const t = THEMES[theme];
  return {
    '--bg': t.bg,
    '--surface': t.surface,
    '--grid': t.grid,
    '--grid-line': t.gridLine,
    '--cell': t.cell,
    '--cell-hover': t.cellHover,
    '--text': t.text,
    '--text-muted': t.textMuted,
    '--accent': t.accent,
    '--accent-dim': t.accentDim,
    '--overlay': t.overlay,
    '--endpoint-bg': t.endpointBg,
    '--shadow': t.shadow,
    '--accent-text': theme === 'dark' ? '#0c0c14' : '#ffffff',
  };
}
