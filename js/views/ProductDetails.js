import { $, $$, html, toEl, money } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { getProduct, listProducts } from '../data/api.js';
import { state, inWishlist, on } from '../core/store.js';
import { priceFor, defaultSelection } from '../core/cart.js';
import { productArt, artSVG } from '../components/ProductArt.js';
import { stars, stockInfo, catLabel, productCard } from '../components/ProductCard.js';
import { reviewCard } from '../components/ReviewCard.js';
import { createKeyboard } from '../components/KeyboardPreview.js';
import { reveal, tweenNumber } from '../core/anim.js';
import { CASES } from '../data/themes.js';

export default async function ProductDetails({ params }) {
  const p = await getProduct(params.id);
  let sel = defaultSelection(p);
  let qty = 1;
  let view = p.category === 'keyboards' ? 'interactive' : 'main';
  const colorGroup = p.variants?.find((g) => g.type === 'Color');
  let kb = null;

  const related = (await listProducts()).filter((x) => x.id !== p.id && x.category === p.category).slice(0, 4);
  const reviews = state.reviews.filter((r) => r.productId === p.id && r.status === 'published');

  const views = p.category === 'keyboards' ? ['interactive', 'main', 'angle', 'detail'] : p.image.kind === 'switch' ? ['main', 'detail', 'angle'] : ['main', 'angle', 'detail'];
  const viewLabel = { interactive: 'Interactive', main: 'Front', angle: 'Angle', detail: 'Close-up' };

  const el = toEl(html`
    <div class="container pd">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a>${icon('chevron')}<a href="#/shop?cat=${p.category}">${catLabel(p.category)}</a>${icon('chevron')}<span aria-current="page">${p.name}</span></nav>
      <div class="pd-grid">
        <div class="pd-gallery">
          <div class="pd-stage glass" id="stage"></div>
          <div class="pd-thumbs" role="tablist" aria-label="Product views">${views.map((v) => html`<button type="button" role="tab" class="thumb" data-view="${v}" aria-selected="${v === view}" aria-label="${viewLabel[v]} view"><span class="thumb-art" data-thumb="${v}"></span><span>${viewLabel[v]}</span></button>`)}</div>
        </div>
        <div class="pd-info">
          <div class="row wrap" style="gap:8px"><span class="badge">${catLabel(p.category)}</span>${p.new ? html`<span class="badge accent">New</span>` : ''}${p.bestSeller ? html`<span class="badge">Best seller</span>` : ''}<span class="badge ${stockInfo(p).cls}" id="stock-badge">${stockInfo(p).label}</span></div>
          <h1 class="pd-title">${p.name}</h1>
          <div class="row wrap" style="gap:14px">${stars(p.rating, { size: 17, count: p.reviews })}<a class="link" href="#reviews-h" data-scroll style="font-size:.88rem">Read reviews</a></div>
          <div class="pd-price"><strong class="num" id="price">${money(priceFor(p, sel))}</strong>${p.category === 'switches' ? html`<span class="muted">per pack</span>` : p.category === 'keycaps' ? html`<span class="muted">per set</span>` : ''}</div>
          <p class="lead" style="max-width:56ch">${p.description}</p>
          <form class="variants" id="variants" aria-label="Choose options">
            ${(p.variants || []).map((g) => html`
              <fieldset class="vgroup"><legend>${g.type}: <b class="vcur" data-cur="${g.type}">${sel[g.type]}</b></legend>
                <div class="vopts ${g.type === 'Color' || g.options[0].hex ? 'colors' : ''}">${g.options.map((o) => html`
                  <label class="vopt ${o.hex ? 'sw' : ''}" ${o.hex ? html`style="--c:${o.hex}"` : ''}>
                    <input type="radio" name="${g.type}" value="${o.name}" ${sel[g.type] === o.name ? 'checked' : ''}>
                    ${o.hex ? html`<span class="sr-only">${o.name}</span><i></i>` : html`<span>${o.name}${o.price ? html` <em>${o.price > 0 ? '+' : '−'}${money(Math.abs(o.price))}</em>` : ''}</span>`}
                  </label>`)}</div>
              </fieldset>`)}
          </form>
          <div class="pd-buy">
            <div class="qty big" role="group" aria-label="Quantity">
              <button type="button" id="q-minus" aria-label="Decrease quantity">${icon('minus')}</button><output id="q-out" aria-live="polite">1</output><button type="button" id="q-plus" aria-label="Increase quantity">${icon('plus')}</button>
            </div>
            <button class="btn btn-primary btn-lg" type="button" id="add" data-action="add-detail" ${p.stock <= 0 ? 'disabled' : ''}>${icon('cart')}${p.stock <= 0 ? 'Out of stock' : 'Add to Cart'}</button>
            <button class="btn btn-ghost btn-lg" type="button" id="buy" data-action="buy-now" ${p.stock <= 0 ? 'disabled' : ''}>Buy Now</button>
            <button class="btn btn-ghost btn-icon wish-lg ${inWishlist(p.id) ? 'on' : ''}" type="button" data-action="wish" data-id="${p.id}" aria-pressed="${inWishlist(p.id)}" aria-label="${inWishlist(p.id) ? 'Remove from' : 'Add to'} wishlist">${icon('heart')}</button>
          </div>
          <ul class="pd-perks"><li>${icon('truck')}Free shipping over ₱5,000</li><li>${icon('shield')}2-year warranty</li><li>${icon('rotate')}30-day returns</li></ul>
        </div>
      </div>

      <section class="pd-specs" aria-labelledby="spec-h">
        <h2 id="spec-h" class="reveal">Specifications</h2>
        <p class="faint" style="margin:-8px 0 16px;font-size:.85rem">Placeholder test data: prices and specifications are illustrative, not official.</p>
        <dl class="specs reveal">${Object.entries(p.specifications).map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>
      </section>

      <section class="pd-reviews" aria-labelledby="reviews-h">
        <h2 id="reviews-h" class="reveal">Customer reviews</h2>
        ${reviews.length ? html`<div class="reviews-grid">${reviews.map((r) => reviewCard(r, { showProduct: false }))}</div>` : html`<div class="empty"><span class="ico">${icon('star')}</span><h3>No reviews yet</h3><p>Be the first to share how ${p.name} feels after purchase.</p></div>`}
      </section>

      ${related.length ? html`<section class="pd-related" aria-labelledby="rel-h"><h2 id="rel-h" class="reveal">You may also like</h2><div class="product-grid">${related.map((r, i) => productCard(r, i))}</div></section>` : ''}
    </div>`);

  // ---- Gallery ----
  const stage = $('#stage', el);
  const art = (v, opts = {}) => {
    const hue = opts.hue ?? p.image.hue;
    return p.image.src ? String(productArt(p)) : artSVG(p.image, { view: v === 'detail' ? 'detail' : 'main', ...opts, hue });
  };
  const caseForColor = () => {
    const name = sel.Color;
    const hex = colorGroup?.options.find((o) => o.name === name)?.hex;
    if (!hex) return {};
    const match = Object.values(CASES).find((c) => c.fill.toLowerCase() === hex.toLowerCase());
    return match ? { caseColor: match.id } : {};
  };
  function paintStage() {
    kb?.destroy(); kb = null;
    stage.className = 'pd-stage glass view-' + view;
    if (view === 'interactive') {
      kb = createKeyboard({ layout: p.image.layout, theme: p.image.theme, caseColor: caseForColor().caseColor || p.image.case, hue: p.image.hue, fx: 'wave', switchType: (sel.Switch || p.switchType || 'linear').toLowerCase(), readout: true, rx: 18, ry: -8 });
      stage.replaceChildren(kb.el);
      stage.insertAdjacentHTML('beforeend', '<p class="pd-hint">Drag to rotate · hover and press keys · focus the board and type</p>');
    } else {
      stage.innerHTML = `<div class="pd-art">${art(view, caseForColor())}</div>`;
    }
    $$('.thumb', el).forEach((t) => t.setAttribute('aria-selected', t.dataset.view === view));
  }
  $$('[data-thumb]', el).forEach((n) => {
    const v = n.dataset.thumb;
    n.innerHTML = v === 'interactive' ? String(icon('keyboard')) : art(v === 'angle' ? 'main' : v);
  });
  $('.pd-thumbs', el).addEventListener('click', (e) => { const b = e.target.closest('[data-view]'); if (b) { view = b.dataset.view; paintStage(); } });

  // ---- Variants / price / qty ----
  const priceEl = $('#price', el);
  priceEl.dataset.v = priceFor(p, sel);
  $('#variants', el).addEventListener('change', (e) => {
    const r = e.target.closest('input[type=radio]'); if (!r) return;
    sel[r.name] = r.value;
    $(`[data-cur="${r.name}"]`, el).textContent = r.value;
    tweenNumber(priceEl, priceFor(p, sel), money, 350);
    if (r.name === 'Color') { if (view === 'interactive') kb.update({ caseColor: caseForColor().caseColor || p.image.case }); else paintStage(); }
    if (r.name === 'Switch' && kb) kb.update({ switchType: r.value.toLowerCase() });
  });
  const qOut = $('#q-out', el);
  const setQty = (n) => { qty = Math.max(1, Math.min(n, Math.min(p.stock || 1, 20))); qOut.textContent = qty; };
  $('#q-minus', el).addEventListener('click', () => setQty(qty - 1));
  $('#q-plus', el).addEventListener('click', () => setQty(qty + 1));

  // Global action handler reads these hooks
  el._detail = { product: p, getSelection: () => ({ ...sel }), getQty: () => qty, flySource: () => $('.pd-art svg, .kb-wrap', el) || stage };
  el.addEventListener('click', (e) => { const a = e.target.closest('[data-scroll]'); if (a) { e.preventDefault(); document.getElementById('reviews-h').scrollIntoView({ behavior: 'smooth' }); } });

  paintStage();
  const off = on('products', () => {});
  reveal(el);
  el._cleanup = () => { kb?.destroy(); off(); };
  return el;
}
