// Keyboard geometry in key units. Shared by the DOM keyboard and the SVG product art.
// Every key: { l: legend, n: name, c: KeyboardEvent.code, t: 'a' alpha | 'm' modifier | 'x' accent, x, y, w, h }
export const LAYOUTS = {
  '60': { id: '60', label: '60%', keys: 61, blurb: 'Ultra-compact, no arrows' },
  '65': { id: '65', label: '65%', keys: 68, blurb: 'Compact with arrow keys' },
  '75': { id: '75', label: '75%', keys: 84, blurb: 'Function row, no gap' },
  tkl: { id: 'tkl', label: 'TKL', keys: 87, blurb: 'Tenkeyless classic' },
  '96': { id: '96', label: '96%', keys: 101, blurb: 'Full features, compressed' },
  full: { id: 'full', label: 'Full Size', keys: 104, blurb: 'Everything, numpad too' },
};
export const LAYOUT_IDS = Object.keys(LAYOUTS);

const SYM = { '-': 'Minus', '=': 'Equal', '[': 'BracketLeft', ']': 'BracketRight', '\\': 'Backslash', ';': 'Semicolon', "'": 'Quote', ',': 'Comma', '.': 'Period', '/': 'Slash', '`': 'Backquote' };
const SYM_NAME = { '-': 'Minus', '=': 'Equals', '[': 'Left Bracket', ']': 'Right Bracket', '\\': 'Backslash', ';': 'Semicolon', "'": 'Apostrophe', ',': 'Comma', '.': 'Period', '/': 'Slash', '`': 'Backtick' };

function code(l) {
  if (/^[A-Z]$/.test(l)) return 'Key' + l;
  if (/^[0-9]$/.test(l)) return 'Digit' + l;
  return SYM[l] || l;
}
const K = (l, w = 1, t = 'a', c, n, h = 1) => ({
  l, w, t, h, c: c || code(l),
  n: n || (/^[A-Z]$/.test(l) ? `Key ${l}` : /^[0-9]$/.test(l) ? `Digit ${l}` : SYM_NAME[l] || l),
});
const G = (w) => ({ gap: w });

const row = (first) => [
  K(first, 1, 'x', first === 'Esc' ? 'Escape' : 'Backquote', first === 'Esc' ? 'Escape' : 'Backtick'),
  ...'1234567890'.split('').map((d) => K(d)),
  K('-'), K('='),
];
const R1 = (first, right) => [...row(first), K('Bksp', 2, 'm', 'Backspace', 'Backspace'), ...(right ? [K(right, 1, 'm', right === 'Del' ? 'Delete' : right, right)] : [])];
const R2 = (right) => [K('Tab', 1.5, 'm', 'Tab'), ...'QWERTYUIOP'.split('').map((l) => K(l)), K('['), K(']'), K('\\', 1.5, 'm'), ...(right ? [K(right, 1, 'm', right === 'PgUp' ? 'PageUp' : right, right)] : [])];
const R3 = (right) => [K('Caps', 1.75, 'm', 'CapsLock', 'Caps Lock'), ...'ASDFGHJKL'.split('').map((l) => K(l)), K(';'), K("'"), K('Enter', 2.25, 'x', 'Enter'), ...(right ? [K(right, 1, 'm', right === 'PgDn' ? 'PageDown' : right, right)] : [])];
const R4 = (compact) => compact
  ? [K('Shift', 2.25, 'm', 'ShiftLeft', 'Left Shift'), ...'ZXCVBNM'.split('').map((l) => K(l)), K(','), K('.'), K('/'), K('Shift', 1.75, 'm', 'ShiftRight', 'Right Shift'), K('↑', 1, 'm', 'ArrowUp', 'Up'), K('End', 1, 'm')]
  : [K('Shift', 2.25, 'm', 'ShiftLeft', 'Left Shift'), ...'ZXCVBNM'.split('').map((l) => K(l)), K(','), K('.'), K('/'), K('Shift', 2.75, 'm', 'ShiftRight', 'Right Shift')];
const R5 = (compact) => compact
  ? [K('Ctrl', 1.25, 'm', 'ControlLeft', 'Left Ctrl'), K('Win', 1.25, 'm', 'MetaLeft', 'Left Win'), K('Alt', 1.25, 'm', 'AltLeft', 'Left Alt'), K('', 6.25, 'a', 'Space', 'Space'), K('Alt', 1, 'm', 'AltRight', 'Right Alt'), K('Fn', 1, 'm', 'Fn', 'Fn'), K('Ctrl', 1, 'm', 'ControlRight', 'Right Ctrl'), K('←', 1, 'm', 'ArrowLeft', 'Left'), K('↓', 1, 'm', 'ArrowDown', 'Down'), K('→', 1, 'm', 'ArrowRight', 'Right')]
  : [K('Ctrl', 1.25, 'm', 'ControlLeft', 'Left Ctrl'), K('Win', 1.25, 'm', 'MetaLeft', 'Left Win'), K('Alt', 1.25, 'm', 'AltLeft', 'Left Alt'), K('', 6.25, 'a', 'Space', 'Space'), K('Alt', 1.25, 'm', 'AltRight', 'Right Alt'), K('Win', 1.25, 'm', 'MetaRight', 'Right Win'), K('Menu', 1.25, 'm', 'ContextMenu', 'Menu'), K('Ctrl', 1.25, 'm', 'ControlRight', 'Right Ctrl')];

const fnKeys = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => K('F' + (a + i), 1, 'm', 'F' + (a + i)));
const FN_TENKEY = [K('Esc', 1, 'x', 'Escape', 'Escape'), G(1), ...fnKeys(1, 4), G(0.5), ...fnKeys(5, 8), G(0.5), ...fnKeys(9, 12)];
const FN_COMPACT = [K('Esc', 1, 'x', 'Escape', 'Escape'), ...fnKeys(1, 12), K('Prt', 1, 'm', 'PrintScreen', 'Print Screen'), K('Ins', 1, 'm', 'Insert', 'Insert'), K('Home', 1, 'm', 'Home')];

function place(rows, x0, y0, out) {
  rows.forEach((r, ri) => {
    let x = x0;
    r.forEach((k) => {
      if (k.gap) { x += k.gap; return; }
      out.push({ ...k, x, y: y0 + ri });
      x += k.w;
    });
  });
}
function placeAt(items, out) {
  items.forEach(([k, x, y]) => out.push({ ...k, x, y }));
}

const NAV = (x) => [
  [K('PrtSc', 1, 'm', 'PrintScreen', 'Print Screen'), x, 0], [K('ScrLk', 1, 'm', 'ScrollLock', 'Scroll Lock'), x + 1, 0], [K('Pause', 1, 'm', 'Pause'), x + 2, 0],
  [K('Ins', 1, 'm', 'Insert', 'Insert'), x, 1.5], [K('Home', 1, 'm'), x + 1, 1.5], [K('PgUp', 1, 'm', 'PageUp', 'Page Up'), x + 2, 1.5],
  [K('Del', 1, 'm', 'Delete', 'Delete'), x, 2.5], [K('End', 1, 'm'), x + 1, 2.5], [K('PgDn', 1, 'm', 'PageDown', 'Page Down'), x + 2, 2.5],
  [K('↑', 1, 'm', 'ArrowUp', 'Up'), x + 1, 4.5],
  [K('←', 1, 'm', 'ArrowLeft', 'Left'), x, 5.5], [K('↓', 1, 'm', 'ArrowDown', 'Down'), x + 1, 5.5], [K('→', 1, 'm', 'ArrowRight', 'Right'), x + 2, 5.5],
];
const NUMPAD = (x) => {
  const n = (l, c, nm) => K(l, 1, 'm', c, nm);
  return [
    [n('Num', 'NumLock', 'Num Lock'), x, 1.5], [n('/', 'NumpadDivide', 'Numpad /'), x + 1, 1.5], [n('*', 'NumpadMultiply', 'Numpad *'), x + 2, 1.5], [n('-', 'NumpadSubtract', 'Numpad -'), x + 3, 1.5],
    [n('7', 'Numpad7', 'Numpad 7'), x, 2.5], [n('8', 'Numpad8', 'Numpad 8'), x + 1, 2.5], [n('9', 'Numpad9', 'Numpad 9'), x + 2, 2.5], [K('+', 1, 'm', 'NumpadAdd', 'Numpad +', 2), x + 3, 2.5],
    [n('4', 'Numpad4', 'Numpad 4'), x, 3.5], [n('5', 'Numpad5', 'Numpad 5'), x + 1, 3.5], [n('6', 'Numpad6', 'Numpad 6'), x + 2, 3.5],
    [n('1', 'Numpad1', 'Numpad 1'), x, 4.5], [n('2', 'Numpad2', 'Numpad 2'), x + 1, 4.5], [n('3', 'Numpad3', 'Numpad 3'), x + 2, 4.5], [K('Ent', 1, 'x', 'NumpadEnter', 'Numpad Enter', 2), x + 3, 4.5],
    [K('0', 2, 'm', 'Numpad0', 'Numpad 0'), x, 5.5], [n('.', 'NumpadDecimal', 'Numpad .'), x + 2, 5.5],
  ];
};

const cache = {};
export function getLayout(id = '65') {
  if (cache[id]) return cache[id];
  const keys = [];
  let W = 15, H = 5;
  if (id === '60') {
    place([R1('Esc'), R2(), R3(), R4(false), R5(false)], 0, 0, keys);
  } else if (id === '65') {
    W = 16;
    place([R1('Esc', 'Del'), R2('PgUp'), R3('PgDn'), R4(true), R5(true)], 0, 0, keys);
  } else if (id === '75') {
    W = 16; H = 6.5;
    place([FN_COMPACT], 0, 0, keys);
    place([R1('`', 'Del'), R2('PgUp'), R3('PgDn'), R4(true), R5(true)], 0, 1.5, keys);
  } else if (id === 'tkl') {
    W = 18.5; H = 6.5;
    place([FN_TENKEY], 0, 0, keys);
    place([R1('`'), R2(), R3(), R4(false), R5(false)], 0, 1.5, keys);
    placeAt(NAV(15.5), keys);
  } else if (id === '96') {
    W = 20.5; H = 6.5;
    place([FN_COMPACT], 0, 0, keys);
    place([R1('`', 'Del'), R2('PgUp'), R3('PgDn'), R4(true), R5(true)], 0, 1.5, keys);
    placeAt(NUMPAD(16.5), keys);
  } else {
    W = 23; H = 6.5;
    place([FN_TENKEY], 0, 0, keys);
    place([R1('`'), R2(), R3(), R4(false), R5(false)], 0, 1.5, keys);
    placeAt(NAV(15.5), keys);
    placeAt(NUMPAD(19), keys);
  }
  // Ensure numpad block starts at the right y for 96% (rows are at 1.5+). Fn row sits at y=0.
  keys.forEach((k, i) => { k.i = i; k.cx = +(k.x + k.w / 2).toFixed(2); k.cy = +(k.y + k.h / 2).toFixed(2); });
  return (cache[id] = { id, W, H, keys });
}

// Physical-key lookup for the interactive keyboard.
export const keyIndexByCode = (layout) => {
  const m = new Map();
  layout.keys.forEach((k) => { if (!m.has(k.c)) m.set(k.c, k); });
  return m;
};
