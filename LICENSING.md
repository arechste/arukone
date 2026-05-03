# Licensing

This repository contains code under two compatible but distinct licenses.

| Path | License | Why |
|---|---|---|
| `/` (root) — `src/`, `tests/`, `public/`, `docs/`, configs, `src/data/puzzleBank.json` | **MIT** | Original work © 2026 Alex Rechsteiner. See [`LICENSE`](./LICENSE). |
| `generator/` | **AGPL-3.0** | Derivative of [thomasahle/numberlink](https://github.com/thomasahle/numberlink) (AGPL-3.0). See [`generator/LICENSE`](./generator/LICENSE) and [`generator/README.md`](./generator/README.md). |

## What this means in practice

- **Playing the game and using/forking the runtime app:** governed by MIT —
  permissive, do almost anything.
- **Using or modifying the puzzle generator under `generator/`:** governed by
  AGPL-3.0 — you must preserve the license, share modifications under AGPL,
  and if you serve it as a network service, you must offer source to users.
- **The puzzle bank `src/data/puzzleBank.json`** is *output* of the generator,
  not a derivative work of it. It is part of the MIT-licensed runtime.
  (Same reasoning by which output of GCC is not GPL.)
- **Deployed builds contain zero AGPL code.** The generator is a build-time
  offline tool, never bundled into the published JavaScript artifact.

## Boundary enforcement

`src/` must never `import` from `generator/`. Doing so would require the
runtime to also be AGPL-3.0. An ESLint `no-restricted-imports` rule guards
this boundary.

## Third-party runtime dependencies

See [`THIRD_PARTY_LICENSES.md`](./THIRD_PARTY_LICENSES.md).
