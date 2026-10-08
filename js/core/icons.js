import { raw } from './dom.js';

// Authored stroke icons: 24px grid, 1.8 stroke, round caps.
const P = {
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.8-3.8"/>',
  heart: '<path d="M12 20.5s-7.5-4.4-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.800-7.500 10.200-7.500 10.200Z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.500 20c.8-3.600 3.800-5.500 7.500-5.500s6.700 1.900 7.500 5.500"/>',
  cart: '<path d="M3 4h2.200l2 11h10.500l2-8H6.500"/><circle cx="9.500" cy="19.500" r="1.300"/><circle cx="17" cy="19.500" r="1.300"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12.500h10L18 7M9 7V4h6v3"/>',
  check: '<path d="m5 12.500 4.500 4.500L19 7.500"/>',
  star: '<path d="m12 3.500 2.600 5.400 5.900.8-4.300 4.100 1 5.800L12 16.800 6.800 19.600l1-5.800L3.500 9.700l5.900-.8Z"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  volume: '<path d="M4 9.500v5h3.500l5 4v-13l-5 4Z"/><path d="M16 9c1.300 1.500 1.300 4.500 0 6M18.500 6.500c2.600 3 2.600 8 0 11"/>',
  mute: '<path d="M4 9.500v5h3.500l5 4v-13l-5 4Z"/><path d="m16 9.500 5 5M21 9.500l-5 5"/>',
  play: '<path d="M7 4.500v15l12-7.500Z"/>',
  rotate: '<path d="M20 11a8 8 0 1 0-2.300 5.700"/><path d="M20 4v7h-7"/>',
  sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7.500" cy="17.500" r="1.800"/><circle cx="17" cy="17.500" r="1.800"/>',
  shield: '<path d="M12 3.500 5 6v5.500c0 4.300 3 7.600 7 9 4-1.400 7-4.700 7-9V6Z"/><path d="m9 12 2.200 2.200L15.500 10"/>',
  keyboard: '<rect x="2.500" y="6" width="19" height="12" rx="3"/><path d="M6 10h.01M9.500 10h.01M13 10h.01M16.500 10h.01M7 14h10"/>',
  keycap: '<path d="M7 5h10l3 11a2 2 0 0 1-2 2.500H6A2 2 0 0 1 4 16Z"/><path d="M8.500 9h7"/>',
  switch: '<rect x="5" y="5" width="14" height="14" rx="3"/><path d="M12 8.500v7M8.500 12h7"/>',
  home: '<path d="M4 11.500 12 4l8 7.500V20H4Z"/><path d="M10 20v-5h4v5"/>',
  edit: '<path d="M4 20h4L19 9a2.800 2.800 0 0 0-4-4L4 16Z"/><path d="m13.500 6.500 4 4"/>',
  box: '<path d="m12 3 8 4v10l-8 4-8-4V7Z"/><path d="m4 7 8 4 8-4M12 11v10"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="m7.500 15 3.500-4 3 2.500L19 8"/>',
  users: '<circle cx="9" cy="8.500" r="3.500"/><path d="M2.500 20c.7-3.300 3.200-5 6.500-5s5.800 1.700 6.500 5M16 5.200a3.500 3.500 0 0 1 0 6.600M18 15.300c1.800.7 3 2.300 3.500 4.700"/>',
  tag: '<path d="M3.500 12.200V4.500h7.700l9.300 9.300-7.700 7.700Z"/><circle cx="8" cy="9" r="1.200"/>',
  msg: '<path d="M4 5h16v11H9l-5 4Z"/>',
  gift: '<rect x="3.500" y="9" width="17" height="11" rx="2"/><path d="M12 9v11M3.500 13H20.500M12 9c-1-4-5-4.500-5-2s3 2 5 2Zm0 0c1-4 5-4.500 5-2s-3 2-5 2Z"/>',
  card: '<rect x="3" y="5.500" width="18" height="13" rx="3"/><path d="M3 10h18M7 15h4"/>',
  phone: '<rect x="7" y="3" width="10" height="18" rx="2.500"/><path d="M11 18h2"/>',
  cash: '<rect x="3" y="6.500" width="18" height="11" rx="2.500"/><circle cx="12" cy="12" r="2.500"/>',
  pin: '<path d="M12 21s6.500-5.500 6.500-11A6.500 6.500 0 0 0 5.500 10C5.500 15.500 12 21 12 21Z"/><circle cx="12" cy="10" r="2.300"/>',
  alert: '<path d="M12 4 2.800 19.500h18.400Z"/><path d="M12 10v4.500M12 17.200h.01"/>',
  info: '<circle cx="12" cy="12" r="8.500"/><path d="M12 11v5M12 8h.01"/>',
  lock: '<rect x="5" y="10.500" width="14" height="9.500" rx="2.500"/><path d="M8 10.500V8a4 4 0 0 1 8 0v2.500"/>',
  logout: '<path d="M10 4H5.500A1.500 1.500 0 0 0 4 5.500v13A1.500 1.500 0 0 0 5.500 20H10M15 8l4 4-4 4M19 12H9"/>',
  bolt: '<path d="m13 3-8 11h6l-1 7 8-11h-6Z"/>',
  eye: '<path d="M2.500 12S6 5.500 12 5.500 21.500 12 21.500 12 18 18.500 12 18.500 2.500 12 2.500 12Z"/><circle cx="12" cy="12" r="2.800"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.500 2.500M15.500 15.500 18 18M18 6l-2.500 2.500M8.500 15.500 6 18"/>',
  facebook: '<path d="M14 8.500h2.500V5H14c-2.200 0-3.500 1.500-3.500 3.600V11H8v3.500h2.500V21H14v-6.500h2.500L17 11h-3V9.200c0-.5.200-.7 1-.7Z"/>',
  instagram: '<rect x="3.500" y="3.500" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.800"/><path d="M17 7h.01"/>',
  tiktok: '<path d="M14 4v10.500a3.500 3.500 0 1 1-3.500-3.500M14 4c.4 2.600 2 4 4.500 4.200"/>',
  discord: '<path d="M7 6.500c1.500-.7 3-1 5-1s3.500.3 5 1c1.800 3 2.700 6 2.700 9.500-1.300 1-2.800 1.600-4.200 1.900l-.9-1.600M7 6.500C5.200 9.500 4.300 12.500 4.300 16c1.300 1 2.800 1.600 4.200 1.900l.9-1.600"/><circle cx="9.500" cy="12" r="1"/><circle cx="14.500" cy="12" r="1"/>',
};

export function icon(name, { size, cls = '', label } = {}) {
  const body = P[name] || P.info;
  const dim = size ? ` width="${size}" height="${size}"` : '';
  const aria = label ? ` role="img" aria-label="${label}"` : ' aria-hidden="true" focusable="false"';
  return raw(`<svg viewBox="0 0 24 24"${dim} class="${cls}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"${aria}>${body}</svg>`);
}
export const filledStar = (cls = '') => raw(`<svg viewBox="0 0 24 24" class="${cls}" fill="currentColor" aria-hidden="true"><path d="m12 3.500 2.600 5.400 5.900.8-4.300 4.100 1 5.800L12 16.800 6.800 19.600l1-5.800L3.500 9.700l5.900-.8Z"/></svg>`);
