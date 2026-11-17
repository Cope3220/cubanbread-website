# Phase: capture the Google Ads `ad` URL parameter on cubanbread.com

Status: BUILD. Written by Cowork 2026-11-17. Authorized by Copeland in Cowork 2026-11-17 ("YEs" to adding `ad={creative}` to the wholesale ad tracking; "yes" to this phase doc). A push to `main` is the GitHub Pages deploy and is customer-facing: the merge to main needs Copeland's yes in the Code session.

## Why
The five wholesale campaigns now append `&ad={creative}` to every click. `assets/site.js` stores only gclid, utm_*, matchtype, network, gbraid, wbraid (read 2026-11-17), so the ad ID is dropped. Run after `lasegunda-salespower/docs/phases/ads-ad-id-capture.md` is deployed (safe either way; the old server ignores unknown keys).

## Change
1. `assets/site.js`: add `'ad'` to PARAMS. Keep first-touch, 90-day TTL, MAX_LEN and try/catch behaviour unchanged.
2. `assets/lead-form.js`: add `ad_id: attrGet('ad')` to the payload, and add it to the header comment's attribution list.
3. `index.html` (inline payload near `attrGet('utm_campaign')`): same `ad_id: attrGet('ad')`.
4. Grep the repo for `attrGet('matchtype')` and `'matchtype'`; add the same line wherever else a payload or PARAMS list is built (including `es/` pages).

## TRAPS
1. No test lead POST against production SalesPower. Verify locally only: serve the site, open `/wholesale/atlanta.html?gclid=TEST123&utm_campaign=x&ad=712345678901`, intercept the submit, confirm the payload has `ad_id: "712345678901"` and all old fields unchanged.
2. Existing visitors have an old `lsb_attr` record without `ad`; reading it must return '' for `ad`, not throw. Test that case.
3. `CNAME` must still contain `cubanbread.com` after the merge.
4. Push to main once. Do every check before the merge.

## Steps
1. Branch `feat/ad-id-capture`, implement, run the local tests (TRAPS 1 and 2), push the branch. Stop for Copeland's yes to merge.
2. On yes: merge to main, push once, wait for Pages (poll up to 10 min), confirm `https://cubanbread.com/assets/site.js` contains `'ad'` and `https://cubanbread.com/assets/lead-form.js` contains `ad_id`.
3. STATUS.md: dated section "Ad ID capture (site) 2026-11-17" with merge hash and what was verified live (no production submit). Commit and push. Append one line to `lasegunda-salespower/STATUS.md` under the server section: "Site half live @ <hash>." Commit and push there.

## DONE
Local payload tests pass, merged on Copeland's yes, live files verified, both STATUS.md files pushed.
