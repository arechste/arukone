import { useState } from 'react';
import type { Rating } from '../hooks/useFeedback';

interface FeedbackWidgetProps {
  onRate: (rating: Rating) => void;
  onSkip: () => void;
}

const OPTIONS: { rating: Rating; label: string }[] = [
  { rating: 'too_easy', label: 'Too easy' },
  { rating: 'just_right', label: 'Just right' },
  { rating: 'too_hard', label: 'Too hard' },
  { rating: 'too_linear', label: 'Too linear' },
];

export function FeedbackWidget({ onRate, onSkip }: FeedbackWidgetProps) {
  const [chosen, setChosen] = useState<Rating | null>(null);

  if (chosen) {
    return <p className="feedback-thanks">Thanks &mdash; that helps tune future puzzles.</p>;
  }

  return (
    <div className="feedback">
      <p className="feedback-prompt">How was that puzzle?</p>
      <div className="feedback-buttons">
        {OPTIONS.map(opt => (
          <button
            key={opt.rating}
            className="btn btn--small"
            onClick={() => {
              setChosen(opt.rating);
              onRate(opt.rating);
            }}
          >
            {opt.label}
          </button>
        ))}
        <button className="btn btn--small btn--ghost" onClick={onSkip}>
          Skip
        </button>
      </div>
    </div>
  );
}
