import type { Puzzle } from '../lib/types';
import { cellKey } from '../lib/gameLogic';
import { Cell } from './Cell';

interface GridProps {
  puzzle: Puzzle;
  gridRef: React.RefObject<HTMLDivElement | null>;
  hintMap: Record<string, string> | null;
  showSolution: boolean;
  getCellContent: (r: number, c: number) => {
    isEndpoint: boolean;
    pairId: number | undefined;
    activeColor: string | null;
    connections: { up: boolean; down: boolean; left: boolean; right: boolean } | null;
    isDrawing: boolean;
  };
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
}

export function Grid({ puzzle, gridRef, hintMap, showSolution, getCellContent, onPointerDown, onPointerMove, onPointerUp }: GridProps) {
  return (
    <div className="grid-wrapper">
      <div
        className="grid"
        ref={gridRef}
        style={{
          gridTemplateColumns: `repeat(${puzzle.cols}, 1fr)`,
          gridTemplateRows: `repeat(${puzzle.rows}, 1fr)`,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {Array.from({ length: puzzle.rows }, (_, r) =>
          Array.from({ length: puzzle.cols }, (_, c) => {
            const { isEndpoint, pairId, activeColor, connections, isDrawing } = getCellContent(r, c);
            const k = cellKey(r, c);
            const hintResult = hintMap ? hintMap[k] ?? null : null;
            const solPairId = showSolution ? puzzle.solutionGrid[r][c] : -1;

            return (
              <Cell
                key={`${r}-${c}`}
                r={r}
                c={c}
                isEndpoint={isEndpoint}
                pairId={pairId}
                activeColor={activeColor}
                connections={connections}
                isDrawing={isDrawing}
                hintResult={hintResult}
                showSolution={showSolution}
                solPairId={solPairId}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
