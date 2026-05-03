# Arukone

A Numberlink / Flow Free puzzle game. Connect each pair of matching letters
with a continuous path, fill every cell, and avoid crossings.

Built as a static web app — no accounts, no ads, no tracking. Designed for
touch devices (iPad, iPhone, Android) and keyboard/mouse on desktop.

> **Inspired by** classic Numberlink puzzles (a Nikoli original) and the
> excellent UX of puzzle apps like [gridgames.app](https://gridgames.app/arukone/).
> All code in this repository is original; gameplay was reimplemented from
> the published rules.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · Bun

No SSR, no shadcn, no Next.js — a single static bundle deployed to a CDN.

## Play

A live demo is hosted on Cloudflare Workers. The exact URL is intentionally
not committed to this public repository; see your own deployment after
following [`docs/DEPLOY.md`](./docs/DEPLOY.md).

## Development

Requires [Bun](https://bun.sh/) and (optionally) [mise](https://mise.jdx.dev/).

```bash
bun install
mise run dev          # http://localhost:5173
mise run check        # lint + typecheck
mise run test         # 100+ Vitest unit/integration tests
mise run build        # production build → dist/
```

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full developer workflow.

## Deploy

This project deploys to Cloudflare Workers with Static Assets (the successor
to Cloudflare Pages). Two environments:

- **Preview** — every push to `main` deploys to a `*.workers.dev` URL.
- **Production** — every annotated tag `vX.Y.Z` deploys to a custom domain
  after manual approval.

Full walkthrough: [`docs/DEPLOY.md`](./docs/DEPLOY.md).
Secrets handling: [`docs/SECRETS.md`](./docs/SECRETS.md).

## Self-host

Want to run it yourself without ads or third-party hosting? A first-class
Docker / reverse-proxy path is on the roadmap (see issues). For now, any
static-file host that serves `dist/` with SPA fallback works.

## License

Dual-licensed:

- The application (root and everything except `generator/`) is **MIT**.
- The offline puzzle generator under `generator/` is **AGPL-3.0** (it is a
  derivative of [thomasahle/numberlink](https://github.com/thomasahle/numberlink)
  by Thomas Ahle).

The deployed runtime contains zero AGPL code. See [`LICENSING.md`](./LICENSING.md)
for the full explanation and [`THIRD_PARTY_LICENSES.md`](./THIRD_PARTY_LICENSES.md)
for runtime dependency licenses.

## Security

See [`SECURITY.md`](./SECURITY.md) for vulnerability reporting.
