# cubanbread.com — Consolidated SEO Decisions

Brief for fresh implementation chat. Decisions only.
Audit cycle: Phases 1–7. Date of decisions: May 2, 2026.

---

## Site-wide framing (applies to every file below)

**Master framing — use verbatim or paraphrase consistently:**

> "Through our 46 distributor locations across the United States — including Sysco, US Foods, PFG, GFS, Ben E. Keith, Cheney Brothers, Shamrock Foods, and Northern Haserot — La Segunda product can reach buyers in 35+ states. Active in 18 today and expanding wherever the right operator asks."

**Numbers — pair both, never alone:**

- "35+ states" = lead reach number (user-facing copy).
- "Active in 18" = supporting honesty number (user-facing copy, must accompany 35+).
- "46 distributor locations" = third supporting number (already rendered in distributor cards).
- "11 distributors" = the verified count (Cheney Brothers and PFG kept separate despite 2024 acquisition).
- "20+ delivery zones" = Tampa Bay fresh-delivery count (separate from state count, unchanged).
- "270-day frozen shelf life" = unchanged.
- "20,000+ loaves/day" = production capacity, kept as-is.

**Schema `areaServed` — enumerate exactly these 20 confirmed states (English names, alphabetical or as-listed):**

Arkansas, Colorado, Florida, Georgia, Indiana, Maryland, Michigan, Mississippi, Missouri, Nevada, New York, North Carolina, Ohio, Pennsylvania, South Carolina, Tennessee, Texas, Virginia, Washington, West Virginia.

- **Drop Alabama** from any current schema (it was in earlier lists).
- **Add Michigan and West Virginia** (missing from earlier lists).

**Distributor naming — use these exact display names everywhere (visible copy, schema, FAQ, scrolling band, cards):**

| Display name (verbatim) | URL | Treatment |
|---|---|---|
| Sysco | https://www.sysco.com | Heavy hitter — prominent |
| US Foods | https://www.usfoods.com | Heavy hitter — prominent |
| GFS (Gordon Food Service) | https://www.gfs.com | Heavy hitter — prominent |
| PFG (Performance Food Group) | https://www.pfgc.com | Heavy hitter — prominent |
| Cheney Brothers | https://www.cheneybrothers.com | Heavy hitter — prominent |
| Ben E. Keith | https://www.benekeith.com | Heavy hitter — prominent |
| American Food Distributor | http://afdllc.com/ | Smaller — readable (HTTP, not HTTPS — link as-is) |
| BakeMark | https://www.bakemark.com | Smaller — readable |
| Shamrock Foods | https://www.shamrockfoodservice.com | Smaller — readable |
| Nu Vista Foods Group | https://www.nuvistafoods.com/ | Smaller — readable |
| Northern Haserot | https://www.northernhaserot.com | Smaller — readable |

- All 11 names render as outbound `<a>` links with `rel="noopener"`. **No `nofollow`.**
- All 11 use full names (not "American Foods", "Nu Vista", "GFS", "PFG", "Bakemark").
- **Reinhart is NOT in the approved 11** — remove anywhere it appears.
- Visit each URL once before publish to confirm it loads.

**Email casing — all visible instances site-wide:** lowercase `giuseppe@cubanbread.com` in body copy, footer, FAQ answers, contact cards, and schema `email` fields. `mailto:` href targets can stay mixed case (case-insensitive in practice).

**Distributor cards — semantic markup:** `<div class="dist-card">` → `<article class="dist-card">` everywhere they appear (EN distribution, ES distribution).

**Schema `alternateName` — both EN and ES Bakery schema:** `["La Segunda Wholesale", "La Segunda Mayorista"]` (array, not string).

**`scrollIntoView` — forbidden by environment.** Replace any `element.scrollIntoView(...)` with `window.scrollTo({top: element.offsetTop, behavior: 'smooth'})` wherever it appears (EN contact form, ES contact form).

**K-12 / institutional positioning:** GFS and US Foods named as the K-12 distributors. Reason for Honey Wheat callout: USDA Smart Snacks / NSLP whole-grain compliance (Honey Wheat at 51% whole wheat meets criteria).

**Press article URLs:** verified manually before publish (pending from user).

**Real product photography:** pending from Stephanie + scheduled shoot. Spec sheets already exist in `/assets/specs/`.

**OG image (Stephanie shot):** pending from user.

**Cuban 18" / Cuban 36" / Hoagie Rolls SKU codes:** pending from Giuseppe / D365.

---

## index.html

### Approved fixes
- Add `<meta name="description">` (currently missing).
- Apply master framing to body copy, hero copy, meta description, OG description, Twitter card.
- Remove `hreflang="es"` declaration from `<head>` (ES counterpart does not exist; ES paused this cycle).
- Buyer-list band must include Schools alongside Restaurants, Distributors, Hotels, Country Clubs, Caterers.
- Bakery schema `areaServed`: enumerate the 20 confirmed states. Drop Alabama. Add Michigan + West Virginia.
- Bakery schema `alternateName`: array form `["La Segunda Wholesale", "La Segunda Mayorista"]`.
- Bakery schema `email` field: lowercase.
- Footer email: lowercase.
- Visible Giuseppe@cubanbread.com instances: lowercase.
- Footer social icons (`IG`/`FB`/`LI` placeholders): remove entirely until real URLs supplied.
- Update internal references to "20+ states" / "nationwide" / "18 states" alone → master framing.
- All distributor name mentions (hero, schema description, anywhere): full company names.

### Rejected
- (None specific to this file beyond rejected items in site-wide framing.)

### Pending inputs (non-blocking)
- OG image (Stephanie). Can ship without — current OG image acceptable interim.
- Real product photography. Can ship without.
- Wholesale hours for `openingHoursSpecification`. Can ship without.
- Real social URLs. Footer social block stays removed until supplied.

### Site-wide framing affecting this file
- Master framing, numbers pairing, distributor naming, email lowercase, schema state list.

---

## our-story.html

### Approved fixes
- **Title tag rewrite**: replace generic title with keyword-forward, brand-anchored variant. Pattern: "Our Story | La Segunda — Tampa's Cuban Bread Bakery Since 1915". Keep under 60 characters where possible.
- **Meta description rewrite**: replace current description with one that surfaces founding year (1915), Ybor City origin, family ownership across four generations, and the wholesale positioning. ~155 characters.
- **OG description and Twitter card description**: align with new meta description.
- **Schema split**: separate the `Bakery` (LocalBusiness) schema from an `Organization` / `AboutPage` schema. AboutPage schema describes the page; Bakery schema describes the entity. Currently conflated.
- Add `AboutPage` schema with `mainEntity` referencing the Bakery.
- Add `foundingDate: "1915"` to Bakery schema.
- Add `founder` array to Bakery schema naming Juan Moré (founder) and current generation owners.
- **Generation naming corrections**: verify and correct generation labels and dates throughout body copy. Confirm fourth-generation framing matches Giuseppe's actual generational position (pending confirmation if unclear — flag during implementation).
- **Press section restructure**: pull the Columbia Restaurant testimonial out of the press grid into its own dedicated quote/testimonial block. It is a customer testimonial, not press coverage; mixing the two dilutes both signals.
- Reformat remaining press items as proper press card grid with publication name, headline, date, and outbound link to article.
- **H2/H3 hierarchy fixes**: audit all headings on the page. Current structure skips levels (H1 → H3 in places, multiple H2s with H3 children that should be H2s). Rebuild outline so every section starts at H2 with H3 sub-sections only where genuine subordination exists.
- Add `<time datetime="...">` wrappers around year references in body copy (1915, generation transition years, etc.) for semantic date markup.
- Add `<blockquote>` + `<cite>` semantic markup around the Columbia Restaurant testimonial in its new dedicated block.
- Press articles: add `rel="noopener"` to all outbound links.
- Verify `<picture>` / `<img>` alt text on Moré family / heritage photos describes the people and context, not "image of family".
- Apply master framing where any state count or reach claim appears in body copy or schema.
- Remove `hreflang="es"` declaration from `<head>` (ES counterpart does not exist).
- Bakery schema `areaServed`: 20 confirmed states. Drop Alabama. Add Michigan + WV.
- Bakery schema `alternateName`: array form `["La Segunda Wholesale", "La Segunda Mayorista"]`.
- Bakery schema `email` field: lowercase.
- Footer email: lowercase.
- Footer social icons: remove.
- All visible Giuseppe@cubanbread.com instances: lowercase.

### Rejected
- `<cite>` semantic nit on every italicized publication name in body copy. Reserved `<cite>` for the testimonial block only; using it on every italicized name is over-application of the tag.
- `aria-hidden="true"` on decorative quotation marks around the Columbia testimonial. Screen readers handle decorative quotes fine without explicit hiding; adds clutter without accessibility benefit.

### Pending inputs (non-blocking)
- OG image (Stephanie). Can ship without — current OG image acceptable interim.
- Real product photography. Can ship without.
- Confirmation of exact generation count and current owners' generational position (if Giuseppe is fourth or fifth generation). Flag during implementation if existing copy is ambiguous.

### Site-wide framing affecting this file
- Master framing, distributor naming where mentioned, email lowercase, schema state list.

---

## products.html

### Approved fixes
- **Numbering alignment across surfaces**: index strip, product card badges (the "01 / 02 / 03..." numbers), and `position` field in schema's `ItemList` must all use the same numbering. Currently inconsistent. Establish single canonical order: Cuban 18", Cuban 36", Hoagie Rolls, Honey Wheat (and any others present), then apply that order to all three surfaces.
- **Cuban 18" and Cuban 36" as two separate indexable products**: each gets its own `Product` schema entry, its own anchor (`#cuban-18`, `#cuban-36`), its own card, its own spec sheet link. Do not merge into a single "Cuban Bread" listing.
- **Schema enrichment** for each Product entry — add the following fields where missing:
  - `brand: { "@type": "Brand", "name": "La Segunda" }`
  - `manufacturer` referencing the Bakery
  - `category` (e.g., "Wholesale bread / Cuban bread")
  - `additionalProperty` array for shelf life ("270 days frozen"), ingredients summary, packaging
  - `image` field with absolute URL to product photo (placeholder URL acceptable until real shoot lands)
  - `description` per product (not the same boilerplate across all)
  - `audience: { "@type": "BusinessAudience", "audienceType": "Wholesale buyers, foodservice operators, K-12 / institutional" }` (where applicable per product)
- **Anchor URLs in schema**: each Product `url` field must point to the in-page anchor (e.g., `https://www.cubanbread.com/products.html#cuban-18`), not the bare page URL.
- **National framing fixes**: any current copy that says "available nationwide" / "shipped everywhere" / "20+ states" alone → master framing pairing (35+ reachable / active in 18 / 46 distributor locations).
- **Meta description rewrite**: replace current description with product-line-focused variant naming the four headline products and the "wholesale / foodservice" buyer context. ~155 characters.
- OG description and Twitter card description: align with new meta description.
- **Product-specific CTA anchor text**: replace generic "Contact" / "Get a quote" CTAs on each product card with product-specific anchor text. Pattern: "Quote Cuban 18\"", "Quote Cuban 36\"", "Quote Hoagie Rolls", "Quote Honey Wheat". Each links to `contact.html` with a query parameter (e.g., `?product=cuban-18`) so the contact form can pre-fill product interest where supported (form pre-fill is best-effort, not blocking).
- **`<aside>` → `<div>`/`<dl>` semantic fix**: nutritional info / spec callouts currently wrapped in `<aside>` are not tangentially related content (the definition of `<aside>`); they are core product spec data. Convert to `<div class="product-specs">` containing a `<dl>` with `<dt>`/`<dd>` pairs for each spec line (weight, length, count per case, shelf life, ingredients).
- **Honey Wheat Option B handling**: include Honey Wheat as a full Product entry with its own card, anchor, schema. Pair with the **K-12 / institutional callout** referencing USDA Smart Snacks / NSLP whole-grain compliance (Honey Wheat at 51% whole wheat meets criteria). Name **GFS and US Foods** as the distributors that handle K-12 / school district accounts.
- Honey Wheat callout placement: directly adjacent to or beneath the Honey Wheat product card so the K-12 framing is visually paired.
- **Distributor list rendering**: any inline mention of distributor names in product copy or schema → use full names per master framing distributor table (no "GFS" alone, no "PFG" alone, no "Bakemark", etc.).
- Add `BreadcrumbList` schema if not present: Home → Products.
- Add `<picture>` / `<img>` alt text per product describing the actual product (e.g., "La Segunda Cuban Bread 18-inch loaf, golden crust, palm-leaf score") not generic "Product image". Apply to placeholder images now; real shoot will inherit alt text pattern.
- Apply master framing to any reach/state claims in body copy.
- Remove `hreflang="es"` declaration from `<head>` (ES counterpart does not exist).
- Bakery schema (if present on this page) `areaServed`: 20 confirmed states. Drop Alabama. Add Michigan + WV.
- Bakery schema `alternateName`: array form.
- Footer email: lowercase.
- Footer social icons: remove.
- All Giuseppe@cubanbread.com visible instances: lowercase.

### Rejected
- **H1 keyword-forward rewrite**. Keep current H1 — brand voice tradeoff favors the current treatment over a more SEO-optimized variant.
- **Deli varieties as individual `Product` schema entries**. Sub-varieties (e.g., specific deli flavor variants of Hoagie Rolls or sandwich-builds) are not standalone catalog SKUs and should not be schema'd as separate products. Keep the four headline products as the only Product entries.
- **H2 rewrite for hoagie section**. Current H2 wording stays as-is. Suggested keyword-stuffed alternative rejected on brand-voice grounds.
- **Per-product `AggregateRating` schema**. No verified review corpus exists; fabricating ratings risks Google manual action. Revisit if a real review collection program is stood up later.
- **Per-product `offers` schema with prices**. Wholesale pricing is quote-driven and not publishable. Omit `offers` rather than publish placeholder prices.
- **Splitting Hoagie Rolls into per-size Product entries**. Hoagie Rolls stays as one Product with size variants in `additionalProperty`.

### Pending inputs (non-blocking)
- Real product photography (Stephanie + scheduled shoot). Can ship with current placeholders.
- Cuban 18" / Cuban 36" / Hoagie Rolls SKU codes (Giuseppe / D365). Spec sheets present; SKU codes added when supplied.

### Site-wide framing affecting this file
- Master framing, K-12/institutional positioning, email lowercase.

---

## distribution.html

### Approved fixes (Phase 4)
- **H1**: "Baked in Ybor. Delivered Where You Are."
- **OG description**: revised — remove "Delivered everywhere" framing. Apply master framing.
- **Meta description**: tightened to ~155 chars with confirmed numbers (35+ reach, active in 18, 46 locations).
- Typo fix: "a week a week" duplicate.
- All 11 distributor names rendered as outbound `<a>` links with `rel="noopener"`. No `nofollow`. Heavy hitters visually prominent; other 5 smaller but readable.
- Schema enrichment: `provider` / `availableChannel` pattern referencing each distributor as `Schema.org/Organization`.
- Zone names rendered as visible HTML text on the page (sidebar or list near the map). Currently zones live only in JS — surface them in the DOM.
- H2 added above map section to fix heading hierarchy skip.
- Distributor cards: `<div>` → `<article>`.
- Distributor scrolling band: remove `aria-hidden="true"`.
- Hidden static SVG map: **delete** (preferred) OR wrap in `<noscript>` as a fallback. Implementer's call.
- Leaflet map container: add `aria-label`.
- Bakery schema `areaServed`: 20 confirmed states. Drop Alabama. Add Michigan + WV.
- Bakery schema `alternateName`: array form.
- **Schools/institutional callout** between distributor grid and Tampa block. Mention GFS + US Foods handle school district / institutional accounts. (No copy drafted — placement only.)
- Footer email: lowercase.
- All visible Giuseppe@cubanbread.com instances: lowercase.
- Footer social icons: remove.
- Apply master framing to all reach/state claims.
- Remove "20+ states" alone anywhere it appears — replace with master framing pairing.
- Tampa Bay zones: keep "20+" framing (separate count, unchanged).

### Rejected
- Explainer copy for non-trade visitors (#22). Audience already knows what a foodservice distributor is.
- PostalAddress microdata on every distributor city (#29). Diminishing returns.

### Pending inputs (non-blocking)
- Real social URLs. Footer social block stays removed until supplied.

### Site-wide framing affecting this file
- All framing items apply heavily here. This is the canonical distribution-narrative page.

---

## contact.html

### Approved fixes (Phase 5)
- Apply master framing to meta description, OG description, Twitter card description, body copy, FAQ answers, FAQPage schema.
- Bakery schema `areaServed`: 20 confirmed states. Drop Alabama. Add Michigan + WV.
- Bakery schema `alternateName`: array form.
- Bakery schema description: rewrite to invoke 35+ reachable / active in 18 / 46 locations framing.
- ContactPoint schema `email`: lowercase.
- **Remove "Reinhart"** from FAQPage schema (Q4 and Q6) and visible FAQ answers (Q4 and Q6). Reinhart is not in approved 11.
- FAQ Q4 + Q6 text + schema: rewrite distributor list using full company names per master framing. Update math: 11 − 6 named heavy hitters = 5 regional.
- All visible "20+ states" → master framing.
- Trust band heading: H3 → H2 (heading hierarchy fix).
- **Trust band heading copy**: "Trusted by independent restaurants and operators across 18 states." (replaces "hundreds of restaurants" claim).
- **Logo wall**: remove entirely.
- **K-12 / institutional buyer-segment dropdown** added to form. New "Business Type" select between Phone and City rows, full-width. Options: Restaurant, Sandwich Shop / Cafe, Hotel / Resort, Country Club, Caterer, Distributor, K-12 / Institutional, Other.
- Replace `scrollIntoView` call in submit handler with `window.scrollTo({top: leadSuccess.offsetTop, behavior: 'smooth'})`.
- All visible Giuseppe@cubanbread.com instances: lowercase (footer, Giuseppe card, FAQ Q1, FAQ Q7, contact card email line).
- ContactPoint schema email: lowercase.
- Footer social icons: remove.

### Rejected
- H1 keyword-forward rewrite. **Keep "Let's Talk Cuban Bread"** — brand voice.
- Logo wall replacement with text customer-name list. Removed entirely instead.
- "Hundreds of restaurants" claim. Softened to "independent restaurants and operators across 18 states" (above).
- Second ContactPoint schema entry for bakery main line. Wholesale-direct number is the conversion target; keep schema focused.
- Scope-creep nits: title length tweak (#16), `manufacturingCapacity` custom schema (#23) — not implementing.

### Pending inputs (non-blocking)
- reCAPTCHA production site key. **Publish-blocker for form** — replace `YOUR_RECAPTCHA_SITE_KEY_HERE`.
- Lead intake endpoint URL. **Publish-blocker for form** — replace `https://example.com/api/wholesale-leads`.
- Wholesale hours for `openingHoursSpecification`. Can ship without.
- Real social URLs. Footer social block stays removed until supplied.

### Site-wide framing affecting this file
- All framing items, K-12/institutional positioning, email lowercase, distributor naming, scrollIntoView replacement.

---

## /es/contact.html

### Approved fixes
- **Title**: change to "Pan Cubano al por Mayor | La Segunda — Tampa, FL" (replaces "Pedidos Mayoristas | Pan Cubano La Segunda").
- Apply master framing in Spanish: "35+ estados / activo en 18 / 46 ubicaciones". Use "20 mil+" for thousands (Spanish locale convention).
- Bakery schema `areaServed`: 20 confirmed states (English names — canonical). Drop Alabama. Add Michigan + WV.
- Bakery schema `alternateName`: `["La Segunda Wholesale", "La Segunda Mayorista"]`.
- Bakery schema description: rewrite in Spanish to invoke 35+ alcanzables / activo en 18 / 46 ubicaciones.
- ContactPoint schema `email`: lowercase.
- **Remove "Reinhart"** from FAQ Q6 (schema and visible). Rewrite distributor list using full names per master framing.
- All FAQ "más de 20 estados" → master framing (35+ alcanzables / activo en 18).
- Trust band heading: rewrite to match EN softening — "La elección de restaurantes independientes y operadores en 18 estados" (or close paraphrase). Heading hierarchy: H3 → H2.
- **Logo wall**: remove entirely.
- All visible Giuseppe@cubanbread.com instances: lowercase.
- ContactPoint schema email: lowercase.
- Footer social icons: remove.
- Replace `scrollIntoView` in form submit handler with `window.scrollTo`.
- **Nav and footer 404 fix**: links pointing to `our-story.html`, `products.html`, `index.html` (which 404 in /es/) → point to EN versions: `../our-story.html`, `../products.html`, `../index.html` with `hreflang="en"` and label suffix "(EN)" so users aren't surprised by language switch. Pattern: `<a href="../our-story.html" hreflang="en">Nuestra Historia (EN)</a>`.

### Rejected (deferred to dedicated translation phase)
- Form rebuild to match EN structure (JSON POST + reCAPTCHA + EN field set). ES form keeps current `mailto:` fallback. Leave it functional.
- Business-type dropdown split (separate K-12 vs Hospital). Keep current "Escuela / Hospital / Institucional" combined option this cycle.
- ES H1 keyword-forward rewrite. **Keep "Hablemos de Pan Cubano"** — brand voice (matches EN H1 call).
- Sysco division name translation. **Keep English** (brand terminology, not generic geography). Revert "Florida Central" / "Costa del Golfo" / "Costa Oeste" to "Central Florida" / "Gulf Coast" / "West Coast Florida".

### Pending inputs (non-blocking)
- None specific to ES contact.

### Site-wide framing affecting this file
- All framing items, distributor naming, email lowercase, scrollIntoView replacement.

---

## /es/distribution.html

### Approved fixes
- **H1**: "Horneado en Ybor. Al alcance de 35+ estados." (replaces "Horneado en Ybor. Entregado en todas partes." — matches EN's "Baked in Ybor. Delivered Where You Are.")
- Meta description: apply master framing in Spanish.
- OG description: rewrite with master framing — remove "Entregado en todas partes" and "más de 20 estados" alone.
- Page intro: keep "11 distribuidores" reference; pair with reach numbers per master framing.
- **Stat-stack**: reframe — recommended "35+ Estados Alcanzables", "Activo en 18 Hoy", "46 Ubicaciones de DC" (or similar arrangement of master framing numbers). Implementer's call on exact 4-stat layout.
- Number formatting: "20K Panes Diarios" → "20 mil+ Panes Diarios" (or "20.000+").
- Perk #4: "20 zonas de entrega" → "20+ zonas de entrega" (match EN).
- Schema `areaServed`: 20 confirmed states (English names). Drop Alabama. Add Michigan + WV.
- **Bring ES schema to parity with EN**: full Bakery schema with `description`, `geo`, `founder`, `foundingDate`, `image`, `priceRange`. Add ContactPoint schema. Add FAQPage schema if EN distribution.html has one (verify during implementation).
- Bakery schema `alternateName`: `["La Segunda Wholesale", "La Segunda Mayorista"]`.
- Distributor band: replace short-form names with full names — "American Foods" → "American Food Distributor", "Bakemark" → "BakeMark", "Nu Vista" → "Nu Vista Foods Group", "GFS" → "GFS (Gordon Food Service)", "PFG" → "PFG (Performance Food Group)".
- Distributor cards: `<div class="dist-card">` → `<article class="dist-card">`.
- All 11 distributor names: outbound `<a>` links with `rel="noopener"`. URLs per site-wide table. No `nofollow`.
- Distributor scrolling band: remove `aria-hidden="true"`.
- All visible Giuseppe@cubanbread.com instances: lowercase.
- Footer social icons: remove.
- **Map iframe URL fix**: `!1sen!2sus!` → `!1ses!2sus!` for Spanish map labels.
- Breadcrumb aria-label: "Breadcrumb" → "Migas de pan".
- **Nav and footer 404 fix**: same pattern as /es/contact.html. Links to non-existent ES pages → point to EN with `hreflang="en"` and "(EN)" suffix.
- Cosmetic: `data-screen-label` values to Spanish ("01 Encabezado", "02 Distribución Nacional", "03 Tampa Bay", "04 Mapa Tampa Bay", "05 EDI CTA").

### Rejected (deferred to translation phase)
- ES distribution H1 keyword-forward rewrite beyond the master-framing rewrite above.
- Business-type/segment additions on this page (form lives on contact, not distribution).
- Press section translation. ES press band stays absent until Spanish-language press coverage exists.

### Pending inputs (non-blocking)
- None specific to ES distribution.

### Site-wide framing affecting this file
- All framing items apply heavily. Mirror image of EN distribution.html with Spanish copy.

---

## robots.txt

### Approved fixes
- Keep current allow-all + Sitemap declaration as base.
- Add explicit `Disallow:` directives for any cruft files that remain at root after cleanup. If root cleanup is fully completed (SOURCE_*, v6, v7, BACKUP all moved/deleted), no `Disallow:` directives needed.
- Add `Disallow: /assets/reference-images/` only if that folder remains in `/assets/`. If moved out (preferred per Phase 7 decision), no directive needed.
- `/scratch/` and `/uploads/` — confirmed 404 in production. No urgency. Optionally add `Disallow:` directives as defense-in-depth, low priority.

### Rejected
- (None.)

### Pending inputs (non-blocking)
- None.

### Site-wide framing affecting this file
- None (infrastructure file).

---

## sitemap.xml

### Approved fixes
- **Add `.html` extension to every URL** — match canonicals exactly:
  - `https://www.cubanbread.com/` (root, no change)
  - `https://www.cubanbread.com/our-story.html`
  - `https://www.cubanbread.com/products.html`
  - `https://www.cubanbread.com/distribution.html`
  - `https://www.cubanbread.com/contact.html`
- Update every `<lastmod>` to actual deploy date (manual update at deploy time).
- Do NOT add `/es/` pages (ES paused this cycle; defer to ES parity phase).
- Do NOT add `/press` or `/specs` until those pages exist (deferred per Phase 8).
- Keep `priority` and `changefreq` values as-is (ignored by Google but harmless).

### Rejected
- Image sitemap with `<image:image>` entries. **Defer to post-photo-shoot.**
- ISO 8601 datetime granularity for `<lastmod>`. Date-only acceptable.
- XML stylesheet processing instruction. Cosmetic, skipped.

### Pending inputs (non-blocking)
- Real product photos (for image sitemap, deferred).

### Site-wide framing affecting this file
- None (infrastructure file).

---

## New page: /press

**DEFERRED to Phase 8.** Not part of this implementation cycle. Press article URLs pending verification from user before any new page is built.

---

## New page: /wholesale-for-schools

**DEFERRED to Phase 8.** Not part of this implementation cycle. Schools-segment placement decisions for current cycle are surfaced inline on existing pages (products.html callout, contact.html dropdown, distribution.html callout, index.html buyer-list band).

---

## New page: /specs

**DEFERRED to Phase 8 / not scoped.** Spec sheets currently live as PDFs in `/assets/specs/` and are linked from products.html. No standalone HTML page planned this cycle.

---

## Root-level file cleanup

### Approved actions
- **Delete** OR move to non-deployable `_source/` folder:
  - `SOURCE_index.html`
  - `SOURCE_our_story.html`
  - `SOURCE_products.html`
  - `SOURCE_distribution.html`
  - `SOURCE_contact.html`
- **Delete** OR move to non-deployable `_archive/` folder:
  - `cubanbread_v6.html`
  - `cubanbread_v7.html`
  - `cubanbread_v7_singlepage_BACKUP.html`
- **Move** `/assets/reference-images/` out of `/assets/` to a non-deployable location (e.g., `_reference/`).
- **Keep** at web root:
  - `index.html`, `our-story.html`, `products.html`, `distribution.html`, `contact.html`
  - `sitemap.xml`, `robots.txt`
  - `google23a5d19c68122370.html` (Google Search Console verification — must stay)
  - `assets/` folder (with `reference-images/` removed; `specs/` PDFs stay)
  - `es/` folder (paused but kept; do not delete)

### No urgency (confirmed 404 in production)
- `/scratch/` folder — clean up at implementer's pace.
- `/uploads/` folder — clean up at implementer's pace.

### Rejected
- (None.)

### Pending inputs
- None.

---

## Publish-blockers (must resolve before going live)

1. **reCAPTCHA production site key** for `contact.html` form. Currently placeholder `YOUR_RECAPTCHA_SITE_KEY_HERE`.
2. **Lead intake endpoint URL** for `contact.html` form. Currently placeholder `https://example.com/api/wholesale-leads`.
3. **Press article URLs** verified loading (manual check before publish, only if any press URLs added — currently no /press page in scope).

---

## Deferred to future phases (not this cycle)

1. **Full Spanish translation** of index.html, our-story.html, products.html (parity with EN). Dedicated phase with bilingual brand-voice review.
2. **Form rebuild on /es/contact.html** to match EN structure (JSON POST + reCAPTCHA + same field set + business-type dropdown).
3. **Business-type dropdown split** on ES (separate K-12 from Hospital).
4. **/press standalone page** with verified article URLs.
5. **/wholesale-for-schools standalone page** (USDA Smart Snacks / NSLP positioning).
6. **Image sitemap** with `<image:image>` entries (waits for Stephanie's product shoot).
7. **`openingHoursSpecification`** schema enrichment (waits for hours data).
8. **Real social URLs** in footer (waits for URL list).
9. **OG image** swap (waits for Stephanie's shot).
10. **Real product photography** site-wide (waits for shoot).
11. **SKU codes** for Cuban 18" / Cuban 36" / Hoagie Rolls in product schema (waits for Giuseppe / D365).

---

## SEO-default rule (applies going forward)

For all SEO-related decisions on this site, default to whatever is best for SEO. Do not ask if the tradeoff is purely "SEO vs. nothing." Only surface decisions where SEO conflicts with brand voice, factual accuracy, or another stated priority.

Examples of this default already applied:
- 35+/18 dual-number framing (SEO-best phrasing chosen).
- Full distributor names ("PFG (Performance Food Group)" not "PFG") — keyword density + buyer-search-term match.
- Lowercase email site-wide.
- Logo wall removed (rather than left as visible placeholder trust-signal failure).
- "Hundreds of restaurants" softened to verifiable claim.

Examples where SEO-default was overridden:
- H1 on contact.html: "Let's Talk Cuban Bread" kept (brand voice).
- H1 on /es/contact.html: "Hablemos de Pan Cubano" kept (brand voice).
- Sysco division names on /es/distribution.html: kept English (brand terminology accuracy).

---

End of consolidated decisions. Implementation chat starts from this brief.
