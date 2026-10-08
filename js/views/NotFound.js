import { html, toEl } from '../core/dom.js';
import { icon } from '../core/icons.js';

export default async function NotFound() {
  return toEl(html`<div class="container"><div class="empty" style="min-height:60vh;align-content:center"><span class="ico">${icon('search')}</span><h1 style="font-size:clamp(2rem,5vw,3rem)">Page not found</h1><p>The page you are looking for has moved or never existed.</p><div class="row wrap" style="justify-content:center"><a class="btn btn-primary" href="#/">Back home</a><a class="btn btn-ghost" href="#/shop">Browse products</a></div></div></div>`);
}

export function errorView(err) {
  const missing = /not found/i.test(err?.message || '');
  return toEl(html`<div class="container"><div class="empty" style="min-height:60vh;align-content:center"><span class="ico">${icon('alert')}</span><h1 style="font-size:clamp(2rem,5vw,3rem)">${missing ? 'We could not find that product' : 'Something went wrong'}</h1><p>${missing ? 'It may have been removed or sold out for good.' : 'An unexpected error stopped this page from loading. Please try again.'}</p><div class="row wrap" style="justify-content:center"><button class="btn btn-primary" type="button" onclick="location.reload()">Try again</button><a class="btn btn-ghost" href="#/shop">Browse products</a></div></div></div>`);
}
