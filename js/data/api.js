// Data access layer. Components only talk to these async functions, so replacing the in-memory store with
// fetch() calls to a real backend later means rewriting this file only.
import { state, commit } from '../core/store.js';
import { sleep } from '../core/dom.js';

const latency = (ms = 320) => sleep(ms + Math.random() * 180);
const clone = (x) => structuredClone(x);

export async function listProducts() { await latency(); return clone(state.products); }
export async function getProduct(id) {
  await latency(220);
  const p = state.products.find((x) => x.id === id);
  if (!p) throw new Error('Product not found');
  return clone(p);
}
// Synchronous variant for instant, as-you-type search.
export function searchProducts(q, limit = 8) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const scored = [];
  for (const p of state.products) {
    const hay = [p.name, p.category, p.short, p.layout && ({ '60': '60%', '65': '65%', '75': '75%', tkl: 'tkl tenkeyless', '96': '96%', full: 'full size' }[p.layout]), p.switchType, p.material, p.theme, p.category === 'keyboards' ? 'keyboard' : p.category === 'keycaps' ? 'keycap set' : 'switch'].filter(Boolean).join(' ').toLowerCase();
    if (!terms.every((t) => hay.includes(t))) continue;
    let s = 0;
    terms.forEach((t) => { if (p.name.toLowerCase().includes(t)) s += 3; if (p.name.toLowerCase().startsWith(t)) s += 2; });
    scored.push([s + p.rating, p]);
  }
  return scored.sort((a, b) => b[0] - a[0]).slice(0, limit).map(([, p]) => p);
}

export async function saveProduct(p) {
  await latency(200);
  commit('products', (s) => {
    const i = s.products.findIndex((x) => x.id === p.id);
    if (i >= 0) s.products[i] = { ...s.products[i], ...p };
    else s.products.unshift(p);
  });
  return p;
}
export async function deleteProduct(id) {
  await latency(200);
  commit(['products', 'cart', 'wishlist'], (s) => {
    s.products = s.products.filter((p) => p.id !== id);
    s.wishlist = s.wishlist.filter((x) => x !== id);
    s.cart = s.cart.filter((l) => l.productId !== id);
  });
}

export async function placeOrder(order) {
  await latency(900);
  commit(['orders', 'cart'], (s) => {
    s.orders.unshift(order);
    s.cart = [];
    s.coupon = null;
    order.items.forEach((it) => {
      const p = s.products.find((x) => x.id === it.productId);
      if (p && p.stock != null) p.stock = Math.max(0, p.stock - it.qty);
    });
  });
  return order;
}
