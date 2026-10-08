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

// Isometric MX-style switch: smoky translucent housing, coloured cross stem, visible coil spring, metal pins and an
// RGB glow underneath. Left/right faces are drawn flat and skewed into place, so every part lines up exactly.
export function switchSVG({ switchType = 'linear', hue = 190 } = {}) {
  const s = SWITCH_TYPES[switchType] || SWITCH_TYPES.linear;
  const id = uid('s');
  const top = (z) => `matrix(.6235 .36 -.6235 .36 110 ${34 - z})`;
  const cross = 'M40 22h20v18h18v20h-18v18h-20v-18h-18v-20h18z';
  const coil = (cx, rx, n = 6) => Array.from({ length: n }, (_, i) => `<ellipse cx="${cx}" cy="${42 + i * 4.2}" rx="${rx}" ry="2.4" fill="none" stroke="#d3d8e3" stroke-width="1.7"/>`).join('');
  const extra = {
    clicky: '<rect x="20" y="22" width="8" height="18" rx="2" fill="#f4f4f7"/>',
    silent: '<rect x="30" y="35" width="40" height="6" rx="2" fill="#15171d"/>',
    magnetic: '<rect x="44" y="28" width="12" height="11" rx="1" fill="#c9cdd8"/><rect x="44" y="32" width="12" height="3" fill="#d6a43b"/>',
  }[switchType] || '';
  const stemLayers = Array.from({ length: 7 }, (_, k) => `<g transform="${top(k * 2)}"><path d="${cross}" fill="${s.color}" stroke="${s.color}" stroke-width="3" stroke-linejoin="round" style="filter:brightness(${0.52 + k * 0.03})"/></g>`).join('');
  return `<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(s.name)} switch preview"><defs>
    <radialGradient id="${id}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="hsl(${hue} 100% 60%)" stop-opacity=".75"/><stop offset="1" stop-color="hsl(${hue} 100% 60%)" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a5163"/><stop offset=".55" stop-color="#262b38"/><stop offset="1" stop-color="#171a23"/></linearGradient>
    <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".26"/><stop offset=".5" stop-color="#9aa3b8" stop-opacity=".1"/><stop offset="1" stop-color="hsl(${hue} 100% 65%)" stop-opacity=".3"/></linearGradient>
    <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${s.color}" style="stop-color:${s.color}"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>
    <linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8d93a1"/><stop offset=".45" stop-color="#eef0f5"/><stop offset="1" stop-color="#7b8190"/></linearGradient>
    <filter id="${id}b" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter></defs>
    <circle cx="110" cy="130" r="98" fill="url(#${id}g)" opacity=".55"/>
    <ellipse cx="114" cy="184" rx="68" ry="13" fill="#000" opacity=".55" filter="url(#${id}b)"/>
    <rect x="78" y="160" width="7" height="27" rx="2" fill="url(#${id}m)"/><rect x="138" y="162" width="7" height="25" rx="2" fill="url(#${id}m)"/>
    <ellipse cx="110" cy="178" rx="9" ry="5" fill="#1d212b"/>
    <g transform="matrix(.6235 .36 0 1 47.6 70)">
      <rect width="100" height="70" fill="url(#${id}f)"/><rect x="5" y="4" width="90" height="62" rx="4" fill="#07090e" opacity=".55"/>
      <rect x="30" y="6" width="40" height="36" rx="3" fill="url(#${id}s)" style="filter:brightness(.92)"/>${extra}
      ${coil(50, 17)}<rect x="0" y="63" width="100" height="7" fill="#1b1f29"/><rect width="100" height="70" fill="none" stroke="#fff" stroke-opacity=".28"/>
      <rect x="0" y="0" width="100" height="3" fill="#fff" opacity=".25"/>
    </g>
    <g transform="matrix(.6235 -.36 0 1 110 106)">
      <rect width="100" height="70" fill="url(#${id}f)" style="filter:brightness(.62)"/><rect x="5" y="4" width="90" height="62" rx="4" fill="#05060a" opacity=".6"/>
      <rect x="32" y="6" width="36" height="36" rx="3" fill="${s.color}" style="filter:brightness(.55)"/>
      ${coil(50, 15)}<rect x="0" y="63" width="100" height="7" fill="#12151c"/><rect width="100" height="70" fill="none" stroke="#fff" stroke-opacity=".16"/>
      <rect x="0" y="0" width="100" height="3" fill="#fff" opacity=".12"/>
    </g>
    <path d="M110 106V176" stroke="#fff" stroke-opacity=".45" stroke-width="1.2"/>
    <g transform="${top(0)}"><rect width="100" height="100" rx="9" fill="url(#${id}t)" stroke="#fff" stroke-opacity=".3"/>
      <rect x="13" y="13" width="74" height="74" rx="6" fill="#090b10" stroke="#fff" stroke-opacity=".1"/>
      <rect x="1.5" y="1.5" width="97" height="97" rx="8" fill="none" stroke="#fff" stroke-opacity=".12"/></g>
    ${stemLayers}
    <g transform="${top(14)}"><path d="${cross}" fill="${s.color}" stroke="${s.color}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M44 25h12v21h21v8H44z" fill="#fff" opacity=".22"/><path d="${cross}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/></g>
  </svg>`;
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
  if (img.src) return raw(`<img src="${esc(img.src)}" alt="${esc(product.name)}" loading="lazy" decoding="async" data-pid="${esc(product.id || '')}">`);
  return raw(artSVG(img, opts));
}
