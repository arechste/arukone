import { useCallback } from 'react';
import { useGameState } from './hooks/useGameState';
import { useHelp } from './hooks/useHelp';
import { useFeedback } from './hooks/useFeedback';
import type { Rating } from './hooks/useFeedback';
import { Header } from './components/Header';
import { DifficultyPicker } from './components/DifficultyPicker';
import { Grid } from './components/Grid';
import { Toolbar } from './components/Toolbar';
import { WinOverlay } from './components/WinOverlay';
import { PairStatus } from './components/PairStatus';
import { Footer } from './components/Footer';
import { HelpOverlay } from './components/HelpOverlay';

export default function App() {
  const {
    theme, difficulty, puzzleIndex, puzzle, timer, moves, solved,
    hintMap, showSolution, stats, difficulties, pairStatuses,
    playerPaths, history, gridRef,
    handlePointerDown, handlePointerMove, handlePointerUp,
    handleUndo, handleReset, handleNewPuzzle, handleDifficulty,
    handleToggleTheme, handleHint, handleRevealSolution,
    getCellContent, formatTime,
  } = useGameState();

  const help = useHelp();
  const feedback = useFeedback();
  const connectedCount = pairStatuses.filter(s => s === 'connected').length;

  const handleRate = useCallback((rating: Rating) => {
    feedback.record({
      puzzleId: `${difficulty}-${puzzleIndex}`,
      difficulty,
      rating,
      timeSeconds: timer,
      ts: Date.now(),
    });
  }, [feedback, difficulty, puzzleIndex, timer]);

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={handleToggleTheme} />

      <DifficultyPicker
        difficulties={difficulties}
        current={difficulty}
        onSelect={handleDifficulty}
      />

      <div className="stats">
        <div className="stat">{'⏱'} <strong>{formatTime(timer)}</strong></div>
        <div className="stat">
          <strong>{connectedCount}</strong> / {puzzle.pairs} pairs
        </div>
        <div className="stat">{'↗'} <strong>{moves}</strong> moves</div>
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
        onShowHelp={help.show}
      />

      <button
        onClick={handleRevealSolution}
        style={{
          background: 'none', border: 'none', color: 'var(--text-muted)',
          fontSize: 10, opacity: 0.3, cursor: 'pointer', fontFamily: 'inherit',
          marginTop: 4,
        }}
      >
        {showSolution ? '⊘ hide solution' : '⊙ debug'}
      </button>

      <PairStatus endpoints={puzzle.endpoints} statuses={pairStatuses} />

      <Footer />

      {help.open && (
        <HelpOverlay
          difficultyLabel={difficulties[difficulty].label}
          rows={puzzle.rows}
          cols={puzzle.cols}
          pairs={puzzle.pairs}
          onClose={help.close}
        />
      )}

      {solved && (
        <WinOverlay
          difficulty={difficulties[difficulty]}
          rows={puzzle.rows}
          cols={puzzle.cols}
          timer={formatTime(timer)}
          moves={moves}
          bestTime={stats.bestTimes[difficulty] ? formatTime(stats.bestTimes[difficulty]) : '—'}
          totalSolved={stats.totalSolved}
          onNextPuzzle={handleNewPuzzle}
          onRate={handleRate}
        />
      )}
    </div>
  );
}
