import { pairLabel, getContrastText } from '../lib/constants';

interface EndpointProps {
  pairId: number;
  color: string;
}

export function Endpoint({ pairId, color }: EndpointProps) {
  return (
    <div
      className="endpoint"
      style={{ background: color, color: getContrastText(color) }}
    >
      {pairLabel(pairId)}
    </div>
  );
}
