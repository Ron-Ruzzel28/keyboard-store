import { $, $$, html, toEl, reduceMotion, isTouch } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { state, on, commit } from '../core/store.js';
import { navigate } from '../core/router.js';
import { createKeyboard } from '../components/KeyboardPreview.js';
import { particles } from '../components/Particles.js';
import { categoryCards, aboutSection, reviewsSection } from '../components/Sections.js';
import { switchCompare } from '../components/SwitchCard.js';
import { renderGrid, renderGridLoading, renderGridError } from '../components/ProductGrid.js';
import { listProducts } from '../data/api.js';
import { LAYOUTS } from '../data/layouts.js';
import { RGB_COLORS, RGB_EFFECTS } from '../data/themes.js';
import { reveal } from '../core/anim.js';
import { keyboardSVG } from '../components/ProductArt.js';

export default async function Home() {
  const el = toEl(html`
    <div class="home">
      <section class="hero" id="hero" aria-labelledby="hero-h">
        <canvas class="hero-particles" aria-hidden="true"></canvas>
        <div class="hero-light" aria-hidden="true"></div>
        <div class="container hero-grid">
          <div class="hero-copy">
            <h1 id="hero-h">Build Your Perfect Keyboard.</h1>
            <p class="lead">Premium keyboards, handcrafted keycaps, and switches for every typing experience.</p>
            <div class="row wrap hero-cta">
              <a class="btn btn-primary btn-lg" href="#/shop?cat=keyboards">Shop Keyboards ${icon('arrow')}</a>
              <a class="btn btn-ghost btn-lg" href="#/build">Build Your Keyboard</a>
            </div>
            <ul class="hero-points" aria-label="Highlights">
              <li>${icon('truck')}Free shipping over ₱5,000</li>
              <li>${icon('shield')}30-day returns</li>
              <li>${icon('bolt')}Hot-swap on every board</li>
            </ul>
          </div>
          <div class="hero-board" data-parallax>
            <p class="hero-hint" aria-hidden="true">Hover the keys · drag to rotate</p>
            <div id="hero-kb"></div>
          </div>
        </div>
      </section>

      <section class="section" id="playground" aria-labelledby="pg-h">
        <div class="container">
          <div class="section-head reveal"><h2 id="pg-h">Feel every key before you buy.</h2><p class="lead">Press keys, swap layouts and try lighting effects on a live board. Turn sound on to hear it.</p></div>
          <div class="playground">
            <div class="playground-stage panel reveal" id="pg-stage"></div>
            <div class="playground-ctl panel reveal" style="--d:1">
              <div class="kb-controls">
                <div class="ctl-group"><span class="label" id="l-layout">Layout</span><div class="chip-row" role="group" aria-labelledby="l-layout" id="c-layout">${Object.values(LAYOUTS).map((l) => html`<button class="chip" type="button" data-layout="${l.id}" aria-pressed="${l.id === '65'}">${l.label}</button>`)}</div></div>
                <div class="ctl-group"><span class="label" id="l-rgb">RGB colour</span><div class="swatches" role="group" aria-labelledby="l-rgb" id="c-rgb">${RGB_COLORS.map((c) => html`<button class="swatch" type="button" style="--c:hsl(${c.h} 95% 58%)" data-hue="${c.h}" data-id="${c.id}" aria-label="${c.name}" aria-pressed="${c.id === 'cyan'}"></button>`)}</div></div>
                <div class="ctl-group"><span class="label" id="l-fx">Lighting effect</span><div class="chip-row" role="group" aria-labelledby="l-fx" id="c-fx">${RGB_EFFECTS.map((f) => html`<button class="chip" type="button" data-fx="${f.id}" aria-pressed="${f.id === 'wave'}">${f.name}</button>`)}</div></div>
                <div class="ctl-group"><span class="label">View &amp; sound</span>
                  <div class="row wrap">
                    <button class="btn btn-ghost btn-sm" type="button" id="pg-sound" aria-pressed="false"></button>
                    <button class="btn btn-ghost btn-sm" type="button" data-rot="-18" aria-label="Rotate left">${icon('arrowLeft')}</button>
                    <button class="btn btn-ghost btn-sm" type="button" data-rot="18" aria-label="Rotate right">${icon('arrow')}</button>
                    <button class="btn btn-ghost btn-sm" type="button" id="pg-reset">${icon('rotate')}Reset view</button>
                  </div>
                </div>
                <button class="btn btn-primary btn-lg btn-block" type="button" id="pg-customize">Customize This Keyboard</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="categories" aria-labelledby="cat-h">
        <div class="container">
          <div class="section-head reveal"><h2 id="cat-h">Shop by category</h2><p class="lead">Everything you need for the board you have in mind.</p></div>
          ${categoryCards()}
        </div>
      </section>

      <section class="section" id="featured" aria-labelledby="feat-h">
        <div class="container">
          <div class="row between wrap section-head" style="grid-auto-flow:column">
            <div class="reveal"><h2 id="feat-h">Featured picks</h2></div>
            <a class="btn btn-ghost reveal" href="#/shop">View all products ${icon('arrow')}</a>
          </div>
          <div class="product-grid" id="featured-grid"></div>
        </div>
      </section>

      <section class="section" id="switches" aria-labelledby="sw-h">
        <div class="container">
          <div class="section-head reveal"><h2 id="sw-h">Hear the difference.</h2><p class="lead">Compare how each switch feels and sounds. Preview a short typing sample for each one.</p></div>
          <div id="switch-slot"></div>
        </div>
      </section>

      <section class="section" aria-labelledby="bt-h">
        <div class="container">
          <div class="build-band glass reveal">
            <div class="build-copy">
              <h2 id="bt-h">Design it piece by piece.</h2>
              <p class="lead">Choose the layout, case, keycaps, switches, plate and lighting. Watch your board update live and see the price as you go.</p>
              <a class="btn btn-primary btn-lg" href="#/build" style="justify-self:start">Start your build ${icon('arrow')}</a>
            </div>
            <div class="build-art" id="build-art" aria-hidden="true"></div>
          </div>
        </div>
      </section>
    </div>`);

  // Hero keyboard
  const hero = createKeyboard({ layout: '65', theme: 'stealth', caseColor: 'black', hue: RGB_COLORS.find((c) => c.id === state.settings.accent)?.h ?? 190, fx: 'wave', floating: true, hero: true, rx: 24, ry: -14, rotatable: true });
  $('#hero-kb', el).append(hero.el);

  // Playground keyboard
  const pg = createKeyboard({ layout: '65', theme: 'cyberpunk', caseColor: 'black', hue: 190, fx: 'wave', readout: true, rx: 14, ry: -6 });
  $('#pg-stage', el).append(pg.el);
  const cfg = pg.config;
  const press = (group, attr, val) => $$(`[${attr}]`, group).forEach((b) => b.setAttribute('aria-pressed', b.getAttribute(attr) === String(val)));
  $('#c-layout', el).addEventListener('click', (e) => { const b = e.target.closest('[data-layout]'); if (!b) return; pg.update({ layout: b.dataset.layout }); press($('#c-layout', el), 'data-layout', b.dataset.layout); });
  $('#c-rgb', el).addEventListener('click', (e) => { const b = e.target.closest('[data-hue]'); if (!b) return; pg.update({ hue: +b.dataset.hue }); hero.update({ hue: +b.dataset.hue }); press($('#c-rgb', el), 'data-hue', b.dataset.hue); document.documentElement.dataset.accent = b.dataset.id; commit('settings', (s) => { s.settings.accent = b.dataset.id; }); });
  $('#c-fx', el).addEventListener('click', (e) => { const b = e.target.closest('[data-fx]'); if (!b) return; pg.update({ fx: b.dataset.fx }); press($('#c-fx', el), 'data-fx', b.dataset.fx); });
  $$('[data-rot]', el).forEach((b) => b.addEventListener('click', () => pg.rotate(+b.dataset.rot)));
  $('#pg-reset', el).addEventListener('click', () => pg.resetView());
  const soundBtn = $('#pg-sound', el);
  const paintSound = () => { soundBtn.setAttribute('aria-pressed', state.settings.sound); soundBtn.innerHTML = String(html`${icon(state.settings.sound ? 'volume' : 'mute')}${state.settings.sound ? 'Sound on' : 'Sound off'}`); };
  soundBtn.addEventListener('click', () => { commit('settings', (s) => { s.settings.sound = !s.settings.sound; }); paintSound(); if (state.settings.sound) pg.typeDemo(); });
  paintSound();
  $('#pg-customize', el).addEventListener('click', () => navigate(`/build?layout=${cfg.layout}&hue=${cfg.hue}&fx=${cfg.fx}`));

  // Build teaser: slow cycle through keycap themes
  const themes = ['cyberpunk', 'aurora', 'samurai', 'retro'];
  const hues = [268, 145, 355, 28];
  let ti = 0;
  const paintArt = () => { $('#build-art', el).innerHTML = keyboardSVG({ layout: 'tkl', theme: themes[ti], caseColor: ti === 3 ? 'silver' : 'black', hue: hues[ti] }); };
  paintArt();
  const cycle = reduceMotion() ? null : setInterval(() => { if (!el.isConnected) return; ti = (ti + 1) % themes.length; const a = $('#build-art', el); a.style.opacity = 0; setTimeout(() => { paintArt(); a.style.opacity = 1; }, 300); }, 3600);

  // Mouse-follow light + parallax
  const heroEl = $('#hero', el), board = $('.hero-board', el);
  const onMove = (e) => {
    const r = heroEl.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    heroEl.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
    heroEl.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    if (!reduceMotion() && !isTouch()) hero.setTilt((24 - (py - 0.5) * 10).toFixed(1), (-14 + (px - 0.5) * 16).toFixed(1));
  };
  if (!isTouch()) heroEl.addEventListener('pointermove', onMove);
  const onScroll = () => { if (!reduceMotion()) board.style.transform = `translateY(${Math.min(window.scrollY, 700) * -0.08}px)`; };
  window.addEventListener('scroll', onScroll, { passive: true });
  const stopParticles = particles($('.hero-particles', el));

  // Switch comparison
  const sc = switchCompare();
  $('#switch-slot', el).append(sc);

  // Lower sections
  el.append(aboutSection());
  const rev = reviewsSection();
  el.append(rev);

  // Featured products (async with loading + error states)
  const grid = $('#featured-grid', el);
  const loadFeatured = async () => {
    renderGridLoading(grid, 4);
    try {
      const all = await listProducts();
      const f = all.filter((p) => p.featured).slice(0, 4);
      grid.removeAttribute('aria-busy');
      renderGrid(grid, f);
    } catch { renderGridError(grid, loadFeatured); }
  };
  loadFeatured();
  const off = on('wishlist', () => { /* hearts update via global action handler */ });

  reveal(el);
  el._cleanup = () => {
    hero.destroy(); pg.destroy(); stopParticles(); clearInterval(cycle); off();
    window.removeEventListener('scroll', onScroll); rev._cleanup?.();
  };
  return el;
}
