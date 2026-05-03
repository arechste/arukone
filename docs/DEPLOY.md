# Deployment

Arukone deploys to **Cloudflare Workers with Static Assets** — the successor
to the deprecated Cloudflare Pages product. The deployed artifact is the
contents of `dist/` served from Cloudflare's edge network with SPA-style
not-found handling.

This document uses `arukone.play.example.com` as a placeholder domain.
Substitute your own.

## Promotion model

```
PR opened ─────► dry-run validation (no credentials)
push to main ──► deploy to preview     (workers.dev URL)
tag v*.*.* ────► deploy to production  (custom domain, manual approval)
```

| Environment | Trigger | Hostname | Approval |
|---|---|---|---|
| Preview | every push to `main` | `arukone-preview.<acct>.workers.dev` | none |
| Production | annotated tag `vX.Y.Z` | `arukone.play.example.com` | required reviewer |

## Local validation

```bash
mise run deploy:dry          # validates wrangler.jsonc, no credentials
bunx wrangler dev            # full Workers runtime locally on :8787
mise run build               # produces dist/
```

## First-time setup (manual, one time)

### 1. Cloudflare scoped API token

1. Go to https://dash.cloudflare.com/profile/api-tokens → **Create Token**.
2. Template: **"Edit Cloudflare Workers"**.
3. Narrow scope:
   - **Account Resources**: restrict to your account
   - **Zone Resources**: restrict to your zone (if using custom domain)
   - **TTL**: 1 year
4. Copy the token (shown once). Store in your secret manager.
5. Copy your **Account ID** from the dashboard sidebar.

See [`secret-management.md`](./secret-management.md) for storage options.

### 2. GitHub repository secrets and environments

```bash
# Create the two GitHub environments (one-time)
gh api -X PUT repos/:owner/:repo/environments/preview
gh api -X PUT repos/:owner/:repo/environments/production -f \
  'reviewers[][type]=User' -f 'reviewers[][id]=<your-user-id>'

# Set secrets per environment
gh secret set CLOUDFLARE_API_TOKEN --env preview
gh secret set CLOUDFLARE_ACCOUNT_ID --env preview
gh secret set CLOUDFLARE_API_TOKEN --env production
gh secret set CLOUDFLARE_ACCOUNT_ID --env production
```

Configure the `production` environment's **deployment branches** rule via
the GitHub UI (Settings → Environments → production) to allow only tags
matching `v*`.

### 3. Custom domain (production only)

After the first successful production deploy:

1. Cloudflare dashboard → Workers & Pages → `arukone` → **Custom Domains**
2. Add `arukone.play.example.com`
3. CNAME record is added automatically if your zone is on Cloudflare
4. SSL is provisioned automatically (~2 minutes)

## Day-to-day

```bash
# Local deploy to preview (uses your 1P credentials):
mise run deploy:preview

# Local deploy to production (rare; usually do this via tag + CI):
mise run deploy:production
```

CI handles the normal flow:

- Open PR → CI runs dry-run; merge when green
- Merge to `main` → preview deploy fires automatically
- Cut a release tag → production deploy waits for your approval click

## Releases

The `/dc:ship` workflow handles version bumps, changelog, tag, and
GitHub Release. Or do it manually:

```bash
# Bump version, update CHANGELOG, commit
# Then:
git tag -a v0.2.0 -m "v0.2.0"
git push origin v0.2.0
# CI deploy-production job is created and waits for your approval in the
# Actions UI.
```

## Rollback

```bash
# List recent deployments
bunx wrangler deployments list --env production

# Roll back to a specific deployment ID
bunx wrangler rollback <deployment-id> --env production
```

Cloudflare retains the last 10 deployments per environment.

## Troubleshooting

- **`Authentication error`**: API token is wrong or has expired. Check the
  token in your secret manager.
- **`No account id specified`**: `CLOUDFLARE_ACCOUNT_ID` env var is missing.
- **Custom domain returns 404**: DNS not yet propagated, or the domain is
  not yet attached to the Worker. Wait 2–5 minutes after adding it.
- **CI deploy hangs in "Waiting for review"**: that's the `production`
  environment gate working correctly. Approve in the Actions UI.

## Related documents

- [`secret-management.md`](./secret-management.md) — secret storage and injection
- [`PLAN.md`](./PLAN.md) — original ship plan with phases
- [`../LICENSING.md`](../LICENSING.md) — what you're allowed to redistribute
