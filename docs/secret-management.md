# Secrets

How this project handles deployment secrets without committing them.

## Principle

No secret value — encrypted or otherwise — lives in this repository. Only
templates and references are committed. Real values come from one of three
sources, listed in order of recommendation.

## Option 1 — 1Password (recommended for the maintainer)

The maintainer uses [1Password CLI](https://developer.1password.com/docs/cli/).

```bash
# One-time: sign in to the relevant 1P account
op signin

# Run any deploy command with secrets injected from 1P references
op run --account arcavault --env-file=.env.op -- wrangler deploy --env preview

# Or via the wrapper:
mise run deploy:preview
```

`.env.op` is committed. It contains `op://...` references, not values.
1P resolves them at execution and injects them as environment variables for
the child process only — they never touch disk.

To use a different 1P account or vault, copy `.env.op` to `.env.op.local`
(gitignored) and edit the references.

## Option 2 — Manual `.env` file

For contributors without 1Password.

```bash
cp .env.example .env
# edit .env, paste values from the Cloudflare dashboard
mise run deploy:preview     # mise tasks load .env automatically
```

`.env` is gitignored. Do not commit.

## Option 3 — Bring your own secret manager

Any tool that produces a `.env`-format file works:

- [sops](https://github.com/getsops/sops) + age:
  `sops -d secrets/cloudflare.enc.env > .env`
- [doppler](https://www.doppler.com): `doppler run -- wrangler deploy ...`
- [HashiCorp Vault](https://www.vaultproject.io): `vault kv get -format=...`

The repository imposes no constraint beyond "produce valid `.env` content
at deploy time."

## CI / GitHub Actions

CI does **not** use 1Password or any of the above. It uses GitHub Actions
secrets, scoped per environment:

| Environment | Secrets |
|---|---|
| `preview` | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` |
| `production` | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` |

Set with:
```bash
gh secret set CLOUDFLARE_API_TOKEN --env preview
gh secret set CLOUDFLARE_ACCOUNT_ID --env preview
gh secret set CLOUDFLARE_API_TOKEN --env production
gh secret set CLOUDFLARE_ACCOUNT_ID --env production
```

Use a **scoped Cloudflare API token** (not your global API key):

1. https://dash.cloudflare.com/profile/api-tokens → Create Token
2. Template: "Edit Cloudflare Workers"
3. Restrict Account Resources to your account only
4. Restrict Zone Resources to your zone only (if using a custom domain)
5. TTL: 1 year (calendar reminder to rotate)

## What goes where

| Type | Where | Committed? |
|---|---|---|
| Real CF API token | 1Password (or your manager) + GitHub Actions secrets | no |
| Real CF account ID | 1Password (or your manager) + GitHub Actions secrets | no |
| Worker name | `.env.example`, `.env.op`, `wrangler.jsonc` | yes (not secret) |
| `.env` (your local copy) | your machine only | **no — gitignored** |
| `.env.example` | template only, no values | yes |
| `.env.op` | 1Password references only, no values | yes |

## Defensive controls

- `.gitignore` excludes `.env`, `.env.local`, `secrets/`, `*.pem`, `*.key`, `id_*`
- `gitleaks` runs as a pre-commit hook and as a CI job
- A token format that ever appears in `git log` should be **rotated immediately**
  even if you believe the file was gitignored
