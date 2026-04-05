export interface Cell {
  r: number;
  c: number;
}

export interface Endpoint {
  id: number;
  start: Cell;
  end: Cell;
}

export interface Puzzle {
  rows: number;
  cols: number;
  pairs: number;
  endpoints: Endpoint[];
  solutionGrid: number[][];
  segments: Cell[][];
}

export interface PuzzleBankEntry {
  e: number[][]; // [startRow, startCol, endRow, endCol]
  s: number[][]; // solution grid
}

export interface PuzzleBankDifficulty {
  r: number;
  c: number;
  p: number;
  z: PuzzleBankEntry[];
}

export type PuzzleBank = Record<string, PuzzleBankDifficulty>;

export interface DifficultyConfig {
  label: string;
  rows: number;
  cols: number;
  pairs: number;
}

export interface DrawingState {
  pairId: number;
  cells: Cell[];
}

export interface HistoryEntry {
  action: 'draw' | 'remove';
  pairId: number;
  cells?: Cell[];
}

export interface GameStats {
  bestTimes: Record<string, number>;
  totalSolved: number;
}

export type PairStatus = 'empty' | 'partial' | 'connected';

export interface CellConnections {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export interface CellContent {
  isEndpoint: boolean;
  pairId: number | undefined;
  activeColor: string | null;
  connections: CellConnections | null;
  isDrawing: boolean;
}

export interface ThemeColors {
  bg: string;
  surface: string;
  grid: string;
  gridLine: string;
  cell: string;
  cellHover: string;
  text: string;
  textMuted: string;
  accent: string;
  accentDim: string;
  overlay: string;
  endpointBg: string;
  shadow: string;
}
