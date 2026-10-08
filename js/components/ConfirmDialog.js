import { $, html, toEl, trapFocus } from '../core/dom.js';

// Promise-based confirmation for destructive actions. Resolves true on confirm.
export function confirmDialog({ title, body, confirmLabel = 'Delete', danger = true }) {
  return new Promise((resolve) => {
    const prev = document.activeElement;
    const el = toEl(html`
      <div class="overlay" role="presentation">
        <div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="cd-title" aria-describedby="cd-body">
          <h3 id="cd-title">${title}</h3>
          <p class="muted" id="cd-body">${body}</p>
          <div class="actions">
            <button class="btn btn-ghost" type="button" data-r="0">Cancel</button>
            <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" type="button" data-r="1">${confirmLabel}</button>
          </div>
        </div>
      </div>`);
    const done = (v) => { release(); el.remove(); prev?.focus?.(); resolve(v); };
    const release = trapFocus(el, () => done(false));
    el.addEventListener('click', (e) => { if (e.target === el) done(false); const b = e.target.closest('[data-r]'); if (b) done(b.dataset.r === '1'); });
    $('#dialog-root').appendChild(el);
    el.querySelector('[data-r="0"]').focus();
  });
}

// Generic modal host for forms (admin editors, etc.). Returns { el, close }.
export function openModal(content, { wide = false, label = 'Dialog' } = {}) {
  const prev = document.activeElement;
  const el = toEl(html`<div class="overlay" role="presentation"><div class="dialog ${wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-label="${label}"></div></div>`);
  el.firstElementChild.append(content);
  const close = () => { release(); el.remove(); prev?.focus?.(); };
  const release = trapFocus(el, close);
  el.addEventListener('mousedown', (e) => { if (e.target === el) close(); });
  $('#dialog-root').appendChild(el);
  const first = el.querySelector('input,select,textarea,button');
  first?.focus();
  return { el, close };
}
