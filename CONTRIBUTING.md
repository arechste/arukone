# Contributing to Arukone

## Prerequisites

- [Bun](https://bun.sh/) (package manager and runtime)
- [mise](https://mise.jdx.dev/) (task runner, optional but recommended)

## Setup

```bash
bun install
mise run dev
```

Open http://localhost:5173 to play.

## Project structure

- `src/components/` — React UI components
- `src/hooks/` — Custom React hooks (game state, drawing, timer, persistence)
- `src/lib/` — Pure game logic, types, constants, theme
- `src/data/` — Puzzle bank (800 puzzles across 4 difficulty levels)
- `generator/` — Python scripts for generating new puzzles (offline tool)
- `docs/` — Project plans and documentation

## Commands

| Command | Description |
|---------|-------------|
| `mise run dev` | Start dev server |
| `mise run dev:stop` | Stop dev server |
| `bun run build` | Type-check and production build |
| `bun run lint` | Run ESLint |

## Game rules

Arukone (Numberlink) — connect each pair of matching letters (A-A, B-B, etc.)
with a continuous path. All cells must be filled. Paths cannot cross or overlap.

## Conventions

- Commits: `type(scope): description` (imperative mood, under 72 chars)
- Types: feat, fix, refactor, docs, test, chore, ci
- Branch from `main` for non-trivial changes
