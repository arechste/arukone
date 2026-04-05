import { useGameState } from './hooks/useGameState';
import { getThemeVars } from './lib/theme';
import { Header } from './components/Header';
import { DifficultyPicker } from './components/DifficultyPicker';
import { Grid } from './components/Grid';
import { Toolbar } from './components/Toolbar';
import { WinOverlay } from './components/WinOverlay';
import { PairStatus } from './components/PairStatus';

export default function App() {
  const {
    theme, difficulty, puzzle, timer, moves, solved,
    hintMap, showSolution, stats, difficulties, pairStatuses,
    playerPaths, history, gridRef,
    handlePointerDown, handlePointerMove, handlePointerUp,
    handleUndo, handleReset, handleNewPuzzle, handleDifficulty,
    handleToggleTheme, handleHint, handleRevealSolution,
    getCellContent, formatTime,
  } = useGameState();

  const themeVars = getThemeVars(theme);
  const connectedCount = pairStatuses.filter(s => s === 'connected').length;

  return (
    <div className="app" style={themeVars as React.CSSProperties}>
      <Header theme={theme} onToggleTheme={handleToggleTheme} />

      <DifficultyPicker
        difficulties={difficulties}
        current={difficulty}
        onSelect={handleDifficulty}
      />

      <div className="stats">
        <div className="stat">{'\u23F1'} <strong>{formatTime(timer)}</strong></div>
        <div className="stat">
          <strong>{connectedCount}</strong> / {puzzle.pairs} pairs
        </div>
        <div className="stat">{'\u2197'} <strong>{moves}</strong> moves</div>
      </div>

      <Grid
        puzzle={puzzle}
        gridRef={gridRef}
        hintMap={hintMap}
        showSolution={showSolution}
        getCellContent={getCellContent}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      <Toolbar
        canUndo={history.length > 0}
        canHint={playerPaths.size > 0 && !solved}
        hintActive={!!hintMap}
        onUndo={handleUndo}
        onReset={handleReset}
        onNewPuzzle={handleNewPuzzle}
        onHint={handleHint}
      />

      <div style={{ marginTop: 4 }}>
        <button
          onClick={handleRevealSolution}
          style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            fontSize: 10, opacity: 0.3, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          {showSolution ? '\u2298 hide solution' : '\u2299 debug'}
        </button>
      </div>

      <PairStatus endpoints={puzzle.endpoints} statuses={pairStatuses} />

      {solved && (
        <WinOverlay
          difficulty={difficulties[difficulty]}
          rows={puzzle.rows}
          cols={puzzle.cols}
          timer={formatTime(timer)}
          moves={moves}
          bestTime={stats.bestTimes[difficulty] ? formatTime(stats.bestTimes[difficulty]) : '\u2014'}
          totalSolved={stats.totalSolved}
          onNextPuzzle={handleNewPuzzle}
        />
      )}
    </div>
  );
}
