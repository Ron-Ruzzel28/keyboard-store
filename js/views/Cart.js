import { $, html, toEl, money } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { state, on, totals } from '../core/store.js';
import { lineItem, totalsBlock, shipProgress } from '../components/CartDrawer.js';
import { applyCoupon, clearCoupon } from '../core/cart.js';
import { toast } from '../components/ToastNotification.js';

export default async function Cart() {
  const el = toEl(html`<div class="container cart-page"><h1 style="font-size:clamp(2.2rem,5vw,3.4rem);margin-bottom:28px">Your cart</h1><div id="cart-slot"></div></div>`);
  const slot = $('#cart-slot', el);

  const paint = () => {
    if (!state.cart.length) {
      slot.innerHTML = String(html`<div class="empty panel"><span class="ico">${icon('cart')}</span><h3>Your cart is empty</h3><p>Nothing here yet. Explore the catalogue or put together a custom build.</p><div class="row wrap" style="justify-content:center"><a class="btn btn-primary" href="#/shop">Start shopping</a><a class="btn btn-ghost" href="#/build">Build a keyboard</a></div></div>`);
      return;
    }
    const t = totals();
    slot.innerHTML = String(html`
      <div class="cart-layout">
        <section class="panel" aria-label="Items"><ul>${state.cart.map((l) => lineItem(l))}</ul></section>
        <aside class="panel summary" aria-label="Order summary">
          <h2 style="font-size:1.25rem">Order summary</h2>
          ${shipProgress(t)}
          <form class="promo" id="promo" novalidate>
            <label class="sr-only" for="promo-code">Discount code</label>
            <input class="input" id="promo-code" name="code" placeholder="Discount code" value="${state.coupon || ''}" autocomplete="off" ${state.coupon ? 'readonly' : ''}>
            ${state.coupon ? html`<button class="btn btn-ghost" type="button" id="promo-clear">Remove</button>` : html`<button class="btn btn-ghost" type="submit">Apply</button>`}
          </form>
          <p class="faint" style="font-size:.8rem">Try KEYFORGE10, WELCOME500 or FREESHIP.</p>
          ${totalsBlock(t)}
          <a class="btn btn-primary btn-lg btn-block" href="#/checkout">Proceed to checkout</a>
          <a class="btn btn-ghost btn-block" href="#/shop">Continue shopping</a>
        </aside>
      </div>`);
  };
  paint();
  const off = on(['cart'], paint);
  el.addEventListener('submit', (e) => {
    if (e.target.id !== 'promo') return;
    e.preventDefault();
    const code = new FormData(e.target).get('code');
    if (!code.trim()) return;
    const r = applyCoupon(code);
    if (r.ok) toast('Discount applied', { body: `${r.code.code} is active.` });
    else toast('Code not applied', { body: r.reason, type: 'error' });
  });
  el.addEventListener('click', (e) => { if (e.target.id === 'promo-clear') clearCoupon(); });
  el._cleanup = off;
  void money;
  return el;
}
