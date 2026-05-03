# Third-Party Licenses

Runtime dependencies bundled into the deployed JavaScript artifact. Build-time
dependencies (Vite, TypeScript, ESLint, Tailwind, Vitest, etc.) are not listed
here — they are not shipped to end users.

## Bundled at runtime

| Package | License | Source |
|---|---|---|
| `react` | MIT | https://github.com/facebook/react |
| `react-dom` | MIT | https://github.com/facebook/react |

The full text of the MIT License accompanies each package in `node_modules/<pkg>/LICENSE`
and is reproduced in the bundled artifact via Vite's license-comment preservation.

## Generator (separate, not bundled)

The Python tools under `generator/` are AGPL-3.0 and never reach a deployed
build. See [`generator/README.md`](./generator/README.md) and
[`generator/LICENSE`](./generator/LICENSE).

## Audit

Run `bun audit` for vulnerability status. Run `bunx license-checker --production`
for a current list of all production dependency licenses (this file lists only
those that are actually bundled into the runtime).
