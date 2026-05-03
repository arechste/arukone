interface ToolbarProps {
  canUndo: boolean;
  canHint: boolean;
  hintActive: boolean;
  onUndo: () => void;
  onReset: () => void;
  onNewPuzzle: () => void;
  onHint: () => void;
  onShowHelp: () => void;
}

export function Toolbar({ canUndo, canHint, hintActive, onUndo, onReset, onNewPuzzle, onHint, onShowHelp }: ToolbarProps) {
  return (
    <div className="actions">
      <button className="btn" onClick={onUndo} disabled={!canUndo}>
        ↶ Undo
      </button>
      <button className="btn" onClick={onReset}>
        ⟳ Reset
      </button>
      <button className="btn" onClick={onNewPuzzle}>
        ✦ New
      </button>
      <button
        className={`btn ${hintActive ? 'btn--accent-filled' : 'btn--accent'}`}
        onClick={onHint}
        disabled={!canHint}
      >
        {hintActive ? '✓ Hide' : '✓ Hint'}
      </button>
      <button className="btn btn--icon" onClick={onShowHelp} aria-label="How to play">?</button>
    </div>
  );
}
