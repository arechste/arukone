# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.2.0] - 2026-05-03

First production release — public OSS posture, deployable to Cloudflare
Workers via tag-driven CI/CD, security-hardened.

### Added
- Public GitHub repository at `arechste/arukone` under MIT license
- AGPL-3.0 attribution and license for `generator/` (derived from
  thomasahle/numberlink); ESLint guard enforcing the MIT/AGPL boundary
- `LICENSING.md`, `THIRD_PARTY_LICENSES.md`, `SECURITY.md`,
  OSS-flavored `CONTRIBUTING.md`
- Cloudflare Workers Static Assets deploy:
  - `wrangler.jsonc` with `preview` and `production` environments
  - GitHub Actions deploy jobs (preview on `main`, production on
    `v*.*.*` tags), production gated on manual approval
  - Mise tasks `deploy:dry`, `deploy:preview`, `deploy:production`
    wrapping `op run` for 1Password-injected secrets
- Security headers via `public/_headers` — strict CSP, HSTS, COOP/CORP,
  Permissions-Policy
- Operational documentation: `docs/DEPLOY.md`, `docs/DASHBOARDS.md`,
  `docs/secret-management.md`
- Pre-commit framework with SHA-pinned hooks (`pre-commit-hooks`,
  `gitleaks`, plus local lint/typecheck)
- Gitleaks job in CI as additional defense-in-depth
- Renovate auto-update PRs enabled
- Live deployment QR code in `README.md` for mobile testing

### Changed
- Vite bumped 8.0.4 → 8.0.10 (resolves GHSA-v2wj-q39q-566r and
  GHSA-p9ff-h696-f583, both dev-server-only)
- Vitest bumped 4.1.2 → 4.1.5 (was pinning a transitive vulnerable Vite)

### Security
- All known high-severity dependency CVEs cleared
- Real domain and account ID kept out of repo (placeholder
  `arukone.play.example.com` used in deploy docs)
- `.gitignore` hardened for `.env`, `secrets/`, `*.pem`, `*.key`, `id_*`

### Known issues
- Theme toggle inconsistency on macOS Brave (#2)
- Desktop layout doesn't scale to wide viewports (#3)
- iPad landscape orientation overflows (#4)

These are quality-of-life improvements scheduled for `v0.2.x` patches,
not release blockers — functional play works on all target devices.

## [0.1.0] - 2026-04-06

First versioned release — project hygiene complete (Phase 0).

### Added
- Numberlink/Flow Free puzzle game with 800 puzzles across 4 difficulties
- Vite + React 19 + TypeScript + Tailwind CSS v4 stack
- Touch-based drawing with path interpolation and drag-back erase
- Win detection, move counter, timer, and persistent stats (localStorage)
- Hint system comparing against stored solutions
- Vitest test suite — 101 tests across lib, hooks, and components
- Pre-commit hook (lint + typecheck) for local-first CI
- GitHub Actions workflow (lint, typecheck, test, build) with path filtering
- mise tasks for dev, check, test, build workflows
- Ship-ready plan documenting PWA, CI, security, and deployment phases
