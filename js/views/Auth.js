import { $, html, toEl, validate, rules } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { state, commit } from '../core/store.js';
import { navigate } from '../core/router.js';
import { toast } from '../components/ToastNotification.js';

const field = (name, label, o = {}) => html`<div class="field"><label for="a-${name}">${label}</label><input class="input" id="a-${name}" name="${name}" type="${o.type || 'text'}" autocomplete="${o.ac || 'off'}" placeholder="${o.ph || ''}" aria-describedby="ae-${name}"><span class="error" id="ae-${name}" role="alert"></span></div>`;

const shell = (title, sub, body, foot) => toEl(html`
  <div class="container auth">
    <div class="auth-card glass">
      <div class="auth-head"><h1 style="font-size:2rem">${title}</h1><p class="muted">${sub}</p></div>
      ${body}
      <p class="auth-foot muted">${foot}</p>
    </div>
  </div>`);

const next = (q) => (q.next && q.next.startsWith('/') ? q.next : '/account');

export function Login({ query }) {
  if (state.user) { navigate('/account', { replace: true }); return toEl(html`<div></div>`); }
  const el = shell('Welcome back', 'Sign in to track orders and manage your wishlist.', html`
    <form novalidate class="stack" id="login">
      ${query.reason ? html`<div class="notice error" role="alert">${icon('lock')}<span>${query.reason}</span></div>` : ''}
      <div class="notice">${icon('info')}<span>Demo accounts: <b>demo@keyforge.dev</b> / <b>demo1234</b>, or admin <b>admin@keyforge.dev</b> / <b>admin123</b>.</span></div>
      ${field('email', 'Email', { type: 'email', ac: 'username' })}
      ${field('password', 'Password', { type: 'password', ac: 'current-password' })}
      <button class="btn btn-primary btn-lg btn-block" type="submit">Sign in</button>
      <button class="btn btn-ghost btn-block" type="button" id="demo">Use demo account</button>
    </form>`, html`New here? <a class="link" href="#/register">Create an account</a>`);
  const form = $('#login', el);
  const submit = () => {
    if (!validate(form, { email: rules.email, password: rules.required('Password') })) return;
    const fd = new FormData(form);
    const u = state.users.find((x) => x.email.toLowerCase() === fd.get('email').trim().toLowerCase() && x.password === fd.get('password'));
    if (!u) {
      const f = form.elements.password.closest('.field'); f.classList.add('has-error'); f.querySelector('.error').textContent = 'Email or password is incorrect.'; return;
    }
    commit('user', (s) => { s.user = { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role }; });
    toast(`Welcome back, ${u.name.split(' ')[0]}`);
    navigate(u.role === 'admin' && !query.next ? '/admin' : next(query));
  };
  form.addEventListener('submit', (e) => { e.preventDefault(); submit(); });
  $('#demo', el).addEventListener('click', () => { form.elements.email.value = 'demo@keyforge.dev'; form.elements.password.value = 'demo1234'; submit(); });
  return el;
}

export function Register({ query }) {
  if (state.user) { navigate('/account', { replace: true }); return toEl(html`<div></div>`); }
  const el = shell('Create your account', 'Save addresses, track orders and build a wishlist.', html`
    <form novalidate class="stack" id="reg">
      ${field('name', 'Full name', { ac: 'name' })}
      ${field('email', 'Email', { type: 'email', ac: 'email' })}
      ${field('password', 'Password', { type: 'password', ac: 'new-password', ph: 'At least 8 characters' })}
      ${field('confirm', 'Confirm password', { type: 'password', ac: 'new-password' })}
      <label class="check"><input type="checkbox" name="terms"><span>I agree to the terms and privacy policy.</span></label>
      <button class="btn btn-primary btn-lg btn-block" type="submit">Create account</button>
    </form>`, html`Already have an account? <a class="link" href="#/login">Sign in</a>`);
  const form = $('#reg', el);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = validate(form, {
      name: (v) => (v.length >= 3 ? '' : 'Enter your full name.'),
      email: (v) => rules.email(v) || (state.users.some((u) => u.email.toLowerCase() === v.toLowerCase()) ? 'An account with this email already exists.' : ''),
      password: rules.min('Password', 8),
      confirm: (v, f) => (v === f.elements.password.value ? '' : 'Passwords do not match.'),
    });
    if (!ok) return;
    if (!form.elements.terms.checked) { toast('Please accept the terms', { body: 'You need to agree before creating an account.', type: 'error' }); form.elements.terms.focus(); return; }
    const fd = new FormData(form);
    const user = { id: 'u-' + Date.now().toString(36), name: fd.get('name').trim(), email: fd.get('email').trim(), password: fd.get('password'), phone: '', role: 'customer' };
    commit('users', (s) => { s.users.push(user); });
    commit('user', (s) => { s.user = { id: user.id, name: user.name, email: user.email, phone: '', role: 'customer' }; });
    toast('Account created', { body: 'Welcome to KEYFORGE.' });
    navigate(next(query));
  });
  return el;
}
