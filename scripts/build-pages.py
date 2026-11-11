#!/usr/bin/env python3
"""Generate wholesale/<market>.html from assets/markets.json.

The head, nav, footer, form markup and form CSS are copied from contact.html
at build time, so the market pages stay in step with the live site design.
Facts on these pages come only from markets.json (DC names, item codes) and
text already on the site. No prices, no delivery claims.

Run (after scripts/build-markets.py):  python scripts/build-pages.py
"""
import html
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SITE = 'https://cubanbread.com'
PHONE_TEL, PHONE_TXT = '+18138106920', '813-810-6920'

PRODUCT_LABELS = {
    '18_cuban': ('Cuban Bread, 18"', 'Pan Cubano, 18"'),
    '36_cuban': ('Cuban Bread, 36"', 'Pan Cubano, 36"'),
    '18_honey_wheat': ('Honey Wheat, 18"', 'Trigo con Miel, 18"'),
    '8_media_noche': ('Media Noche, 8"', 'Media Noche, 8"'),
    '4_coca_buns': ('Coca Buns, 4"', 'Panecillos Coca, 4"'),
    '8_hoagie_rolls': ('Hoagie Rolls, 8"', 'Panecillos Hoagie, 8"'),
}


def esc(s):
    return html.escape(s, quote=True)


def attr_es(s):
    """data-es value (double-quoted attribute)."""
    return html.escape(s, quote=True)


def join_and(items, word='and'):
    items = list(items)
    if len(items) <= 1:
        return ''.join(items)
    return ', '.join(items[:-1]) + f' {word} ' + items[-1]


def prefix_links(frag):
    return re.sub(r'(href|src)="(?!https?:|#|mailto:|tel:|\.\./|/)([^"]+)"', r'\1="../\2"', frag)


def between(s, start, end, include_end=True):
    i = s.index(start)
    j = s.index(end, i)
    return s[i:j + (len(end) if include_end else 0)]


def main():
    contact = open(os.path.join(ROOT, 'contact.html'), encoding='utf-8').read().replace('\r\n', '\n')
    data = json.load(open(os.path.join(ROOT, 'assets', 'markets.json'), encoding='utf-8'))

    head_links = prefix_links(between(contact, '<link rel="preconnect" href="https://fonts.googleapis.com">',
                                      '<script src="assets/i18n.js"></script>'))
    nav = prefix_links(between(contact, '<nav class="nav">', '</nav>\n'))
    foot = prefix_links(between(contact, '<footer class="foot">', '</footer>'))
    form_css = between(contact, '/* page header (no hero photo) */', '/* giuseppe contact card */', include_end=False)
    form_css = form_css.replace('/* two-column form + giuseppe card */', '/* form wrapper */')
    form_html = between(contact, '<form id="leadForm"', '</form>')
    success_html = between(contact, '<div id="leadSuccess"', '</div>\n  </div>', include_end=False) + '</div>'

    markets = data['markets']
    for m in markets:
        if not m['dcs']:
            print('SKIP (no DC meets the rule):', m['name'])
            continue
        build(m, markets, head_links, nav, foot, form_css, form_html, success_html)


def build(m, markets, head_links, nav, foot, form_css, form_html, success_html):
    name, slug = m['name'], m['slug']
    dcs = m['dcs']
    dc_names = [d['name'] for d in dcs]
    dc_list = join_and(dc_names)
    dc_list_es = join_and(dc_names, 'y')
    url = f'{SITE}/wholesale/{slug}.html'

    title = f'Cuban Bread for {name} Restaurants | La Segunda Wholesale'
    desc = (f'Serving {name} restaurants through {dc_list}. Order La Segunda Cuban bread through your '
            f'distributor rep. Baked in Ybor City since 1915.')

    # --- form: market, distributor list, heading
    f = form_html
    f = f.replace('<input type="hidden" name="market" value=""/>',
                  f'<input type="hidden" name="market" value="{esc(name)}"/>')
    opts = ['          <option value="">— Optional —</option>']
    opts += [f'          <option value="{esc(n)}">{esc(n)}</option>' for n in dc_names]
    opts += ['          <option value="Another distributor">Another distributor</option>',
             '          <option value="Not sure / want to buy direct">Not sure / want to buy direct</option>']
    f, n = re.subn(r'(<select id="lf-distributor" name="distributor_named">)(.*?)(</select>)',
                   lambda mo: mo.group(1) + '\n' + '\n'.join(opts) + '\n        ' + mo.group(3), f, flags=re.S)
    assert n == 1
    f = f.replace('data-es="¿A qué distribuidor le compra?">Which distributor do you buy from?',
                  f'data-es="¿Con qué distribuidor de {esc(name)} compra?">Which distributor do you buy from?')

    # --- DC cards
    cards = []
    for d in dcs:
        codes = d.get('item_codes') or {}
        if codes:
            rows = ''.join(
                f'<li><span>{esc(PRODUCT_LABELS[k][0])}</span><b>{esc(v)}</b></li>'
                for k, v in codes.items() if k in PRODUCT_LABELS)
            body = f'<ul class="mk-codes">{rows}</ul>'
        else:
            body = (f'<p class="mk-ask" data-es="Pídale a su representante de {esc(d["name"])} el pan cubano de La Segunda.">'
                    f'Ask your {esc(d["name"])} rep for La Segunda Cuban bread.</p>')
        cards.append(
            '<article class="mk-card">'
            f'<h3 class="mk-card-name">{esc(d["name"])}</h3>'
            f'<p class="mk-card-cta" data-es="Pida a través de su representante de {esc(d["name"])}">'
            f'Order through your {esc(d["name"])} rep</p>{body}</article>')

    products = ''
    if m.get('products'):
        lis = ''.join(
            f'<li><a href="../products.html#{esc(p["anchor"])}">{esc(p["name"])}</a></li>' for p in m['products'])
        products = ('<section class="mk-products" data-screen-label="03 Products">'
                    '<h2 data-es="Productos disponibles <em>en su mercado</em>">Products available <em>in your market</em></h2>'
                    f'<ul>{lis}</ul></section>')

    page = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}"/>
<link rel="canonical" href="{url}"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="{esc(title)}"/>
<meta property="og:description" content="{esc(desc)}"/>
<meta property="og:url" content="{url}"/>
<meta property="og:site_name" content="La Segunda Central Bakery"/>
<meta property="og:image" content="{SITE}/assets/og-image.jpg"/>
<meta property="og:locale" content="en_US"/>
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large"/>

{head_links}
<script src="../assets/i18n.js"></script>

<!-- Google reCAPTCHA v2 -->
<script src="https://www.google.com/recaptcha/api.js" async defer></script>

<style>
/* ============================================================
   MARKET PAGE STYLES (generated by scripts/build-pages.py)
   Form styles are copied from contact.html at build time.
============================================================ */
{form_css}
.contact-grid{{padding:96px 56px;border-bottom:1px solid var(--rule);display:block}}
.contact-grid .form-wrap{{max-width:760px}}
.mk-actions{{display:flex;gap:14px;flex-wrap:wrap;margin-top:28px}}
.mk-call{{display:inline-flex;align-items:center;gap:10px;padding:16px 22px;background:var(--red);color:var(--cream);
  font-family:var(--mono);font-size:11px;letter-spacing:0.24em;text-transform:uppercase;text-decoration:none}}
.mk-call:hover{{background:var(--red-ink)}}
.mk-ghost{{background:transparent;border:1px solid var(--rule-strong)}}
.mk-dcs{{padding:96px 56px;border-bottom:1px solid var(--rule);background:var(--ink-2)}}
.mk-dcs h2,.mk-products h2{{font-family:var(--display);font-weight:400;font-size:clamp(34px,4vw,52px);line-height:1.05;
  letter-spacing:-0.02em;color:var(--cream);margin:0 0 36px}}
.mk-dcs h2 em,.mk-products h2 em{{font-style:italic;color:var(--red)}}
.mk-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1px;background:var(--rule-strong)}}
.mk-card{{background:var(--ink);padding:28px 26px;display:flex;flex-direction:column;gap:12px}}
.mk-card-name{{font-family:var(--display);font-weight:500;font-size:26px;color:var(--cream);margin:0;letter-spacing:-0.01em}}
.mk-card-cta{{font-family:var(--mono);font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:var(--red);margin:0}}
.mk-ask{{font-size:14px;line-height:1.5;color:var(--cream-dim);margin:0}}
.mk-codes{{list-style:none;padding:0;margin:0;display:grid;gap:6px}}
.mk-codes li{{display:flex;justify-content:space-between;gap:12px;font-size:13px;color:var(--cream-dim);
  border-bottom:1px solid var(--rule);padding-bottom:6px}}
.mk-codes b{{font-family:var(--mono);font-weight:500;color:var(--cream)}}
.mk-products{{padding:96px 56px;border-bottom:1px solid var(--rule)}}
.mk-products ul{{list-style:none;padding:0;margin:0;display:flex;gap:12px;flex-wrap:wrap}}
.mk-products a{{display:inline-block;padding:12px 18px;border:1px solid var(--rule-strong);color:var(--cream);text-decoration:none;font-size:14px}}
.mk-products a:hover{{border-color:var(--red)}}
@media (max-width:980px){{
  .page-head{{padding:130px 32px 60px}}
  .contact-grid,.mk-dcs,.mk-products{{padding:64px 24px}}
  .lead-form{{padding:32px 24px}}
  .lf-row{{grid-template-columns:1fr}}
  .lf-multi{{grid-template-columns:1fr}}
}}
</style>
<link rel="icon" type="image/png" href="../assets/favicon.png">
<link rel="apple-touch-icon" href="../assets/favicon.png">
</head>
<body>

<a class="skip-link" href="#main">Skip to content</a>

{nav}

<header class="page-head" id="main" data-screen-label="01 Page Header">
  <nav class="crumbs" aria-label="Breadcrumb">
    <a href="../index.html" data-es="Inicio">Home</a><span>/</span><a href="../distribution.html" data-es="Distribución">Distribution</a><span>/</span><span>{esc(name)}</span>
  </nav>
  <p class="page-eyebrow" data-es="Mayorista · {esc(name)}">Wholesale · {esc(name)}</p>
  <h1 class="page-h1" data-es="Pan Cubano para<br><em>restaurantes de {esc(name)}</em>">Cuban Bread for<br><em>{esc(name)} restaurants</em></h1>
  <p class="page-intro" data-es="Atendemos restaurantes de {esc(name)} a través de {esc(dc_list_es)}.">Serving {esc(name)} restaurants through {esc(dc_list)}.</p>
  <div class="mk-actions">
    <a class="mk-call" href="tel:{PHONE_TEL}" data-es="Llame a Giuseppe · {PHONE_TXT}">Call Giuseppe · {PHONE_TXT}</a>
    <a class="mk-call mk-ghost" href="#request" data-es="Solicitar precio mayorista">Request wholesale pricing</a>
  </div>
</header>

<section class="mk-dcs" data-screen-label="02 Distributors" id="distributors">
  <h2 data-es="Pídalo a través de <em>su distribuidor</em>">Order through <em>your distributor</em></h2>
  <div class="mk-grid">
    {''.join(cards)}
  </div>
</section>

{products}

<section class="contact-grid" data-screen-label="04 Request" id="request">
  <div class="form-wrap">
    {f}

    {success_html}
  </div>
</section>

{foot}

<script src="../assets/lead-form.js?v=1"></script>
<script src="../assets/site.js?v=5"></script>
</body>
</html>
'''
    out = os.path.join(ROOT, 'wholesale', f'{slug}.html')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(page)
    print('wrote', os.path.relpath(out, ROOT))


if __name__ == '__main__':
    main()
