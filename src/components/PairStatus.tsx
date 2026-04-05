import type { Endpoint } from '../lib/types';
import type { PairStatus as PairStatusType } from '../lib/types';
import { PATH_COLORS, pairLabel, getContrastText } from '../lib/constants';

interface PairStatusProps {
  endpoints: Endpoint[];
  statuses: PairStatusType[];
}

export function PairStatus({ endpoints, statuses }: PairStatusProps) {
  return (
    <div className="pair-status">
      {endpoints.map((ep, i) => {
        const color = PATH_COLORS[ep.id % PATH_COLORS.length];
        return (
          <div
            key={i}
            className={`pair-dot ${statuses[i]}`}
            style={{ background: color, color: getContrastText(color) }}
          >
            {pairLabel(ep.id)}
          </div>
        );
      })}
    </div>
  );
}
