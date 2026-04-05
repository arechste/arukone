import { PATH_COLORS } from '../lib/constants';
import { PathSegment } from './PathSegment';
import { Endpoint } from './Endpoint';

interface CellProps {
  r: number;
  c: number;
  isEndpoint: boolean;
  pairId: number | undefined;
  activeColor: string | null;
  connections: { up: boolean; down: boolean; left: boolean; right: boolean } | null;
  isDrawing: boolean;
  hintResult: string | null;
  showSolution: boolean;
  solPairId: number;
}

export function Cell({ pairId, isEndpoint, activeColor, connections, isDrawing, hintResult, showSolution, solPairId }: CellProps) {
  const solColor = showSolution && solPairId >= 0 ? PATH_COLORS[solPairId % PATH_COLORS.length] : null;

  return (
    <div className="cell">
      {solColor && !activeColor && (
        <div style={{
          position: 'absolute', inset: '15%',
          background: solColor, opacity: 0.18, borderRadius: '30%',
          zIndex: 1, pointerEvents: 'none',
        }} />
      )}

      {connections && activeColor && (
        <PathSegment connections={connections} color={activeColor} isActive={isDrawing} />
      )}

      {isEndpoint && pairId !== undefined && (
        <Endpoint pairId={pairId} color={PATH_COLORS[pairId % PATH_COLORS.length]} />
      )}

      {hintResult && (
        <div className={`hint-overlay hint-${hintResult}`} />
      )}
    </div>
  );
}
