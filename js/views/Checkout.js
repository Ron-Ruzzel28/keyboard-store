import { $, html, toEl, money, dateFmt } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { state, on, totals } from '../core/store.js';
import { checkoutForm } from '../components/CheckoutForm.js';
import { lineItem, totalsBlock } from '../components/CartDrawer.js';
import { toast } from '../components/ToastNotification.js';

export default async function Checkout() {
  if (!state.cart.length) {
    return toEl(html`<div class="container"><div class="empty panel" style="margin-top:40px"><span class="ico">${icon('cart')}</span><h3>Nothing to check out</h3><p>Add something to your cart first.</p><a class="btn btn-primary" href="#/shop">Browse products</a></div></div>`);
  }
  const el = toEl(html`<div class="container checkout-page"><h1 style="font-size:clamp(2.2rem,5vw,3.4rem);margin-bottom:28px">Checkout</h1><div class="checkout-layout"><div id="form-slot"></div><aside class="panel summary" aria-label="Order summary"><h2 style="font-size:1.25rem">Order summary</h2><ul id="sum-items"></ul><div id="sum-totals"></div></aside></div></div>`);
  const paintSummary = () => {
    $('#sum-items', el).innerHTML = String(html`${state.cart.map((l) => lineItem(l, { editable: false }))}`);
    $('#sum-totals', el).innerHTML = String(totalsBlock(totals()));
  };
  paintSummary();
  const off = on('cart', () => { if (state.cart.length) paintSummary(); });

  const form = checkoutForm({
    onDone(order) {
      off();
      const wrap = $('.checkout-layout', el);
      wrap.outerHTML = String(html`
        <section class="order-success panel" aria-labelledby="ok-h">
          <span class="ico-ok">${icon('check')}</span>
          <h2 id="ok-h">Thank you, ${order.customer.split(' ')[0]}. Your order is in.</h2>
          <p class="lead" style="margin-inline:auto;text-align:center">Order <b class="num">${order.id}</b> was placed on ${dateFmt(order.date)}. A confirmation will be sent to ${order.email}.</p>
          <dl class="success-grid"><div><dt>Total</dt><dd class="num">${money(order.total)}</dd></div><div><dt>Payment</dt><dd>${order.payment}</dd></div><div><dt>Ship to</dt><dd>${order.address.city}, ${order.address.province}</dd></div></dl>
          <div class="row wrap" style="justify-content:center"><a class="btn btn-primary" href="#/account?tab=track&order=${order.id}">Track order</a><a class="btn btn-ghost" href="#/shop">Continue shopping</a></div>
        </section>`);
      toast('Order placed', { body: `${order.id} is being prepared.` });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  });
  $('#form-slot', el).append(form);
  el._cleanup = off;
  return el;
}
