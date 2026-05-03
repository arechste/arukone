# Security Policy

## Reporting a vulnerability

If you believe you have found a security vulnerability, please report it
**privately** rather than through public issues.

Use GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
on this repository (Security tab → Report a vulnerability), or email the
maintainer (address available on the maintainer's GitHub profile).

Please include:

- A description of the issue and its impact
- Steps to reproduce, or a proof-of-concept
- Any relevant version, browser, or environment information

I aim to acknowledge reports within 5 business days and to triage within 14
days. Coordinated disclosure is appreciated.

## Supported versions

Only the latest released version is supported. Pre-release versions
(`0.x.y`) receive security fixes on a best-effort basis until `1.0.0`.

| Version | Supported |
|---|---|
| `1.x.y` (when released) | yes |
| `0.x.y` (current) | best effort |
| older | no |

## Scope

In scope:

- The web application code under `src/`
- The deploy configuration (`wrangler.jsonc`, GitHub Actions workflows)
- The CI pipeline integrity (build artifact tampering, supply chain)

Out of scope:

- The `generator/` Python tools — offline-only, not exposed to end users
- Vulnerabilities in transitive dependencies that are not exploitable in
  this application (please still report them, but they may be downgraded)
- Issues requiring physical access to a device that already has the app
  installed

## Hardening already applied

- No external network requests from the runtime (fonts and assets are self-hosted)
- Strict Content-Security-Policy and security headers via Cloudflare
- Dependency audit (`bun audit --audit-level=high`) gates every CI run
- Static analysis: ESLint + `eslint-plugin-no-unsanitized`
- Secret scanning: gitleaks pre-commit hook and CI job
- Reproducible builds via lockfile-frozen installs
