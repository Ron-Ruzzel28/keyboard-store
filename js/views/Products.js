import { $, html, toEl, debounce } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { setQuery } from '../core/router.js';
import { listProducts } from '../data/api.js';
import { renderGrid, renderGridLoading, renderGridError } from '../components/ProductGrid.js';
import { filterPanel, parseFilters, filtersToQuery, applyFilters, readFilters, defaultFilters, SORTS } from '../components/ProductFilter.js';
import { switchCompare } from '../components/SwitchCard.js';
import { trapFocus } from '../core/dom.js';

const TITLES = { '': 'All products', keyboards: 'Keyboards', keycaps: 'Keycaps', switches: 'Switches' };
const BLURBS = {
  '': 'Complete boards, keycap sets and switches, all in one place.',
  keyboards: 'From pocket-sized 60% to full-size workhorses. Hot-swap, wireless and gasket-mounted.',
  keycaps: 'PBT, ABS, double-shot and hand-poured artisans, with sets for every colour story.',
  switches: 'Linear, tactile, clicky, silent and magnetic. Pre-lubed and ready to swap.',
};

export default async function Products({ query }) {
  let f = parseFilters(query);
  let all = [];
  const el = toEl(html`
    <div class="shop container">
      <header class="shop-head">
        <div><h1 id="shop-title" style="font-size:clamp(2.2rem,5vw,3.6rem)">${TITLES[f.cat] ?? 'Products'}</h1><p class="lead" id="shop-blurb" style="margin-top:12px">${BLURBS[f.cat] ?? BLURBS['']}</p></div>
      </header>
      ${f.cat === 'switches' ? html`<div id="compare-slot" class="shop-compare"></div>` : ''}
      <div class="shop-bar">
        <button class="btn btn-ghost" type="button" id="open-filters" aria-controls="filter-pane">${icon('sliders')}Filters <span class="badge accent" id="filter-count" hidden></span></button>
        <div class="search-inline"><label class="sr-only" for="shop-q">Search within results</label>${icon('search')}<input class="input" id="shop-q" type="search" placeholder="Search products" value="${f.q}"></div>
        <p class="muted" id="result-count" role="status" aria-live="polite"></p>
        <label class="row sort" style="gap:10px"><span class="muted" style="font-size:.88rem">Sort</span>
          <select class="select" id="sort" style="min-height:44px;width:auto">${SORTS.map(([v, l]) => html`<option value="${v}" ${f.sort === v ? 'selected' : ''}>${l}</option>`)}</select></label>
      </div>
      <div class="shop-layout">
        <aside class="filter-pane glass" id="filter-pane" aria-label="Filters">
          <div class="filter-pane-head"><h2 style="font-size:1.2rem">Filters</h2><button class="btn btn-icon" type="button" id="close-filters" aria-label="Close filters">${icon('close')}</button></div>
          <div id="filter-slot"></div>
          <button class="btn btn-primary btn-block filter-apply" type="button" id="apply-filters">Show results</button>
        </aside>
        <div class="filter-scrim" id="filter-scrim"></div>
        <section aria-label="Products"><div class="product-grid" id="grid" aria-live="polite"></div></section>
      </div>
    </div>`);

  if (f.cat === 'switches') $('#compare-slot', el).append(switchCompare());

  const grid = $('#grid', el);
  const mountFilters = () => {
    const counts = { all: all.length, keyboards: 0, keycaps: 0, switches: 0 };
    all.forEach((p) => counts[p.category]++);
    $('#filter-slot', el).replaceChildren(filterPanel(f, counts));
  };
  const syncUrl = () => setQuery(filtersToQuery(f));
  const paint = () => {
    const out = applyFilters(all, f);
    $('#result-count', el).textContent = `${out.length} ${out.length === 1 ? 'product' : 'products'}`;
    grid.removeAttribute('aria-busy');
    renderGrid(grid, out, { onReset: true });
    const active = f.layouts.length + f.types.length + f.materials.length + (f.min > 0 || f.max < 12000 ? 1 : 0) + (f.inStock ? 1 : 0) + (f.cat ? 1 : 0);
    const fc = $('#filter-count', el); fc.hidden = !active; fc.textContent = active;
    $('#shop-title', el).textContent = TITLES[f.cat] ?? 'Products';
    $('#shop-blurb', el).textContent = BLURBS[f.cat] ?? BLURBS[''];
    $('#sort', el).value = f.sort;
  };
  const update = (next) => { f = { ...f, ...next }; syncUrl(); paint(); };

  const load = async () => {
    renderGridLoading(grid, 8);
    try { all = await listProducts(); mountFilters(); paint(); }
    catch { renderGridError(grid, load); }
  };

  el.addEventListener('input', (e) => {
    const form = e.target.closest('.filters');
    if (form) {
      const next = readFilters(form, f);
      const r = form.querySelector('.range2'); r.style.setProperty('--lo', (next.min / 12000) * 100 + '%'); r.style.setProperty('--hi', (next.max / 12000) * 100 + '%');
      form.querySelector('[data-out=min]').textContent = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(next.min);
      form.querySelector('[data-out=max]').textContent = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(next.max) + (next.max >= 12000 ? '+' : '');
      update({ cat: next.cat, layouts: next.layouts, types: next.types, materials: next.materials, min: next.min, max: next.max, inStock: next.inStock });
    }
  });
  $('#shop-q', el).addEventListener('input', debounce((e) => update({ q: e.target.value }), 200));
  $('#sort', el).addEventListener('change', (e) => update({ sort: e.target.value }));
  el.addEventListener('click', (e) => {
    if (e.target.closest('[data-action="reset-filters"]')) { f = { ...defaultFilters(), cat: '' }; $('#shop-q', el).value = ''; syncUrl(); mountFilters(); paint(); }
  });

  // Mobile filter drawer
  const pane = $('#filter-pane', el), scrim = $('#filter-scrim', el);
  let release;
  const open = () => { pane.classList.add('open'); scrim.classList.add('open'); release = trapFocus(pane, close); document.body.style.overflow = 'hidden'; $('#close-filters', el).focus(); };
  const close = () => { pane.classList.remove('open'); scrim.classList.remove('open'); release?.(); document.body.style.overflow = ''; };
  $('#open-filters', el).addEventListener('click', open);
  $('#close-filters', el).addEventListener('click', close);
  $('#apply-filters', el).addEventListener('click', close);
  scrim.addEventListener('click', close);

  el._cleanup = () => { document.body.style.overflow = ''; release?.(); };
  await Promise.resolve();
  load();
  return el;
}
