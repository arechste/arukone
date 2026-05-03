interface HelpOverlayProps {
  difficultyLabel: string;
  rows: number;
  cols: number;
  pairs: number;
  onClose: () => void;
}

export function HelpOverlay({ difficultyLabel, rows, cols, pairs, onClose }: HelpOverlayProps) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="help-title">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose} aria-label="Close help">×</button>
        <h2 id="help-title">How to play</h2>
        <p className="modal-context">
          {difficultyLabel} &middot; {rows}&times;{cols} &middot; {pairs} pairs
        </p>
        <ol className="help-steps">
          <li>Drag from one letter to its matching letter through empty cells.</li>
          <li>Paths can&rsquo;t cross or overlap. Drag back to erase.</li>
          <li>Fill every cell to win. Connecting all pairs alone isn&rsquo;t enough.</li>
        </ol>
        <p className="modal-fineprint">
          Open source &middot; no accounts &middot; no ads &middot; no tracking. Plays
          entirely in your browser. Generator under AGPL-3.0; everything else MIT.
        </p>
        <button className="btn btn--filled" onClick={onClose} style={{ marginTop: 8 }}>
          Got it
        </button>
      </div>
    </div>
  );
}
