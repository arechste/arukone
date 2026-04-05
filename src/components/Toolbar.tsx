interface ToolbarProps {
  canUndo: boolean;
  canHint: boolean;
  hintActive: boolean;
  onUndo: () => void;
  onReset: () => void;
  onNewPuzzle: () => void;
  onHint: () => void;
}

export function Toolbar({ canUndo, canHint, hintActive, onUndo, onReset, onNewPuzzle, onHint }: ToolbarProps) {
  return (
    <div className="actions" style={{ marginTop: 12 }}>
      <button className="action-btn" onClick={onUndo} disabled={!canUndo}>
        ↶ Undo
      </button>
      <button className="action-btn" onClick={onReset}>
        ⟳ Reset
      </button>
      <button className="action-btn" onClick={onNewPuzzle}>
        ✦ New Puzzle
      </button>
      <button
        className={`action-btn hint-btn ${hintActive ? 'hint-active' : ''}`}
        onClick={onHint}
        disabled={!canHint}
      >
        {hintActive ? '✓ Hide' : '✓ Hint'}
      </button>
    </div>
  );
}
