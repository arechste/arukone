# Operational Dashboards

Where to look when you want to know what's happening with the deployed
app — its CI, its traffic, its errors, its DDoS defense state.

This document uses generic Cloudflare paths (no account-specific IDs).
For your own deployment, log into your Cloudflare dashboard and navigate
to the Worker named `arukone` (production) or `arukone-preview` (preview).

## GitHub repository

| View | URL | What it tells you |
|---|---|---|
| Repo home | https://github.com/arechste/arukone | Latest commit, README, stats |
| Actions | https://github.com/arechste/arukone/actions | Every CI run — build, lint, test, audit, gitleaks, deploys. Filter by workflow or by `status:failure`. |
| Pending deployments | https://github.com/arechste/arukone/deployments | Approve a queued production deploy here (after `v*.*.*` tag push). |
| Issues | https://github.com/arechste/arukone/issues | Bug reports, feature requests, Renovate dashboard. |
| Insights → Traffic | https://github.com/arechste/arukone/graphs/traffic | Repo views/clones for last 14 days. |
| Insights → Pulse | https://github.com/arechste/arukone/pulse | Recent activity summary. |
| Security overview | https://github.com/arechste/arukone/security | Dependabot alerts, code scanning, secret scanning summary. |
| Dependabot alerts | https://github.com/arechste/arukone/security/dependabot | CVEs in dependencies. CI also blocks on high-sev via `bun audit`. |
| Code scanning | https://github.com/arechste/arukone/security/code-scanning | Output of any future CodeQL or similar scanners. |
| Secret scanning | https://github.com/arechste/arukone/security/secret-scanning | Tokens accidentally committed. Should always be empty (gitleaks pre-commit + CI catches first). |

### Useful CLI views

```bash
# Recent runs (any branch)
gh run list --repo arechste/arukone --limit 10

# Watch the latest run live
gh run watch --repo arechste/arukone

# Open the Actions page in browser
gh run list --repo arechste/arukone --limit 1 --json databaseId --jq .[0].databaseId | xargs -I{} gh run view {} --web --repo arechste/arukone

# Open pending production deploys (where you approve)
gh api repos/arechste/arukone/deployments --jq '.[] | select(.environment == "production") | {id, ref, created_at, statuses_url}'
```

## Cloudflare dashboard

All paths assume you're logged in at https://dash.cloudflare.com.

| View | Path | What it tells you |
|---|---|---|
| Workers list | Workers & Pages | All your Workers. `arukone` (prod) and `arukone-preview` are here. |
| Worker overview | Workers & Pages → `arukone` | Recent deployments, custom domains, settings. |
| Deployments | Workers & Pages → `arukone` → Deployments | Every successful deploy with timestamp, version ID, build size. Click any to roll back. |
| Workers metrics | Workers & Pages → `arukone` → Metrics | Requests/sec, errors, CPU time, p50/p99 latency. **Default view to bookmark.** |
| Real-user analytics | Workers & Pages → `arukone` → Real User Monitoring (if enabled) | Web-vitals from actual visitors. |
| Logs (live tail) | Workers & Pages → `arukone` → Logs (or `wrangler tail`) | Stream every request live. Useful for debugging a specific 4xx/5xx. |
| Custom Domains | Workers & Pages → `arukone` → Settings → Domains & Routes | Manage `arukone.play.8-p.ch`. |
| Account analytics | Account Home → Analytics | All requests across all CF products on your account. |
| Security events | Security → Events | DDoS mitigations, WAF hits, bot blocks. |
| Audit log | Manage Account → Audit Log | Every API/dashboard action on your account. |

### Useful CLI views

```bash
# Live request stream (needs your CF API token in env)
bunx wrangler tail --env production
bunx wrangler tail --env preview

# Recent deployments
bunx wrangler deployments list --env production
```

## Worker URLs (current state)

| Environment | URL |
|---|---|
| Preview (workers.dev) | `https://arukone-preview.<account>.workers.dev` |
| Production (workers.dev) | `https://arukone.<account>.workers.dev` |
| Production (custom domain) | `https://arukone.play.8-p.ch` (after attach) |

(Replace `<account>` with your default workers.dev subdomain — find it
under Workers & Pages → Overview.)

## DDoS, abuse, and rate limiting — what protects you

Cloudflare provides **always-on** protections at no cost on the free
tier. You don't have to enable them.

### What's automatic

- **L3/L4 DDoS protection** — volumetric attacks (SYN floods, UDP floods,
  reflection attacks) are absorbed and filtered at the edge before they
  ever touch your Worker. You will not see them; you will not be billed.
- **L7 HTTP DDoS heuristics** — anomalous request patterns are throttled
  automatically.
- **TLS termination at the edge** — your Worker only sees clean HTTPS.
- **Cache** — static assets (your JS, CSS, fonts, images) are served
  from the CF edge cache. Only the *first* request per edge POP per
  asset hits your Worker. A puzzle game getting "popular" sees almost
  zero increase in Worker invocations because the bundle is cached for
  a long time.

### What CAN happen on the free tier

| Scenario | What CF does | Will you be charged? |
|---|---|---|
| 100k+ Worker requests in a single day | Returns HTTP 1015 / 429 to the next request, until the daily counter resets at 00:00 UTC | **No** — free tier never bills, it just stops serving |
| Sustained L7 attack (slow, distributed, looks like real traffic) | Free tier has limited automatic mitigation. Your Worker may serve the requests until the daily limit | **No** |
| Targeted exploit attempt against a CVE you haven't patched | CF can't tell — your app would still be hit | n/a |
| Someone scraping the entire site repeatedly | Counts toward 100k/day; cached assets don't count | **No** |

**Bottom line for a personal puzzle game:** the realistic worst case is
"someone shares the link on Hacker News, you serve 100k visits, then the
URL returns 1015 until midnight UTC." No surprise bill. No data loss.
The site is back the next day. The Cloudflare dashboard logs the event.

### Optional hardening (free, on by request)

If you want extra paranoia, enable in dashboard:

1. **Bot Fight Mode** — Security → Bots → toggle on. Blocks known
   automated traffic (scrapers, low-quality bots). Free.
2. **Rate Limiting (free tier)** — Security → WAF → Rate limiting rules.
   E.g. "block any IP making more than 200 requests/min." Free tier
   allows 1 rule.
3. **Country-block** — Security → WAF → Custom rules → country in
   `(CN, RU, KP, ...)` → block. Free, 5 rules.
4. **Always Use HTTPS** — Should already be on for any zone on CF.
5. **Browser Integrity Check** — Security → Settings → on. Blocks
   requests with bad/missing User-Agent.

None of these are necessary for first launch. Worth revisiting if you
see weird traffic in metrics.

## Notifications — set these up before going live

Cloudflare can email you when things happen. Free tier includes most
notification types.

Path: **Account Home → Notifications → Add**

Recommended for an unattended app:

| Type | What it tells you |
|---|---|
| Workers — usage threshold | Hitting your free-tier daily request cap |
| HTTP DDoS Attack Alert | Active L7 attack mitigation |
| Origin Error Rate Alert | Sudden spike in 5xx responses |
| SSL — certificate validation | Renewal failed (rare; CF auto-renews) |
| Account-level audit log alert | Someone (you?) changed account settings |

Configure delivery to your primary email and (optionally) a webhook for
Slack/Discord/Telegram if you ever set up a notification channel.

## Quick triage: "the URL is broken"

Walk through these in order:

1. **Cloudflare Worker metrics** — is request count zero (DDoS limit hit)
   or full of 5xx (worker error)?
2. **`wrangler tail --env production`** — what error is logged?
3. **GitHub Actions latest run** — was there a recent deploy that
   broke something? Roll back via `wrangler rollback` if so.
4. **Status page** https://www.cloudflarestatus.com — is CF itself
   having an incident?
5. **DNS** — does `dig arukone.play.8-p.ch` return a CF IP?
   (`104.16.0.0/13`, `172.64.0.0/13`, etc.)
6. **Custom domain attached** — Workers & Pages → arukone → Custom
   Domains shows status `Active`?

## Performance baseline (what's "normal")

After first deploy, your metrics should look like:

| Metric | Expected on free tier |
|---|---|
| Requests/day | < 1k unless promoted |
| Cache hit ratio | > 95% (static assets) |
| Worker p50 latency | < 5ms (CDN-served, no CPU) |
| Worker p99 latency | < 20ms |
| 5xx rate | 0% |
| Build artifact size | ~115KB gzipped (current) |

Big deviations from these are signal — investigate.
