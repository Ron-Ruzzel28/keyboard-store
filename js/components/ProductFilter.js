import { html, money, toEl } from '../core/dom.js';
import { LAYOUTS } from '../data/layouts.js';
import { SWITCH_TYPES } from '../data/themes.js';

export const SORTS = [
  ['featured', 'Featured'], ['newest', 'Newest'], ['price-asc', 'Price: Low → High'], ['price-desc', 'Price: High → Low'], ['rating', 'Highest rated'], ['best', 'Best selling'],
];
export const MATERIALS = ['ABS', 'PBT', 'Resin', 'Aluminum', 'Polycarbonate', 'Brass'];

export const defaultFilters = () => ({ cat: '', layouts: [], types: [], materials: [], min: 0, max: 12000, inStock: false, q: '', sort: 'featured' });

export function parseFilters(query) {
  const f = defaultFilters();
  if (query.cat) f.cat = query.cat;
  const list = (v) => (v ? v.split(',').filter(Boolean) : []);
  f.layouts = list(query.layout); f.types = list(query.type); f.materials = list(query.mat);
  if (query.min) f.min = +query.min; if (query.max) f.max = +query.max;
  f.inStock = query.stock === '1'; f.q = query.q || ''; f.sort = query.sort || 'featured';
  return f;
}
export function filtersToQuery(f) {
  return { cat: f.cat, layout: f.layouts.join(','), type: f.types.join(','), mat: f.materials.join(','), min: f.min > 0 ? f.min : '', max: f.max < 12000 ? f.max : '', stock: f.inStock ? '1' : '', q: f.q, sort: f.sort === 'featured' ? '' : f.sort };
}
export function applyFilters(products, f) {
  const q = f.q.toLowerCase().trim();
  let out = products.filter((p) => {
    if (f.cat && p.category !== f.cat) return false;
    if (p.price < f.min || p.price > f.max) return false;
    if (f.inStock && p.stock <= 0) return false;
    if (f.layouts.length && !(p.layout && f.layouts.includes(p.layout))) return false;
    if (f.types.length && !(p.switchType && f.types.includes(p.switchType.toLowerCase()))) return false;
    if (f.materials.length && !(p.material && f.materials.includes(p.material))) return false;
    if (q && !`${p.name} ${p.short} ${p.category} ${p.material || ''} ${p.switchType || ''} ${p.layout || ''}`.toLowerCase().includes(q)) return false;
    return true;
  });
  const by = { featured: (a, b) => (b.featured - a.featured) || (b.rating - a.rating), newest: (a, b) => b.addedAt - a.addedAt, 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews, best: (a, b) => (b.bestSeller - a.bestSeller) || b.reviews - a.reviews };
  return out.sort(by[f.sort] || by.featured);
}

const group = (title, body) => html`<fieldset class="fgroup"><legend>${title}</legend>${body}</fieldset>`;
const checks = (name, items, selected) => html`<div class="fchecks">${items.map(([v, l]) => html`<label class="check"><input type="checkbox" name="${name}" value="${v}" ${selected.includes(v) ? 'checked' : ''}><span>${l}</span></label>`)}</div>`;

export function filterPanel(f, counts = {}) {
  return toEl(html`
    <form class="filters" aria-label="Product filters" novalidate>
      ${group('Category', html`<div class="fchecks">${[['', 'All products'], ['keyboards', 'Keyboards'], ['keycaps', 'Keycaps'], ['switches', 'Switches']].map(([v, l]) => html`<label class="check"><input type="radio" name="cat" value="${v}" ${f.cat === v ? 'checked' : ''}><span>${l}</span>${counts[v || 'all'] != null ? html`<em>${counts[v || 'all']}</em>` : ''}</label>`)}</div>`)}
      ${group('Price', html`
        <div class="range2" style="--lo:${(f.min / 12000) * 100}%;--hi:${(f.max / 12000) * 100}%">
          <input type="range" name="min" min="0" max="12000" step="100" value="${f.min}" aria-label="Minimum price">
          <input type="range" name="max" min="0" max="12000" step="100" value="${f.max}" aria-label="Maximum price">
        </div>
        <div class="row between num price-out"><output data-out="min">${money(f.min)}</output><output data-out="max">${money(f.max)}${f.max >= 12000 ? '+' : ''}</output></div>`)}
      ${group('Keyboard layout', checks('layout', Object.values(LAYOUTS).map((l) => [l.id, l.label]), f.layouts))}
      ${group('Switch type', checks('type', Object.values(SWITCH_TYPES).map((s) => [s.id, s.name]), f.types))}
      ${group('Material', checks('mat', MATERIALS.map((m) => [m, m]), f.materials))}
      <label class="toggle"><input type="checkbox" name="stock" ${f.inStock ? 'checked' : ''}><span class="track"></span><span>In stock only</span></label>
      <button type="button" class="btn btn-ghost btn-block" data-action="reset-filters">Reset filters</button>
    </form>`);
}

// Read the form back into a filters object.
export function readFilters(form, prev) {
  const fd = new FormData(form);
  let min = +fd.get('min'), max = +fd.get('max');
  if (min > max) [min, max] = [max, min];
  return {
    ...prev, cat: fd.get('cat') || '', layouts: fd.getAll('layout'), types: fd.getAll('type'), materials: fd.getAll('mat'), min, max, inStock: fd.get('stock') === 'on',
  };
}
