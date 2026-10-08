import { html, toEl, validate, rules } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { toast } from './ToastNotification.js';

const COLS = [
  ['Shop', [['Keyboards', '/shop?cat=keyboards'], ['Keycaps', '/shop?cat=keycaps'], ['Switches', '/shop?cat=switches'], ['Accessories', '/shop?q=cable']]],
  ['Support', [['Contact', '/support?topic=contact'], ['Shipping', '/support?topic=shipping'], ['Returns', '/support?topic=returns'], ['FAQ', '/support?topic=faq']]],
  ['Company', [['About Us', '/about'], ['Our Story', '/about?at=story'], ['Careers', '/support?topic=careers']]],
];
const SOCIAL = [['Facebook', 'facebook'], ['Instagram', 'instagram'], ['TikTok', 'tiktok'], ['Discord', 'discord']];

export function mountFooter(host) {
  const el = toEl(html`
    <footer class="footer">
      <div class="container">
        <div class="newsletter-band reveal in">
          <div><h2 style="font-size:clamp(1.6rem,3vw,2.2rem)">Join the Keyboard Community</h2><p class="muted" style="margin-top:8px">Group buys, restocks and build guides. One email a week, no spam.</p></div>
          <form class="newsletter" novalidate aria-label="Newsletter signup">
            <div class="row"><div class="field"><label class="sr-only" for="nl-email">Email address</label><input class="input" id="nl-email" name="email" type="email" placeholder="you@example.com" autocomplete="email"><span class="error" role="alert"></span></div><button class="btn btn-primary" type="submit">Subscribe</button></div>
          </form>
        </div>
        <div class="footer-top">
          <div class="about">
            <a class="logo" href="#/"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="6" width="24" height="16" rx="5"/><path d="M9 11h2M14 11h2M19 11h2M11 16.500h10"/><path d="M10 26h12"/></svg><span>KEYFORGE</span></a>
            <p>Mechanical keyboards, keycaps and switches for people who love to type. Designed in Manila.</p>
            <div class="row" style="gap:6px">${SOCIAL.map(([n, i]) => html`<a class="btn btn-icon" href="#/support?topic=contact" aria-label="${n}" style="border:1px solid var(--line)">${icon(i)}</a>`)}</div>
          </div>
          ${COLS.map(([t, ls]) => html`<nav aria-label="${t}"><h4>${t}</h4><ul>${ls.map(([l, h]) => html`<li><a href="#${h}">${l}</a></li>`)}</ul></nav>`)}
          <nav aria-label="Social"><h4>Social</h4><ul>${SOCIAL.map(([n]) => html`<li><a href="#/support?topic=contact">${n}</a></li>`)}</ul></nav>
        </div>
        <div class="footer-bottom"><span>© 2026 KEYFORGE. All rights reserved.</span><span>Sample store: no real payments are processed.</span></div>
      </div>
    </footer>`);
  host.replaceChildren(el);
  el.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    if (!validate(f, { email: rules.email })) return;
    f.reset();
    toast('You are on the list', { body: 'Check your inbox to confirm your subscription.' });
  });
}
