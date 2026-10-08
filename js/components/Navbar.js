import { $, $$, html, toEl } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { state, on, cartCount } from '../core/store.js';
import { onNavigate, currentPath } from '../core/router.js';

const LINKS = [
  ['/', 'Home'], ['/shop?cat=keyboards', 'Keyboards'], ['/shop?cat=keycaps', 'Keycaps'], ['/shop?cat=switches', 'Switches'], ['/build', 'Build Your Keyboard'], ['/about', 'About'],
];

function isCurrent(href, path, query) {
  const [p, qs] = href.split('?');
  if (p !== path) return false;
  if (!qs) return true;
  return new URLSearchParams(qs).get('cat') === (query.cat || '');
}

export function mountNavbar(host) {
  const links = (cls = '') => LINKS.map(([h, l]) => html`<a href="#${h}" data-href="${h}" class="${cls}">${l}</a>`);
  const el = toEl(html`
    <header class="nav" id="nav">
      <nav class="container nav-inner" aria-label="Main">
        <a class="logo" href="#/" aria-label="KEYFORGE home">
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="6" width="24" height="16" rx="5"/><path d="M9 11h2M14 11h2M19 11h2M11 16.500h10"/><path d="M10 26h12"/></svg>
          <span>KEYFORGE</span>
        </a>
        <div class="nav-links">${links()}</div>
        <div class="nav-actions">
          <button class="btn-icon btn" type="button" id="search-btn" data-action="search" aria-label="Search products (press /)">${icon('search')}</button>
          <a class="btn-icon btn hide-m" href="#/account?tab=wishlist" aria-label="Wishlist" style="position:relative">${icon('heart')}<span class="count" id="wish-count" data-n="0"></span></a>
          <a class="btn-icon btn hide-m" href="#/account" aria-label="Account" id="account-link">${icon('user')}</a>
          <button class="btn-icon btn" type="button" id="cart-btn" data-action="cart" aria-label="Open cart" aria-haspopup="dialog">${icon('cart')}<span class="count" id="cart-count" data-n="0"></span></button>
          <button class="btn-icon btn nav-burger" type="button" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="nav-mobile">${icon('menu')}</button>
        </div>
      </nav>
    </header>`);
  const mobile = toEl(html`
    <div class="nav-mobile" id="nav-mobile">
      ${links()}
      <a href="#/account?tab=wishlist" data-href="/account">Wishlist</a>
      <a href="#/account" data-href="/account">Account</a>
    </div>`);
  host.replaceChildren(el, mobile);

  const burger = $('#burger');
  const setMenu = (open) => {
    mobile.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    burger.innerHTML = String(icon(open ? 'close' : 'menu'));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!mobile.classList.contains('open')));
  mobile.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && mobile.classList.contains('open')) { setMenu(false); burger.focus(); } });

  const onScroll = () => el.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const counts = () => {
    const c = cartCount();
    $('#cart-count').textContent = c || ''; $('#cart-count').dataset.n = c;
    const w = state.wishlist.length;
    $('#wish-count').textContent = w || ''; $('#wish-count').dataset.n = w;
    $('#account-link').setAttribute('aria-label', state.user ? `Account (${state.user.name})` : 'Sign in');
    $('#account-link').setAttribute('href', state.user ? '#/account' : '#/login');
  };
  const mark = ({ path, query } = { path: currentPath(), query: {} }) => {
    $$('[data-href]', host).forEach((a) => {
      if (isCurrent(a.dataset.href, path, query || {})) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    setMenu(false);
  };
  on(['cart', 'wishlist', 'user'], counts);
  onNavigate(mark);
  counts(); mark({ path: currentPath(), query: {} });
}
