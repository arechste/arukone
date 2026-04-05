import { useMemo } from 'react';
import { PATH_COLORS } from '../lib/constants';
import type { DifficultyConfig, GameStats } from '../lib/types';

interface WinOverlayProps {
  difficulty: DifficultyConfig;
  rows: number;
  cols: number;
  timer: string;
  moves: number;
  bestTime: string;
  totalSolved: number;
  onNextPuzzle: () => void;
}

function Confetti() {
  const pieces = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: PATH_COLORS[i % PATH_COLORS.length],
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      size: 6 + Math.random() * 8,
      shape: Math.random() > 0.5 ? '50%' : '2px',
    })), []
  );
  return (
    <>
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`, width: p.size, height: p.size,
          background: p.color, borderRadius: p.shape,
          animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
        }} />
      ))}
    </>
  );
}

export function WinOverlay({ difficulty, rows, cols, timer, moves, bestTime, totalSolved, onNextPuzzle }: WinOverlayProps) {
  return (
    <div className="win-overlay">
      <Confetti />
      <div className="win-card">
        <h2>Solved!</h2>
        <p>{difficulty.label} &middot; {rows}&times;{cols}</p>
        <div className="win-stats">
          <div className="win-stat-item">
            <div className="val">{timer}</div>
            <div className="lbl">Time</div>
          </div>
          <div className="win-stat-item">
            <div className="val">{moves}</div>
            <div className="lbl">Moves</div>
          </div>
          <div className="win-stat-item">
            <div className="val">{bestTime}</div>
            <div className="lbl">Best</div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
          {totalSolved} puzzle{totalSolved !== 1 ? 's' : ''} solved
        </p>
        <button className="next-btn" onClick={onNextPuzzle}>
          Next Puzzle &rarr;
        </button>
      </div>
    </div>
  );
}
