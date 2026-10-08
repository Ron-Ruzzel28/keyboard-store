// Six-step configurator with a live preview and a running price.
import { $, $$, html, toEl, money } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { createKeyboard } from './KeyboardPreview.js';
import { LAYOUTS } from '../data/layouts.js';
import { CASES, KEYCAP_SETS, SWITCH_TYPES, PLATES, RGB_COLORS, RGB_EFFECTS, BASE_PRICE } from '../data/themes.js';
import { tweenNumber, flyToCart } from '../core/anim.js';
import { addCustomBuild } from '../core/cart.js';
import { toast } from './ToastNotification.js';
import { playSwitch } from '../core/audio.js';

const STEPS = [
  ['layout', 'Keyboard', 'Choose a layout'],
  ['case', 'Case', 'Pick a finish'],
  ['keycaps', 'Keycaps', 'Choose a keycap set'],
  ['switch', 'Switches', 'Decide how it feels'],
  ['plate', 'Plate', 'Tune the sound'],
  ['rgb', 'RGB', 'Set the lighting'],
];

export function buildPrice(b) {
  const parts = [
    ['Keyboard', LAYOUTS[b.layout].label, BASE_PRICE[b.layout]],
    ['Case', CASES[b.case].name, CASES[b.case].price],
    ['Keycaps', KEYCAP_SETS[b.keycaps].name, KEYCAP_SETS[b.keycaps].price],
    ['Switches', SWITCH_TYPES[b.switch].name, SWITCH_TYPES[b.switch].price],
    ['Plate', PLATES[b.plate].name, PLATES[b.plate].price],
    ['RGB', `${RGB_COLORS.find((c) => c.h === b.hue)?.name || 'Custom'} · ${RGB_EFFECTS.find((e) => e.id === b.fx).name}`, 0],
  ];
  return { parts, total: parts.reduce((s, p) => s + p[2], 0) };
}

export function buildKeyboard(init = {}) {
  const b = { layout: '65', case: 'black', keycaps: 'stealth', switch: 'linear', plate: 'aluminum', hue: 190, fx: 'wave', ...init };
  let step = 0;
  const el = toEl(html`
    <div class="builder">
      <div class="builder-preview">
        <div class="panel preview-card" id="b-preview"></div>
        <div class="panel current" aria-labelledby="cur-h">
          <h2 id="cur-h" style="font-size:1.2rem">Current Build</h2>
          <ul id="b-list" class="build-list"></ul>
          <div class="build-total"><span>Total</span><strong class="num" id="b-total" data-v="0">₱0</strong></div>
          <button class="btn btn-primary btn-lg btn-block" type="button" id="b-add">${icon('cart')}Add Custom Build to Cart</button>
          <p class="faint" style="font-size:.8rem">Assembled and tested in 3–5 business days.</p>
        </div>
      </div>
      <div class="builder-steps">
        <ol class="stepper" id="b-stepper" aria-label="Build steps">${STEPS.map(([id, label], i) => html`<li><button type="button" data-step="${i}" ${i === 0 ? 'aria-current="step"' : ''}><span class="n">${i + 1}</span><span class="l">${label}</span></button></li>`)}</ol>
        <div class="panel step-panel" id="b-panel" aria-live="polite"></div>
        <div class="row between">
          <button class="btn btn-ghost" type="button" id="b-prev">${icon('arrowLeft')}Back</button>
          <button class="btn btn-primary" type="button" id="b-next">Next ${icon('arrow')}</button>
        </div>
      </div>
    </div>`);

  const kb = createKeyboard({ layout: b.layout, theme: b.keycaps, caseColor: b.case, hue: b.hue, fx: b.fx, switchType: b.switch, plate: b.plate, readout: true, rx: 18, ry: -8 });
  $('#b-preview', el).append(kb.el);

  const panels = {
    layout: () => html`<div class="opt-grid">${Object.values(LAYOUTS).map((l) => html`<button type="button" class="opt" data-k="layout" data-v="${l.id}" aria-pressed="${b.layout === l.id}"><span class="o-t">${l.label}</span><span class="o-s">${l.keys} keys · ${l.blurb}</span><span class="o-p num">${money(BASE_PRICE[l.id])}</span></button>`)}</div>`,
    case: () => html`<div class="opt-grid">${Object.values(CASES).map((c) => html`<button type="button" class="opt" data-k="case" data-v="${c.id}" aria-pressed="${b.case === c.id}"><span class="dot" style="background:${c.swatch}"></span><span class="o-t">${c.name}</span><span class="o-p num">${c.price === 0 ? 'Included' : '+' + money(c.price)}</span></button>`)}</div>`,
    keycaps: () => html`<div class="opt-grid">${Object.values(KEYCAP_SETS).filter((k) => k.id !== 'galaxy').map((k) => html`<button type="button" class="opt keycap-opt" data-k="keycaps" data-v="${k.id}" aria-pressed="${b.keycaps === k.id}"><span class="kc-strip" aria-hidden="true"><i style="background:${k.alpha}"></i><i style="background:${k.mod}"></i><i style="background:${k.accent}"></i></span><span class="o-t">${k.name}</span><span class="o-s">${k.desc}</span><span class="o-p num">${k.price === 0 ? 'Included' : '+' + money(k.price)}</span></button>`)}</div>`,
    switch: () => html`<div class="opt-grid">${Object.values(SWITCH_TYPES).map((s) => html`<button type="button" class="opt" data-k="switch" data-v="${s.id}" aria-pressed="${b.switch === s.id}"><span class="dot" style="background:${s.color}"></span><span class="o-t">${s.name}</span><span class="o-s">${s.blurb} ${s.force} g</span><span class="o-p num">+${money(s.price)}</span></button>`)}</div><p class="faint" style="margin-top:12px;font-size:.85rem">Click a switch to hear it on the preview board when sound is on.</p>`,
    plate: () => html`<div class="opt-grid">${Object.values(PLATES).map((p) => html`<button type="button" class="opt" data-k="plate" data-v="${p.id}" aria-pressed="${b.plate === p.id}"><span class="o-t">${p.name}</span><span class="o-s">${p.note}</span><span class="o-p num">${p.price === 0 ? 'Included' : '+' + money(p.price)}</span></button>`)}</div>`,
    rgb: () => html`
      <div class="ctl-group"><span class="label" id="b-l1">Colour</span><div class="swatches" role="group" aria-labelledby="b-l1">${RGB_COLORS.map((c) => html`<button class="swatch" type="button" style="--c:hsl(${c.h} 95% 58%)" data-k="hue" data-v="${c.h}" aria-label="${c.name}" aria-pressed="${b.hue === c.h}"></button>`)}</div></div>
      <div class="ctl-group" style="margin-top:22px"><span class="label" id="b-l2">Effect</span><div class="opt-grid">${RGB_EFFECTS.map((f) => html`<button type="button" class="opt" data-k="fx" data-v="${f.id}" aria-pressed="${b.fx === f.id}"><span class="o-t">${f.name}</span><span class="o-p num">Included</span></button>`)}</div></div>`,
  };

  function paintPanel() {
    const [id, , sub] = STEPS[step];
    $('#b-panel', el).innerHTML = String(html`<div class="step-head"><h2 style="font-size:1.4rem">Step ${step + 1} — ${STEPS[step][1] === 'Keyboard' ? 'Choose Keyboard' : STEPS[step][1] === 'RGB' ? 'Choose RGB' : 'Choose ' + STEPS[step][1]}</h2><p class="muted">${sub}</p></div><div class="step-body">${panels[id]()}</div>`);
    $$('[data-step]', el).forEach((s, i) => { s.toggleAttribute('aria-current', i === step); if (i === step) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current'); s.classList.toggle('done', i < step); });
    $('#b-prev', el).disabled = step === 0;
    const last = step === STEPS.length - 1;
    $('#b-next', el).innerHTML = String(last ? html`Review build ${icon('check')}` : html`Next ${icon('arrow')}`);
  }
  function paintSummary() {
    const { parts, total } = buildPrice(b);
    $('#b-list', el).innerHTML = String(html`${parts.map(([k, v, p]) => html`<li><span class="k">${k}</span><span class="v">${v}</span><span class="p num">${p ? money(p) : 'Included'}</span></li>`)}`);
    tweenNumber($('#b-total', el), total, money, 450);
  }
  paintPanel(); paintSummary();

  el.addEventListener('click', (e) => {
    const o = e.target.closest('[data-k]');
    if (o) {
      const k = o.dataset.k, v = k === 'hue' ? +o.dataset.v : o.dataset.v;
      b[k === 'switch' ? 'switch' : k] = v;
      const map = { layout: { layout: v }, case: { caseColor: v }, keycaps: { theme: v }, switch: { switchType: v }, hue: { hue: v }, fx: { fx: v }, plate: { plate: v } }[k];
      if (map) kb.update(map);
      if (k === 'switch' || k === 'plate') { kb.typeDemo(); }
      $$(`[data-k="${k}"]`, el).forEach((n) => n.setAttribute('aria-pressed', String(n.dataset.v) === String(v)));
      paintSummary();
      return;
    }
    const s = e.target.closest('[data-step]');
    if (s) { step = +s.dataset.step; paintPanel(); }
  });
  $('#b-prev', el).addEventListener('click', () => { step = Math.max(0, step - 1); paintPanel(); });
  $('#b-next', el).addEventListener('click', () => {
    if (step < STEPS.length - 1) { step++; paintPanel(); }
    else $('#b-list', el).closest('.current').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  $('#b-add', el).addEventListener('click', () => {
    const { total } = buildPrice(b);
    addCustomBuild({
      name: `Custom ${LAYOUTS[b.layout].label} Keyboard`,
      price: total,
      selection: { Case: CASES[b.case].name, Keycaps: KEYCAP_SETS[b.keycaps].name, Switches: SWITCH_TYPES[b.switch].name, Plate: PLATES[b.plate].name, RGB: RGB_EFFECTS.find((f) => f.id === b.fx).name },
      image: { kind: 'custom', layout: b.layout, keycaps: b.keycaps, case: b.case, hue: b.hue },
    });
    flyToCart($('.kb-wrap', el));
    toast('Custom build added', { body: `${LAYOUTS[b.layout].label} · ${SWITCH_TYPES[b.switch].name} · ${money(total)}` });
  });
  el._cleanup = () => kb.destroy();
  return el;
}
