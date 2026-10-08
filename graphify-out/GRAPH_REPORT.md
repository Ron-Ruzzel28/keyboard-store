# Graph Report - js  (2026-10-08)

## Corpus Check
- Corpus is ~25,948 words - fits in a single context window. You may not need a graph.

## Summary
- 289 nodes · 1254 edges · 9 communities
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8

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
- `paintSummary()` --indirect_call--> `money()`  [INFERRED]
  components/KeyboardBuilder.js → core/dom.js
- `field()` --calls--> `html()`  [EXTRACTED]
  views/Account.js → core/dom.js
- `lineItem()` --calls--> `money()`  [EXTRACTED]
  components/CartDrawer.js → core/dom.js
- `totalsBlock()` --calls--> `money()`  [EXTRACTED]
  components/CartDrawer.js → core/dom.js
- `shipProgress()` --calls--> `money()`  [EXTRACTED]
  components/CartDrawer.js → core/dom.js

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (41): lineItem(), mountCartDrawer(), shipProgress(), totalsBlock(), checkoutForm(), field(), luhn(), PAY (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.14
Nodes (32): catLabel(), productCard(), stars(), stockInfo(), initials(), reviewCard(), reviewsCarousel(), addCustomBuild() (+24 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (28): buildKeyboard(), paintPanel(), paintSummary(), buildPrice(), STEPS, createKeyboard(), bind(), bind2() (+20 more)

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (27): lineThumb(), barChart(), donut(), lineChart(), PAL, palette(), artisanSVG(), artSVG() (+19 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (28): confirmDialog(), openModal(), isCurrent(), LINKS, mountNavbar(), mark(), mountSearch(), SUGGEST (+20 more)

### Community 5 - "Community 5"
Cohesion: 0.18
Nodes (19): particles(), productSkeleton(), renderGrid(), renderGridError(), renderGridLoading(), aboutSection(), reviewsSection(), switchCompare() (+11 more)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (21): defaults(), FREE_SHIP_AT, load(), persist(), resetStore(), SHIPPING, subs, CATEGORIES (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.17
Nodes (20): cache, code(), FN_COMPACT, FN_TENKEY, fnKeys(), getLayout(), K(), LAYOUT_IDS (+12 more)

### Community 8 - "Community 8"
Cohesion: 0.29
Nodes (13): applyFilters(), checks(), defaultFilters(), filterPanel(), filtersToQuery(), group(), MATERIALS, parseFilters() (+5 more)

## Knowledge Gaps
- **40 isolated node(s):** `PAL`, `PAY`, `PROVINCES`, `COLS`, `SOCIAL` (+35 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 58 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `$$` connect `Community 5` to `Community 0`, `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 8`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **What connects `PAL`, `PAY`, `PROVINCES` to the rest of the system?**
  _40 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1447811447811448 - nodes in this community are weakly interconnected._
- **Why does `html()` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 5`, `Community 8`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.14264264264264265 - nodes in this community are weakly interconnected._
- **Why does `toEl()` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 5`, `Community 8`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1226890756302521 - nodes in this community are weakly interconnected._