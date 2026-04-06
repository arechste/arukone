import { THEMES, getThemeVars } from '../../src/lib/theme';

describe('THEMES', () => {
  it('has dark and light themes', () => {
    expect(THEMES).toHaveProperty('dark');
    expect(THEMES).toHaveProperty('light');
  });

  it('each theme has all required color keys', () => {
    const requiredKeys = ['bg', 'surface', 'grid', 'gridLine', 'cell', 'cellHover', 'text', 'textMuted', 'accent', 'accentDim', 'overlay', 'endpointBg', 'shadow'];
    for (const theme of Object.values(THEMES)) {
      for (const key of requiredKeys) {
        expect(theme).toHaveProperty(key);
      }
    }
  });
});

describe('getThemeVars', () => {
  it('maps theme colors to CSS custom properties', () => {
    const vars = getThemeVars('dark');
    expect(vars['--bg']).toBe(THEMES.dark.bg);
    expect(vars['--text']).toBe(THEMES.dark.text);
    expect(vars['--accent']).toBe(THEMES.dark.accent);
  });

  it('includes accent-text based on theme', () => {
    expect(getThemeVars('dark')['--accent-text']).toBe('#0c0c14');
    expect(getThemeVars('light')['--accent-text']).toBe('#ffffff');
  });

  it('returns all expected CSS variables', () => {
    const vars = getThemeVars('dark');
    const expectedKeys = ['--bg', '--surface', '--grid', '--grid-line', '--cell', '--cell-hover', '--text', '--text-muted', '--accent', '--accent-dim', '--overlay', '--endpoint-bg', '--shadow', '--accent-text'];
    expect(Object.keys(vars).sort()).toEqual(expectedKeys.sort());
  });
});
