# Contributing to Arukone

Thanks for your interest. This is a small open-source project; contributions
of any size are welcome — bug reports, fixes, tests, accessibility
improvements, new puzzle difficulty parameters, and documentation polish
are all appreciated.

## Code of conduct

Be kind. Disagree on the technical content, never on the person. Assume good
intent. The maintainer reserves the right to remove comments or block users
who are persistently abusive.

## Getting started

```bash
# Fork on GitHub, then:
git clone https://github.com/<you>/arukone.git
cd arukone
bun install
brew install pre-commit && pre-commit install   # one-time, enables pinned pre-commit hooks
mise run dev                                    # http://localhost:5173
```

Requirements:

- [Bun](https://bun.sh/) (package manager and runtime)
- [mise](https://mise.jdx.dev/) (task runner — optional but recommended)
- Python 3.10+ (only if you want to regenerate the puzzle bank)

## Project layout

```
src/
  components/   React UI components
  hooks/        Game state, drawing, timer, persistence
  lib/          Pure logic (gameLogic, puzzles, types) — no side effects
  data/         puzzleBank.json (generated; do not edit by hand)
tests/          Vitest tests, mirroring src/
generator/      Python puzzle generator (AGPL-3.0; offline only)
docs/           Plans and reference docs
```

**License boundary:** `src/**` is MIT, `generator/**` is AGPL-3.0. Never
import from `generator/` inside `src/` — it would taint the runtime.
See [`LICENSING.md`](./LICENSING.md). The ESLint config enforces this.

## Tasks

| Command | What it does |
|---|---|
| `mise run dev` | Vite dev server with HMR on `:5173` |
| `mise run dev:stop` | Kill process on `:5173` |
| `mise run check` | ESLint + `tsc --noEmit` |
| `mise run test` | Vitest, all suites |
| `mise run build` | Production build to `dist/` |
| `mise run audit` | `bun audit --audit-level=high` |
| `mise run deploy:dry` | Validate Cloudflare config (no credentials needed) |
| `mise run deploy:preview` | Deploy to preview env (requires secrets) |
| `mise run deploy:production` | Deploy to production env (requires secrets) |

## Pull-request workflow

1. Open or comment on an issue first for non-trivial changes.
2. Branch from `main`: `git switch -c feat/short-description`.
3. Make the change. Add or update tests.
4. Run `mise run check && mise run test` locally — CI runs the same.
5. Conventional commits: `type(scope): subject` under 72 chars.
   Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `ci`.
6. Open a PR. CI runs lint, typecheck, tests, build, audit, gitleaks,
   and a Cloudflare config dry-run. All must pass.

## Tests

- **Behavior over implementation.** Test what the code does, not how.
- **Real dependencies over mocks.** Mock only at system boundaries
  (browser APIs, `localStorage`, time).
- **One concept per test.** Multiple assertions are fine if they're testing
  the same behavior from different angles.
- **Regression test every bug fix.**

## Reporting bugs

Use GitHub Issues. Include browser, OS, the puzzle (difficulty + grid size
or seed), and reproduction steps. Screenshots help.

## Security

Do not file security issues publicly. See [`SECURITY.md`](./SECURITY.md).
