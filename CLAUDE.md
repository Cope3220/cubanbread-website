# CLAUDE.md — cubanbread-website
_Last updated 2026-07-05 (handoff-hardening audit; file created in that audit)_

Operating rules for any Claude (Code, Desktop, web) working on this repo. Read `STATUS.md` before any substantive action.

## Project Overview
- Public marketing website for La Segunda Bakery — **https://cubanbread.com**. Static HTML/CSS/JS, wholesale-focused: products, distribution, contact/lead capture, family story, blog.
- **This is NOT an agent repo.** No Python, no cron, no VPS runtime. Verified 2026-07-05: `lasegunda-devops-infra/crontab.txt` contains no entries for this repo (only `@cubanbread.com` email recipients for other agents).
- **Hosting:** GitHub Pages, served from the `main` branch root. The `CNAME` file pins the custom domain `cubanbread.com` — do not delete or edit it. **Pushing to `main` IS deploying to production.**
- **Remote:** `git@github.com:Cope3220/cubanbread-website.git` — Copeland's personal GitHub account, **not** the LaSegundaBakery org. Recorded 2026-07-05 as an org-migration candidate; do not change the remote without Copeland.

## Site structure
| Path | What it is |
|---|---|
| `index.html`, `our-story.html`, `products.html`, `distribution.html`, `contact.html` | Main English pages |
| `es/contact.html`, `es/distribution.html` | Crawlable Spanish pages (partial coverage — only these two) |
| `blog/` | Blog index + 3 articles |
| `assets/` | CSS, JS, images; `assets/specs/` holds wholesale product spec-sheet PDFs |
| `assets/site.js` | Shared behaviors (mobile nav drawer etc.) |
| `assets/i18n.js` | Client-side EN/ES toggle (localStorage-persisted; does not replace the crawlable `/es/` pages or hreflang) |
| `robots.txt` / `sitemap.xml` | robots disallows internal working files; keep both in sync when adding/removing pages |
| `CNAME` | GitHub Pages custom-domain binding (`cubanbread.com`) — do not touch |
| `google23a5d19c68122370.html` | Google Search Console site-verification file — do not delete |

## Lead form (contact pages)
- `contact.html` validates + POSTs lead JSON to the SalesPower public intake endpoint `https://salespower-production.up.railway.app/api/website-lead` (owner: Giuseppe Bua / SalesPower) — reCAPTCHA v2-gated, no auth. The field mapping is documented in the comment block above `LEAD_ENDPOINT` inside `contact.html`.
- The reCAPTCHA `data-sitekey` embedded in `contact.html` is the **public** site key (public by design, registered for cubanbread.com). The paired **secret** key lives only in the SalesPower server environment — it must never appear in this repo.
- `es/contact.html` still uses the older `mailto:Giuseppe@cubanbread.com` fallback; SalesPower integration for the Spanish form is parked pending schema confirmation (see `STATUS.md` and the TODO comments in that file).

## Rules
1. Never commit secrets, credentials, API keys, tokens, or connection strings. This site needs none — if a change seems to require one, stop and ask Copeland.
2. Do not change business copy, product claims, prices, or contact addresses without Copeland/Giuseppe approval.
3. `main` is production. There is no staging branch or build step — test locally in a browser before pushing.
4. Keep `sitemap.xml`, `robots.txt`, and hreflang alternate links consistent whenever pages are added, removed, or renamed.
5. Keep the site dependency-free static HTML/CSS/JS — no frameworks, no build tooling.

## Recovery / operations
Not a production agent repo — no recovery runbook required. If the site is down: check GitHub Pages status/settings for `Cope3220/cubanbread-website` and DNS for `cubanbread.com`. Rollback = `git revert` the bad commit and push (GitHub Pages redeploys automatically).

**Business owner:** Copeland (copeland@cubanbread.com). Wholesale/lead contact: Giuseppe Bua (giuseppe@cubanbread.com).
