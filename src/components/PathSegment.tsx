import { PATH_WIDTH, PATH_WIDTH_HALF } from '../lib/constants';

interface PathSegmentProps {
  connections: { up: boolean; down: boolean; left: boolean; right: boolean };
  color: string;
  isActive: boolean;
}

export function PathSegment({ connections, color, isActive }: PathSegmentProps) {
  const connCount = [connections.up, connections.down, connections.left, connections.right].filter(Boolean).length;
  const cls = isActive ? 'path-cell-anim' : '';

  return (
    <>
      <div className={cls} style={{
        position: 'absolute', zIndex: 2, pointerEvents: 'none',
        width: `${PATH_WIDTH}%`, height: `${PATH_WIDTH}%`,
        top: `${50 - PATH_WIDTH_HALF}%`, left: `${50 - PATH_WIDTH_HALF}%`,
        background: color, borderRadius: connCount <= 1 ? '50%' : '1px',
      }} />
      {connections.up && (
        <div className={cls} style={{
          position: 'absolute', zIndex: 2, pointerEvents: 'none',
          width: `${PATH_WIDTH}%`, left: `${50 - PATH_WIDTH_HALF}%`,
          top: 0, height: '50%', background: color,
        }} />
      )}
      {connections.down && (
        <div className={cls} style={{
          position: 'absolute', zIndex: 2, pointerEvents: 'none',
          width: `${PATH_WIDTH}%`, left: `${50 - PATH_WIDTH_HALF}%`,
          top: '50%', height: '50%', background: color,
        }} />
      )}
      {connections.left && (
        <div className={cls} style={{
          position: 'absolute', zIndex: 2, pointerEvents: 'none',
          height: `${PATH_WIDTH}%`, top: `${50 - PATH_WIDTH_HALF}%`,
          left: 0, width: '50%', background: color,
        }} />
      )}
      {connections.right && (
        <div className={cls} style={{
          position: 'absolute', zIndex: 2, pointerEvents: 'none',
          height: `${PATH_WIDTH}%`, top: `${50 - PATH_WIDTH_HALF}%`,
          left: '50%', width: '50%', background: color,
        }} />
      )}
    </>
  );
}
