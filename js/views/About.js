import { html, toEl } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { aboutSection, reviewsSection } from '../components/Sections.js';

export default async function About() {
  const el = toEl(html`<div class="about-page">
    <section class="section" style="padding-bottom:0"><div class="container"><div class="section-head"><h1 style="font-size:clamp(2.4rem,5.5vw,4.2rem);max-width:16ch">The story behind the switches.</h1><p class="lead">A small team of typists, tinkerers and tuners in Manila, building the keyboards we wanted to own.</p></div></div></section>
  </div>`);
  const a = aboutSection(), r = reviewsSection();
  el.append(a, r, toEl(html`<section class="container" style="padding-bottom:40px"><div class="panel row between wrap" style="gap:20px"><div><h3>Ready to build yours?</h3><p class="muted">Pick every part, hear the switches and see the price live.</p></div><a class="btn btn-primary btn-lg" href="#/build">Build Your Keyboard ${icon('arrow')}</a></div></section>`));
  el._cleanup = () => r._cleanup?.();
  return el;
}
