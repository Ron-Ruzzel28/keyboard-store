import { html, toEl, dateFmt, reduceMotion } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { stars } from './ProductCard.js';

const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export const reviewCard = (r, { showProduct = true } = {}) => html`
  <article class="review">
    <header>
      <span class="avatar" style="--h:${r.hue ?? 190}" aria-hidden="true">${initials(r.name)}</span>
      <div><strong>${r.name}</strong><span class="badge ok">${icon('check')}Verified Purchase</span></div>
    </header>
    ${stars(r.rating, { size: 15, showNum: false })}
    <p>${r.text}</p>
    <footer class="faint">${showProduct ? html`<span>${r.product}</span> · ` : ''}<time datetime="${r.date}">${dateFmt(r.date)}</time></footer>
  </article>`;

// Carousel: scroll-snap track with prev/next, dots and optional autoplay (paused on hover/focus and for reduced motion).
export function reviewsCarousel(reviews) {
  const el = toEl(html`
    <div class="carousel" role="region" aria-roledescription="carousel" aria-label="Customer reviews">
      <div class="carousel-track" tabindex="0">${reviews.map((r) => html`<div class="slide">${reviewCard(r)}</div>`)}</div>
      <div class="carousel-ctl">
        <div class="dots" role="tablist" aria-label="Choose review"></div>
        <div class="row" style="gap:8px">
          <button type="button" class="btn btn-ghost btn-icon" data-dir="-1" aria-label="Previous review" style="border:1px solid var(--line-2)">${icon('arrowLeft')}</button>
          <button type="button" class="btn btn-ghost btn-icon" data-dir="1" aria-label="Next review" style="border:1px solid var(--line-2)">${icon('arrow')}</button>
        </div>
      </div>
    </div>`);
  const track = el.querySelector('.carousel-track'), dots = el.querySelector('.dots');
  const slides = [...track.children];
  const perView = () => (window.innerWidth > 1000 ? 3 : window.innerWidth > 640 ? 2 : 1);
  const pages = () => Math.max(1, slides.length - perView() + 1);
  const index = () => Math.round(track.scrollLeft / (slides[0].offsetWidth + 20));
  const go = (i) => track.scrollTo({ left: Math.max(0, Math.min(i, pages() - 1)) * (slides[0].offsetWidth + 20), behavior: reduceMotion() ? 'auto' : 'smooth' });
  const buildDots = () => {
    dots.innerHTML = Array.from({ length: pages() }, (_, i) => `<button type="button" role="tab" aria-label="Review ${i + 1}" data-i="${i}"></button>`).join('');
    sync();
  };
  const sync = () => { const i = index(); [...dots.children].forEach((d, n) => d.setAttribute('aria-selected', n === i)); };
  el.addEventListener('click', (e) => {
    const d = e.target.closest('[data-dir]'); if (d) go(index() + +d.dataset.dir);
    const dot = e.target.closest('[data-i]'); if (dot) go(+dot.dataset.i);
  });
  track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  track.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(index() + 1); if (e.key === 'ArrowLeft') go(index() - 1); });
  window.addEventListener('resize', buildDots);
  buildDots();
  let timer, paused = false;
  const tick = () => { if (!paused && document.visibilityState === 'visible' && el.isConnected) go(index() + 1 >= pages() ? 0 : index() + 1); };
  if (!reduceMotion()) timer = setInterval(tick, 5500);
  ['mouseenter', 'focusin', 'touchstart'].forEach((ev) => el.addEventListener(ev, () => (paused = true), { passive: true }));
  ['mouseleave', 'focusout'].forEach((ev) => el.addEventListener(ev, () => (paused = false)));
  el._cleanup = () => { clearInterval(timer); window.removeEventListener('resize', buildDots); };
  return el;
}
