import { $, $$, html, toEl, money, num, dateFmt, validate, rules, slug, raw } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { state, commit } from '../core/store.js';
import { navigate, setQuery } from '../core/router.js';
import { saveProduct, deleteProduct } from '../data/api.js';
import { toast } from '../components/ToastNotification.js';
import { confirmDialog, openModal } from '../components/ConfirmDialog.js';
import { lineChart, barChart, donut } from '../components/Charts.js';
import { seedCustomers } from '../data/seed.js';
import { counters, reveal } from '../core/anim.js';
import { LAYOUTS } from '../data/layouts.js';
import { SWITCH_TYPES, KEYCAP_SETS } from '../data/themes.js';
import { artSVG } from '../components/ProductArt.js';

const TABS = [['overview', 'Overview', 'chart'], ['products', 'Products', 'box'], ['inventory', 'Inventory', 'tag'], ['categories', 'Categories', 'keyboard'], ['orders', 'Orders', 'truck'], ['customers', 'Customers', 'users'], ['sales', 'Sales', 'chart'], ['discounts', 'Discounts', 'gift'], ['reviews', 'Reviews', 'msg']];
const STATUSES = ['Processing', 'Packed', 'Shipped', 'Out for delivery', 'Delivered', 'Cancelled'];
const cls = (s) => (s === 'Delivered' ? 'ok' : s === 'Cancelled' ? 'bad' : s === 'Processing' ? '' : 'accent');
const LOW = 10;

function analytics() {
  const live = state.orders.filter((o) => o.status !== 'Cancelled');
  const revenue = live.reduce((s, o) => s + o.total, 0);
  const byDay = new Map();
  const end = new Date('2026-10-08T00:00:00Z');
  for (let i = 29; i >= 0; i--) { const d = new Date(end.getTime() - i * 86400000); byDay.set(d.toISOString().slice(0, 10), 0); }
  live.forEach((o) => { const k = o.date.slice(0, 10); if (byDay.has(k)) byDay.set(k, byDay.get(k) + o.total); });
  const series = [...byDay].map(([k, v]) => ({ label: new Date(k).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }), v }));
  const prod = new Map(); const cat = new Map();
  live.forEach((o) => o.items.forEach((it) => { prod.set(it.name, (prod.get(it.name) || 0) + it.qty); const c = it.category || 'keyboards'; cat.set(c, (cat.get(c) || 0) + it.price * it.qty); }));
  const best = [...prod].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, v]) => ({ label, v }));
  const revCat = [...cat].map(([label, v]) => ({ label: label[0].toUpperCase() + label.slice(1), v }));
  const st = new Map(STATUSES.map((s) => [s, 0])); state.orders.forEach((o) => st.set(o.status, (st.get(o.status) || 0) + 1));
  const customers = new Set(state.orders.map((o) => o.customerId)).size + state.users.filter((u) => u.role === 'customer' && !state.orders.some((o) => o.customerId === u.id)).length;
  return { revenue, series, best, revCat, status: [...st].map(([label, v]) => ({ label, v })).filter((x) => x.v), customers, orders: state.orders.length, low: state.products.filter((p) => p.stock <= LOW) };
}

const table = (cols, rows, { empty = 'Nothing to show yet.' } = {}) => rows.length
  ? html`<div class="tbl-wrap"><table class="tbl"><thead><tr>${cols.map((c) => html`<th scope="col" ${c.num ? 'class="r"' : ''}>${c.h}</th>`)}</tr></thead><tbody>${rows}</tbody></table></div>`
  : html`<div class="empty"><span class="ico">${icon('box')}</span><h3>${empty}</h3></div>`;

function productForm(p) {
  const isNew = !p;
  const v = p || { name: '', category: 'keyboards', price: '', stock: '', description: '', short: '', featured: false, new: false, bestSeller: false, layout: '65', switchType: 'Linear', material: 'Aluminum', image: { kind: 'keyboard', layout: '65', hue: 190, theme: 'stealth', case: 'black' } };
  const form = toEl(html`
    <form novalidate id="pform">
      <h3>${isNew ? 'Add product' : 'Edit product'}</h3>
      <div class="form-grid" style="margin-top:16px">
        <div class="field full"><label for="p-name">Name</label><input class="input" id="p-name" name="name" value="${v.name}"><span class="error" role="alert"></span></div>
        <div class="field"><label for="p-cat">Category</label><select class="select" id="p-cat" name="category">${state.categories.map((c) => html`<option value="${c}" ${v.category === c ? 'selected' : ''}>${c[0].toUpperCase() + c.slice(1)}</option>`)}</select><span class="error"></span></div>
        <div class="field"><label for="p-price">Price (₱)</label><input class="input" id="p-price" name="price" type="number" min="1" step="1" value="${v.price}"><span class="error" role="alert"></span></div>
        <div class="field"><label for="p-stock">Stock</label><input class="input" id="p-stock" name="stock" type="number" min="0" step="1" value="${v.stock}"><span class="error" role="alert"></span></div>
        <div class="field"><label for="p-short">Short description</label><input class="input" id="p-short" name="short" value="${v.short}"><span class="error" role="alert"></span></div>
        <div class="field full"><label for="p-desc">Description</label><textarea class="textarea" id="p-desc" name="description">${v.description}</textarea><span class="error" role="alert"></span></div>
        <div class="field"><label for="p-layout">Layout (keyboards)</label><select class="select" id="p-layout" name="layout"><option value="">None</option>${Object.values(LAYOUTS).map((l) => html`<option value="${l.id}" ${v.layout === l.id ? 'selected' : ''}>${l.label}</option>`)}</select></div>
        <div class="field"><label for="p-sw">Switch type</label><select class="select" id="p-sw" name="switchType"><option value="">None</option>${Object.values(SWITCH_TYPES).map((s) => html`<option ${v.switchType === s.name ? 'selected' : ''}>${s.name}</option>`)}</select></div>
        <div class="field"><label for="p-mat">Material</label><select class="select" id="p-mat" name="material"><option value="">None</option>${['ABS', 'PBT', 'Resin', 'Aluminum', 'Polycarbonate', 'Brass'].map((m) => html`<option ${v.material === m ? 'selected' : ''}>${m}</option>`)}</select></div>
        <div class="field full row wrap" style="gap:20px"><label class="check"><input type="checkbox" name="featured" ${v.featured ? 'checked' : ''}><span>Featured</span></label><label class="check"><input type="checkbox" name="isNew" ${v.new ? 'checked' : ''}><span>New</span></label><label class="check"><input type="checkbox" name="bestSeller" ${v.bestSeller ? 'checked' : ''}><span>Best seller</span></label></div>
      </div>
      <div class="actions"><button class="btn btn-ghost" type="button" data-cancel>Cancel</button><button class="btn btn-primary" type="submit">${isNew ? 'Add product' : 'Save changes'}</button></div>
    </form>`);
  return { form, v, isNew };
}

export default async function AdminDashboard({ query }) {
  if (!state.user || state.user.role !== 'admin') {
    navigate('/login?next=/admin&reason=' + encodeURIComponent('Admin access required. Sign in with an admin account.'), { replace: true });
    return toEl(html`<div></div>`);
  }
  let tab = TABS.some((t) => t[0] === query.tab) ? query.tab : 'overview';
  let q = '';
  const el = toEl(html`
    <div class="container admin">
      <header class="acc-head"><div><h1 style="font-size:clamp(2rem,4.5vw,3rem)">Admin dashboard</h1><p class="muted">Manage the catalogue, orders and customers.</p></div><a class="btn btn-ghost" href="#/">${icon('home')}View store</a></header>
      <div class="admin-tabs" role="tablist" aria-label="Admin sections">${TABS.map(([id, l, ic]) => html`<button role="tab" type="button" data-tab="${id}" aria-selected="${id === tab}" aria-controls="apanel">${icon(ic)}<span>${l}</span></button>`)}</div>
      <section id="apanel" class="apanel" role="tabpanel" tabindex="0" aria-live="polite"></section>
    </div>`);
  const panel = $('#apanel', el);

  const views = {
    overview() {
      const a = analytics();
      const stat = (label, val, ico, fmt = (x) => num(x), warn) => html`<div class="astat ${warn ? 'warn' : ''}"><span class="ico-sm">${icon(ico)}</span><div><div class="astat-n num" data-count="${Math.round(val)}" ${fmt === money ? 'data-money="1"' : ''}>${fmt(val)}</div><div class="astat-l">${label}</div></div></div>`;
      return html`
        <div class="astats">${stat('Total sales', a.revenue, 'chart', money)}${stat('Orders', a.orders, 'truck')}${stat('Customers', a.customers, 'users')}${stat('Products', state.products.length, 'box')}${stat('Low stock items', a.low.length, 'alert', num, a.low.length > 0)}</div>
        <div class="chart-grid">
          <div class="panel wide"><h2>Sales over time</h2><p class="faint">Last 30 days, excluding cancelled orders</p>${lineChart(a.series, { fmt: (v) => '₱' + (v >= 1000 ? Math.round(v / 1000) + 'k' : Math.round(v)) })}</div>
          <div class="panel"><h2>Best-selling products</h2><p class="faint">Units sold</p>${barChart(a.best)}</div>
          <div class="panel"><h2>Revenue by category</h2>${donut(a.revCat, { fmt: money, center: '₱' + Math.round(a.revCat.reduce((s, x) => s + x.v, 0) / 1000) + 'k' })}</div>
          <div class="panel"><h2>Order status</h2>${donut(a.status, { center: String(state.orders.length) })}</div>
          <div class="panel"><h2>Needs attention</h2>${a.low.length ? html`<ul class="attn">${a.low.map((p) => html`<li><span>${p.name}</span><span class="badge ${p.stock === 0 ? 'bad' : 'warn'}">${p.stock === 0 ? 'Out of stock' : p.stock + ' left'}</span></li>`)}</ul>` : html`<p class="muted">All products are well stocked.</p>`}</div>
        </div>`;
    },
    products() {
      const list = state.products.filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.category.includes(q.toLowerCase()));
      return html`
        <div class="row between wrap atools"><div class="search-inline"><label class="sr-only" for="a-q">Search products</label>${icon('search')}<input class="input" id="a-q" type="search" placeholder="Search products" value="${q}"></div><button class="btn btn-primary" type="button" data-add>${icon('plus')}Add product</button></div>
        ${table([{ h: 'Product' }, { h: 'Category' }, { h: 'Price', num: 1 }, { h: 'Stock', num: 1 }, { h: 'Flags' }, { h: 'Actions', num: 1 }], list.map((p) => html`<tr>
          <td><div class="row"><span class="mini-art">${raw(artSVG(p.image))}</span><div><b>${p.name}</b><div class="faint">${p.id}</div></div></div></td><td>${p.category}</td><td class="r num">${money(p.price)}</td>
          <td class="r num"><span class="badge ${p.stock === 0 ? 'bad' : p.stock <= LOW ? 'warn' : 'ok'}">${p.stock}</span></td>
          <td>${[p.featured && 'Featured', p.new && 'New', p.bestSeller && 'Best seller'].filter(Boolean).join(', ') || '—'}</td>
          <td class="r"><div class="row" style="justify-content:flex-end;gap:6px"><button class="btn btn-ghost btn-sm" type="button" data-edit="${p.id}" aria-label="Edit ${p.name}">${icon('edit')}Edit</button><button class="btn btn-danger btn-sm" type="button" data-del="${p.id}" aria-label="Delete ${p.name}">${icon('trash')}</button></div></td></tr>`), { empty: 'No products match your search' })}`;
    },
    inventory() {
      return html`<p class="muted" style="margin-bottom:16px">Adjust stock levels directly. Items at ${LOW} or fewer are flagged as low stock.</p>
        ${table([{ h: 'Product' }, { h: 'Status' }, { h: 'Stock', num: 1 }], [...state.products].sort((a, b) => a.stock - b.stock).map((p) => html`<tr><td><b>${p.name}</b><div class="faint">${p.category}</div></td>
          <td><span class="badge ${p.stock === 0 ? 'bad' : p.stock <= LOW ? 'warn' : 'ok'}">${p.stock === 0 ? 'Out of stock' : p.stock <= LOW ? 'Low stock' : 'In stock'}</span></td>
          <td class="r"><div class="qty" role="group" aria-label="Stock for ${p.name}"><button type="button" data-stock="${p.id}" data-d="-1" aria-label="Decrease stock" ${p.stock <= 0 ? 'disabled' : ''}>${icon('minus')}</button><output>${p.stock}</output><button type="button" data-stock="${p.id}" data-d="1" aria-label="Increase stock">${icon('plus')}</button></div></td></tr>`))}`;
    },
    categories() {
      return html`<form id="catform" class="row wrap atools" novalidate style="align-items:flex-start"><div class="field" style="flex:1;min-width:220px"><label for="c-name">New category</label><input class="input" id="c-name" name="name" placeholder="e.g. accessories"><span class="error" role="alert"></span></div><button class="btn btn-primary" type="submit" style="margin-top:28px">${icon('plus')}Add category</button></form>
        ${table([{ h: 'Category' }, { h: 'Products', num: 1 }, { h: 'Actions', num: 1 }], state.categories.map((c) => { const n = state.products.filter((p) => p.category === c).length; return html`<tr><td><b style="text-transform:capitalize">${c}</b></td><td class="r num">${n}</td><td class="r"><button class="btn btn-danger btn-sm" type="button" data-delcat="${c}" ${n ? 'disabled title="Move or delete its products first"' : ''}>${icon('trash')}Delete</button></td></tr>`; }))}`;
    },
    orders() {
      return html`${table([{ h: 'Order' }, { h: 'Customer' }, { h: 'Date' }, { h: 'Total', num: 1 }, { h: 'Status' }], state.orders.slice(0, 40).map((o) => html`<tr><td class="num"><b>${o.id}</b><div class="faint">${o.items.length} item${o.items.length > 1 ? 's' : ''}</div></td><td>${o.customer}<div class="faint">${o.email}</div></td><td>${dateFmt(o.date)}</td><td class="r num">${money(o.total)}</td>
        <td><label class="sr-only" for="st-${o.id}">Status for ${o.id}</label><select class="select sm" id="st-${o.id}" data-order="${o.id}">${STATUSES.map((s) => html`<option ${s === o.status ? 'selected' : ''}>${s}</option>`)}</select></td></tr>`))}`;
    },
    customers() {
      const seeds = seedCustomers();
      const reg = state.users.filter((u) => u.role === 'customer').map((u) => ({ id: u.id, name: u.name, email: u.email, city: '—', joined: '2026-10-01' }));
      const all = [...reg, ...seeds].map((c) => { const os = state.orders.filter((o) => (o.customerId === c.id || o.email === c.email) && o.status !== 'Cancelled'); return { ...c, orders: os.length, spent: os.reduce((s, o) => s + o.total, 0) }; });
      return html`${table([{ h: 'Customer' }, { h: 'City' }, { h: 'Joined' }, { h: 'Orders', num: 1 }, { h: 'Spent', num: 1 }], all.map((c) => html`<tr><td><b>${c.name}</b><div class="faint">${c.email}</div></td><td>${c.city}</td><td>${dateFmt(c.joined)}</td><td class="r num">${c.orders}</td><td class="r num">${money(c.spent)}</td></tr>`))}`;
    },
    sales() {
      const a = analytics();
      const total = a.series.reduce((s, d) => s + d.v, 0);
      const days = a.series.filter((d) => d.v > 0).length;
      return html`<div class="astats"><div class="astat"><span class="ico-sm">${icon('chart')}</span><div><div class="astat-n num">${money(total)}</div><div class="astat-l">Last 30 days</div></div></div><div class="astat"><span class="ico-sm">${icon('tag')}</span><div><div class="astat-n num">${money(total / Math.max(1, days))}</div><div class="astat-l">Average per selling day</div></div></div><div class="astat"><span class="ico-sm">${icon('box')}</span><div><div class="astat-n num">${money(a.revenue / Math.max(1, state.orders.filter((o) => o.status !== 'Cancelled').length))}</div><div class="astat-l">Average order value</div></div></div></div>
        <div class="panel" style="margin-top:20px"><h2>Daily sales</h2>${lineChart(a.series, { fmt: (v) => '₱' + (v >= 1000 ? Math.round(v / 1000) + 'k' : Math.round(v)) })}</div>
        <div class="panel" style="margin-top:20px"><h2>Revenue by category</h2>${donut(a.revCat, { fmt: money, center: '₱' + Math.round(a.revCat.reduce((s, x) => s + x.v, 0) / 1000) + 'k' })}</div>`;
    },
    discounts() {
      return html`<div class="row between wrap atools"><p class="muted">Codes customers can apply in the cart.</p><button class="btn btn-primary" type="button" data-add-disc>${icon('plus')}Add discount</button></div>
        ${table([{ h: 'Code' }, { h: 'Type' }, { h: 'Value', num: 1 }, { h: 'Min. spend', num: 1 }, { h: 'Used', num: 1 }, { h: 'Active' }, { h: 'Actions', num: 1 }], state.discounts.map((d) => html`<tr><td><b class="num">${d.code}</b></td><td>${d.type === 'percent' ? 'Percent' : d.type === 'fixed' ? 'Fixed amount' : 'Free shipping'}</td><td class="r num">${d.type === 'percent' ? d.value + '%' : d.type === 'fixed' ? money(d.value) : '—'}</td><td class="r num">${money(d.minSubtotal)}</td><td class="r num">${d.uses}</td>
          <td><label class="toggle"><input type="checkbox" data-active="${d.id}" ${d.active ? 'checked' : ''} aria-label="Active: ${d.code}"><span class="track"></span></label></td>
          <td class="r"><button class="btn btn-danger btn-sm" type="button" data-deldisc="${d.id}" aria-label="Delete ${d.code}">${icon('trash')}</button></td></tr>`))}`;
    },
    reviews() {
      return html`${table([{ h: 'Customer' }, { h: 'Product' }, { h: 'Rating' }, { h: 'Review' }, { h: 'Status' }, { h: 'Actions', num: 1 }], state.reviews.map((r) => html`<tr><td><b>${r.name}</b><div class="faint">${dateFmt(r.date)}</div></td><td>${r.product}</td><td class="num">${'★'.repeat(r.rating)}<span class="faint">${'★'.repeat(5 - r.rating)}</span></td><td style="max-width:320px">${r.text}</td>
        <td><span class="badge ${r.status === 'published' ? 'ok' : 'warn'}">${r.status === 'published' ? 'Published' : 'Hidden'}</span></td>
        <td class="r"><div class="row" style="justify-content:flex-end;gap:6px"><button class="btn btn-ghost btn-sm" type="button" data-togrev="${r.id}">${r.status === 'published' ? 'Hide' : 'Publish'}</button><button class="btn btn-danger btn-sm" type="button" data-delrev="${r.id}" aria-label="Delete review by ${r.name}">${icon('trash')}</button></div></td></tr>`), { empty: 'No reviews yet' })}`;
    },
  };

  function paint() {
    panel.innerHTML = String(views[tab]());
    $$('[data-tab]', el).forEach((b) => b.setAttribute('aria-selected', b.dataset.tab === tab));
    panel.classList.remove('enter'); void panel.offsetWidth; panel.classList.add('enter');
    $$('[data-count]', panel).forEach((n) => { /* values already rendered; animate to them */
      const end = +n.dataset.count; const isMoney = n.dataset.money; const t0 = performance.now();
      const f = (x) => (isMoney ? money(x) : num(x));
      const tick = (t) => { const p = Math.min(1, (t - t0) / 900); n.textContent = f(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); else n.textContent = f(end); };
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(tick);
    });
    reveal(panel);
  }
  paint();
  void counters;

  $('.admin-tabs', el).addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) { tab = b.dataset.tab; q = ''; setQuery({ tab }); paint(); } });

  const openProduct = (p) => {
    const { form, isNew } = productForm(p);
    const m = openModal(form, { wide: true, label: isNew ? 'Add product' : 'Edit product' });
    form.querySelector('[data-cancel]').addEventListener('click', m.close);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const ok = validate(form, { name: (v) => (v.length >= 3 ? '' : 'Enter a product name (3+ characters).'), price: (v) => (+v > 0 ? '' : 'Enter a price above zero.'), stock: (v) => (v !== '' && +v >= 0 && Number.isInteger(+v) ? '' : 'Enter a whole number, 0 or more.'), short: rules.required('Short description'), description: (v) => (v.length >= 10 ? '' : 'Add a description (10+ characters).') });
      if (!ok) return;
      const fd = Object.fromEntries(new FormData(form));
      const base = p || { id: slug(fd.name), rating: 4.5, reviews: 0, variants: [], specifications: {}, addedAt: 99, image: fd.category === 'keycaps' ? { kind: 'keycaps', theme: 'stealth' } : fd.category === 'switches' ? { kind: 'switch', switchType: (fd.switchType || 'Linear').toLowerCase(), hue: 190 } : { kind: 'keyboard', layout: fd.layout || '65', hue: 190, theme: 'stealth', case: 'black' } };
      if (!p && state.products.some((x) => x.id === base.id)) { const f = form.elements.name.closest('.field'); f.classList.add('has-error'); f.querySelector('.error').textContent = 'A product with this name already exists.'; return; }
      const btn = form.querySelector('[type=submit]'); btn.disabled = true;
      await saveProduct({ ...base, name: fd.name.trim(), category: fd.category, price: +fd.price, stock: +fd.stock, short: fd.short.trim(), description: fd.description.trim(), layout: fd.layout || undefined, switchType: fd.switchType || undefined, material: fd.material || undefined, featured: !!fd.featured, new: !!fd.isNew, bestSeller: !!fd.bestSeller });
      m.close(); toast(isNew ? 'Product added' : 'Product updated', { body: fd.name }); paint();
    });
  };

  el.addEventListener('click', async (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.hasAttribute('data-add')) openProduct(null);
    else if (t.dataset.edit) openProduct(state.products.find((p) => p.id === t.dataset.edit));
    else if (t.dataset.del) {
      const p = state.products.find((x) => x.id === t.dataset.del);
      if (await confirmDialog({ title: `Delete “${p.name}”?`, body: 'It will be removed from the catalogue, carts and wishlists. This cannot be undone.' })) { await deleteProduct(p.id); toast('Product deleted', { body: p.name }); paint(); }
    } else if (t.dataset.stock) {
      commit('products', (s) => { const p = s.products.find((x) => x.id === t.dataset.stock); p.stock = Math.max(0, p.stock + +t.dataset.d); }); paint();
    } else if (t.dataset.delcat) {
      if (await confirmDialog({ title: `Delete category “${t.dataset.delcat}”?`, body: 'This category has no products, so nothing else will be affected.' })) { commit('products', (s) => { s.categories = s.categories.filter((c) => c !== t.dataset.delcat); }); toast('Category deleted'); paint(); }
    } else if (t.hasAttribute('data-add-disc')) {
      const form = toEl(html`<form novalidate><h3>Add discount</h3><div class="form-grid" style="margin-top:16px"><div class="field"><label for="d-code">Code</label><input class="input" id="d-code" name="code" placeholder="SUMMER15"><span class="error" role="alert"></span></div><div class="field"><label for="d-type">Type</label><select class="select" id="d-type" name="type"><option value="percent">Percent off</option><option value="fixed">Fixed amount off</option><option value="shipping">Free shipping</option></select><span class="error"></span></div><div class="field"><label for="d-val">Value</label><input class="input" id="d-val" name="value" type="number" min="0" value="10"><span class="error" role="alert"></span></div><div class="field"><label for="d-min">Minimum spend (₱)</label><input class="input" id="d-min" name="min" type="number" min="0" value="0"><span class="error"></span></div></div><div class="actions"><button class="btn btn-ghost" type="button" data-cancel>Cancel</button><button class="btn btn-primary" type="submit">Add discount</button></div></form>`);
      const m = openModal(form, { label: 'Add discount' });
      form.querySelector('[data-cancel]').addEventListener('click', m.close);
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        if (!validate(form, { code: (v) => (/^[A-Za-z0-9]{3,16}$/.test(v) ? (state.discounts.some((d) => d.code === v.toUpperCase()) ? 'That code already exists.' : '') : 'Use 3–16 letters or numbers.'), value: (v, f) => (f.elements.type.value === 'shipping' || (+v > 0 && (f.elements.type.value !== 'percent' || +v <= 100)) ? '' : 'Enter a valid value.') })) return;
        const fd = Object.fromEntries(new FormData(form));
        commit('discounts', (s) => { s.discounts.push({ id: 'd' + Date.now(), code: fd.code.toUpperCase(), type: fd.type, value: +fd.value, minSubtotal: +fd.min || 0, active: true, uses: 0 }); });
        m.close(); toast('Discount added', { body: fd.code.toUpperCase() }); paint();
      });
    } else if (t.dataset.deldisc) {
      const d = state.discounts.find((x) => x.id === t.dataset.deldisc);
      if (await confirmDialog({ title: `Delete code ${d.code}?`, body: 'Customers will no longer be able to use it.' })) { commit('discounts', (s) => { s.discounts = s.discounts.filter((x) => x.id !== d.id); }); toast('Discount deleted'); paint(); }
    } else if (t.dataset.togrev) {
      commit('reviews', (s) => { const r = s.reviews.find((x) => x.id === t.dataset.togrev); r.status = r.status === 'published' ? 'hidden' : 'published'; }); paint();
    } else if (t.dataset.delrev) {
      if (await confirmDialog({ title: 'Delete this review?', body: 'It will be permanently removed from the store.' })) { commit('reviews', (s) => { s.reviews = s.reviews.filter((x) => x.id !== t.dataset.delrev); }); toast('Review deleted'); paint(); }
    }
  });
  el.addEventListener('change', (e) => {
    if (e.target.dataset.order) { commit('orders', (s) => { s.orders.find((o) => o.id === e.target.dataset.order).status = e.target.value; }); toast('Order updated', { body: `${e.target.dataset.order} is now ${e.target.value}.` }); }
    if (e.target.dataset.active) commit('discounts', (s) => { const d = s.discounts.find((x) => x.id === e.target.dataset.active); d.active = e.target.checked; });
  });
  el.addEventListener('input', (e) => { if (e.target.id === 'a-q') { q = e.target.value; const pos = e.target.selectionStart; paint(); const i = $('#a-q', el); i.focus(); i.setSelectionRange(pos, pos); } });
  el.addEventListener('submit', (e) => {
    if (e.target.id !== 'catform') return;
    e.preventDefault();
    if (!validate(e.target, { name: (v) => (v.length < 3 ? 'Enter a category name (3+ characters).' : state.categories.includes(slug(v)) ? 'That category already exists.' : '') })) return;
    const name = slug(new FormData(e.target).get('name'));
    commit('products', (s) => { s.categories.push(name); }); toast('Category added', { body: name }); paint();
  });
  void KEYCAP_SETS;
  return el;
}
