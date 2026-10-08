import { $, html, toEl } from '../core/dom.js';
import { icon } from '../core/icons.js';

const ICONS = { success: 'check', error: 'alert', info: 'info' };

export function toast(title, { body = '', type = 'success', life = 3600 } = {}) {
  const host = $('#toasts');
  const el = toEl(html`
    <div class="toast ${type}" style="--life:${life}ms" role="${type === 'error' ? 'alert' : 'status'}">
      <span class="ico">${icon(ICONS[type] || 'info')}</span>
      <div class="msg"><b>${title}</b>${body ? html`<span>${body}</span>` : ''}</div>
      <button class="x" type="button" aria-label="Dismiss notification">${icon('close')}</button>
      <i class="bar"></i>
    </div>`);
  const close = () => { if (el.classList.contains('out')) return; el.classList.add('out'); setTimeout(() => el.remove(), 260); };
  el.querySelector('.x').addEventListener('click', close);
  host.appendChild(el);
  while (host.children.length > 4) host.firstElementChild.remove();
  setTimeout(close, life);
  return close;
}
