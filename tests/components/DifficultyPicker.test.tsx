import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DifficultyPicker } from '../../src/components/DifficultyPicker';

const difficulties = {
  easy: { label: 'Easy', rows: 7, cols: 7, pairs: 4 },
  hard: { label: 'Hard', rows: 9, cols: 9, pairs: 7 },
};

describe('DifficultyPicker', () => {
  it('renders a button for each difficulty', () => {
    render(<DifficultyPicker difficulties={difficulties} current="easy" onSelect={() => {}} />);
    expect(screen.getByText(/Easy/)).toBeInTheDocument();
    expect(screen.getByText(/Hard/)).toBeInTheDocument();
  });

  it('applies filled class to current difficulty', () => {
    render(<DifficultyPicker difficulties={difficulties} current="easy" onSelect={() => {}} />);
    const easyBtn = screen.getByText(/Easy/).closest('button')!;
    expect(easyBtn.className).toContain('btn--filled');
  });

  it('calls onSelect when a difficulty is clicked', async () => {
    const onSelect = vi.fn();
    render(<DifficultyPicker difficulties={difficulties} current="easy" onSelect={onSelect} />);

    await userEvent.click(screen.getByText(/Hard/).closest('button')!);
    expect(onSelect).toHaveBeenCalledWith('hard');
  });
});
