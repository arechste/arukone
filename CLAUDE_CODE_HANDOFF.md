# Arukone — Claude Code Handoff

## Project Overview

Arukone is a Numberlink/Flow Free puzzle game. The player connects lettered endpoint pairs (A-A, B-B, etc.) with continuous paths on a grid. All cells must be filled, no paths may cross. Reference game: https://gridgames.app/arukone/

**Current state**: Working prototype as a single React JSX artifact (arukone.jsx, 1033 lines, 225KB). Fully playable with touch drawing, 4 difficulty levels, 800 embedded puzzles, dark/light mode, timer, hints, persistence. Needs visual polish and migration to a proper project structure for shipping.

**Target platforms**: iPad, iPhone, Android — browser-based (PWA).

---

## Current Architecture

### Game Files
- `arukone.jsx` — Monolithic React component with embedded puzzle bank (~190KB of puzzles + ~40KB of game code)
- `puzzle_bank.json` — Raw puzzle bank (800 puzzles, 315KB) for reference/regeneration

### Generator Files (Python, offline use)
- `generate_bank.py` — Our wrapper script
- `gen.py`, `mitm.py`, `grid.py`, `draw.py` — thomasahle/numberlink modules (https://github.com/thomasahle/numberlink)

### Puzzle Parameters (matching gridgames.app)
| Difficulty | Grid | Pairs | Endpoint Density |
|-----------|------|-------|-----------------|
| Easy | 7×7 | 4 | ~16% |
| Medium | 8×8 | 5 | ~16% |
| Hard | 9×9 | 7 | ~17% |
| Extreme | 10×10 | 8 | ~16% |

### Puzzle Bank Format (compact JSON embedded in app)
```json
{
  "easy": {
    "r": 7, "c": 7, "p": 4,
    "z": [
      {
        "e": [[startRow,startCol,endRow,endCol], ...],  // endpoints per pair
        "s": [[0,1,0,1,...], ...]                        // solution grid (pair IDs)
      }
    ]
  }
}
```

---

## Implemented Features

### Core Gameplay
- Touch-drag path drawing with pointer capture
- Drag-back erasing (retrace to undo partial path)
- Tap endpoint to start, tap existing path to remove
- Fast-swipe interpolation (straight lines)
- Path stops at destination endpoint (can't draw beyond)
- Adjacent-endpoint blocking (can't draw through other pairs' endpoints)
- Incomplete paths auto-dropped on pointer up

### UI/UX
- Dark mode (default) and light mode toggle
- Timer (starts on first draw)
- Move counter
- Pairs completed counter
- Undo (last path), Reset (clear all), New Puzzle
- Hint system (per-cell green/red, 5-second toggle)
- Debug solution reveal
- Confetti win animation
- Daily puzzle seed (seeded PRNG)
- Persistence via window.storage (best times, solve counts)
- 4 difficulty selector with grid size labels

### Drawing Mechanics
- Path width: 19% of cell size
- Endpoint circle: 54% of cell size
- Seam-fixed path rendering (no gaps between segments)
- Path animation: 0.12s transition (may need tuning)
- 12 path colors with letter labels (A-Z)
- Fonts: DM Sans (UI) + JetBrains Mono (endpoint letters)

---

## Tech Stack Decision

**Chosen: Vite + React + TypeScript + Tailwind CSS + Bun**

| Choice | Reason |
|--------|--------|
| Vite | SPA game, no SSR needed. Instant HMR, tiny builds. |
| React | Already React. Port game logic directly. |
| TypeScript | Complex state (puzzle data, drawing state, pointer events). Types catch bugs. |
| Tailwind CSS | Replaces 150-line CSS string. Built-in responsive, dark mode, design tokens. |
| Bun | Fast installs, fast scripts. Drop-in Node replacement. |

**Rejected:**
- Next.js — No SSR/routing needed for a single-page game
- shadcn/ui — 90% of UI is custom (grid, paths, endpoints). Only ~4 standard buttons. Overhead not justified.

---

## Migration Plan

### Phase 1: Project Setup
```bash
bun create vite arukone --template react-ts
cd arukone
bun add -d tailwindcss @tailwindcss/vite
```

### Phase 2: Component Split
Split `arukone.jsx` into:
```
src/
  components/
    Grid.tsx          # Grid rendering, cell layout, path SVG overlay
    Cell.tsx           # Individual cell (empty, path segment, endpoint)
    Endpoint.tsx       # Lettered circle with color
    PathLayer.tsx      # SVG overlay for drawn paths
    Toolbar.tsx        # Undo, Reset, New Puzzle, Hint buttons
    DifficultyPicker.tsx  # Easy/Medium/Hard/Extreme tabs
    WinOverlay.tsx     # Win celebration modal
    Header.tsx         # Title, theme toggle, timer, counters
  hooks/
    useGameState.ts    # Core game state machine
    useDrawing.ts      # Pointer event handling, path building
    usePersistence.ts  # localStorage stats
    useTimer.ts        # Timer logic
  lib/
    puzzles.ts         # Puzzle loader, bank data types
    gameLogic.ts       # checkWin, isAdjacent, interpolateCells, tracePath
    theme.ts           # Theme definitions, color palette
    constants.ts       # PATH_COLORS, difficulty configs
  data/
    puzzleBank.json    # Extracted from embedded constant
  App.tsx
  main.tsx
```

### Phase 3: Game Logic Port
Game logic is pure functions — port directly with type annotations:
- `checkWin()`, `isAdjacent()`, `cellKey()`, `interpolateCells()`, `tracePath()`, `loadPuzzle()`
- `createRNG()`, `getDailySeed()`

### Phase 4: Drawing System Port
The pointer event system (handlePointerDown/Move/Up) ports as a custom hook `useDrawing`. Key behaviors to preserve:
- Pointer capture for touch reliability
- Fast-swipe interpolation
- Drag-back erasing
- Path stops at destination endpoint
- touch-action: none on grid only

### Phase 5: Design System & Polish (see below)

### Phase 6: PWA & Deploy
- `manifest.json` with app name, icons, standalone display
- Service worker for offline caching
- iOS meta tags (`apple-mobile-web-app-capable`, status bar style)
- App icons (192px, 512px)
- Deploy to Vercel or Netlify (free tier)

---

## Design Polish Requirements

### 1. Color Palette
Current 12 colors lack sufficient contrast, especially on light backgrounds. Need:
- 12 distinct, accessible colors that work on both dark AND light backgrounds
- Each color needs: full (path fill), dimmed (completed pair glow), text-on-color (endpoint letter)
- Test for color blindness accessibility (avoid pure red/green adjacency)
- Reference: gridgames.app uses muted, slightly desaturated colors

### 2. Component Consistency
Current issues: inconsistent button sizes, font weights, border radii, spacing. Need:
- Unified button component (consistent padding, border-radius, font, hover/active states)
- Consistent spacing scale (use Tailwind's default: 4px increments)
- Typography scale: title (bold, large), body (medium), label (small, muted), mono (endpoint letters)

### 3. Branding & Design Tokens
Define in Tailwind config:
- Primary accent color (currently #00d4aa teal)
- Surface hierarchy: bg → surface → elevated
- Border/divider colors
- Animation durations (fast: 100ms, normal: 200ms, slow: 400ms)
- Border radii: sm (4px), md (8px), lg (12px), xl (16px), full (50%)
- Shadows: subtle, medium, strong

### 4. Grid Rendering
Current issues: rounded edges look imprecise, grid lines inconsistent across devices.
- Grid container: solid border-radius with overflow hidden, crisp outer border
- Cell dividers: 1px lines (use gap or border, not both)
- Endpoint circles: consistent size ratio, centered, subtle shadow
- Path segments: smooth rounded caps, consistent width, no visual seams
- Consider using SVG for the entire grid instead of DOM elements for pixel-perfect rendering

### 5. Cross-Device Polish
- Test on: iPad (landscape + portrait), iPhone SE (small), iPhone Pro Max (large), Android mid-range
- Grid should be square and maximize available width (with padding)
- Buttons should be at least 44px touch targets (Apple HIG)
- No viewport-height (vh) based sizing (breaks in mobile browsers with address bar)
- Use `dvh` or flex-based layouts instead
- Ensure touch-action: none only on grid (allow page scroll elsewhere)

### 6. Dark/Light Mode Parity
Both themes need equal care:
- Dark: current is decent but cells/grid lines could be crisper
- Light: needs more contrast, currently feels washed out
- Endpoint colors may need per-theme variants for optimal contrast

---

## Decisions Log

### Uniqueness Verification — DEFERRED
- `checkWin()` validates structurally (all cells filled, paths connect, no overlaps) — does NOT compare against stored solution
- Game works correctly with non-unique puzzles
- Only the hint system compares against stored solution — hints could mislead on non-unique puzzles
- Writing a Numberlink solver from scratch is hard — thomasahle's Go solver would work but requires Go compiler
- All 800 stored solutions verified as structurally valid
- **Action**: Revisit if hint accuracy becomes a user complaint. Would need Go compiler + thomasahle's solver to filter puzzles.

### Generator Choice — thomasahle/numberlink
- Previous diagonal-fill approach produced parallel/blobby paths (~35% interleaving)
- thomasahle's algorithm (MITM path table + side paths + loop insertion on doubled grid) produces genuine crossings (~46-49% interleaving)
- Powers Puzzle Baron's numberlink puzzles
- Generation speed: ~15-30 puzzles/sec depending on difficulty
- Quality filtering: interleaving score, bbox overlap, endpoint distance, length variance

---

## Known Issues / Technical Debt

1. **Monolithic file** — 1033 lines, single component, embedded CSS string, embedded 190KB puzzle bank
2. **Color contrast** — Some endpoint colors too similar, poor on light mode
3. **Button inconsistency** — Mixed sizing, padding, border-radius
4. **Grid rendering** — Border-radius imprecise, grid lines vary across devices
5. **No error boundaries** — Puzzle load failure = blank screen
6. **No analytics** — No way to know which puzzles are too easy/hard
7. **Persistence fragile** — Uses window.storage (artifact-specific), needs localStorage for PWA
8. **Path animation** — 0.12s may be too fast/slow, needs device testing

---

---

## Transition to Claude Code — Step by Step

### Prerequisites
- A **Claude Pro, Max, Team, or Enterprise** subscription (free plan does NOT include Claude Code)
- macOS, Windows, or Linux computer
- Git installed

### Step 1: Download all project files from claude.ai

Download these 8 files from the chat outputs (click the download icon on each):
- `CLAUDE_CODE_HANDOFF.md` (this file)
- `arukone.jsx`
- `puzzle_bank.json`
- `generate_bank.py`
- `gen.py`
- `mitm.py`
- `grid.py`
- `draw.py`

### Step 2: Create the project folder on your computer

**macOS (Terminal):**
```bash
mkdir -p ~/Projects/arukone/generator
```

**Windows (PowerShell):**
```powershell
mkdir ~\Projects\arukone\generator
```

Now move the downloaded files into place:
```
~/Projects/arukone/
  CLAUDE_CODE_HANDOFF.md
  arukone.jsx
  puzzle_bank.json
  generator/
    generate_bank.py
    gen.py
    mitm.py
    grid.py
    draw.py
```

### Step 3: Create the CLAUDE.md file

Create a file called `CLAUDE.md` in `~/Projects/arukone/` with this content:

```markdown
# Arukone

Read CLAUDE_CODE_HANDOFF.md for full project context, architecture,
design decisions, and task backlog.

## Current state
Working prototype in arukone.jsx (monolithic React component with
embedded 800-puzzle bank). Needs migration to proper project structure.

## Immediate task
Migrate to Vite + React + TypeScript + Tailwind CSS project.
See "Migration Plan" in CLAUDE_CODE_HANDOFF.md.

## Stack
Vite + React + TypeScript + Tailwind CSS + Bun
No shadcn. No Next.js.

## Reference game
https://gridgames.app/arukone/
```

### Step 4: Initialize Git

```bash
cd ~/Projects/arukone
git init
git add .
git commit -m "Initial commit: working prototype from claude.ai"
```

### Step 5: Install Claude Code

You have two options — Desktop App (easier) or Terminal CLI (more powerful).

#### Option A: Claude Code Desktop App (recommended for beginners)

1. Download from https://claude.ai/download (macOS or Windows)
2. Install: drag to Applications (Mac) or run installer (Windows)
3. Launch the app and sign in with your Anthropic account
4. Click the **Code** tab at the top center
5. Select **Local** to run on your machine
6. Click **Select folder** → navigate to `~/Projects/arukone` → select it
7. You're in! Claude Code can now see all your project files

#### Option B: Terminal CLI (more powerful, full feature set)

**macOS:**
```bash
curl -fsSL https://code.claude.com/install | sh
```

**Windows (PowerShell):**
```powershell
irm https://code.claude.com/install | iex
```

**Verify:**
```bash
claude --version
```

**Start a session:**
```bash
cd ~/Projects/arukone
claude
```

First time: a browser window opens for authentication. Sign in with your Anthropic account.

### Step 6: Your first Claude Code prompt

Whether you're in the Desktop App or Terminal, give Claude this first prompt:

```
Read CLAUDE_CODE_HANDOFF.md thoroughly. Then:

1. Set up a new Vite + React + TypeScript + Tailwind project using bun
2. Migrate the game code from arukone.jsx into the component structure
   described in the handoff doc (Grid, Cell, Endpoint, Toolbar, etc.)
3. Extract the puzzle bank into a separate JSON file
4. Keep the game fully functional — I want to test it with bun dev
   before we do anything else
```

### Step 7: Verify the migration works

After Claude Code finishes, test it:
```bash
bun dev
```
Open the URL shown (usually http://localhost:5173) in your browser. Play a puzzle. If it works, commit:
```bash
git add .
git commit -m "Migrate to Vite + React + TypeScript + Tailwind"
```

### Step 8: Start the polish pass

```
Now do the design polish. Focus on:
1) Better color palette — 12 distinct accessible colors for both themes
2) Consistent button component with uniform padding, radius, font
3) Crisp grid rendering with proper border-radius and overflow hidden
4) Cross-device responsive layout (iPad, iPhone SE, iPhone Pro Max, Android)
5) Dark/light mode parity — both should look equally polished
Reference gridgames.app/arukone for the quality bar.
```

### Step 9: PWA & Deploy (when ready to ship)

```
Add PWA support: manifest.json, service worker for offline caching,
app icons (192px + 512px), iOS meta tags for standalone mode.
Then deploy to Vercel.
```

---

## Tips for Working with Claude Code

- **Claude Code reads `CLAUDE.md` automatically** — keep it updated as the project evolves
- **Git is your safety net** — commit before asking Claude to make big changes
- **Be specific** — "fix the button styling" is vague; "make all buttons 44px tall with 12px rounded corners and the accent color" is clear
- **You can run multiple sessions** — Desktop App supports parallel sessions
- **Review diffs before accepting** — Claude Code shows you what it changed

---

## Reference

- Game reference: https://gridgames.app/arukone/
- Generator: https://github.com/thomasahle/numberlink
- Numberlink rules: https://en.wikipedia.org/wiki/Numberlink
- Apple HIG touch targets: https://developer.apple.com/design/human-interface-guidelines/
- Claude Code docs: https://code.claude.com/docs/en/desktop-quickstart
- Claude Code setup: https://code.claude.com/docs/en/setup
