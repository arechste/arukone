import { render } from '@testing-library/react';
import { Grid } from '../../src/components/Grid';
import type { Puzzle } from '../../src/lib/types';
import { createRef } from 'react';

const testPuzzle: Puzzle = {
  rows: 3,
  cols: 3,
  pairs: 1,
  endpoints: [{ id: 0, start: { r: 0, c: 0 }, end: { r: 2, c: 2 } }],
  solutionGrid: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
  segments: [],
};

describe('Grid', () => {
  it('renders correct number of cells', () => {
    const gridRef = createRef<HTMLDivElement>();
    const getCellContent = () => ({
      isEndpoint: false,
      pairId: undefined,
      activeColor: null,
      connections: null,
      isDrawing: false,
    });

    const { container } = render(
      <Grid
        puzzle={testPuzzle}
        gridRef={gridRef}
        hintMap={null}
        showSolution={false}
        getCellContent={getCellContent}
        onPointerDown={() => {}}
        onPointerMove={() => {}}
        onPointerUp={() => {}}
      />
    );

    const cells = container.querySelectorAll('.cell');
    expect(cells).toHaveLength(9);
  });

  it('sets grid template based on puzzle dimensions', () => {
    const gridRef = createRef<HTMLDivElement>();
    const getCellContent = () => ({
      isEndpoint: false,
      pairId: undefined,
      activeColor: null,
      connections: null,
      isDrawing: false,
    });

    const { container } = render(
      <Grid
        puzzle={testPuzzle}
        gridRef={gridRef}
        hintMap={null}
        showSolution={false}
        getCellContent={getCellContent}
        onPointerDown={() => {}}
        onPointerMove={() => {}}
        onPointerUp={() => {}}
      />
    );

    const grid = container.querySelector('.grid') as HTMLElement;
    expect(grid.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
    expect(grid.style.gridTemplateRows).toBe('repeat(3, 1fr)');
  });
});
