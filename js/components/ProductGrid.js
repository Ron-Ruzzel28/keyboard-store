import { html, toEl } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { productCard, productSkeleton } from './ProductCard.js';
import { reveal } from '../core/anim.js';

// Renders a product grid into `host`. `states`: loading | error | empty handled in-place.
export function renderGrid(host, products, { onReset, emptyTitle = 'No products match', emptyBody = 'Try removing a filter or searching for something else.' } = {}) {
  if (!products.length) {
    host.replaceChildren(toEl(html`
      <div class="empty" style="grid-column:1/-1">
        <span class="ico">${icon('search')}</span><h3>${emptyTitle}</h3><p>${emptyBody}</p>
        ${onReset ? html`<button class="btn btn-ghost" type="button" data-action="reset-filters">Clear all filters</button>` : ''}
      </div>`));
    return;
  }
  const t = document.createElement('template');
  t.innerHTML = String(html`${products.map((p, i) => productCard(p, i))}`);
  host.replaceChildren(t.content);
  reveal(host);
}
export function renderGridLoading(host, n = 8) {
  const t = document.createElement('template');
  t.innerHTML = String(productSkeleton(n));
  host.replaceChildren(t.content);
  host.setAttribute('aria-busy', 'true');
}
export function renderGridError(host, retry) {
  host.removeAttribute('aria-busy');
  const el = toEl(html`<div class="empty" style="grid-column:1/-1"><span class="ico">${icon('alert')}</span><h3>We couldn't load the catalogue</h3><p>Check your connection and try again.</p><button class="btn btn-primary" type="button">Try again</button></div>`);
  el.querySelector('button').addEventListener('click', retry);
  host.replaceChildren(el);
}
