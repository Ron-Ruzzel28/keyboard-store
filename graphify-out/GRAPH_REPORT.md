# Graph Report - keyboard-store  (2026-10-08)

## Corpus Check
- Corpus is ~26,009 words - fits in a single context window. You may not need a graph.

## Summary
- 318 nodes · 1296 edges · 11 communities
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0: CartDrawer.js, lineItem(), lineThumb()
- Community 1: CheckoutForm.js, checkoutForm(), field()
- Community 2: components/KeyboardBuilder.js, STEPS, KeyboardPreview.js
- Community 3: Charts.js, barChart(), donut()
- Community 4: Particles.js, particles(), frame()
- Community 5: productArt(), ProductCard.js, catLabel()
- Community 6: layouts.js, cache, code()
- Community 7: ref_node_fs, ref_node_path, ref_node_url
- Community 8: productSkeleton(), ProductFilter.js, applyFilters()
- Community 9: photos.js, PHOTOS, products.js
- Community 10: SearchOverlay.js, mark(), mountSearch()

## God Nodes (most connected - your core abstractions)
1. `$$` - 85 edges
2. `html()` - 80 edges
3. `toEl()` - 58 edges
4. `icon()` - 57 edges
5. `toast()` - 28 edges
6. `AdminDashboard()` - 28 edges
7. `money()` - 26 edges
8. `commit()` - 26 edges
9. `raw()` - 25 edges
10. `ProductDetails()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `lineThumb()` --calls--> `artSVG()`  [EXTRACTED]
  js/components/CartDrawer.js → js/components/ProductArt.js
- `lineThumb()` --calls--> `productArt()`  [EXTRACTED]
  js/components/CartDrawer.js → js/components/ProductArt.js
- `lineThumb()` --calls--> `raw()`  [EXTRACTED]
  js/components/CartDrawer.js → js/core/dom.js
- `lineItem()` --calls--> `html()`  [EXTRACTED]
  js/components/CartDrawer.js → js/core/dom.js
- `lineItem()` --calls--> `money()`  [EXTRACTED]
  js/components/CartDrawer.js → js/core/dom.js

## Import Cycles
- None detected.

## Communities (11 total, 0 thin omitted)

### Community 0 - "Community 0: CartDrawer.js, lineItem(), lineThumb()"
Cohesion: 0.09
Nodes (50): lineItem(), lineThumb(), mountCartDrawer(), shipProgress(), totalsBlock(), isCurrent(), LINKS, mountNavbar() (+42 more)

### Community 1 - "Community 1: CheckoutForm.js, checkoutForm(), field()"
Cohesion: 0.11
Nodes (47): checkoutForm(), field(), luhn(), PAY, PROVINCES, confirmDialog(), openModal(), COLS (+39 more)

### Community 2 - "Community 2: components/KeyboardBuilder.js, STEPS, KeyboardPreview.js"
Cohesion: 0.14
Nodes (23): STEPS, createKeyboard(), bind(), bind2(), build(), holdRelease(), observe(), press() (+15 more)

### Community 3 - "Community 3: Charts.js, barChart(), donut()"
Cohesion: 0.17
Nodes (20): barChart(), donut(), lineChart(), PAL, palette(), artisanSVG(), artSVG(), keyboardSVG() (+12 more)

### Community 4 - "Community 4: Particles.js, particles(), frame()"
Cohesion: 0.24
Nodes (17): particles(), renderGrid(), renderGridError(), reviewsCarousel(), aboutSection(), reviewsSection(), meter(), switchCard() (+9 more)

### Community 5 - "Community 5: productArt(), ProductCard.js, catLabel()"
Cohesion: 0.23
Nodes (19): productArt(), catLabel(), productCard(), stars(), stockInfo(), initials(), reviewCard(), tweenNumber() (+11 more)

### Community 6 - "Community 6: layouts.js, cache, code()"
Cohesion: 0.17
Nodes (20): cache, code(), FN_COMPACT, FN_TENKEY, fnKeys(), getLayout(), K(), LAYOUT_IDS (+12 more)

### Community 7 - "Community 7: ref_node_fs, ref_node_path, ref_node_url"
Cohesion: 0.10
Nodes (15): args, body, credited, CREDITS, done, DRY, EXT, FORCE (+7 more)

### Community 8 - "Community 8: productSkeleton(), ProductFilter.js, applyFilters()"
Cohesion: 0.24
Nodes (15): productSkeleton(), applyFilters(), checks(), defaultFilters(), filterPanel(), filtersToQuery(), group(), MATERIALS (+7 more)

### Community 9 - "Community 9: photos.js, PHOTOS, products.js"
Cohesion: 0.21
Nodes (15): PHOTOS, base(), CATEGORIES, colors(), FLAG(), img(), KB_ROWS, KC_ROWS (+7 more)

### Community 10 - "Community 10: SearchOverlay.js, mark(), mountSearch()"
Cohesion: 0.22
Nodes (14): mark(), mountSearch(), SUGGEST, debounce(), currentPath(), listeners, navigate(), parseHash() (+6 more)

## Knowledge Gaps
- **57 isolated node(s):** `PAL`, `PAY`, `PROVINCES`, `COLS`, `SOCIAL` (+52 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 76 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `$$` connect `Community 1: CheckoutForm.js, checkoutForm(), field()` to `Community 0: CartDrawer.js, lineItem(), lineThumb()`, `Community 2: components/KeyboardBuilder.js, STEPS, KeyboardPreview.js`, `Community 3: Charts.js, barChart(), donut()`, `Community 4: Particles.js, particles(), frame()`, `Community 5: productArt(), ProductCard.js, catLabel()`, `Community 8: productSkeleton(), ProductFilter.js, applyFilters()`, `Community 10: SearchOverlay.js, mark(), mountSearch()`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **What connects `PAL`, `PAY`, `PROVINCES` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0: CartDrawer.js, lineItem(), lineThumb()` be split into smaller, more focused modules?**
  _Cohesion score 0.08766803039158387 - nodes in this community are weakly interconnected._
- **Why does `html()` connect `Community 1: CheckoutForm.js, checkoutForm(), field()` to `Community 0: CartDrawer.js, lineItem(), lineThumb()`, `Community 2: components/KeyboardBuilder.js, STEPS, KeyboardPreview.js`, `Community 3: Charts.js, barChart(), donut()`, `Community 4: Particles.js, particles(), frame()`, `Community 5: productArt(), ProductCard.js, catLabel()`, `Community 8: productSkeleton(), ProductFilter.js, applyFilters()`, `Community 10: SearchOverlay.js, mark(), mountSearch()`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Should `Community 1: CheckoutForm.js, checkoutForm(), field()` be split into smaller, more focused modules?**
  _Cohesion score 0.1119177253478524 - nodes in this community are weakly interconnected._
- **Why does `toEl()` connect `Community 1: CheckoutForm.js, checkoutForm(), field()` to `Community 0: CartDrawer.js, lineItem(), lineThumb()`, `Community 2: components/KeyboardBuilder.js, STEPS, KeyboardPreview.js`, `Community 3: Charts.js, barChart(), donut()`, `Community 4: Particles.js, particles(), frame()`, `Community 5: productArt(), ProductCard.js, catLabel()`, `Community 8: productSkeleton(), ProductFilter.js, applyFilters()`, `Community 10: SearchOverlay.js, mark(), mountSearch()`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `Community 2: components/KeyboardBuilder.js, STEPS, KeyboardPreview.js` be split into smaller, more focused modules?**
  _Cohesion score 0.14022988505747128 - nodes in this community are weakly interconnected._