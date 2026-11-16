# Phase: publish item codes on the wholesale market pages

Status: BUILD. Written by Cowork 2026-11-15. Authorized by Copeland in Cowork 2026-11-15 (asked to fill the codes from Giuseppe's 2026-11-15 email). Covers rebuilding the market pages with `scripts/item-codes.json`, one push to main, and live checks. Nothing else.

## What changed (uncommitted, written by Cowork)
`scripts/item-codes.json` now holds the SalesPower codes Giuseppe sent 2026-11-15 for all 13 pilot DCs (18" Cuban, 8" Media Noche, 4" Coca Buns): PFS 886369 / 371225 / 361192; Sysco 8556607 / 0786234 / 1233471; US Foods 9375387 / 9714783 / 2585123; Cheney Brothers 302022 / 798849 / 312232. Codes are strings; keep Sysco's leading zero.

## TRAPS
1. Rebuild with `python scripts/build-markets.py --today 2026-11-11` (the activity data's as-of date). Running with today's date can change which DCs pass the 180-day rule. If the DC lists differ from the live pages (atlanta: PFS Atlanta, Sysco Atlanta, US Foods Atlanta; carolinas: Sysco Charlotte, US Foods Fort Mill, US Foods Raleigh, Cheney Brothers Statesville; houston: PFS Houston; knoxville: PFS Knoxville, Sysco Knoxville, US Foods Knoxville; seattle: Sysco Seattle, US Foods Seattle-North), stop and report.
2. `dc-activity.json` stays outside the repo (`C:\dev\cubanbread-build-data`). Never add it back.
3. Codes only: no prices, no delivery times. Grep the built pages and markets.json for `$` and for the word "price" in new text.
4. No production form submit.
5. A push to main is the deploy (GitHub Pages). Push once.

## Steps
1. `git pull` on main. Confirm the only working-tree changes are `scripts/item-codes.json` and this doc.
2. Run `build-markets.py --today 2026-11-11`, then `build-pages.py`. Read the diff: only item codes, the products block per market, and the "Ask your <DC> rep" lines for DCs that now have codes should change. No card should still say "Ask your <DC> rep".
3. Commit (item-codes.json, markets.json, the rebuilt pages, this doc) and push main once.
4. Live checks over HTTPS after Pages publishes (poll up to 10 min): each of the five pages returns 200; every DC card on all five pages shows its three codes (houston: 886369, 371225, 361192; carolinas includes 302022; Sysco cards show 0786234 with the leading zero); no card says "Ask your"; no `$` in page text.
5. STATUS.md: replace the "NOT BUILT: item codes" line with what was published and its source (SalesPower codes sent by Giuseppe 2026-11-15, national-account-wide). Commit and push.

## Decision rules
- Any check fails before the push: do not push; report in one line per issue.
- A live check fails after the push: report URL + status; revert only if the home or contact page is broken.

## DONE
Commit hash on main, live checks listed with URL + result, STATUS.md updated and pushed with hash. Say "live" only if step 4 passed.
