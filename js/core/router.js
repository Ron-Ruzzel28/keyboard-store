// Hash router with animated page transitions. Views: (ctx) => Element | Promise<Element>. A view may set el._cleanup.
import { $, reduceMotion } from './dom.js';

const routes = [];
let current = null;
let token = 0;
const listeners = new Set();

export function route(pattern, view, meta = {}) {
  const keys = [];
  const re = new RegExp('^' + pattern.replace(/:([a-z]+)/gi, (_, k) => { keys.push(k); return '([^/]+)'; }) + '/?$');
  routes.push({ re, keys, view, meta });
}
export const onNavigate = (fn) => listeners.add(fn);

export function parseHash() {
  const raw = location.hash.slice(1) || '/';
  const [path, qs = ''] = raw.split('?');
  const query = Object.fromEntries(new URLSearchParams(qs));
  return { path: path || '/', query, raw };
}
export function navigate(to, { replace = false } = {}) {
  const target = '#' + (to.startsWith('/') ? to : '/' + to);
  if (location.hash === target) { render(); return; }
  if (replace) location.replace(target); else location.hash = target;
}
export function setQuery(patch, { replace = true } = {}) {
  const { path, query } = parseHash();
  const q = new URLSearchParams({ ...query, ...patch });
  [...q.keys()].forEach((k) => { if (q.get(k) === '' || q.get(k) == null) q.delete(k); });
  const s = q.toString();
  const target = '#' + path + (s ? '?' + s : '');
  if (replace) history.replaceState(null, '', target); else location.hash = target;
}

async function render() {
  const my = ++token;
  const main = $('#main');
  const { path, query } = parseHash();
  let match = null, params = {};
  for (const r of routes) {
    const m = path.match(r.re);
    if (m) { match = r; r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1]))); break; }
  }
  match ||= routes.find((r) => r.meta.notFound);
  const animate = !reduceMotion() && main.childElementCount > 0;
  if (animate) { main.classList.remove('page-in'); main.classList.add('page-out'); await new Promise((r) => setTimeout(r, 150)); }
  if (my !== token) return;
  current?._cleanup?.();
  main.innerHTML = '';
  let el;
  try { el = await match.view({ params, query, path }); }
  catch (err) { console.error(err); el = (await import('../views/NotFound.js')).errorView(err); }
  if (my !== token) return;
  main.replaceChildren(el);
  current = el;
  main.classList.remove('page-out');
  if (!reduceMotion()) { void main.offsetWidth; main.classList.add('page-in'); }
  const scrollTo = parseHash().query.at;
  if (scrollTo && document.getElementById(scrollTo)) document.getElementById(scrollTo).scrollIntoView({ behavior: 'smooth', block: 'start' });
  else window.scrollTo({ top: 0, behavior: 'instant' });
  document.title = (match.meta.title ? (typeof match.meta.title === 'function' ? match.meta.title(params) : match.meta.title) + ' · ' : '') + 'KEYFORGE';
  main.focus({ preventScroll: true });
  listeners.forEach((fn) => fn({ path, query, params }));
}

export function start() {
  window.addEventListener('hashchange', render);
  render();
}
export const currentPath = () => parseHash().path;
