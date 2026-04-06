import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toolbar } from '../../src/components/Toolbar';

function renderToolbar(overrides: Partial<Parameters<typeof Toolbar>[0]> = {}) {
  const props = {
    canUndo: true,
    canHint: true,
    hintActive: false,
    onUndo: vi.fn(),
    onReset: vi.fn(),
    onNewPuzzle: vi.fn(),
    onHint: vi.fn(),
    ...overrides,
  };
  render(<Toolbar {...props} />);
  return props;
}

describe('Toolbar', () => {
  it('renders all action buttons', () => {
    renderToolbar();
    expect(screen.getByText(/Undo/)).toBeInTheDocument();
    expect(screen.getByText(/Reset/)).toBeInTheDocument();
    expect(screen.getByText(/New/)).toBeInTheDocument();
    expect(screen.getByText(/Hint/)).toBeInTheDocument();
  });

  it('disables undo when canUndo is false', () => {
    renderToolbar({ canUndo: false });
    expect(screen.getByText(/Undo/).closest('button')).toBeDisabled();
  });

  it('disables hint when canHint is false', () => {
    renderToolbar({ canHint: false });
    expect(screen.getByText(/Hint/).closest('button')).toBeDisabled();
  });

  it('shows "Hide" when hint is active', () => {
    renderToolbar({ hintActive: true });
    expect(screen.getByText(/Hide/)).toBeInTheDocument();
  });

  it('calls handlers on click', async () => {
    const props = renderToolbar();

    await userEvent.click(screen.getByText(/Undo/).closest('button')!);
    expect(props.onUndo).toHaveBeenCalledOnce();

    await userEvent.click(screen.getByText(/Reset/).closest('button')!);
    expect(props.onReset).toHaveBeenCalledOnce();

    await userEvent.click(screen.getByText(/New/).closest('button')!);
    expect(props.onNewPuzzle).toHaveBeenCalledOnce();

    await userEvent.click(screen.getByText(/Hint/).closest('button')!);
    expect(props.onHint).toHaveBeenCalledOnce();
  });
});
