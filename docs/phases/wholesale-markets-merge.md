# Phase: merge feat/wholesale-markets to main (go live on cubanbread.com)

Status: BUILD. Written by Cowork 2026-11-13. Authorized by Copeland in Cowork 2026-11-13 ("go" on merging feat/wholesale-markets). This is a customer-facing change; that authorization covers the merge and push below and nothing else.

## Why
Part B of the wholesale Google Ads build (`lasegunda-salespower/docs/phases/google-ads-wholesale.md`, Part B) is pushed on `feat/wholesale-markets` but not on `main`. GitHub Pages serves `main`, so the five market pages are not live. SalesPower Part A (accepts `market`, `distributor_named`, `business_type`) is already deployed, and its ads env vars were set 2026-11-13.

## TRAPS
1. A push to `main` IS the deploy (GitHub Pages). Do every check before the merge; never push to fix-forward on main without re-running them.
2. `CNAME` must still contain `cubanbread.com` after the merge. If it is missing or changed, stop.
3. No test lead POST against production SalesPower. A real submit creates a production lead and sends internal notification email. Verify the form with the local test only (Part B4).
4. `assets/markets.json` must hold DC names and item codes only: no dollar amounts, no customer numbers, no invoice data. Grep it before merging.
5. Copy rule (B5): no prices, no delivery times, no claim not in markets.json or already on the site. Read each of the five pages' visible text before merging.
6. Do not touch any branch other than `feat/wholesale-markets` and `main`. Do not delete the feature branch.
7. Line-ending noise (CRLF/LF) is not a change; ignore it in the diff review.

## Steps
1. `git fetch origin`; confirm local `feat/wholesale-markets` equals `origin/feat/wholesale-markets` and `main` equals `origin/main`. If main has commits not in the branch, merge main into the branch first and re-run step 2.
2. Read `git diff main...feat/wholesale-markets --stat` and the full diff. Confirm against Part B:
   - B1: `assets/lead-form.js` exists; `contact.html` and `es/contact.html` both use it; fields `market` (hidden), `distributor_named` (select), `business_type` sent; POST target is still SalesPower `/api/website-lead`.
   - B2: `scripts/build-markets.py` and `assets/markets.json` present; TRAP 4 grep clean.
   - B3: `wholesale/atlanta.html`, `carolinas.html`, `houston.html`, `knoxville.html`, `seattle.html` exist; linked from `distribution.html`; in `sitemap.xml`; not blocked in `robots.txt`.
   - B4: run the local attribution test (serve the site locally, open `/wholesale/atlanta.html?gclid=TEST123&utm_campaign=x`, intercept the submit; do not let it reach production) and confirm gclid and utm values are in the payload.
   - B5 / TRAP 5: read visible text of all five pages.
3. If every check passes: `git checkout main && git merge --no-ff feat/wholesale-markets -m "Merge feat/wholesale-markets: wholesale market pages"` then `git push origin main` once.
4. Wait for GitHub Pages to publish (poll up to 10 minutes), then verify live over HTTPS: each of the five `https://cubanbread.com/wholesale/<market>.html` returns 200 and contains its "Serving <market> restaurants through" line; `https://cubanbread.com/sitemap.xml` lists them; `https://cubanbread.com/contact.html` loads `assets/lead-form.js`; `https://cubanbread.com/CNAME` still resolves the site on the custom domain.
5. Update `STATUS.md` in this repo with a dated section "Wholesale market pages live (2026-11-13)": merge commit hash, what was verified live, what was not (no production form submit). Commit and push.
6. Append one line to `lasegunda-salespower/STATUS.md` under "Wholesale Google Ads, Part A": "Part B merged to cubanbread.com main @ <hash> and live 2026-11-13." Commit and push there.

## Decision rules
- Any check in step 2 fails: do not merge. Fix it on `feat/wholesale-markets` only if the fix is mechanical (missing sitemap entry, missing link from distribution.html, a dollar figure or unsupported claim to remove), push the branch, re-run step 2. Anything else (a page's DC list looks wrong, a market has fewer than 2 DCs, form POSTs elsewhere): stop and report to Copeland in one line per issue.
- Pages publish fails or a live check fails after the push: report exactly what failed with the URL and status. Do not revert without Copeland's yes unless the home page or contact page is broken, in which case revert the merge commit, push, and report.

## DONE
- Merge commit on `main`, pushed once (hash reported).
- All step-4 live checks pass and are listed with URL + status.
- STATUS.md updated in this repo and in `lasegunda-salespower`, each committed and pushed with hashes reported. State "merged and live" only if step 4 passed.
