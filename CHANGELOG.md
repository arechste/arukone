# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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
