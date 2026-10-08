import { $, $$ } from './core/dom.js';
import { state, commit, getProduct, resetStore } from './core/store.js';
import { route, start, navigate } from './core/router.js';
import { addToCart, setQty, removeLine, toggleWishlist, defaultSelection } from './core/cart.js';
import { flyToCart, reveal, bounceCart } from './core/anim.js';
import { mountNavbar } from './components/Navbar.js';
import { mountFooter } from './components/Footer.js';
import { mountCartDrawer } from './components/CartDrawer.js';
import { mountSearch } from './components/SearchOverlay.js';
import { toast } from './components/ToastNotification.js';

import Home from './views/Home.js';
import Products from './views/Products.js';
import ProductDetails from './views/ProductDetails.js';
import KeyboardBuilder from './views/KeyboardBuilder.js';
import Cart from './views/Cart.js';
import Checkout from './views/Checkout.js';
import { Login, Register } from './views/Auth.js';
import Account from './views/Account.js';
import AdminDashboard from './views/AdminDashboard.js';
import About from './views/About.js';
import Support from './views/Support.js';
import NotFound from './views/NotFound.js';

// ---- Routes ----
route('/', Home, { title: 'Premium Mechanical Keyboards' });
route('/shop', Products, { title: 'Shop' });
route('/product/:id', ProductDetails, { title: 'Product' });
route('/build', KeyboardBuilder, { title: 'Build Your Keyboard' });
route('/cart', Cart, { title: 'Cart' });
route('/checkout', Checkout, { title: 'Checkout' });
route('/login', Login, { title: 'Sign in' });
route('/register', Register, { title: 'Create account' });
route('/account', Account, { title: 'Account' });
route('/admin', AdminDashboard, { title: 'Admin' });
route('/about', About, { title: 'About' });
route('/support', Support, { title: 'Support' });
route('/404', NotFound, { notFound: true, title: 'Not found' });

// ---- Shell ----
const applyAccent = () => {
  const root = document.documentElement;
  root.dataset.accent = state.settings.accent || 'cyan';
};
applyAccent();
mountNavbar($('#navbar'));
mountFooter($('#footer'));
const cart = mountCartDrawer($('#cart-root'));
const search = mountSearch($('#search-root'));

// ---- Global actions (event delegation) ----
function addFrom(btn, id, selection, qty = 1) {
  const r = addToCart(id, selection, qty);
  if (!r.ok) { toast('Could not add to cart', { body: r.reason, type: 'error' }); return r; }
  const source = btn?.closest('.pcard')?.querySelector('.art-box') || btn?.closest('.pd')?.querySelector('.pd-art, .kb-wrap');
  flyToCart(source || btn);
  toast('Added to cart', { body: `${qty > 1 ? qty + ' × ' : ''}${r.product.name}` });
  return r;
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-action]');
  if (!t) return;
  const a = t.dataset.action;
  if (a === 'cart') { cart.open(); }
  else if (a === 'search') { search.open(); }
  else if (a === 'add') { addFrom(t, t.dataset.id); }
  else if (a === 'add-detail' || a === 'buy-now') {
    const d = t.closest('.pd')?._detail;
    if (!d) return;
    const r = addFrom(t, d.product.id, d.getSelection(), d.getQty());
    if (a === 'buy-now' && r.ok) navigate('/checkout');
  }
  else if (a === 'wish') {
    const id = t.dataset.id;
    const added = toggleWishlist(id);
    $$(`[data-action="wish"][data-id="${id}"]`).forEach((b) => { b.classList.toggle('on', added); b.setAttribute('aria-pressed', added); });
    toast(added ? 'Saved to wishlist' : 'Removed from wishlist', { body: getProduct(id)?.name, life: 2400 });
  }
  else if (a === 'qty') {
    const line = state.cart.find((l) => l.key === t.dataset.key);
    if (!line) return;
    const r = setQty(line.key, line.qty + +t.dataset.delta);
    if (!r.ok && r.reason) toast('Quantity limit', { body: r.reason, type: 'error' });
  }
  else if (a === 'remove') {
    const line = state.cart.find((l) => l.key === t.dataset.key);
    removeLine(t.dataset.key);
    if (line) toast('Removed from cart', { body: line.name, life: 2400, type: 'info' });
  }
});

// Shortcuts: "/" or Ctrl/Cmd+K opens search.
document.addEventListener('keydown', (e) => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
  if ((e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
    e.preventDefault(); search.isOpen() ? search.close() : search.open();
  }
});

window.addEventListener('keyforge:reset', resetStore);
window.keyforge = { reset: resetStore, state };
void commit; void reveal; void bounceCart; void defaultSelection;

start();
