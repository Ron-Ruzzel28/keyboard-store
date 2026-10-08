// Dependency-free SVG charts for the admin dashboard.
import { esc, money, raw, uid } from '../core/dom.js';

const PAL = ['hsl(190 95% 60%)', 'hsl(268 90% 70%)', 'hsl(28 95% 62%)', 'hsl(145 70% 55%)', 'hsl(355 90% 68%)', 'hsl(218 95% 68%)'];
export const palette = (i) => PAL[i % PAL.length];

export function lineChart(points, { height = 240, fmt = (v) => v } = {}) {
  const W = 640, H = height, p = { l: 46, r: 14, t: 16, b: 28 };
  const max = Math.max(...points.map((d) => d.v), 1) * 1.1;
  const x = (i) => p.l + (i / Math.max(points.length - 1, 1)) * (W - p.l - p.r);
  const y = (v) => p.t + (1 - v / max) * (H - p.t - p.b);
  const path = points.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(d.v).toFixed(1)}`).join(' ');
  const area = `${path} L${x(points.length - 1)} ${H - p.b} L${x(0)} ${H - p.b}Z`;
  const id = uid('lc');
  const grid = [0, 0.25, 0.5, 0.75, 1].map((t) => `<line x1="${p.l}" x2="${W - p.r}" y1="${y(max * t / 1.1 * 1.1 * 1)}" y2="${y(max * t)}" stroke="#fff" opacity=".07"/><text x="${p.l - 8}" y="${y(max * t) + 4}" text-anchor="end" fill="#8089a0" font-size="11">${fmt(max * t)}</text>`).join('');
  const labels = points.filter((_, i) => i % Math.ceil(points.length / 6) === 0).map((d) => `<text x="${x(points.indexOf(d))}" y="${H - 8}" text-anchor="middle" fill="#8089a0" font-size="11">${esc(d.label)}</text>`).join('');
  const dots = points.map((d, i) => `<circle class="pt" cx="${x(i)}" cy="${y(d.v)}" r="10" fill="transparent"><title>${esc(d.label)}: ${esc(fmt(d.v))}</title></circle>`).join('');
  return raw(`<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="Line chart of sales over time"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(190 95% 60%)" stop-opacity=".35"/><stop offset="1" stop-color="hsl(190 95% 60%)" stop-opacity="0"/></linearGradient></defs>
    ${grid}${labels}<path d="${area}" fill="url(#${id})" class="area"/><path d="${path}" fill="none" stroke="hsl(190 95% 60%)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" class="draw" pathLength="1"/>${dots}</svg>`);
}

export function barChart(items, { fmt = (v) => v } = {}) {
  const max = Math.max(...items.map((i) => i.v), 1);
  return raw(`<ul class="hbars" role="list">${items.map((it, i) => `<li><span class="lab" title="${esc(it.label)}">${esc(it.label)}</span><span class="track"><i style="--w:${(it.v / max) * 100}%;--c:${palette(i)}"></i></span><b class="num">${esc(fmt(it.v))}</b></li>`).join('')}</ul>`);
}

export function donut(items, { fmt = (v) => v, center = '' } = {}) {
  const total = items.reduce((s, i) => s + i.v, 0) || 1;
  const R = 52, C = 2 * Math.PI * R;
  let off = 0;
  const segs = items.map((it, i) => {
    const len = (it.v / total) * C;
    const s = `<circle class="seg" cx="70" cy="70" r="${R}" fill="none" stroke="${palette(i)}" stroke-width="18" stroke-dasharray="${len.toFixed(2)} ${(C - len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 70 70)"><title>${esc(it.label)}: ${esc(fmt(it.v))}</title></circle>`;
    off += len; return s;
  }).join('');
  return raw(`<div class="donut-wrap"><svg viewBox="0 0 140 140" class="donut" role="img" aria-label="Donut chart"><circle cx="70" cy="70" r="${R}" fill="none" stroke="#fff" opacity=".06" stroke-width="18"/>${segs}<text x="70" y="68" text-anchor="middle" fill="#fff" font-family="Sora" font-weight="700" font-size="15">${esc(center)}</text><text x="70" y="84" text-anchor="middle" fill="#8089a0" font-size="9">total</text></svg>
    <ul class="legend">${items.map((it, i) => `<li><i style="background:${palette(i)}"></i><span>${esc(it.label)}</span><b class="num">${esc(fmt(it.v))}</b></li>`).join('')}</ul></div>`);
}
export { money };
