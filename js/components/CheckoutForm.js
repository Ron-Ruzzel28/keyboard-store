// Three-step checkout: customer → shipping → payment, with animated step transitions and validation.
import { $, $$, html, toEl, validate, rules, money } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { state } from '../core/store.js';
import { placeOrder } from '../data/api.js';
import { totals } from '../core/store.js';
import { navigate } from '../core/router.js';
import { toast } from './ToastNotification.js';

const PAY = [
  ['card', 'Credit/Debit Card', 'card', 'Visa, Mastercard, JCB'],
  ['gcash', 'GCash', 'phone', 'Pay with your GCash wallet'],
  ['maya', 'Maya', 'phone', 'Pay with your Maya wallet'],
  ['cod', 'Cash on Delivery', 'cash', 'Pay when your order arrives'],
];
const PROVINCES = ['Metro Manila', 'Cavite', 'Laguna', 'Rizal', 'Bulacan', 'Pampanga', 'Cebu', 'Davao del Sur', 'Iloilo', 'Benguet', 'Batangas', 'Pangasinan', 'Negros Occidental', 'Misamis Oriental', 'Other'];

const luhn = (n) => { let s = 0, alt = false; for (let i = n.length - 1; i >= 0; i--) { let d = +n[i]; if (alt) { d *= 2; if (d > 9) d -= 9; } s += d; alt = !alt; } return s % 10 === 0; };
const field = (name, label, { type = 'text', ac, ph = '', full = false, value = '', hint } = {}) => html`<div class="field ${full ? 'full' : ''}"><label for="f-${name}">${label}</label><input class="input" id="f-${name}" name="${name}" type="${type}" ${ac ? html`autocomplete="${ac}"` : ''} placeholder="${ph}" value="${value}" aria-describedby="e-${name}">${hint ? html`<span class="hint">${hint}</span>` : ''}<span class="error" id="e-${name}" role="alert"></span></div>`;

export function checkoutForm({ onDone }) {
  const u = state.user;
  const saved = state.addresses[0];
  const data = { pay: 'card' };
  let step = 0;
  const el = toEl(html`
    <div class="checkout-main">
      <ol class="stepper" aria-label="Checkout steps">${['Customer', 'Shipping', 'Payment'].map((l, i) => html`<li><button type="button" data-goto="${i}" ${i ? 'disabled' : 'aria-current="step"'}><span class="n">${i + 1}</span><span class="l">${l}</span></button></li>`)}</ol>
      <div class="steps">
        <form class="step panel" data-s="0" novalidate aria-label="Customer information">
          <h2>Customer information</h2>
          <div class="form-grid">
            ${field('name', 'Full name', { ac: 'name', full: true, value: u?.name || '' })}
            ${field('email', 'Email', { type: 'email', ac: 'email', value: u?.email || '' })}
            ${field('phone', 'Phone number', { type: 'tel', ac: 'tel', ph: '+63 9XX XXX XXXX', value: u?.phone || '' })}
          </div>
          ${!u ? html`<p class="muted" style="font-size:.9rem">Have an account? <a class="link" href="#/login?next=/checkout">Sign in</a> to prefill your details.</p>` : ''}
          <div class="row between"><a class="btn btn-ghost" href="#/cart">${icon('arrowLeft')}Back to cart</a><button class="btn btn-primary" type="submit">Continue to shipping ${icon('arrow')}</button></div>
        </form>
        <form class="step panel" data-s="1" novalidate hidden aria-label="Shipping address">
          <h2>Shipping address</h2>
          <div class="form-grid">
            ${field('address', 'Street address', { ac: 'street-address', full: true, value: saved?.address || '' })}
            ${field('city', 'City', { ac: 'address-level2', value: saved?.city || '' })}
            <div class="field"><label for="f-province">Province</label><select class="select" id="f-province" name="province" autocomplete="address-level1"><option value="">Select province</option>${PROVINCES.map((p) => html`<option ${saved?.province === p ? 'selected' : ''}>${p}</option>`)}</select><span class="error" role="alert"></span></div>
            ${field('postal', 'Postal code', { ac: 'postal-code', value: saved?.postal || '' })}
            <div class="field"><label for="f-country">Country</label><select class="select" id="f-country" name="country" autocomplete="country-name"><option>Philippines</option><option>Singapore</option><option>Malaysia</option><option>United States</option></select><span class="error" role="alert"></span></div>
          </div>
          <div class="row between"><button class="btn btn-ghost" type="button" data-back>${icon('arrowLeft')}Back</button><button class="btn btn-primary" type="submit">Continue to payment ${icon('arrow')}</button></div>
        </form>
        <form class="step panel" data-s="2" novalidate hidden aria-label="Payment">
          <h2>Payment</h2>
          <fieldset class="pay-options"><legend class="sr-only">Payment method</legend>
            ${PAY.map(([id, name, ic, sub]) => html`<label class="pay-opt"><input type="radio" name="pay" value="${id}" ${id === 'card' ? 'checked' : ''}><span class="pay-card">${icon(ic)}<b>${name}</b><small>${sub}</small></span></label>`)}
          </fieldset>
          <div class="pay-detail" data-for="card">
            <div class="form-grid">
              ${field('cardname', 'Name on card', { ac: 'cc-name', full: true })}
              ${field('cardnum', 'Card number', { ac: 'cc-number', ph: '4242 4242 4242 4242', full: true, hint: 'Demo only. Card details are never stored or sent.' })}
              ${field('exp', 'Expiry (MM/YY)', { ac: 'cc-exp', ph: 'MM/YY' })}
              ${field('cvc', 'CVC', { ac: 'cc-csc', ph: '123' })}
            </div>
          </div>
          <div class="pay-detail" data-for="wallet" hidden>
            <div class="form-grid">${field('wallet', 'Mobile number linked to wallet', { type: 'tel', ac: 'tel', ph: '09XX XXX XXXX', full: true, hint: 'You would be redirected to approve the payment. This is a simulation.' })}</div>
          </div>
          <div class="pay-detail" data-for="cod" hidden><div class="notice">${icon('info')}<span>Pay the courier in cash when your order arrives. Please have the exact amount ready.</span></div></div>
          <div class="row between"><button class="btn btn-ghost" type="button" data-back>${icon('arrowLeft')}Back</button><button class="btn btn-primary btn-lg" type="submit" id="place">${icon('lock')}Place order</button></div>
        </form>
      </div>
    </div>`);

  const show = (n) => {
    step = n;
    $$('.step', el).forEach((s) => {
      const on = +s.dataset.s === n;
      s.hidden = !on;
      if (on) { s.classList.remove('enter'); void s.offsetWidth; s.classList.add('enter'); }
    });
    $$('[data-goto]', el).forEach((b, i) => { b.disabled = i > n; b.classList.toggle('done', i < n); if (i === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 100), behavior: 'smooth' });
    $('.step:not([hidden]) input, .step:not([hidden]) select', el)?.focus({ preventScroll: true });
  };
  el.addEventListener('click', (e) => {
    if (e.target.closest('[data-back]')) show(step - 1);
    const g = e.target.closest('[data-goto]'); if (g && !g.disabled) show(+g.dataset.goto);
  });
  el.addEventListener('change', (e) => {
    if (e.target.name !== 'pay') return;
    data.pay = e.target.value;
    const k = data.pay === 'card' ? 'card' : data.pay === 'cod' ? 'cod' : 'wallet';
    $$('.pay-detail', el).forEach((d) => (d.hidden = d.dataset.for !== k));
  });

  const forms = $$('.step', el);
  forms[0].addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate(forms[0], { name: (v) => (v.length >= 3 ? '' : 'Enter your full name.'), email: rules.email, phone: rules.phone })) return;
    Object.assign(data, Object.fromEntries(new FormData(forms[0]))); show(1);
  });
  forms[1].addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate(forms[1], { address: rules.required('Street address'), city: rules.required('City'), province: rules.required('Province'), postal: (v) => (/^\d{4}$/.test(v) ? '' : 'Enter a 4-digit postal code.') })) return;
    Object.assign(data, Object.fromEntries(new FormData(forms[1]))); show(2);
  });
  forms[2].addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = forms[2];
    if (data.pay === 'card') {
      const ok = validate(f, {
        cardname: rules.required('Name on card'),
        cardnum: (v) => { const d = v.replace(/\s/g, ''); return /^\d{13,19}$/.test(d) && luhn(d) ? '' : 'Enter a valid card number.'; },
        exp: (v) => { const m = v.match(/^(\d{2})\/(\d{2})$/); if (!m || +m[1] < 1 || +m[1] > 12) return 'Use the format MM/YY.'; const end = new Date(2000 + +m[2], +m[1], 0); return end >= new Date() ? '' : 'This card has expired.'; },
        cvc: (v) => (/^\d{3,4}$/.test(v) ? '' : 'Enter the 3 or 4 digit code.'),
      });
      if (!ok) return;
    } else if (data.pay !== 'cod') {
      if (!validate(f, { wallet: rules.phone })) return;
    }
    const btn = $('#place', el);
    btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Processing…';
    try {
      const t = totals();
      const payName = PAY.find((p) => p[0] === data.pay)[1];
      const order = await placeOrder({
        id: 'KF-' + (10500 + state.orders.length),
        customerId: state.user?.id || 'guest', customer: data.name, email: data.email, phone: data.phone,
        date: new Date().toISOString(), status: 'Processing', payment: payName,
        address: { address: data.address, city: data.city, province: data.province, postal: data.postal, country: data.country },
        items: state.cart.map((l) => ({ productId: l.productId, name: l.name, category: l.custom ? 'keyboards' : (state.products.find((p) => p.id === l.productId)?.category || 'keyboards'), qty: l.qty, price: l.unitPrice, variant: Object.values(l.selection || {}).join(' · '), image: l.image })),
        subtotal: t.subtotal, shipping: t.shipping, discount: t.discount, total: t.total, city: data.city,
      });
      onDone(order);
    } catch (err) {
      console.error(err);
      toast('Payment failed', { body: 'Something went wrong. You have not been charged. Please try again.', type: 'error' });
      btn.disabled = false; btn.innerHTML = String(html`${icon('lock')}Place order`);
    }
  });
  void navigate; void money;
  return el;
}
