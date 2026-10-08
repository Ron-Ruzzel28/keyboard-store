import { $, html, toEl, money, trapFocus } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { state, on, totals, FREE_SHIP_AT } from '../core/store.js';
import { productArt, artSVG } from './ProductArt.js';
import { raw } from '../core/dom.js';
import { variantLabel } from '../core/cart.js';

export const lineThumb = (l) => (l.custom ? raw(artSVG(l.image)) : productArt({ image: l.image, name: l.name }));

export function lineItem(l, { editable = true } = {}) {
  return html`
    <li class="line-item" data-key="${l.key}">
      <div class="line-thumb">${lineThumb(l)}</div>
      <div class="line-info">
        ${l.custom ? html`<span class="name">${l.name}</span>` : html`<a href="#${l.href}" data-close-cart>${l.name}</a>`}
        <span class="var">${variantLabel(l.selection)}</span>
        ${editable ? html`<div class="qty" role="group" aria-label="Quantity for ${l.name}">
          <button type="button" data-action="qty" data-key="${l.key}" data-delta="-1" aria-label="Decrease quantity">${icon('minus')}</button>
          <output aria-live="polite">${l.qty}</output>
          <button type="button" data-action="qty" data-key="${l.key}" data-delta="1" aria-label="Increase quantity">${icon('plus')}</button>
        </div>` : html`<span class="var">Qty ${l.qty}</span>`}
      </div>
      <div class="line-side"><span class="price num">${money(l.unitPrice * l.qty)}</span>${editable ? html`<button type="button" class="rm" data-action="remove" data-key="${l.key}" aria-label="Remove ${l.name}">${icon('trash')}Remove</button>` : ''}</div>
    </li>`;
}

export function totalsBlock(t = totals()) {
  return html`
    <div class="totals">
      <div class="tr"><span>Subtotal</span><span class="num">${money(t.subtotal)}</span></div>
      <div class="tr"><span>Shipping</span><span class="num">${t.subtotal === 0 ? '—' : t.shipping === 0 ? 'Free' : money(t.shipping)}</span></div>
      <div class="tr disc" ${t.discount || (t.coupon && t.coupon.type === 'shipping') ? '' : 'hidden'}><span>Discount${t.coupon ? ` (${t.coupon.code})` : ''}</span><span class="num">${t.discount ? '−' + money(t.discount) : 'Free shipping'}</span></div>
      <div class="tr total"><span>Total</span><span class="num">${money(t.total)}</span></div>
    </div>`;
}

export const shipProgress = (t = totals()) => html`
  <div>
    <p class="muted" style="font-size:.85rem;margin-bottom:8px">${t.subtotal === 0 ? `Free shipping on orders over ${money(FREE_SHIP_AT)}.` : t.freeShipGap > 0 ? html`Add <b style="color:var(--text)">${money(t.freeShipGap)}</b> more for free shipping.` : 'You have unlocked free shipping.'}</p>
    <div class="ship-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.min(100, Math.round((t.subtotal / FREE_SHIP_AT) * 100))}"><i style="transform:scaleX(${Math.min(1, t.subtotal / FREE_SHIP_AT)})"></i></div>
  </div>`;

export function mountCartDrawer(host) {
  const scrim = toEl(html`<div class="scrim" data-close-cart></div>`);
  const drawer = toEl(html`
    <aside class="drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" aria-hidden="true">
      <div class="drawer-head"><h2 id="cart-title">Your cart</h2><button class="btn btn-icon" type="button" data-close-cart aria-label="Close cart">${icon('close')}</button></div>
      <div class="drawer-body" id="cart-body"></div>
      <div class="drawer-foot" id="cart-foot"></div>
    </aside>`);
  host.replaceChildren(scrim, drawer);
  let release, prev;

  const paint = () => {
    const body = $('#cart-body'), foot = $('#cart-foot');
    if (!state.cart.length) {
      body.innerHTML = String(html`<div class="empty"><span class="ico">${icon('cart')}</span><h3>Your cart is empty</h3><p>Browse keyboards, keycaps and switches, or design your own build.</p><div class="row wrap" style="justify-content:center"><a class="btn btn-primary" href="#/shop" data-close-cart>Start shopping</a><a class="btn btn-ghost" href="#/build" data-close-cart>Build a keyboard</a></div></div>`);
      foot.innerHTML = ''; foot.hidden = true; return;
    }
    foot.hidden = false;
    body.innerHTML = String(html`<ul>${state.cart.map((l) => lineItem(l))}</ul>`);
    foot.innerHTML = String(html`
      ${shipProgress()}
      ${totalsBlock()}
      <a class="btn btn-primary btn-lg btn-block" href="#/checkout" data-close-cart>Proceed to checkout</a>
      <div class="row between"><button class="btn btn-ghost btn-sm" type="button" data-close-cart>Continue shopping</button><a class="link" href="#/cart" data-close-cart style="font-size:.88rem">View full cart</a></div>`);
  };

  const api = {
    open() {
      prev = document.activeElement;
      paint();
      scrim.classList.add('open'); drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      release = trapFocus(drawer, api.close);
      setTimeout(() => (drawer.querySelector('.btn-icon') || drawer).focus(), 60);
    },
    close() {
      scrim.classList.remove('open'); drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; release?.(); release = null;
      prev?.focus?.();
    },
    isOpen: () => drawer.classList.contains('open'),
  };
  host.addEventListener('click', (e) => { if (e.target.closest('[data-close-cart]')) api.close(); });
  on(['cart', 'products'], () => { if (api.isOpen()) paint(); });
  return api;
}
