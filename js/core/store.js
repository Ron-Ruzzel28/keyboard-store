// Minimal reactive store persisted to localStorage. Topics: cart, wishlist, user, settings, products, orders, reviews, discounts, users, addresses, payments.
import { PRODUCTS } from '../data/products.js';
import { REVIEWS, DISCOUNTS, seedOrders } from '../data/seed.js';

const KEY = 'keyforge:v1';
const subs = new Map();

const defaults = () => ({
  cart: [],
  wishlist: [],
  user: null,
  users: [{ id: 'u-admin', name: 'Admin', email: 'admin@keyforge.dev', password: 'admin123', phone: '', role: 'admin' }, { id: 'u-demo', name: 'Demo Typist', email: 'demo@keyforge.dev', password: 'demo1234', phone: '+63 917 555 0100', role: 'customer' }],
  settings: { sound: false, volume: 0.5, accent: 'cyan' },
  products: structuredClone(PRODUCTS),
  categories: ['keyboards', 'keycaps', 'switches'],
  orders: seedOrders(PRODUCTS),
  reviews: structuredClone(REVIEWS),
  discounts: structuredClone(DISCOUNTS),
  coupon: null,
  addresses: [],
  payments: [],
});

function load() {
  const base = defaults();
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && typeof saved === 'object') return { ...base, ...saved, settings: { ...base.settings, ...saved.settings } };
  } catch { /* storage blocked or corrupt: fall back to defaults */ }
  return base;
}

export const state = load();

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore quota/privacy mode */ }
}

export function on(topics, fn) {
  const list = Array.isArray(topics) ? topics : [topics];
  list.forEach((t) => { if (!subs.has(t)) subs.set(t, new Set()); subs.get(t).add(fn); });
  return () => list.forEach((t) => subs.get(t)?.delete(fn));
}

export function commit(topic, mutate) {
  mutate?.(state);
  persist();
  (Array.isArray(topic) ? topic : [topic]).forEach((t) => subs.get(t)?.forEach((fn) => fn(state)));
}

export function resetStore() {
  try { localStorage.removeItem(KEY); } catch { /* noop */ }
  location.reload();
}

// ---- Derived helpers ----
export const getProduct = (id) => state.products.find((p) => p.id === id);
export const cartCount = () => state.cart.reduce((n, l) => n + l.qty, 0);
export const inWishlist = (id) => state.wishlist.includes(id);

export const FREE_SHIP_AT = 5000;
export const SHIPPING = 150;
export function totals() {
  const subtotal = state.cart.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  let shipping = subtotal === 0 || subtotal >= FREE_SHIP_AT ? 0 : SHIPPING;
  let discount = 0;
  const c = state.coupon && state.discounts.find((d) => d.code === state.coupon && d.active);
  if (c && subtotal >= c.minSubtotal) {
    if (c.type === 'percent') discount = Math.round((subtotal * c.value) / 100);
    else if (c.type === 'fixed') discount = Math.min(c.value, subtotal);
    else if (c.type === 'shipping') shipping = 0;
  }
  return { subtotal, shipping, discount, total: Math.max(0, subtotal + shipping - discount), freeShipGap: Math.max(0, FREE_SHIP_AT - subtotal), coupon: c || null };
}
