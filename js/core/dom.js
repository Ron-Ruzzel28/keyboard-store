// Tiny DOM helpers. `html` escapes interpolated values by default; wrap trusted markup with raw().
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ENT[c]);

class Safe {
  constructor(s) { this.s = s; }
  toString() { return this.s; }
}
export const raw = (s) => new Safe(String(s ?? ''));
const val = (v) => (v instanceof Safe ? v.s : Array.isArray(v) ? v.map(val).join('') : v == null || v === false ? '' : esc(v));
export function html(strings, ...vals) {
  let out = '';
  strings.forEach((s, i) => { out += s; if (i < vals.length) out += val(vals[i]); });
  return new Safe(out);
}
export function toEl(safe) {
  const t = document.createElement('template');
  t.innerHTML = String(safe).trim();
  return t.content.firstElementChild;
}
export function toFrag(safe) {
  const t = document.createElement('template');
  t.innerHTML = String(safe);
  return t.content;
}

export const money = (n) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n || 0);
export const num = (n) => new Intl.NumberFormat('en-US').format(n || 0);
export const dateFmt = (d) => new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
export const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
export const debounce = (fn, ms = 160) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
export const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = () => window.matchMedia('(hover: none)').matches;
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const uid = (() => { let n = 0; return (p = 'id') => `${p}${++n}`; })();

// Focus trap for drawers / dialogs.
export function trapFocus(container, onEscape) {
  const sel = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
  const handler = (e) => {
    if (e.key === 'Escape') { onEscape?.(); return; }
    if (e.key !== 'Tab') return;
    const items = $$(sel, container).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  container.addEventListener('keydown', handler);
  return () => container.removeEventListener('keydown', handler);
}

// Form validation: returns true when valid and paints errors.
export function validate(form, rules) {
  let ok = true;
  let firstBad = null;
  for (const [name, check] of Object.entries(rules)) {
    const input = form.elements[name];
    if (!input) continue;
    const field = input.closest('.field');
    const msg = check(input.value.trim(), form);
    field?.classList.toggle('has-error', !!msg);
    const errEl = field?.querySelector('.error');
    if (errEl) errEl.textContent = msg || '';
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (msg) { ok = false; firstBad ||= input; }
  }
  firstBad?.focus();
  return ok;
}
export const isPhone = (v) => /^\+?[\d\s().-]+$/.test(v) && v.replace(/\D/g, '').length >= 7 && v.replace(/\D/g, '').length <= 15;
export const rules = {
  required: (label) => (v) => (v ? '' : `${label} is required.`),
  email: (v) => (!v ? 'Email is required.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid email address.'),
  phone: (v) => (!v ? 'Phone number is required.' : isPhone(v) ? '' : 'Enter a valid phone number.'),
  min: (label, n) => (v) => (v.length >= n ? '' : `${label} must be at least ${n} characters.`),
};
