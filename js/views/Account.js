import { $, $$, html, toEl, money, dateFmt, validate, rules, isPhone } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { state, commit, on } from '../core/store.js';
import { navigate, setQuery } from '../core/router.js';
import { toast } from '../components/ToastNotification.js';
import { confirmDialog } from '../components/ConfirmDialog.js';
import { productCard } from '../components/ProductCard.js';
import { artSVG } from '../components/ProductArt.js';
import { raw } from '../core/dom.js';
import { reveal } from '../core/anim.js';

const TABS = [['profile', 'Profile', 'user'], ['orders', 'Order history', 'box'], ['track', 'Track order', 'truck'], ['wishlist', 'Wishlist', 'heart'], ['addresses', 'Addresses', 'pin'], ['payments', 'Payment methods', 'card']];
const STEPS = ['Processing', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];

const field = (name, label, value = '', o = {}) => html`<div class="field ${o.full ? 'full' : ''}"><label for="ac-${name}">${label}</label><input class="input" id="ac-${name}" name="${name}" type="${o.type || 'text'}" value="${value}" autocomplete="${o.ac || 'off'}" placeholder="${o.ph || ''}"><span class="error" role="alert"></span></div>`;
const statusClass = (s) => (s === 'Delivered' ? 'ok' : s === 'Cancelled' ? 'bad' : s === 'Processing' ? '' : 'accent');

export function trackTimeline(order) {
  if (order.status === 'Cancelled') return html`<div class="notice error">${icon('alert')}<span>This order was cancelled. Any payment will be refunded within 5–7 business days.</span></div>`;
  const idx = STEPS.indexOf(order.status);
  return html`<ol class="timeline">${STEPS.map((s, i) => html`<li class="${i < idx ? 'done' : i === idx ? 'current' : ''}"><span class="dot">${i <= idx ? icon('check') : ''}</span><div><b>${s}</b><span class="faint">${i <= idx ? (i === idx ? 'Current status' : 'Completed') : 'Pending'}</span></div></li>`)}</ol>`;
}

export default async function Account({ query }) {
  if (!state.user) { navigate('/login?next=/account&reason=' + encodeURIComponent('Sign in to view your account.'), { replace: true }); return toEl(html`<div></div>`); }
  let tab = TABS.some((t) => t[0] === query.tab) ? query.tab : 'profile';
  const el = toEl(html`
    <div class="container account">
      <header class="acc-head"><div><h1 style="font-size:clamp(2rem,4.5vw,3rem)">Hello, ${state.user.name.split(' ')[0]}</h1><p class="muted">${state.user.email}</p></div>
        <div class="row wrap">${state.user.role === 'admin' ? html`<a class="btn btn-ghost" href="#/admin">${icon('chart')}Admin dashboard</a>` : ''}<button class="btn btn-ghost" type="button" id="logout">${icon('logout')}Sign out</button></div></header>
      <div class="acc-layout">
        <div class="tabs" role="tablist" aria-label="Account sections" aria-orientation="vertical">${TABS.map(([id, l, ic]) => html`<button role="tab" type="button" id="tab-${id}" aria-controls="panel" data-tab="${id}" aria-selected="${id === tab}">${icon(ic)}<span>${l}</span></button>`)}</div>
        <section class="tab-panel" id="panel" role="tabpanel" tabindex="0"></section>
      </div>
    </div>`);
  const panel = $('#panel', el);
  const mine = () => state.orders.filter((o) => o.customerId === state.user.id || o.email === state.user.email);

  const views = {
    profile() {
      return html`<h2>Profile</h2>
        <form id="prof" class="form-grid" novalidate>
          ${field('name', 'Full name', state.user.name, { ac: 'name', full: true })}
          ${field('email', 'Email', state.user.email, { type: 'email', ac: 'email' })}
          ${field('phone', 'Phone number', state.user.phone || '', { type: 'tel', ac: 'tel', ph: '+63 9XX XXX XXXX' })}
          <div class="full"><button class="btn btn-primary" type="submit">Save changes</button></div>
        </form>`;
    },
    orders() {
      const list = mine();
      if (!list.length) return html`<h2>Order history</h2><div class="empty"><span class="ico">${icon('box')}</span><h3>No orders yet</h3><p>When you place an order it will show up here, with live tracking.</p><a class="btn btn-primary" href="#/shop">Start shopping</a></div>`;
      return html`<h2>Order history</h2><ul class="orders">${list.map((o) => html`<li class="order"><details>
        <summary><span class="o-id num">${o.id}</span><span class="faint">${dateFmt(o.date)}</span><span class="badge ${statusClass(o.status)}">${o.status}</span><b class="num">${money(o.total)}</b></summary>
        <ul class="o-items">${o.items.map((it) => html`<li><span class="o-thumb">${it.image ? raw(artSVG(it.image)) : ''}</span><span>${it.name}${it.variant ? html`<small class="faint"> · ${it.variant}</small>` : ''}</span><span class="num">×${it.qty}</span><span class="num">${money(it.price * it.qty)}</span></li>`)}</ul>
        <div class="row between wrap"><span class="faint">Paid with ${o.payment}</span><a class="btn btn-ghost btn-sm" href="#/account?tab=track&order=${o.id}">Track order</a></div></details></li>`)}</ul>`;
    },
    track() {
      const list = mine();
      const sel = state.orders.find((o) => o.id === (query.order || list[0]?.id));
      return html`<h2>Track order</h2>
        <form id="trk" class="row wrap" novalidate style="align-items:flex-start">
          <div class="field" style="flex:1;min-width:200px"><label for="trk-id">Order number</label><input class="input" id="trk-id" name="id" value="${sel?.id || ''}" placeholder="KF-10400" autocomplete="off"><span class="error" role="alert"></span></div>
          <button class="btn btn-primary" type="submit" style="margin-top:28px">Track</button>
        </form>
        ${sel ? html`<div class="track-card"><div class="row between wrap"><div><b class="num">${sel.id}</b><div class="faint">Placed ${dateFmt(sel.date)} · ${sel.items.length} item${sel.items.length > 1 ? 's' : ''}</div></div><span class="badge ${statusClass(sel.status)}">${sel.status}</span></div>${trackTimeline(sel)}</div>` : html`<div class="empty"><span class="ico">${icon('truck')}</span><h3>Enter an order number</h3><p>Your order number starts with KF- and is in your confirmation email.</p></div>`}`;
    },
    wishlist() {
      const items = state.products.filter((p) => state.wishlist.includes(p.id));
      if (!items.length) return html`<h2>Wishlist</h2><div class="empty"><span class="ico">${icon('heart')}</span><h3>Your wishlist is empty</h3><p>Tap the heart on any product to save it for later.</p><a class="btn btn-primary" href="#/shop">Browse products</a></div>`;
      return html`<h2>Wishlist</h2><div class="product-grid cols2">${items.map((p, i) => productCard(p, i))}</div>`;
    },
    addresses() {
      return html`<h2>Saved addresses</h2>
        ${state.addresses.length ? html`<ul class="addr-list">${state.addresses.map((a) => html`<li class="addr"><div><b>${a.label}</b><p class="muted">${a.address}, ${a.city}, ${a.province} ${a.postal}</p></div><button type="button" class="btn btn-danger btn-sm" data-del-addr="${a.id}">${icon('trash')}Delete</button></li>`)}</ul>` : html`<div class="empty" style="padding:24px"><span class="ico">${icon('pin')}</span><h3>No saved addresses</h3><p>Add one so checkout is faster next time.</p></div>`}
        <h3 style="margin-top:28px">Add an address</h3>
        <form id="addr" class="form-grid" novalidate>
          ${field('label', 'Label', '', { ph: 'Home, Office…' })}${field('postal', 'Postal code', '', { ac: 'postal-code' })}
          ${field('address', 'Street address', '', { full: true, ac: 'street-address' })}${field('city', 'City', '', { ac: 'address-level2' })}${field('province', 'Province', '', { ac: 'address-level1' })}
          <div class="full"><button class="btn btn-primary" type="submit">Save address</button></div>
        </form>`;
    },
    payments() {
      return html`<h2>Payment methods</h2>
        <div class="notice">${icon('lock')}<span>Demo store: only the card brand and last 4 digits are kept, in this browser. Full card numbers are never stored.</span></div>
        ${state.payments.length ? html`<ul class="addr-list" style="margin-top:16px">${state.payments.map((p) => html`<li class="addr"><div class="row"><span class="ico-sm">${icon('card')}</span><div><b>${p.brand} ending ${p.last4}</b><p class="muted">Expires ${p.exp}</p></div></div><button type="button" class="btn btn-danger btn-sm" data-del-pay="${p.id}">${icon('trash')}Remove</button></li>`)}</ul>` : html`<div class="empty" style="padding:24px"><span class="ico">${icon('card')}</span><h3>No saved cards</h3><p>Add a card below to speed up checkout.</p></div>`}
        <h3 style="margin-top:28px">Add a card</h3>
        <form id="pay" class="form-grid" novalidate>
          ${field('num', 'Card number', '', { full: true, ph: '4242 4242 4242 4242', ac: 'cc-number' })}${field('exp', 'Expiry (MM/YY)', '', { ph: 'MM/YY', ac: 'cc-exp' })}
          <div class="field"><label for="ac-brand">Brand</label><select class="select" id="ac-brand" name="brand"><option>Visa</option><option>Mastercard</option><option>JCB</option></select><span class="error"></span></div>
          <div class="full"><button class="btn btn-primary" type="submit">Save card</button></div>
        </form>`;
    },
  };

  function paint(animate = true) {
    panel.innerHTML = String(views[tab]());
    panel.setAttribute('aria-labelledby', 'tab-' + tab);
    if (animate) { panel.classList.remove('enter'); void panel.offsetWidth; panel.classList.add('enter'); }
    $$('[data-tab]', el).forEach((b) => b.setAttribute('aria-selected', b.dataset.tab === tab));
    reveal(panel);
  }
  paint(false);

  $('.tabs', el).addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) { tab = b.dataset.tab; setQuery({ tab, order: '' }); query.tab = tab; delete query.order; paint(); } });
  $('.tabs', el).addEventListener('keydown', (e) => {
    const tabs = $$('[data-tab]', el); const i = tabs.findIndex((t) => t.dataset.tab === tab);
    if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); const n = tabs[(i + (e.key.endsWith('Down') || e.key.endsWith('Right') ? 1 : -1) + tabs.length) % tabs.length]; n.focus(); n.click(); }
  });
  $('#logout', el).addEventListener('click', () => { commit('user', (s) => { s.user = null; }); toast('Signed out'); navigate('/'); });

  panel.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    if (f.id === 'prof') {
      if (!validate(f, { name: (v) => (v.length >= 3 ? '' : 'Enter your full name.'), email: rules.email, phone: (v) => (!v || isPhone(v) ? '' : 'Enter a valid phone number.') })) return;
      const fd = new FormData(f);
      commit(['user', 'users'], (s) => {
        Object.assign(s.user, { name: fd.get('name').trim(), email: fd.get('email').trim(), phone: fd.get('phone').trim() });
        const u = s.users.find((x) => x.id === s.user.id); if (u) Object.assign(u, { name: s.user.name, email: s.user.email, phone: s.user.phone });
      });
      toast('Profile updated');
    } else if (f.id === 'trk') {
      const id = new FormData(f).get('id').trim().toUpperCase();
      const found = state.orders.find((o) => o.id === id);
      if (!found) { const fl = f.elements.id.closest('.field'); fl.classList.add('has-error'); fl.querySelector('.error').textContent = 'We could not find that order number.'; return; }
      query.order = id; setQuery({ tab: 'track', order: id }); paint(false);
    } else if (f.id === 'addr') {
      if (!validate(f, { label: rules.required('Label'), address: rules.required('Street address'), city: rules.required('City'), province: rules.required('Province'), postal: (v) => (/^\d{4}$/.test(v) ? '' : 'Enter a 4-digit postal code.') })) return;
      const fd = Object.fromEntries(new FormData(f));
      commit('addresses', (s) => { s.addresses.push({ id: 'a' + Date.now(), ...fd }); });
      toast('Address saved'); paint(false);
    } else if (f.id === 'pay') {
      const ok = validate(f, {
        num: (v) => (/^\d{13,19}$/.test(v.replace(/\s/g, '')) ? '' : 'Enter a valid card number.'),
        exp: (v) => (/^(0[1-9]|1[0-2])\/\d{2}$/.test(v) ? '' : 'Use the format MM/YY.'),
      });
      if (!ok) return;
      const fd = Object.fromEntries(new FormData(f));
      commit('payments', (s) => { s.payments.push({ id: 'p' + Date.now(), brand: fd.brand, last4: fd.num.replace(/\s/g, '').slice(-4), exp: fd.exp }); });
      toast('Card saved'); paint(false);
    }
  });
  panel.addEventListener('click', async (e) => {
    const da = e.target.closest('[data-del-addr]'), dp = e.target.closest('[data-del-pay]');
    if (da && await confirmDialog({ title: 'Delete this address?', body: 'You can add it again at any time.' })) { commit('addresses', (s) => { s.addresses = s.addresses.filter((a) => a.id !== da.dataset.delAddr); }); toast('Address deleted'); paint(false); }
    if (dp && await confirmDialog({ title: 'Remove this card?', body: 'Your card details will be removed from this browser.', confirmLabel: 'Remove' })) { commit('payments', (s) => { s.payments = s.payments.filter((a) => a.id !== dp.dataset.delPay); }); toast('Card removed'); paint(false); }
  });
  const off = on('wishlist', () => { if (tab === 'wishlist') paint(false); });
  el._cleanup = off;
  return el;
}
