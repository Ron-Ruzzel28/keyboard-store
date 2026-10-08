import { html, toEl } from '../core/dom.js';
import { buildKeyboard } from '../components/KeyboardBuilder.js';
import { LAYOUTS } from '../data/layouts.js';
import { RGB_EFFECTS } from '../data/themes.js';

export default async function KeyboardBuilderView({ query }) {
  const init = {};
  if (LAYOUTS[query.layout]) init.layout = query.layout;
  if (query.hue && !Number.isNaN(+query.hue)) init.hue = +query.hue;
  if (RGB_EFFECTS.some((f) => f.id === query.fx)) init.fx = query.fx;
  const el = toEl(html`
    <div class="container builder-page">
      <header class="shop-head"><div><h1 style="font-size:clamp(2.2rem,5vw,3.6rem)">Build Your Keyboard</h1><p class="lead" style="margin-top:12px">Six steps. A live preview. A price that updates with every choice.</p></div></header>
      <div id="slot"></div>
    </div>`);
  const b = buildKeyboard(init);
  el.querySelector('#slot').append(b);
  el._cleanup = b._cleanup;
  return el;
}
