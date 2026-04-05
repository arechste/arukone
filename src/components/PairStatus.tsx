import type { Endpoint } from '../lib/types';
import type { PairStatus as PairStatusType } from '../lib/types';
import { PATH_COLORS, pairLabel } from '../lib/constants';

interface PairStatusProps {
  endpoints: Endpoint[];
  statuses: PairStatusType[];
}

export function PairStatus({ endpoints, statuses }: PairStatusProps) {
  return (
    <div className="pair-status">
      {endpoints.map((ep, i) => (
        <div
          key={i}
          className={`pair-dot ${statuses[i]}`}
          style={{ background: PATH_COLORS[ep.id % PATH_COLORS.length] }}
        >
          {pairLabel(ep.id)}
        </div>
      ))}
    </div>
  );
}
