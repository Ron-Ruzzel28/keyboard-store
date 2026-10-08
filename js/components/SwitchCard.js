// Switch comparison: cards with animated meters, a head-to-head table and synthesised sound previews.
import { $, $$, html, toEl } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { SWITCH_TYPES } from '../data/themes.js';
import { switchSVG } from './ProductArt.js';
import { raw } from '../core/dom.js';
import { playSwitch, playTyping } from '../core/audio.js';
import { state, commit } from '../core/store.js';
import { reveal } from '../core/anim.js';
import { toast } from './ToastNotification.js';

const meter = (label, v, shown = v) => html`<div class="meter"><div class="row between"><span>${label}</span><b class="num">${shown}</b></div><div class="bar"><i style="--v:${Math.min(100, v)}%"></i></div></div>`;

export function switchCard(s, i) {
  const hue = { linear: 355, tactile: 28, clicky: 218, silent: 268, magnetic: 190 }[s.id];
  return html`
    <article class="swcard reveal" style="--d:${i};--c:${s.color}" data-type="${s.id}">
      <div class="swcard-art" aria-hidden="true">${raw(switchSVG({ switchType: s.id, hue }))}</div>
      <h3>${s.name}</h3>
      <p class="muted">${s.blurb}</p>
      <div class="meters">
        ${meter('Smoothness', s.smooth)}
        ${meter('Tactility', s.tactile)}
        ${meter('Sound', s.sound)}
        ${meter('Actuation force', Math.round((s.force / 70) * 100), `${s.force} g`)}
      </div>
      <dl class="swspec">
        <div><dt>Actuation</dt><dd class="num">${s.force} g</dd></div>
        <div><dt>Travel</dt><dd class="num">${s.travel} mm</dd></div>
        <div><dt>Feel</dt><dd>${s.feel}</dd></div>
        <div><dt>Best for</dt><dd>${s.use}</dd></div>
      </dl>
      <div class="row between wrap">
        <button type="button" class="btn btn-ghost btn-sm" data-preview="${s.id}" aria-label="Preview ${s.name} switch sound">${icon('play')} Preview Sound</button>
        <a class="link" href="#/shop?type=${s.id}" style="font-size:.88rem">Shop ${s.name}</a>
      </div>
    </article>`;
}

export function switchCompare() {
  const list = Object.values(SWITCH_TYPES);
  const el = toEl(html`
    <div class="switch-compare">
      <div class="sound-bar glass" role="group" aria-label="Sound settings">
        <button type="button" class="btn btn-ghost btn-sm" id="snd-toggle" aria-pressed="${state.settings.sound}">${icon(state.settings.sound ? 'volume' : 'mute')}<span>${state.settings.sound ? 'Sound on' : 'Sound off'}</span></button>
        <label class="row" style="gap:12px;flex:1;min-width:180px"><span class="muted" style="font-size:.85rem">Volume</span><input type="range" id="snd-vol" min="0" max="100" value="${Math.round(state.settings.volume * 100)}" aria-label="Volume"></label>
      </div>
      <div class="switch-grid">${list.map((s, i) => switchCard(s, i))}</div>
    </div>`);

  const syncBar = () => {
    const t = $('#snd-toggle', el);
    t.setAttribute('aria-pressed', state.settings.sound);
    t.innerHTML = String(html`${icon(state.settings.sound ? 'volume' : 'mute')}<span>${state.settings.sound ? 'Sound on' : 'Sound off'}</span>`);
  };
  $('#snd-toggle', el).addEventListener('click', () => { commit('settings', (s) => { s.settings.sound = !s.settings.sound; }); syncBar(); });
  const vol = $('#snd-vol', el);
  const paintVol = () => vol.style.setProperty('--pct', vol.value + '%');
  paintVol();
  vol.addEventListener('input', () => { paintVol(); commit('settings', (s) => { s.settings.volume = vol.value / 100; }); });
  vol.addEventListener('change', () => playSwitch('linear', { force: true }));
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-preview]');
    if (!b) return;
    if (!state.settings.sound) { commit('settings', (s) => { s.settings.sound = true; }); syncBar(); toast('Sound enabled', { body: 'Use the sound toggle to mute again.', type: 'info', life: 2600 }); }
    $$('.swcard.playing', el).forEach((c) => c.classList.remove('playing'));
    const card = b.closest('.swcard'); card.classList.add('playing');
    const ms = playTyping(b.dataset.preview);
    setTimeout(() => card.classList.remove('playing'), ms || 1000);
  });
  reveal(el);
  return el;
}
