# KEYFORGE — Mechanical Keyboard Store

A premium, dark-themed online store for mechanical keyboards, keycaps and switches. Pure HTML/CSS/JS (ES modules), no build step.

## Run
```bash
python3 -m http.server 8000   # any static server works; ES modules need http://, not file://
# open http://localhost:8000
```

## What's inside
- **Home**: animated hero with a live 3D keyboard (hover, press, drag-to-rotate, RGB effects, 6 layouts), category cards, featured products, switch comparison with synthesised sound previews, builder teaser, animated stats, review carousel.
- **Shop**: live filters (category, price range, layout, switch type, material, stock), 6 sort orders, URL-synced state, skeleton/empty/error states.
- **Product page**: gallery (incl. interactive keyboard), variants, quantity, specs, reviews, related items.
- **Keyboard builder**: 6 steps (keyboard, case, keycaps, switches, plate, RGB) with live preview and running total.
- **Cart drawer + cart page**: fly-to-cart animation, coupons (`KEYFORGE10`, `WELCOME500`, `FREESHIP`), free-shipping progress.
- **Checkout**: 3 animated steps, validation, card / GCash / Maya / COD, order confirmation.
- **Account**: profile, order history, order tracking, wishlist, addresses, payment methods.
- **Admin** (`admin@keyforge.dev` / `admin123`): products CRUD, inventory, categories, orders, customers, sales, discounts, reviews, charts.
- Demo customer: `demo@keyforge.dev` / `demo1234`. Shortcuts: `/` or Ctrl/⌘+K opens search.

## Structure
```
index.html
css/        base · layout · keyboard · shop · views
js/core/    dom (safe html templates) · store (localStorage) · router · cart · audio · anim · icons
js/data/    products · layouts (key geometry) · themes · seed · api (swap for a real backend)
js/components/  Navbar · Footer · ProductCard · ProductGrid · ProductFilter · KeyboardPreview · KeyboardBuilder
                SwitchCard · CartDrawer · CheckoutForm · ReviewCard · ToastNotification · SearchOverlay · Charts …
js/views/   Home · Products · ProductDetails · KeyboardBuilder · Cart · Checkout · Auth · Account · AdminDashboard …
```

## Adding product photos
1. Open `tools/photo-urls.txt`. For each product, uncomment its line and paste a direct image URL (right-click an image, *Copy image address*), optionally followed by a credit.
2. On a machine with normal internet access run `node tools/fetch-photos.mjs` (Node 18+, no dependencies; `--dry` previews, `--force` re-downloads).
3. It saves files to `assets/products/`, registers them in `js/data/photos.js` and writes `CREDITS.md`. Commit the result.

## Notes
- All data is sample data persisted in `localStorage` (`window.keyforge.reset()` clears it). Auth and payments are simulated; passwords are stored in plain text in the browser for demo purposes only. Do not reuse this for production.
- The catalogue uses real brands/models (Keychron, Wooting, NuPhy, Akko, HHKB, Gateron, Cherry, GMK, PBTfans…) with **illustrative prices and specs**. Photos: add files to `assets/products/` and register them in `js/data/photos.js`; products without a photo show generated SVG art (`js/components/ProductArt.js`).
- `graphify-out/` holds a knowledge graph of the codebase (`graph.html`, `GRAPH_REPORT.md`) built with [graphify](https://github.com/safishamsi/graphify). The UI was built following the [impeccable](https://github.com/pbakaus/impeccable) design skill (installed under `.agents/skills`).
