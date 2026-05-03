import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    // suppress first-visit help overlay so it doesn't shadow text queries
    localStorage.setItem('arukone:help-dismissed-v1', '1');
  });

  it('renders the game', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Easy/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Medium/ })).toBeInTheDocument();
    expect(screen.getByText(/moves/)).toBeInTheDocument();
  });

  it('renders the grid with cells', () => {
    const { container } = render(<App />);
    const cells = container.querySelectorAll('.cell');
    // 7x7 easy grid = 49 cells
    expect(cells.length).toBe(49);
  });

  it('switches difficulty', async () => {
    const { container } = render(<App />);

    await userEvent.click(screen.getByText(/Hard/).closest('button')!);

    const cells = container.querySelectorAll('.cell');
    // 9x9 hard grid = 81 cells
    expect(cells.length).toBe(81);
  });

  it('renders toolbar buttons', () => {
    render(<App />);
    expect(screen.getByText(/Undo/)).toBeInTheDocument();
    expect(screen.getByText(/Reset/)).toBeInTheDocument();
    expect(screen.getByText(/New/)).toBeInTheDocument();
  });

  it('has debug/solution button', () => {
    render(<App />);
    expect(screen.getByText(/debug/)).toBeInTheDocument();
  });
});
