# Arukone

Numberlink/Flow Free puzzle game — connect lettered endpoint pairs on a grid,
fill all cells, no crossings. Reference: https://gridgames.app/arukone/

## Stack

Vite + React 19 + TypeScript + Tailwind CSS v4 + Bun

No shadcn. No Next.js. No SSR.

## Architecture

```
src/
  components/   # React components (Grid, Cell, Endpoint, Toolbar, etc.)
  hooks/        # useGameState, useDrawing, usePersistence, useTimer
  lib/          # Pure logic (gameLogic, puzzles, constants, theme, types)
  data/         # puzzleBank.json (800 puzzles, 4 difficulties)
generator/      # Python offline puzzle generator (thomasahle/numberlink)
```

Key patterns:
- `useGameState` is the central state machine — orchestrates all hooks
- `useDrawing` handles pointer capture, path interpolation, drag-back erase
- Game logic is pure functions in `lib/` — no side effects
- Puzzle bank format: compact JSON with endpoints + solution grids
- 12 path colors with letter labels (A-L)

## Development

```bash
mise run dev          # Start dev server on :5173
mise run dev:stop     # Stop dev server
mise run dev:restart  # Restart dev server
mise run lint         # ESLint only
mise run check        # Lint + typecheck
mise run test         # Vitest test suite
mise run build        # Type-check + production build
```

## CI

- **Pre-commit hook** (`.githooks/pre-commit`): runs lint + typecheck locally on every commit
  - Setup: `git config core.hooksPath .githooks` (once per clone)
- **GitHub Actions** (`.github/workflows/ci.yml`): lint, typecheck, test, build
  - Triggers on push/PR to main, path-filtered to skip docs/generator changes
  - Free-tier friendly: local hook catches most issues before pushing

## Puzzle parameters

| Difficulty | Grid  | Pairs |
|-----------|-------|-------|
| Easy      | 7x7   | 4     |
| Medium    | 8x8   | 5     |
| Hard      | 9x9   | 7     |
| Extreme   | 10x10 | 8     |

## Decisions

- `checkWin()` validates structurally (all filled, paths connect) — does NOT compare to stored solution
- Hint system compares against stored solution — uniqueness verification deferred
- Generator uses thomasahle/numberlink (MITM algorithm) — quality filtered by interleaving score
- Target platforms: iPad, iPhone, Android (PWA)
- Deploy target: Cloudflare Workers (play.8-p.ch)

## Ship plan

See `docs/PLAN.md` for phased shipping plan (PWA, CI, security, deployment).
