import { html, toEl, validate, rules } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { toast } from '../components/ToastNotification.js';

const FAQ = [
  ['What does hot-swap mean?', 'Hot-swap boards let you pull out and replace switches without soldering. All KEYFORGE keyboards are hot-swap.'],
  ['Which switch should I choose?', 'Linear for smooth gaming, tactile for typing feedback, clicky for audible feedback, silent for shared spaces, and magnetic for adjustable actuation. Try the sound previews on the home page.'],
  ['Do keycaps fit every keyboard?', 'Our sets use MX-style stems and fit nearly all hot-swap boards. Check the layout compatibility on each product page.'],
  ['How long does delivery take?', 'Metro Manila: 1–3 business days. Provincial: 3–7 business days. Custom builds are assembled first, which adds 3–5 days.'],
];
const TOPICS = {
  contact: ['Contact us', 'Questions about an order or a build? We reply within one business day.'],
  shipping: ['Shipping', 'Flat ₱150 shipping, free over ₱5,000. Tracked delivery nationwide through our courier partners.'],
  returns: ['Returns', 'Return unused items in original packaging within 30 days for a refund. Custom builds are covered by our 2-year warranty.'],
  faq: ['Frequently asked questions', 'Quick answers to the things we hear most.'],
  careers: ['Careers', 'We are a small team. There are no open roles right now, but we would love to hear from you.'],
};

export default async function Support({ query }) {
  const topic = TOPICS[query.topic] ? query.topic : 'contact';
  const [title, sub] = TOPICS[topic];
  const el = toEl(html`
    <div class="container support">
      <div class="section-head"><h1 style="font-size:clamp(2.2rem,5vw,3.4rem)">${title}</h1><p class="lead">${sub}</p></div>
      <div class="chip-row" style="margin-bottom:28px">${Object.entries(TOPICS).map(([id, [l]]) => html`<a class="chip ${id === topic ? 'active' : ''}" href="#/support?topic=${id}">${l.split(' ')[0] === 'Frequently' ? 'FAQ' : l.replace(' us', '')}</a>`)}</div>
      ${topic === 'faq' ? html`<div class="faq">${FAQ.map(([q, a]) => html`<details class="panel"><summary>${q}</summary><p class="muted">${a}</p></details>`)}</div>` : ''}
      ${topic === 'contact' || topic === 'careers' ? html`
        <form class="panel stack" id="contact" novalidate style="max-width:640px">
          <div class="field"><label for="s-name">Name</label><input class="input" id="s-name" name="name" autocomplete="name"><span class="error" role="alert"></span></div>
          <div class="field"><label for="s-email">Email</label><input class="input" id="s-email" name="email" type="email" autocomplete="email"><span class="error" role="alert"></span></div>
          <div class="field"><label for="s-msg">Message</label><textarea class="textarea" id="s-msg" name="msg"></textarea><span class="error" role="alert"></span></div>
          <button class="btn btn-primary" type="submit" style="justify-self:start">${icon('msg')}Send message</button>
        </form>` : ''}
      ${topic === 'shipping' || topic === 'returns' ? html`<div class="panel" style="max-width:640px"><p class="muted">${sub}</p><a class="btn btn-ghost" href="#/support?topic=contact" style="margin-top:16px">Questions? Contact us</a></div>` : ''}
    </div>`);
  const f = el.querySelector('#contact');
  f?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate(f, { name: rules.required('Name'), email: rules.email, msg: (v) => (v.length >= 10 ? '' : 'Write at least 10 characters.') })) return;
    f.reset(); toast('Message sent', { body: 'We will get back to you within one business day.' });
  });
  return el;
}
