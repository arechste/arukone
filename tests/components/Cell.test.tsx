import { render, screen } from '@testing-library/react';
import { Cell } from '../../src/components/Cell';

describe('Cell', () => {
  it('renders an empty cell', () => {
    const { container } = render(
      <Cell r={0} c={0} isEndpoint={false} pairId={undefined}
        activeColor={null} connections={null} isDrawing={false}
        hintResult={null} showSolution={false} solPairId={-1} />
    );
    expect(container.querySelector('.cell')).toBeInTheDocument();
  });

  it('renders endpoint when isEndpoint is true', () => {
    render(
      <Cell r={0} c={0} isEndpoint={true} pairId={0}
        activeColor={null} connections={null} isDrawing={false}
        hintResult={null} showSolution={false} solPairId={-1} />
    );
    // Endpoint component renders the letter label
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders hint overlay when hintResult is set', () => {
    const { container } = render(
      <Cell r={0} c={0} isEndpoint={false} pairId={undefined}
        activeColor="#ff0000" connections={{ up: false, down: true, left: false, right: false }}
        isDrawing={false} hintResult="wrong" showSolution={false} solPairId={-1} />
    );
    expect(container.querySelector('.hint-wrong')).toBeInTheDocument();
  });

  it('renders correct hint class', () => {
    const { container } = render(
      <Cell r={0} c={0} isEndpoint={false} pairId={undefined}
        activeColor="#ff0000" connections={{ up: false, down: true, left: false, right: false }}
        isDrawing={false} hintResult="correct" showSolution={false} solPairId={-1} />
    );
    expect(container.querySelector('.hint-correct')).toBeInTheDocument();
  });

  it('renders solution overlay when showSolution is true', () => {
    const { container } = render(
      <Cell r={0} c={0} isEndpoint={false} pairId={undefined}
        activeColor={null} connections={null} isDrawing={false}
        hintResult={null} showSolution={true} solPairId={0} />
    );
    // Solution shows a colored div with opacity
    const overlay = container.querySelector('.cell > div');
    expect(overlay).toBeInTheDocument();
  });
});
