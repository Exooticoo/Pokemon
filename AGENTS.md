# AGENTS.md — PokeRadar

Static site: vanilla HTML/CSS/JS. No build system, package manager, or linters. Node is available for utility scripts only.

## Run / verify
- Serve over HTTP — `python -m http.server` or any static server on the repo root — then open `http://localhost:8000`. Do NOT test via `file://`: `fetch()` fails and the app silently falls back to hardcoded sample data inside `app.js`, hiding real errors.
- Verify by opening the three tabs (Buscador, Mi Pokédex, Tiendas Verificadas) and checking the DevTools console.
- Quick syntax check: `node --check app.js`.

## Architecture
- All logic lives in `app.js` inside one `DOMContentLoaded` callback. No modules or frameworks. Three tab pages (`#page-home`, `#page-pokedex`, `#page-tiendas`) toggled via `.tab-link[data-page]`.
- Runtime data: `productos.json` (~462 real sealed Pokémon products from 5 Chilean stores) and `pokedex.json` (1160 entries: 1025 species + 59 regional forms + 76 other forms). Both loaded with `fetch()`.
- Store directory (`storesDB`) is hardcoded in `app.js`, not in JSON. Stores with automated prices carry `auto: true` and render a 🤖 badge.
- **Catalog pipeline (never hand-edit `productos.json`)**: `scripts/build-catalog.mjs` regenerates the whole catalog from live store feeds. Per-store Pokémon sealed-only filters are verified against each feed (AFK: `product_type === 'Sellados'`; PiedraBruja: `tcgpokemon` minus accessories/events; Collector Center: sealed type whitelist minus Magic/OP/Riftbound; DeckSwap: category `Pokemon TCG` minus accesorios/torneos; Charizstore: everything except `Singles Pokémon`/`Accesorios`). Each product carries `image` (store's CDN photo, 100% coverage) — cards fall back to a local 🎴 placeholder via `onerror`. Expansion detection uses the ordered `EXPANSION_MAP` regex table (most specific first — e.g. Chaos Rising before Mega Evolution); unknown sets → "Otras Expansiones". If a store's feed fails or rate-limits (HTTP 429), its previous products are kept (merge mode) — a failed run never loses stores.
- Price bot: `scripts/update-prices.mjs` refreshes `price`/`inStock`/`lastUpdated` by EXACT URL match between each product's `link` and the store feed (Shopify `/products.json`, WooCommerce `/wp-json/wc/store/v1/products`; platform auto-detected). Stores list lives in `scripts/stores.config.json` (only feed-backed stores; unsupported ones were removed). Verified 462/462 link matches across all 5 feeds.
- **GitHub Actions automation**: `.github/workflows/actualizar.yml` runs the bot on GitHub's servers — daily ~13:00 UTC runs `update-prices.mjs`; Sundays (cron `0 14 * * 0`) and manual `workflow_dispatch` runs run `build-catalog.mjs` instead. Commits `productos.json` only if it changed (`git diff --cached --quiet` guard), which auto-redeploys Pages. Requires repo Workflow permission "Read and write" (the workflow also declares `permissions: contents: write`). `.nojekyll` at root keeps Pages builds fast.
- `loadProducts()` / `loadPokedex()` contain small fallback arrays duplicating a subset of the JSON data — update them too when changing record shapes.

## Pokédex data regeneration
- `scripts/regen-pokedex.mjs` refetches types from PokeAPI and rewrites `pokedex.json` (UTF-8, no BOM). Run with `node scripts/regen-pokedex.mjs`.
- Form → PokeAPI name mapping uses `{english-name}-{region}` plus a `FORM_OVERRIDES` map for exceptions (e.g. `tauros-paldea-combat-breed`, `darmanitan-galar-standard`). New regional forms go into `ADDITIONS`.
- Conventions: forms use the generation of their region (e.g. Galarian forms = gen 8), ids are zero-padded or region-suffixed (`"025"`, `"026-alola"`), type names are Spanish (`Planta`, `Siniestro`...), sprites come from PokeAPI GitHub raw URLs. Non-regional alternate forms (Mega, Gigantamax, Unown letters, Castform, etc.) have `region: null` + a `form` label (e.g. `"Sol"`, `"Mega X"`); the UI renders them via `.poke-form-tag` and the gen filter excludes them (use the "Otras Formas" option).
- There is no plain "Tauros Paldea" form in PokeAPI — the Combat Breed IS the base Paldean Tauros.

## Gotchas
- UI text is Spanish (Chilean); prices use CLP via `Intl.NumberFormat('es-CL')`. Write new UI strings in Spanish.
- Expansion names pair ES/EN, e.g. "Chispas Fulgurantes / Surging Sparks"; filtering splits on `" / "` (see `getFilteredProducts`). The `#expansionSelect` options are generated dynamically by `populateExpansionSelect()` in `app.js` from whatever expansions exist in `productos.json` — to add a set, only extend the ordered `EXPANSION_MAP` regex table in `scripts/build-catalog.mjs` and rebuild. `#storeSelect` is populated the same way by `populateStoreSelect()`.
- Products paginate at `PAGE_SIZE = 24` (`state.page`, reset to 1 on any filter change). Favorites persist in localStorage under `poke_favorites_v1`; recent searches under `poke_recent_searches`.
- Handlers used in generated HTML templates must be attached to `window` (`window.quickSearch`, `window.toggleCollection`, `window.toggleFavorite`, `window.goToPage`) because they are called from inline `onclick`. Recent-search pills use event delegation with `data-q` attributes (safer than escaping quotes into inline handlers).
- Do not use external placeholder image services (`via.placeholder.com` is dead); store logos use locally generated initials avatars, product images use an emoji fallback div toggled by `onerror`.
- Pokédex collection persists in localStorage under `poke_collection_v2`; bump the suffix if the stored shape changes.
