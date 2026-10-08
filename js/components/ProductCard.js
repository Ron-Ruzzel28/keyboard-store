import { html, money, raw } from '../core/dom.js';
import { icon, filledStar } from '../core/icons.js';
import { productArt } from './ProductArt.js';
import { inWishlist } from '../core/store.js';

export const stars = (rating, { size = 16, showNum = true, count } = {}) => html`
  <span class="stars" role="img" aria-label="Rated ${rating} out of 5${count != null ? ` from ${count} reviews` : ''}">
    <span class="stars-row" style="--s:${size}px">${[1, 2, 3, 4, 5].map((i) => raw(`<i class="${rating >= i - 0.25 ? 'on' : rating >= i - 0.75 ? 'half' : ''}">${filledStar()}</i>`))}</span>
    ${showNum ? html`<span class="stars-num num">${rating.toFixed(1)}${count != null ? html` <span class="faint">(${count})</span>` : ''}</span>` : ''}
  </span>`;

export function stockInfo(p) {
  if (p.stock <= 0) return { cls: 'bad', label: 'Out of stock' };
  if (p.stock <= 10) return { cls: 'warn', label: `Only ${p.stock} left` };
  return { cls: 'ok', label: 'In stock' };
}
export const catLabel = (c) => ({ keyboards: 'Keyboard', keycaps: 'Keycaps', switches: 'Switches' }[c] || c);

export function productCard(p, i = 0) {
  const s = stockInfo(p);
  const wished = inWishlist(p.id);
  return html`
    <article class="pcard reveal" style="--d:${Math.min(i, 8)}" data-id="${p.id}">
      <a class="pcard-media" href="#/product/${p.id}" aria-label="View ${p.name}" data-art>
        <div class="art-box">${productArt(p)}</div>
        <div class="pcard-badges">
          ${p.new ? html`<span class="badge accent">New</span>` : ''}
          ${p.bestSeller ? html`<span class="badge">Best seller</span>` : ''}
        </div>
      </a>
      <button type="button" class="wish ${wished ? 'on' : ''}" data-action="wish" data-id="${p.id}" aria-pressed="${wished}" aria-label="${wished ? 'Remove from' : 'Add to'} wishlist: ${p.name}">${icon('heart')}</button>
      <div class="pcard-body">
        <div class="row between"><span class="cat">${catLabel(p.category)}</span><span class="badge ${s.cls}">${s.label}</span></div>
        <h3><a href="#/product/${p.id}">${p.name}</a></h3>
        <p class="muted short">${p.short}</p>
        <div class="row between">${stars(p.rating, { size: 14, count: p.reviews })}</div>
        <div class="pcard-foot">
          <strong class="price num">${money(p.price)}</strong>
          <button type="button" class="btn btn-primary btn-sm" data-action="add" data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''} aria-label="Add ${p.name} to cart">${icon('cart')}<span>${p.stock <= 0 ? 'Sold out' : 'Add'}</span></button>
        </div>
      </div>
    </article>`;
}

export const productSkeleton = (n = 8) => html`${Array.from({ length: n }, () => html`
  <div class="pcard skeleton-card" aria-hidden="true"><div class="skel" style="aspect-ratio:4/3;border-radius:14px"></div><div class="pcard-body"><div class="skel" style="height:14px;width:40%"></div><div class="skel" style="height:22px;width:80%"></div><div class="skel" style="height:14px;width:90%"></div><div class="skel" style="height:40px;width:100%;margin-top:8px"></div></div></div>`)}`;
