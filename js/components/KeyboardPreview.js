// Interactive DOM keyboard: hover glow, press animation, RGB effects, layouts, drag-to-rotate, physical-key input.
import { esc, clamp } from '../core/dom.js';
import { getLayout } from '../data/layouts.js';
import { KEYCAP_SETS, CASES } from '../data/themes.js';
import { playSwitch } from '../core/audio.js';

export function createKeyboard(opts = {}) {
  const cfg = {
    layout: '65', theme: 'stealth', caseColor: 'black', hue: 190, fx: 'wave', switchType: 'linear',
    interactive: true, rotatable: true, floating: false, hero: false, readout: false, rx: 16, ry: -8, ...opts,
  };
  const wrap = document.createElement('div');
  wrap.className = 'kb-wrap';
  let rotX = cfg.rx, rotY = cfg.ry, pressedTimers = new Map();

  function build() {
    const L = getLayout(cfg.layout);
    const t = KEYCAP_SETS[cfg.theme] || KEYCAP_SETS.stealth;
    const c = CASES[cfg.caseColor] || CASES.black;
    const keys = L.keys.map((k) => `<button type="button" class="key" tabindex="-1" data-t="${k.t}" data-code="${esc(k.c)}" data-name="${esc(k.n)}" aria-label="${esc(k.n)}" style="--x:${k.x};--y:${k.y};--w:${k.w};--h:${k.h};--cx:${k.cx};--cy:${k.cy}"><span class="cap">${k.l ? esc(k.l) : ''}</span></button>`).join('');
    wrap.innerHTML = `
      <div class="kb-stage ${cfg.floating ? 'floating' : ''} ${cfg.hero ? 'kb-hero' : ''}" data-stage>
        <div class="kb-float"><div class="kb-3d" style="--rx:${rotX}deg;--ry:${rotY}deg">
          <div class="kb ${cfg.interactive ? '' : 'static'}" tabindex="${cfg.interactive ? 0 : -1}" role="group" aria-label="Interactive ${esc(L.id)} keyboard. Hover or tap keys to light them up, or type on your own keyboard."
            data-fx="${cfg.fx}" data-case="${cfg.caseColor}"
            style="--W:${L.W};--H:${L.H};--base:${cfg.hue};--alpha:${t.alpha};--mod:${t.mod};--accentk:${t.accent};--legend:${t.legend};--case:${c.fill};--case-edge:${c.edge}">
            <div class="kb-case"><div class="kb-keys">${keys}</div></div>
          </div>
        </div></div>
      </div>
      ${cfg.readout ? '<div class="kb-readout" aria-live="off"><span>Last key</span><kbd data-readout>—</kbd></div>' : ''}`;
    stage = wrap.querySelector('[data-stage]');
    board = wrap.querySelector('.kb');
    d3 = wrap.querySelector('.kb-3d');
    readout = wrap.querySelector('[data-readout]');
    if (!cfg.interactive) wrap.querySelectorAll('.key').forEach((k) => (k.style.pointerEvents = 'none'));
  }
  let stage, board, d3, readout, onMove, onUp;

  function press(keyEl, { sound = true } = {}) {
    if (!keyEl) return;
    clearTimeout(pressedTimers.get(keyEl));
    keyEl.classList.add('down');
    if (board.dataset.fx === 'reactive') { keyEl.classList.remove('lit'); void keyEl.offsetWidth; keyEl.classList.add('lit'); }
    if (readout) readout.textContent = keyEl.dataset.name;
    if (sound) playSwitch(cfg.switchType);
    cfg.onKey?.(keyEl.dataset.name);
    pressedTimers.set(keyEl, setTimeout(() => release(keyEl), 130));
  }
  function release(keyEl) { keyEl.classList.remove('down'); }
  function holdRelease(keyEl) { clearTimeout(pressedTimers.get(keyEl)); pressedTimers.set(keyEl, setTimeout(() => release(keyEl), 70)); }

  function bind() {
    // Pointer: press keys, or drag the stage to rotate.
    let drag = null;
    wrap.addEventListener('pointerdown', (e) => {
      if (!cfg.interactive) return;
      const keyEl = e.target.closest('.key');
      drag = { x: e.clientX, y: e.clientY, rx: rotX, ry: rotY, moved: false, keyEl, id: e.pointerId };
      if (keyEl) { clearTimeout(pressedTimers.get(keyEl)); keyEl.classList.add('down'); if (readout) readout.textContent = keyEl.dataset.name; }
    });
    onMove = (e) => {
      if (!drag || !cfg.rotatable || drag.id !== e.pointerId) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) > 9) {
        drag.moved = true; stage.classList.add('dragging');
        if (drag.keyEl) release(drag.keyEl);
      }
      if (drag.moved) {
        rotY = clamp(drag.ry + dx * 0.28, -55, 55);
        rotX = clamp(drag.rx - dy * 0.22, 0, 60);
        d3.style.setProperty('--ry', rotY + 'deg'); d3.style.setProperty('--rx', rotX + 'deg');
      }
    };
    window.addEventListener('pointermove', onMove);
    onUp = (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      const { keyEl, moved } = drag;
      drag = null; stage?.classList.remove('dragging');
      if (keyEl && !moved) { keyEl.classList.remove('down'); press(keyEl); }
    };
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    wrap.addEventListener('dblclick', (e) => { if (!e.target.closest('.key')) api.resetView(); });

    // Physical keyboard (only while the board is focused, so forms elsewhere keep working).
    board.addEventListener('keydown', (e) => {
      if (!cfg.interactive || e.code === 'Tab' || e.metaKey || e.ctrlKey) return;
      const k = wrap.querySelector(`.key[data-code="${CSS.escape(e.code)}"]`);
      if (!k) return;
      e.preventDefault();
      if (e.repeat) return;
      clearTimeout(pressedTimers.get(k));
      k.classList.add('down');
      if (board.dataset.fx === 'reactive') { k.classList.remove('lit'); void k.offsetWidth; k.classList.add('lit'); }
      if (readout) readout.textContent = k.dataset.name;
      playSwitch(cfg.switchType);
    });
    board.addEventListener('keyup', (e) => { const k = wrap.querySelector(`.key[data-code="${CSS.escape(e.code)}"]`); if (k) holdRelease(k); });
  }

  // Pause CSS animations when off-screen to save battery.
  function observe() {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([en]) => board.classList.toggle('is-paused', !en.isIntersecting), { threshold: 0 });
    io.observe(wrap);
    api._io = io;
  }

  const api = {
    el: wrap,
    config: cfg,
    update(patch) {
      const needsRebuild = ['layout', 'theme', 'caseColor'].some((k) => k in patch && patch[k] !== cfg[k]);
      Object.assign(cfg, patch);
      if (needsRebuild) { api._io?.disconnect(); build(); bind2(); observe(); return; }
      if ('hue' in patch) board.style.setProperty('--base', cfg.hue);
      if ('fx' in patch) board.dataset.fx = cfg.fx;
    },
    rotate(dy) { rotY = clamp(rotY + dy, -55, 55); d3.style.setProperty('--ry', rotY + 'deg'); },
    resetView() { rotX = cfg.rx; rotY = cfg.ry; d3.style.setProperty('--rx', rotX + 'deg'); d3.style.setProperty('--ry', rotY + 'deg'); },
    setTilt(rx, ry) { if (!stage?.classList.contains('dragging')) { d3.style.setProperty('--rx', rx + 'deg'); d3.style.setProperty('--ry', ry + 'deg'); rotX = rx; rotY = ry; } },
    pressCode(code) { const k = wrap.querySelector(`.key[data-code="${CSS.escape(code)}"]`); if (k) press(k); },
    typeDemo() {
      const seq = ['KeyK', 'KeyE', 'KeyY', 'KeyF', 'KeyO', 'KeyR', 'KeyG', 'KeyE'];
      seq.forEach((c, i) => setTimeout(() => api.pressCode(c), 120 * i));
    },
    destroy() {
      api._io?.disconnect(); pressedTimers.forEach(clearTimeout);
      window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onUp);
    },
  };
  // Window listeners are bound once; element listeners rebind after a rebuild.
  let windowBound = false;
  function bind2() {
    if (!windowBound) { bind(); windowBound = true; return; }
    board.addEventListener('keydown', (e) => {
      if (!cfg.interactive || e.code === 'Tab' || e.metaKey || e.ctrlKey) return;
      const k = wrap.querySelector(`.key[data-code="${CSS.escape(e.code)}"]`);
      if (!k) return;
      e.preventDefault(); if (e.repeat) return;
      clearTimeout(pressedTimers.get(k)); k.classList.add('down'); playSwitch(cfg.switchType);
      if (readout) readout.textContent = k.dataset.name;
    });
    board.addEventListener('keyup', (e) => { const k = wrap.querySelector(`.key[data-code="${CSS.escape(e.code)}"]`); if (k) holdRelease(k); });
  }
  build(); bind2(); observe();
  return api;
}
