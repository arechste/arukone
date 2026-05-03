#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
# Copyright (c) 2026 Alex Rechsteiner
# Imports from thomasahle/numberlink (AGPL-3.0); this wrapper inherits AGPL-3.0.
# See ./LICENSE and ./README.md.
"""
Arukone Puzzle Bank Generator
Wraps thomasahle's numberlink generator to produce high-quality puzzles
matching gridgames.app parameters.

Usage:
  python generate_bank.py                  # Full bank (200 per difficulty)
  python generate_bank.py --quick          # Quick test (10 per difficulty)
  python generate_bank.py --count 50       # Custom count
  python generate_bank.py --difficulty easy # Single difficulty
"""

import sys, os, json, time, argparse, random

# Import thomasahle's modules
sys.path.insert(0, os.path.dirname(__file__))
from mitm import Mitm
from gen import make
from grid import UnionFind

# Target parameters matching gridgames.app (~16% endpoint density)
DIFFICULTIES = {
    "easy":    {"w": 7,  "h": 7,  "min_pairs": 4, "max_pairs": 4},
    "medium":  {"w": 8,  "h": 8,  "min_pairs": 5, "max_pairs": 5},
    "hard":    {"w": 9,  "h": 9,  "min_pairs": 7, "max_pairs": 7},
    "extreme": {"w": 10, "h": 10, "min_pairs": 8, "max_pairs": 8},
}


def grid_to_puzzle(grid, w, h):
    """Convert thomasahle's Grid object to our puzzle format.

    Returns dict with:
      - endpoints: [{id, start:[r,c], end:[r,c]}, ...]
      - solution: 2D grid of pair IDs (0-based)
    Or None if conversion fails.
    """
    # Build tube grid and union-find to identify connected paths
    tube_grid, uf = grid.make_tubes()

    # Find all endpoints (marked as 'x' in tube_grid which are v^<> in original)
    endpoints_by_group = {}
    for y in range(h):
        for x in range(w):
            # In the original grid, endpoints are v^<>
            # In tube_grid, they become 'x'
            if tube_grid[x, y] == 'x':
                group = uf.find((x, y))
                endpoints_by_group.setdefault(group, []).append((y, x))  # (row, col)

    # Each group should have exactly 2 endpoints
    pairs = []
    for group, eps in endpoints_by_group.items():
        if len(eps) != 2:
            return None  # Invalid puzzle
        pairs.append((group, eps[0], eps[1]))

    # Build solution grid: map each cell to its pair ID
    pair_id_map = {}
    for i, (group, _, _) in enumerate(pairs):
        pair_id_map[group] = i

    solution = [[-1] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            group = uf.find((x, y))
            pid = pair_id_map.get(group, -1)
            if pid == -1:
                return None  # Cell not assigned to any pair
            solution[y][x] = pid

    # Check full coverage
    for row in solution:
        if -1 in row:
            return None

    # Build endpoints list
    endpoints = []
    for i, (group, start, end) in enumerate(pairs):
        endpoints.append({
            "id": i,
            "start": list(start),
            "end": list(end)
        })

    return {"endpoints": endpoints, "solution": solution}


def score_puzzle(puzzle, w, h):
    """Score puzzle quality. Higher = better interleaving.
    Returns (score, reasons) or (negative, reason) if rejected."""

    eps = puzzle["endpoints"]
    sol = puzzle["solution"]
    n_pairs = len(eps)

    # 1. Minimum endpoint Manhattan distance
    dists = []
    for ep in eps:
        sr, sc = ep["start"]
        er, ec = ep["end"]
        d = abs(sr - er) + abs(sc - ec)
        dists.append(d)

    min_dist = min(dists)
    if min_dist < 2:
        return -1, "endpoint too close"

    # 2. No length-2 paths (boring)
    path_lengths = {}
    for r in range(h):
        for c in range(w):
            pid = sol[r][c]
            path_lengths[pid] = path_lengths.get(pid, 0) + 1

    if min(path_lengths.values()) < 3:
        return -2, "path too short"

    # 3. Count same-axis trivial pairs (both endpoints on same row/col, close)
    trivial = 0
    for ep in eps:
        sr, sc = ep["start"]
        er, ec = ep["end"]
        d = abs(sr - er) + abs(sc - ec)
        if (sr == er or sc == ec) and d <= 2:
            trivial += 1
    if trivial > 1:
        return -3, "too many trivial pairs"

    # 4. Interleaving score: count color transitions in rows and columns
    transitions = 0
    total_adjacencies = 0
    for r in range(h):
        for c in range(w - 1):
            total_adjacencies += 1
            if sol[r][c] != sol[r][c + 1]:
                transitions += 1
    for c in range(w):
        for r in range(h - 1):
            total_adjacencies += 1
            if sol[r][c] != sol[r + 1][c]:
                transitions += 1

    interleaving = transitions / total_adjacencies if total_adjacencies > 0 else 0

    # 5. Bounding box overlap (paths crossing territories)
    boxes = []
    for ep in eps:
        sr, sc = ep["start"]
        er, ec = ep["end"]
        boxes.append((min(sr, er), max(sr, er), min(sc, ec), max(sc, ec)))

    overlap_score = 0
    for i in range(len(boxes)):
        for j in range(i + 1, len(boxes)):
            r_overlap = max(0, min(boxes[i][1], boxes[j][1]) - max(boxes[i][0], boxes[j][0]) + 1)
            c_overlap = max(0, min(boxes[i][3], boxes[j][3]) - max(boxes[i][2], boxes[j][2]) + 1)
            overlap_score += r_overlap * c_overlap

    # 6. Path length variance (want mix of short and long)
    avg_len = (w * h) / n_pairs
    lengths = list(path_lengths.values())
    length_var = sum((l - avg_len) ** 2 for l in lengths) / n_pairs

    # Combined score
    score = (
        interleaving * 100 +      # Higher interleaving = better
        overlap_score * 2 +        # More bbox overlap = more crossing
        sum(dists) / n_pairs * 3 + # Farther endpoints = longer paths
        min(dists) * 5 -           # Reward minimum distance
        (length_var / avg_len) * 2 # Slight penalty for very uneven lengths
    )

    return score, "ok"


def generate_puzzles(difficulty, count, mitm, timeout_per=10.0):
    """Generate `count` puzzles for a given difficulty."""
    cfg = DIFFICULTIES[difficulty]
    w, h = cfg["w"], cfg["h"]
    mn, mx = cfg["min_pairs"], cfg["max_pairs"]

    puzzles = []
    attempts = 0
    failures = {"gen_fail": 0, "convert_fail": 0, "quality_fail": 0}
    t_start = time.time()

    # Generate more than needed, keep best
    target = int(count * 1.5)  # Generate 50% extra for quality selection

    while len(puzzles) < target and attempts < count * 50:
        attempts += 1

        try:
            grid = make(w, h, mitm, mn, mx)
        except Exception:
            failures["gen_fail"] += 1
            continue

        if grid is None:
            failures["gen_fail"] += 1
            continue

        puzzle = grid_to_puzzle(grid, w, h)
        if puzzle is None:
            failures["convert_fail"] += 1
            continue

        score, reason = score_puzzle(puzzle, w, h)
        if score < 0:
            failures["quality_fail"] += 1
            continue

        puzzle["_score"] = score
        puzzles.append(puzzle)

        elapsed = time.time() - t_start
        rate = len(puzzles) / elapsed if elapsed > 0 else 0
        if len(puzzles) % 10 == 0:
            print(f"  {difficulty}: {len(puzzles)}/{target} puzzles "
                  f"({attempts} attempts, {rate:.1f}/s, "
                  f"score range {min(p['_score'] for p in puzzles):.0f}-{max(p['_score'] for p in puzzles):.0f})")

    # Sort by quality score, keep the best
    puzzles.sort(key=lambda p: p["_score"], reverse=True)
    puzzles = puzzles[:count]

    # Strip internal score
    for p in puzzles:
        del p["_score"]

    elapsed = time.time() - t_start
    print(f"  {difficulty}: DONE — {len(puzzles)} puzzles from {attempts} attempts "
          f"in {elapsed:.1f}s. Failures: {failures}")

    return puzzles


def main():
    parser = argparse.ArgumentParser(description="Generate Arukone puzzle bank")
    parser.add_argument("--count", type=int, default=200, help="Puzzles per difficulty")
    parser.add_argument("--quick", action="store_true", help="Quick test (10 per difficulty)")
    parser.add_argument("--difficulty", type=str, default=None,
                        choices=list(DIFFICULTIES.keys()), help="Single difficulty only")
    parser.add_argument("--output", type=str, default="puzzle_bank.json")
    parser.add_argument("--jsx-output", type=str, default=None,
                        help="Also output as embeddable JSX constant")
    args = parser.parse_args()

    count = 10 if args.quick else args.count
    difficulties = [args.difficulty] if args.difficulty else list(DIFFICULTIES.keys())

    print(f"Generating {count} puzzles each for: {', '.join(difficulties)}")
    print(f"Preparing MITM table...")
    t0 = time.time()

    # Prepare MITM table (one-time cost)
    max_h = max(DIFFICULTIES[d]["h"] for d in difficulties)
    mitm = Mitm(lr_price=2, t_price=1)
    mitm.prepare(min(20, max(max_h, 6)))
    print(f"MITM ready in {time.time() - t0:.1f}s")

    # Generate all puzzles
    bank = {
        "version": 4,
        "generator": "thomasahle/numberlink",
        "generated": time.strftime("%Y-%m-%d %H:%M:%S"),
        "difficulties": {}
    }

    for diff in difficulties:
        cfg = DIFFICULTIES[diff]
        print(f"\n{'='*60}")
        print(f"Generating {diff} ({cfg['w']}x{cfg['h']}, {cfg['min_pairs']} pairs)...")
        print(f"{'='*60}")

        puzzles = generate_puzzles(diff, count, mitm)

        bank["difficulties"][diff] = {
            "rows": cfg["h"],
            "cols": cfg["w"],
            "pairs": cfg["min_pairs"],
            "puzzles": puzzles
        }

    # Save JSON bank
    with open(args.output, "w") as f:
        json.dump(bank, f, separators=(",", ":"))

    total = sum(len(d["puzzles"]) for d in bank["difficulties"].values())
    size_kb = os.path.getsize(args.output) / 1024
    print(f"\n{'='*60}")
    print(f"Total: {total} puzzles → {args.output} ({size_kb:.0f} KB)")
    print(f"{'='*60}")

    # Optionally output JSX-embeddable format
    if args.jsx_output:
        write_jsx_bank(bank, args.jsx_output)


def write_jsx_bank(bank, filepath):
    """Write the puzzle bank as a JS constant for embedding in the React app."""
    lines = ["// Auto-generated puzzle bank — do not edit manually"]
    lines.append(f"// Generated: {bank['generated']}")
    lines.append(f"// Generator: {bank['generator']}")
    lines.append("const PUZZLE_BANK = " + json.dumps(bank, separators=(",", ":")) + ";")
    lines.append("")

    with open(filepath, "w") as f:
        f.write("\n".join(lines))

    size_kb = os.path.getsize(filepath) / 1024
    print(f"JSX bank → {filepath} ({size_kb:.0f} KB)")


if __name__ == "__main__":
    main()
