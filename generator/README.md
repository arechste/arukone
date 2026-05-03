# Arukone Puzzle Generator

Offline tool that produces `src/data/puzzleBank.json`. Not part of the deployed
runtime — never imported from `src/`.

## License — AGPL-3.0

This subdirectory is licensed under **GNU Affero General Public License v3.0**
(see [`LICENSE`](./LICENSE)) because it is a derivative work of
[thomasahle/numberlink](https://github.com/thomasahle/numberlink) by Thomas Ahle.

> **Note on the rest of the repository:** the runtime application under `src/`,
> `tests/`, `public/`, configuration files, and the generated puzzle bank JSON
> are licensed under MIT (see root `LICENSE` and [`LICENSING.md`](../LICENSING.md)).
> The generator's AGPL terms apply only to the files in this directory.

## Attribution

- Original work: [thomasahle/numberlink](https://github.com/thomasahle/numberlink),
  Copyright © Thomas Ahle, AGPL-3.0
- Modifications: Copyright © 2026 Alex Rechsteiner, AGPL-3.0 (see git history
  for the list of changes — primarily `generate_bank.py` and parameter tuning
  for the puzzle difficulty levels)

## Files

| File | Origin |
|---|---|
| `mitm.py` | Adapted from upstream |
| `gen.py` | Adapted from upstream |
| `grid.py` | Adapted from upstream |
| `draw.py` | Adapted from upstream |
| `generate_bank.py` | Original (Alex Rechsteiner) — wrapper over upstream |

## Usage

```bash
# Full bank (200 puzzles per difficulty)
python3 generate_bank.py

# Quick test
python3 generate_bank.py --quick

# Single difficulty
python3 generate_bank.py --difficulty easy --count 50
```

Output is written to `../src/data/puzzleBank.json`.

## Network use clause

The AGPL network clause requires that anyone interacting with the program over
a network can obtain its source. This generator runs **locally only** — it is
never exposed as a network service — so the network clause is not triggered in
this project's deployment. If you fork and turn it into an online generator,
you must comply with §13 of the AGPL.
