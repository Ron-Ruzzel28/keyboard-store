import { state, commit, getProduct } from './store.js';

export const defaultSelection = (p) => Object.fromEntries((p.variants || []).map((g) => [g.type, g.options[0].name]));

export function priceFor(p, selection = defaultSelection(p)) {
  let price = p.price;
  (p.variants || []).forEach((g) => {
    const o = g.options.find((x) => x.name === selection[g.type]);
    if (o) price += o.price || 0;
  });
  return price;
}
export const variantLabel = (sel) => Object.values(sel || {}).join(' · ');

const lineKey = (id, sel) => id + '|' + Object.entries(sel || {}).sort().map(([k, v]) => `${k}=${v}`).join(',');

// Adds a catalogue product (with chosen variants) or a custom build. Returns { ok, reason }.
export function addToCart(productId, selection, qty = 1) {
  const p = getProduct(productId);
  if (!p) return { ok: false, reason: 'This product is no longer available.' };
  if (p.stock <= 0) return { ok: false, reason: 'This product is out of stock.' };
  const sel = selection || defaultSelection(p);
  const key = lineKey(productId, sel);
  const existing = state.cart.find((l) => l.key === key);
  const have = existing ? existing.qty : 0;
  if (have + qty > p.stock) return { ok: false, reason: `Only ${p.stock} left in stock.` };
  commit('cart', (s) => {
    if (existing) existing.qty += qty;
    else s.cart.push({ key, productId, name: p.name, image: p.image, selection: sel, qty, unitPrice: priceFor(p, sel), href: `/product/${p.id}` });
  });
  return { ok: true, product: p };
}

export function addCustomBuild(build) {
  const key = 'custom|' + JSON.stringify(build.selection);
  const existing = state.cart.find((l) => l.key === key);
  commit('cart', (s) => {
    if (existing) existing.qty += 1;
    else s.cart.push({ key, productId: 'custom', custom: true, name: build.name, image: build.image, selection: build.selection, qty: 1, unitPrice: build.price, href: '/build' });
  });
  return { ok: true };
}

export function setQty(key, qty) {
  const line = state.cart.find((l) => l.key === key);
  if (!line) return { ok: false };
  const p = line.custom ? null : getProduct(line.productId);
  if (p && qty > p.stock) return { ok: false, reason: `Only ${p.stock} left in stock.` };
  commit('cart', (s) => {
    if (qty <= 0) s.cart = s.cart.filter((l) => l.key !== key);
    else s.cart.find((l) => l.key === key).qty = Math.min(qty, 99);
  });
  return { ok: true };
}
export const removeLine = (key) => commit('cart', (s) => { s.cart = s.cart.filter((l) => l.key !== key); });

export function toggleWishlist(id) {
  let added = false;
  commit('wishlist', (s) => {
    const i = s.wishlist.indexOf(id);
    if (i >= 0) s.wishlist.splice(i, 1); else { s.wishlist.push(id); added = true; }
  });
  return added;
}

export function applyCoupon(code) {
  const c = state.discounts.find((d) => d.code === code.trim().toUpperCase() && d.active);
  if (!c) return { ok: false, reason: 'That code is not valid.' };
  const sub = state.cart.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  if (sub < c.minSubtotal) return { ok: false, reason: `Spend at least ₱${c.minSubtotal.toLocaleString()} to use ${c.code}.` };
  commit('cart', (s) => { s.coupon = c.code; });
  return { ok: true, code: c };
}
export const clearCoupon = () => commit('cart', (s) => { s.coupon = null; });
