// 12 perceptually distinct colors — bright enough for dark mode,
// saturated enough for light mode. Ordered for maximum early-pair contrast.
export const PATH_COLORS = [
  '#dc2626', // 0  red
  '#2563eb', // 1  blue
  '#16a34a', // 2  green
  '#f97316', // 3  orange
  '#a855f7', // 4  purple
  '#0891b2', // 5  cyan
  '#db2777', // 6  pink
  '#eab308', // 7  yellow
  '#6366f1', // 8  indigo
  '#14b8a6', // 9  teal
  '#f43f5e', // 10 rose
  '#84cc16', // 11 lime
];

export const PATH_WIDTH = 19;
export const PATH_WIDTH_HALF = PATH_WIDTH / 2;
export const ENDPOINT_SIZE = 54;

export const pairLabel = (id: number): string => String.fromCharCode(65 + id);

/** Returns '#fff' or dark text based on perceived luminance of a hex color. */
export function getContrastText(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#1a1a2e' : '#ffffff';
}
