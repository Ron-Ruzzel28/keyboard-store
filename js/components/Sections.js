// Page sections reused by Home and About.
import { html, toEl } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { CATEGORIES } from '../data/products.js';
import { state } from '../core/store.js';
import { reviewsCarousel } from './ReviewCard.js';
import { keyboardSVG, keycapsSVG, switchSVG } from './ProductArt.js';
import { raw } from '../core/dom.js';
import { counters, reveal } from '../core/anim.js';

export function categoryCards() {
  const art = {
    keyboards: raw(keyboardSVG({ layout: '65', theme: 'cyberpunk', caseColor: 'black', hue: 190 })),
    keycaps: raw(keycapsSVG({ theme: 'aurora' })),
    switches: raw(switchSVG({ switchType: 'tactile', hue: 28 })),
  };
  return html`<div class="cat-grid">${CATEGORIES.map((c, i) => html`
    <a class="catcard reveal" style="--d:${i};--h:${c.hue}" href="#/shop?cat=${c.id}" aria-label="Shop ${c.name}">
      <div class="catcard-glow" aria-hidden="true"></div>
      <div class="catcard-art" aria-hidden="true">${art[c.id]}</div>
      <div class="catcard-body">
        <div class="row between"><h3>${c.name}</h3><span class="go">${icon('arrow')}</span></div>
        <p class="muted">${c.blurb}</p>
        <ul class="catcard-tags">${c.tags.map((t) => html`<li>${t}</li>`)}</ul>
      </div>
    </a>`)}</div>`;
}

export function aboutSection() {
  const el = toEl(html`
    <section class="section about" id="story" aria-labelledby="about-h">
      <div class="container about-grid">
        <div class="reveal">
          <h2 id="about-h">Made for People Who Love to Type.</h2>
          <p class="lead" style="margin-top:20px">KEYFORGE started with a shared desk and a shared obsession. Today we design and curate mechanical keyboards, keycaps and switches for enthusiasts, gamers, programmers, creators and everyday typists.</p>
          <p class="muted" style="margin-top:16px;max-width:58ch">Every board is tuned for sound and feel before it ships. Every keycap set is tested on real layouts. If you are new to the hobby, our builder and switch guide will walk you through it. If you have been collecting for years, we have something for the next build.</p>
          <ul class="values">
            <li>${icon('shield')}<span><b>Tested before shipped.</b> Every board is typed on, tuned and photographed.</span></li>
            <li>${icon('truck')}<span><b>Fast, tracked delivery</b> across the Philippines.</span></li>
            <li>${icon('msg')}<span><b>Real people</b> to help you choose your first build.</span></li>
          </ul>
        </div>
        <div class="stats reveal" style="--d:2">
          ${[[50, '+', 'Keyboard Designs'], [100, '+', 'Switches'], [500, '+', 'Keycap Sets'], [10000, '+', 'Happy Customers']].map(([n, s, l]) => html`<div class="stat"><div class="stat-n num" data-count="${n}" data-suffix="${s}">0</div><div class="stat-l">${l}</div></div>`)}
        </div>
      </div>
    </section>`);
  counters(el); reveal(el);
  return el;
}

export function reviewsSection() {
  const list = state.reviews.filter((r) => r.status === 'published');
  const el = toEl(html`
    <section class="section" id="reviews" aria-labelledby="rev-h">
      <div class="container">
        <div class="section-head center reveal"><h2 id="rev-h">Typists Love Their Boards</h2><p class="lead">Verified purchases from the KEYFORGE community.</p></div>
        <div class="reveal" id="rev-slot"></div>
      </div>
    </section>`);
  const car = reviewsCarousel(list);
  el.querySelector('#rev-slot').append(car);
  el._cleanup = car._cleanup;
  reveal(el);
  return el;
}
