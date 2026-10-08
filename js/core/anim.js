import { $, $$, reduceMotion } from './dom.js';

let io;
export function reveal(root = document) {
  const items = $$('.reveal:not(.in)', root);
  if (!items.length) return;
  if (reduceMotion() || !('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('in')); return; }
  io ||= new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach((el) => io.observe(el));
}

// Animate numbers when they enter the viewport. Markup: <span data-count="10000" data-suffix="+">0</span>
export function counters(root = document) {
  const els = $$('[data-count]', root);
  const run = (el) => {
    const end = +el.dataset.count, suffix = el.dataset.suffix || '';
    if (reduceMotion()) { el.textContent = end.toLocaleString() + suffix; return; }
    const dur = 1600, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(end * e).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io2 = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); io2.unobserve(e.target); } }), { threshold: 0.4 });
  els.forEach((el) => io2.observe(el));
}

// Tween a displayed number (e.g. build total).
export function tweenNumber(el, to, fmt = (n) => Math.round(n).toString(), dur = 450) {
  const from = +el.dataset.v || 0;
  el.dataset.v = to;
  if (reduceMotion() || from === to) { el.textContent = fmt(to); return; }
  const t0 = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(from + (to - from) * e);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function bounceCart() {
  const btn = $('#cart-btn');
  if (!btn) return;
  btn.classList.remove('bounce'); void btn.offsetWidth; btn.classList.add('bounce');
  const c = $('.count', btn);
  if (c) { c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); }
}

// Product "flies" toward the cart icon. `source` is the element to clone (image box).
export function flyToCart(source) {
  const target = $('#cart-btn');
  if (!source || !target || reduceMotion()) { bounceCart(); return; }
  const a = source.getBoundingClientRect(), b = target.getBoundingClientRect();
  if (!a.width) { bounceCart(); return; }
  const ghost = source.cloneNode(true);
  const size = Math.min(110, a.width);
  Object.assign(ghost.style, { position: 'fixed', left: `${a.left + a.width / 2 - size / 2}px`, top: `${a.top + a.height / 2 - size / 2}px`, width: `${size}px`, height: `${size}px`, margin: 0, zIndex: 500, pointerEvents: 'none', borderRadius: '18px', background: 'rgba(16,19,28,.9)', border: '1px solid rgba(255,255,255,.2)', padding: '8px', overflow: 'hidden', boxShadow: '0 20px 50px -10px rgba(0,0,0,.8)' });
  $('#fly-layer').appendChild(ghost);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = ghost.animate([
    { transform: 'translate(0,0) scale(1)', opacity: 1 },
    { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 70}px) scale(.62)`, opacity: 1, offset: 0.55 },
    { transform: `translate(${dx}px, ${dy}px) scale(.08)`, opacity: 0.2 },
  ], { duration: 720, easing: 'cubic-bezier(.5,0,.3,1)' });
  anim.onfinish = () => { ghost.remove(); bounceCart(); };
}
