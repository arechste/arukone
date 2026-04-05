import type { DifficultyConfig } from '../lib/types';

interface DifficultyPickerProps {
  difficulties: Record<string, DifficultyConfig>;
  current: string;
  onSelect: (diff: string) => void;
}

export function DifficultyPicker({ difficulties, current, onSelect }: DifficultyPickerProps) {
  return (
    <div className="controls">
      {Object.entries(difficulties).map(([key, val]) => (
        <button
          key={key}
          className={`diff-btn ${current === key ? 'active' : ''}`}
          onClick={() => onSelect(key)}
        >
          {val.label} <span style={{ opacity: 0.6, marginLeft: 4 }}>{val.rows}&times;{val.cols}</span>
        </button>
      ))}
    </div>
  );
}
