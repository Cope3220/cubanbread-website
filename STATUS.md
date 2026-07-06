# STATUS — cubanbread-website

Snapshot of where the public website repo stands. Update at the end of every working session.

## Last commit

`2cc3717` — Update site. (This file created 2026-07-05 during the handoff-hardening audit; the audit commit lands immediately after.)

## Production status

**Live** at https://cubanbread.com — static site served by GitHub Pages from the `main` branch root (`CNAME` = cubanbread.com). Pushing to `main` deploys immediately; there is no staging. No VPS runtime and no cron entries (checked against `lasegunda-devops-infra/crontab.txt`, 2026-07-05).

Remote is `git@github.com:Cope3220/cubanbread-website.git` — Copeland's personal account, **not** the LaSegundaBakery org. Flagged 2026-07-05 as an org-migration candidate (report-only; remote unchanged).

## In flight

Nothing in flight. Handoff-hardening audit applied 2026-07-05 (see Recent changes).

## Parked

- **Spanish lead form SalesPower integration.** `es/contact.html` still submits via a `mailto:` fallback; the English `contact.html` already POSTs to the SalesPower intake endpoint (`/api/website-lead`). Blocked on confirming SalesPower hosting + schema for the Spanish form with Giuseppe (SalesPower owner). See "Parked ideas" below.
- **Partial crawlable Spanish coverage.** Only `es/contact.html` and `es/distribution.html` exist as real `/es/` pages; other pages rely on the client-side `assets/i18n.js` toggle only.
- **`sitemap.xml` lastmod dates** are mostly 2026-05-20; refresh when pages next change materially.

## Parked ideas (from code comments, 2026-07)

- `es/contact.html:574` — TODO: SalesPower integration — write CSV row to OneDrive/SalesPower/website-leads/inbox.csv (header comment of the lead-form script; page currently uses the mailto placeholder behavior).
- `es/contact.html:602` — TODO (same integration): once SalesPower hosting + schema is confirmed, POST to the integration endpoint instead of (or in addition to) the mailto fallback.

Note: the English `contact.html` version of this TODO was already resolved — it POSTs to the SalesPower endpoint with reCAPTCHA gating.

## Recent changes

- **2026-07-05** — Handoff-hardening audit (`handoff-hardening-2026-07` phase): added `CLAUDE.md`, this `STATUS.md`, standard `.gitignore`, and tracked `.claude/skills/` + `.claude/agents/` (`.gitkeep`). Tracked-file secret check clean; full-history secret scan clean (grep hits were base64 embedded-font false positives inside deleted `_archive/`/`_source/` HTML from commit `7436994`, removed in `478acc5`). No site content touched.
- **2026-05/06** — Site rebuilt and deployed: new site pushed, `CNAME` created, files moved to repo root, www/apex URLs fixed sitewide, dev scaffolding (`_archive/`, `_source/`) removed.

## Policy

- `main` is production — every push deploys via GitHub Pages.
- Never commit secrets. The reCAPTCHA key in `contact.html` is the public site key (public by design); its secret pair lives only in the SalesPower server environment.
- Business copy, prices, and contact addresses change only with Copeland or Giuseppe approval.
