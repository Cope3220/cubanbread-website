#!/usr/bin/env python3
"""Build assets/markets.json for the wholesale market pages.

Inputs:
  dc-activity.json          DC invoice activity from a read-only Business Central read.
                            NOT committed (repo is public and served by GitHub Pages).
                            Looked up at env DC_ACTIVITY, else ../cubanbread-build-data/.
  scripts/item-codes.json   item codes per DC from SalesPower `distributors`

Listing rule (Copeland, 2026-11-11): a DC appears only if BC shows at least 2
invoices in the last 12 months AND at least 1 in the last 180 days. An item
code appears only if it exists in item-codes.json. No dollar amounts, no
guessed codes.

Run:  python scripts/build-markets.py [--today YYYY-MM-DD]
"""
import argparse
import json
import os
from datetime import date, timedelta

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

MARKETS = [
    ('atlanta',   'Atlanta',   'Atlanta, GA',                      'Atlanta metro'),
    ('carolinas', 'Carolinas', 'Charlotte and Raleigh, NC/SC',      'Charlotte and Raleigh metros'),
    ('houston',   'Houston',   'Houston, TX',                      'Houston metro'),
    ('knoxville', 'Knoxville', 'Knoxville, TN',                    'Knoxville area'),
    ('seattle',   'Seattle',   'Seattle, WA',                      'Seattle metro'),
]

PRODUCTS = [  # code key -> (display name, products.html anchor)
    ('18_cuban', 'Cuban Bread, 18"', 'cuban-bread'),
    ('36_cuban', 'Cuban Bread, 36"', 'cuban-bread'),
    ('18_honey_wheat', 'Honey Wheat, 18"', 'honey-wheat'),
    ('8_media_noche', 'Media Noche, 8"', 'media-noche'),
    ('4_coca_buns', 'Coca Buns, 4"', 'coca-buns'),
    ('8_hoagie_rolls', 'Hoagie Rolls, 8"', 'hoagies'),
]
FAMILY_ORDER = {'PFS': 0, 'Sysco': 1, 'US Foods': 2, 'Cheney Brothers': 3}


def meets_rule(dc, today):
    last = date.fromisoformat(dc['last_invoice'])
    return dc.get('invoices_12mo_min', 0) >= 2 and (today - last) <= timedelta(days=180) and last <= today


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--today', default=date.today().isoformat())
    args = ap.parse_args()
    today = date.fromisoformat(args.today)

    act_path = os.environ.get('DC_ACTIVITY') or os.path.join(os.path.dirname(ROOT), 'cubanbread-build-data', 'dc-activity.json')
    act = json.load(open(act_path, encoding='utf-8'))
    codes_all = json.load(open(os.path.join(HERE, 'item-codes.json'), encoding='utf-8')).get('codes', {})

    out = {'as_of': act['as_of'], 'built': today.isoformat(), 'markets': []}
    dropped = []
    for slug, name, area, geo in MARKETS:
        dcs = []
        for dc in sorted((d for d in act['dcs'] if d['market'] == slug),
                         key=lambda d: (FAMILY_ORDER.get(d['family'], 9), d['city'])):
            display = f"{dc['family']} {dc['city']}"
            if not meets_rule(dc, today):
                dropped.append(display)
                continue
            codes = {k: str(v).strip() for k, v in (codes_all.get(display) or {}).items()
                     if str(v).strip() and k in dict((p[0], 1) for p in PRODUCTS)}
            dcs.append({'name': display, 'family': dc['family'], 'city': dc['city'], 'item_codes': codes})
        products = []
        for key, pname, anchor in PRODUCTS:
            if any(key in d['item_codes'] for d in dcs):
                products.append({'key': key, 'name': pname, 'anchor': anchor})
        out['markets'].append({'slug': slug, 'name': name, 'area': area, 'dcs': dcs, 'products': products})

    path = os.path.join(ROOT, 'assets', 'markets.json')
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(out, f, indent=2, ensure_ascii=False)
        f.write('\n')
    for m in out['markets']:
        print(f"{m['name']}: {len(m['dcs'])} DC(s): " + ', '.join(d['name'] for d in m['dcs']))
    if dropped:
        print('DROPPED by listing rule:', ', '.join(dropped))
    missing = [d['name'] for m in out['markets'] for d in m['dcs'] if not d['item_codes']]
    if missing:
        print('NO ITEM CODES (page says "Ask your <DC> rep"):', ', '.join(missing))


if __name__ == '__main__':
    main()
