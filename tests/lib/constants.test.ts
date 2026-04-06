import { PATH_COLORS, pairLabel, getContrastText } from '../../src/lib/constants';

describe('PATH_COLORS', () => {
  it('has 12 colors', () => {
    expect(PATH_COLORS).toHaveLength(12);
  });

  it('all colors are valid hex', () => {
    for (const color of PATH_COLORS) {
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('all colors are unique', () => {
    expect(new Set(PATH_COLORS).size).toBe(PATH_COLORS.length);
  });
});

describe('pairLabel', () => {
  it('maps 0 to A', () => {
    expect(pairLabel(0)).toBe('A');
  });

  it('maps sequential ids to sequential letters', () => {
    expect(pairLabel(1)).toBe('B');
    expect(pairLabel(11)).toBe('L');
  });
});

describe('getContrastText', () => {
  it('returns white for dark colors', () => {
    expect(getContrastText('#000000')).toBe('#ffffff');
    expect(getContrastText('#1a1a2e')).toBe('#ffffff');
  });

  it('returns dark text for light colors', () => {
    expect(getContrastText('#ffffff')).toBe('#1a1a2e');
    expect(getContrastText('#eab308')).toBe('#1a1a2e');
  });
});
