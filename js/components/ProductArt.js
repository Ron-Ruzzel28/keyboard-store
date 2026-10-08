// Procedural SVG product imagery. Descriptors live on product.image, so real photos can replace them later:
// if product.image.src exists, an <img> is rendered instead.
import { raw, esc, uid } from '../core/dom.js';
import { getLayout } from '../data/layouts.js';
import { KEYCAP_SETS, CASES, SWITCH_TYPES } from '../data/themes.js';

const num = (n) => +n.toFixed(2);

export function keyboardSVG({ layout = '65', theme = 'stealth', caseColor = 'black', hue = 190, view = 'main' } = {}) {
  const L = getLayout(layout);
  const t = KEYCAP_SETS[theme] || KEYCAP_SETS.stealth;
  const c = CASES[caseColor] || CASES.black;
  const pad = 0.55;
  const vw = L.W + pad * 2, vh = L.H + pad * 2 + 0.3;
  const id = uid('k');
  const glass = caseColor === 'transparent';
  const fills = { a: t.alpha, m: t.mod, x: t.accent };
  const keys = L.keys.map((k) => {
    const x = pad + k.x + 0.05, y = pad + k.y + 0.05, w = k.w - 0.1, h = k.h - 0.1;
    return `<rect x="${num(x)}" y="${num(y + 0.06)}" width="${num(w)}" height="${num(h)}" rx=".16" fill="#000" opacity=".45"/>` +
      `<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" rx=".16" fill="${fills[k.t]}" stroke="hsl(${hue} 100% 62% / .5)" stroke-width=".035"/>` +
      `<rect x="${num(x + 0.06)}" y="${num(y + 0.05)}" width="${num(w - 0.12)}" height="${num(h * 0.45)}" rx=".12" fill="#fff" opacity=".07"/>`;
  }).join('');
  const crop = view === 'detail' ? `viewBox="${num(pad + 1)} ${num(pad + 1)} ${num(Math.min(7, vw - 2))} ${num(4)}"` : `viewBox="0 0 ${num(vw)} ${num(vh)}"`;
  return `<svg ${crop} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(layout)} keyboard preview" preserveAspectRatio="xMidYMid meet">
    <defs><filter id="${id}b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".5"/></filter>
    <linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.edge}"/><stop offset=".45" stop-color="${glass ? 'rgba(255,255,255,.12)' : c.fill}"/><stop offset="1" stop-color="${glass ? 'rgba(255,255,255,.05)' : c.fill}"/></linearGradient></defs>
    <rect x=".15" y=".5" width="${num(vw - 0.3)}" height="${num(vh - 0.5)}" rx=".5" fill="hsl(${hue} 90% 55% / .35)" filter="url(#${id}b)"/>
    <rect x=".1" y=".18" width="${num(vw - 0.2)}" height="${num(vh - 0.36)}" rx=".5" fill="url(#${id}c)" stroke="${c.edge}" stroke-width=".05"/>
    <rect x="${pad - 0.12}" y="${pad - 0.12}" width="${num(L.W + 0.24)}" height="${num(L.H + 0.24)}" rx=".22" fill="#05060a" opacity="${glass ? 0.45 : 0.7}"/>
    ${keys}</svg>`;
}

export function keycapsSVG({ theme = 'stealth' } = {}) {
  const t = KEYCAP_SETS[theme] || KEYCAP_SETS.stealth;
  const id = uid('c');
  const grid = [['Q', 'W', 'E', 'R'], ['A', 'S', 'D', 'F'], ['Z', 'X', 'C', 'V']];
  let out = '';
  grid.forEach((r, ri) => r.forEach((l, ci) => {
    const x = 36 + ci * 62 + ri * 10, y = 34 + ri * 58;
    const cls = (ri + ci) % 4 === 0 ? t.accent : (ri + ci) % 3 === 0 ? t.mod : t.alpha;
    const g = `${id}g${ri}${ci}`;
    out += `<g><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cls}"/><stop offset="1" stop-color="${cls}" stop-opacity=".78"/></linearGradient></defs>
      <path d="M${x} ${y + 8} q0 -8 8 -8 h34 q8 0 8 8 l4 40 q0 8 -8 8 h-42 q-8 0 -8 -8z" fill="#000" opacity=".5" transform="translate(0 5)"/>
      <path d="M${x} ${y + 8} q0 -8 8 -8 h34 q8 0 8 8 l4 40 q0 8 -8 8 h-42 q-8 0 -8 -8z" fill="${cls}" filter="brightness(.62)"/>
      <rect x="${x + 6}" y="${y + 4}" width="40" height="36" rx="8" fill="url(#${g})" stroke="#ffffff22"/>
      <rect x="${x + 9}" y="${y + 6}" width="34" height="10" rx="5" fill="#fff" opacity=".12"/>
      <text x="${x + 26}" y="${y + 29}" text-anchor="middle" font-family="Sora, system-ui" font-weight="700" font-size="15" fill="${t.legend}">${l}</text></g>`;
  }));
  return `<svg viewBox="0 0 310 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(t.name)} keycap set preview">${out}</svg>`;
}

export function artisanSVG({ theme = 'galaxy', hue } = {}) {
  const id = uid('a');
  const h = hue ?? (theme === 'galaxy' ? 265 : 190);
  const stars = Array.from({ length: 26 }, (_, i) => `<circle cx="${70 + ((i * 53) % 90)}" cy="${70 + ((i * 37) % 70)}" r="${(i % 4) * 0.5 + 0.6}" fill="#fff" opacity="${0.4 + (i % 5) * 0.12}"/>`).join('');
  return `<svg viewBox="0 0 220 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Artisan galaxy keycap preview"><defs>
    <radialGradient id="${id}n" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="hsl(${h + 40} 90% 70%)"/><stop offset=".45" stop-color="hsl(${h} 80% 42%)"/><stop offset="1" stop-color="hsl(${h - 20} 70% 12%)"/></radialGradient>
    <clipPath id="${id}t"><rect x="58" y="44" width="104" height="104" rx="22"/></clipPath></defs>
    <path d="M44 66 q0 -22 22 -22 h88 q22 0 22 22 l12 90 q2 22 -22 22 h-112 q-24 0 -22 -22z" fill="hsl(${h} 50% 14%)" stroke="#ffffff1a"/>
    <path d="M44 66 q0 -22 22 -22 h88 q22 0 22 22 l12 90 q2 22 -22 22 h-112 q-24 0 -22 -22z" fill="url(#${id}n)" opacity=".5"/>
    <g clip-path="url(#${id}t)"><rect x="58" y="44" width="104" height="104" fill="url(#${id}n)"/>${stars}<ellipse cx="96" cy="76" rx="38" ry="14" fill="#fff" opacity=".14" transform="rotate(-18 96 76)"/></g>
    <rect x="58" y="44" width="104" height="104" rx="22" fill="none" stroke="#ffffff33"/></svg>`;
}

export function switchSVG({ switchType = 'linear', hue = 190 } = {}) {
  const s = SWITCH_TYPES[switchType] || SWITCH_TYPES.linear;
  const id = uid('s');
  return `<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(s.name)} switch preview"><defs>
    <linearGradient id="${id}h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b4152"/><stop offset="1" stop-color="#181b25"/></linearGradient>
    <radialGradient id="${id}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="hsl(${hue} 100% 60%)" stop-opacity=".8"/><stop offset="1" stop-color="hsl(${hue} 100% 60%)" stop-opacity="0"/></radialGradient></defs>
    <circle cx="110" cy="110" r="100" fill="url(#${id}g)" opacity=".5"/>
    <rect x="42" y="50" width="136" height="136" rx="22" fill="#000" opacity=".5" transform="translate(0 8)"/>
    <rect x="42" y="42" width="136" height="136" rx="22" fill="url(#${id}h)" stroke="#ffffff22"/>
    <rect x="52" y="52" width="116" height="116" rx="14" fill="#10131b" stroke="#ffffff10"/>
    <rect x="92" y="62" width="36" height="96" rx="8" fill="${s.color}"/><rect x="62" y="92" width="96" height="36" rx="8" fill="${s.color}"/>
    <rect x="98" y="68" width="24" height="84" rx="5" fill="#fff" opacity=".18"/><rect x="68" y="98" width="84" height="24" rx="5" fill="#fff" opacity=".12"/>
    <circle cx="110" cy="110" r="9" fill="#0b0d13" stroke="#ffffff30"/>
    <rect x="94" y="30" width="32" height="14" rx="5" fill="#2a2f3d"/><rect x="94" y="176" width="32" height="12" rx="5" fill="#2a2f3d"/></svg>`;
}

export function artSVG(img = {}, opts = {}) {
  switch (img.kind) {
    case 'keyboard': return keyboardSVG({ ...img, ...opts });
    case 'custom': return keyboardSVG({ layout: img.layout, theme: img.keycaps, caseColor: img.case, hue: img.hue, ...opts });
    case 'keycaps': return keycapsSVG({ ...img, ...opts });
    case 'artisan': return artisanSVG({ ...img, ...opts });
    case 'switch': return switchSVG({ ...img, ...opts });
    default: return keycapsSVG({});
  }
}

// Markup for cards/thumbs. `opts` may override hue / case colour (used for variant swatches).
export function productArt(product, opts = {}) {
  const img = product.image || {};
  if (img.src) return raw(`<img src="${esc(img.src)}" alt="${esc(product.name)}" loading="lazy" decoding="async">`);
  return raw(artSVG(img, opts));
}
