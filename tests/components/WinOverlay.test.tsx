import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WinOverlay } from '../../src/components/WinOverlay';

const defaultProps = {
  difficulty: { label: 'Easy', rows: 7, cols: 7, pairs: 4 },
  rows: 7,
  cols: 7,
  timer: '1:30',
  moves: 12,
  bestTime: '1:15',
  totalSolved: 5,
  onNextPuzzle: vi.fn(),
};

describe('WinOverlay', () => {
  it('displays "Solved!" heading', () => {
    render(<WinOverlay {...defaultProps} />);
    expect(screen.getByText('Solved!')).toBeInTheDocument();
  });

  it('shows timer, moves, and best time', () => {
    render(<WinOverlay {...defaultProps} />);
    expect(screen.getByText('1:30')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('1:15')).toBeInTheDocument();
  });

  it('shows total solved count', () => {
    render(<WinOverlay {...defaultProps} />);
    expect(screen.getByText('5 puzzles solved')).toBeInTheDocument();
  });

  it('handles singular puzzle count', () => {
    render(<WinOverlay {...defaultProps} totalSolved={1} />);
    expect(screen.getByText('1 puzzle solved')).toBeInTheDocument();
  });

  it('calls onNextPuzzle when button clicked', async () => {
    const onNextPuzzle = vi.fn();
    render(<WinOverlay {...defaultProps} onNextPuzzle={onNextPuzzle} />);

    await userEvent.click(screen.getByText(/Next Puzzle/));
    expect(onNextPuzzle).toHaveBeenCalledOnce();
  });
});
