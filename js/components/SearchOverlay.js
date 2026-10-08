import { $, html, toEl, esc, raw, money, debounce, trapFocus } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { searchProducts } from '../data/api.js';
import { productArt } from './ProductArt.js';
import { navigate } from '../core/router.js';

const SUGGEST = [['Keyboards', '/shop?cat=keyboards'], ['Keycaps', '/shop?cat=keycaps'], ['Switches', '/shop?cat=switches'], ['65% keyboards', '/shop?layout=65'], ['Linear switches', '/shop?type=linear'], ['PBT keycaps', '/shop?mat=PBT'], ['Silent', '/shop?type=silent'], ['Magnetic', '/shop?type=magnetic']];
const mark = (text, q) => {
  const terms = q.split(/\s+/).filter(Boolean).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!terms.length) return raw(esc(text));
  return raw(esc(text).replace(new RegExp(`(${terms.map(esc).join('|')})`, 'ig'), '<mark>$1</mark>'));
};

export function mountSearch(host) {
  const el = toEl(html`
    <div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="Search products" aria-hidden="true">
      <div class="search-box">
        <div class="search-input-row">${icon('search')}
          <input id="search-input" type="search" placeholder="Search keyboards, keycaps, switches…" autocomplete="off" role="combobox" aria-expanded="true" aria-controls="search-results" aria-autocomplete="list">
          <kbd>Esc</kbd>
        </div>
        <div class="search-results" id="search-results" role="listbox" aria-label="Search results"></div>
      </div>
    </div>`);
  host.replaceChildren(el);
  const input = $('#search-input', el), results = $('#search-results', el);
  let release, prev, active = -1, items = [];

  const suggestions = () => {
    results.innerHTML = String(html`<div class="search-group">Popular searches</div><div class="s-tags">${SUGGEST.map(([l, h]) => html`<a class="chip" href="#${h}" data-go>${l}</a>`)}</div>`);
    items = [];
  };
  const render = () => {
    const q = input.value.trim();
    if (!q) return suggestions();
    const found = searchProducts(q, 8);
    items = found;
    if (!found.length) {
      results.innerHTML = String(html`<div class="empty" style="padding:36px 16px"><span class="ico">${icon('search')}</span><h3>No results for “${q}”</h3><p>Try a category such as “keyboards”, a layout like “65%”, or a switch type like “linear”.</p></div>`);
      return;
    }
    results.innerHTML = String(html`<div class="search-group">Products</div>${found.map((p, i) => html`
      <button class="s-item" type="button" role="option" id="so-${i}" data-i="${i}" aria-selected="false">
        <span class="thumb">${productArt(p)}</span>
        <span><span class="t" style="display:block">${mark(p.name, q)}</span><span class="s">${p.category === 'keyboards' ? 'Keyboard' : p.category === 'keycaps' ? 'Keycaps' : 'Switches'} · ${p.short}</span></span>
        <strong class="num">${money(p.price)}</strong>
      </button>`)}
      <div class="s-tags" style="padding-top:12px"><a class="chip" href="#/shop?q=${encodeURIComponent(q)}" data-go>See all results for “${q}”</a></div>`);
  };
  const setActive = (i) => {
    active = (i + items.length) % Math.max(items.length, 1);
    results.querySelectorAll('.s-item').forEach((b, n) => { b.classList.toggle('active', n === active); b.setAttribute('aria-selected', n === active); });
    input.setAttribute('aria-activedescendant', items.length ? `so-${active}` : '');
    results.querySelector('.s-item.active')?.scrollIntoView({ block: 'nearest' });
  };
  const api = {
    open() {
      prev = document.activeElement;
      el.classList.add('open'); el.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      release = trapFocus(el, api.close);
      input.value = ''; active = -1; suggestions();
      setTimeout(() => input.focus(), 50);
    },
    close() {
      el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; release?.(); prev?.focus?.();
    },
    isOpen: () => el.classList.contains('open'),
  };
  input.addEventListener('input', debounce(() => { active = -1; render(); }, 90));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (active >= 0 && items[active]) { api.close(); navigate('/product/' + items[active].id); }
      else if (input.value.trim()) { api.close(); navigate('/shop?q=' + encodeURIComponent(input.value.trim())); }
    }
  });
  el.addEventListener('click', (e) => {
    const b = e.target.closest('.s-item');
    if (b) { api.close(); navigate('/product/' + items[+b.dataset.i].id); return; }
    if (e.target.closest('[data-go]')) { api.close(); return; }
    if (e.target === el) api.close();
  });
  return api;
}
