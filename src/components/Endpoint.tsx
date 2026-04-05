import { pairLabel } from '../lib/constants';

interface EndpointProps {
  pairId: number;
  color: string;
}

export function Endpoint({ pairId, color }: EndpointProps) {
  return (
    <div className="endpoint" style={{ background: color, zIndex: 5 }}>
      {pairLabel(pairId)}
    </div>
  );
}
