// Keycap sets, case finishes, plates, RGB palettes and switch profiles shared by the builder, previews and products.
export const KEYCAP_SETS = {
  stealth: { id: 'stealth', name: 'Stealth Black', alpha: '#242837', mod: '#343a4e', accent: '#4a5470', legend: '#d6dcec', price: 0, desc: 'Included. Matte black PBT, quiet and neutral.' },
  cyberpunk: { id: 'cyberpunk', name: 'Cyberpunk PBT', alpha: '#1c1340', mod: '#2f1d63', accent: '#ff2bd6', legend: '#44f3ff', price: 2490, desc: 'Violet base with neon pink and cyan legends.' },
  samurai: { id: 'samurai', name: 'Midnight Samurai', alpha: '#15171c', mod: '#252931', accent: '#d9363b', legend: '#ececf0', price: 2890, desc: 'Ink black with a single vermilion accent.' },
  aurora: { id: 'aurora', name: 'Aurora Gradient', alpha: '#1d2e3d', mod: '#2f6169', accent: '#79f0c1', legend: '#dcfff3', price: 3290, desc: 'Deep teal fading into northern-lights green.' },
  retro: { id: 'retro', name: 'Retro Cream', alpha: '#e7ddc4', mod: '#bcb094', accent: '#cf5238', legend: '#3b382f', price: 1790, desc: 'Warm beige with 80s terminal modifiers.' },
  snow: { id: 'snow', name: 'Snow White', alpha: '#eceff5', mod: '#c7ccd8', accent: '#8f98ad', legend: '#2a2f3d', price: 1590, desc: 'Clean white PBT, bright and minimal.' },
  galaxy: { id: 'galaxy', name: 'Artisan Galaxy', alpha: '#161236', mod: '#271f60', accent: '#8b5cff', legend: '#cdc2ff', price: 1490, desc: 'Resin nebula artisan on a violet set.' },
};
export const CASES = {
  black: { id: 'black', name: 'Black', fill: '#14161c', edge: '#272b38', price: 0, swatch: '#14161c' },
  white: { id: 'white', name: 'White', fill: '#e6e9f0', edge: '#ffffff', price: 0, swatch: '#e6e9f0' },
  silver: { id: 'silver', name: 'Silver', fill: '#a4abb8', edge: '#d4d9e2', price: 300, swatch: '#a4abb8' },
  purple: { id: 'purple', name: 'Purple', fill: '#4a2cb3', edge: '#6f55d6', price: 400, swatch: '#4a2cb3' },
  blue: { id: 'blue', name: 'Blue', fill: '#1b4fd6', edge: '#4a79ee', price: 400, swatch: '#1b4fd6' },
  transparent: { id: 'transparent', name: 'Transparent', fill: 'rgba(255,255,255,.1)', edge: 'rgba(255,255,255,.4)', price: 900, swatch: 'linear-gradient(135deg,#ffffff55,#ffffff12)' },
};
export const PLATES = {
  aluminum: { id: 'aluminum', name: 'Aluminum', price: 0, note: 'Crisp, stiff, slightly higher pitch' },
  polycarbonate: { id: 'polycarbonate', name: 'Polycarbonate', price: 200, note: 'Flexible and soft, deeper sound' },
  fr4: { id: 'fr4', name: 'FR4', price: 100, note: 'Balanced, a touch of flex' },
  brass: { id: 'brass', name: 'Brass', price: 900, note: 'Heavy and resonant, a bass-forward thock' },
};
export const RGB_COLORS = [
  { id: 'cyan', name: 'Cyan', h: 190 },
  { id: 'purple', name: 'Purple', h: 268 },
  { id: 'blue', name: 'Blue', h: 218 },
  { id: 'red', name: 'Red', h: 355 },
  { id: 'green', name: 'Green', h: 145 },
  { id: 'orange', name: 'Orange', h: 28 },
];
export const RGB_EFFECTS = [
  { id: 'static', name: 'Static' }, { id: 'wave', name: 'Wave' }, { id: 'rainbow', name: 'Rainbow' },
  { id: 'breathing', name: 'Breathing' }, { id: 'reactive', name: 'Reactive' }, { id: 'aurora', name: 'Aurora' },
];
export const SWITCH_TYPES = {
  linear: { id: 'linear', name: 'Linear', price: 990, blurb: 'Smooth, uninterrupted travel.', smooth: 92, tactile: 8, sound: 38, force: 45, travel: 4.0, act: 2.0, feel: 'Silky and fast, nothing to bump into.', use: 'Gaming, fast typing', color: '#e5484d' },
  tactile: { id: 'tactile', name: 'Tactile', price: 1190, blurb: 'A satisfying bump at the actuation point.', smooth: 62, tactile: 78, sound: 52, force: 55, travel: 4.0, act: 2.0, feel: 'A clear bump tells you the key registered.', use: 'Programming, writing', color: '#c4813f' },
  clicky: { id: 'clicky', name: 'Clicky', price: 1090, blurb: 'Tactile bump plus an audible click.', smooth: 48, tactile: 85, sound: 92, force: 60, travel: 4.0, act: 2.2, feel: 'Bump and a crisp click on every press.', use: 'Typewriter fans, solo desks', color: '#3b82f6' },
  silent: { id: 'silent', name: 'Silent', price: 1290, blurb: 'Dampened stems for whisper-quiet typing.', smooth: 74, tactile: 20, sound: 10, force: 45, travel: 3.8, act: 1.9, feel: 'Cushioned bottom-out, almost no noise.', use: 'Offices, shared spaces', color: '#a08cf5' },
  magnetic: { id: 'magnetic', name: 'Magnetic', price: 1990, blurb: 'Hall Effect sensing with adjustable actuation.', smooth: 96, tactile: 5, sound: 34, force: 40, travel: 4.0, act: 0.1, feel: 'Feather-light with 0.1–4.0 mm adjustable actuation.', use: 'Esports, rapid trigger', color: '#22d3ee' },
};
export const BASE_PRICE = { '60': 2990, '65': 3490, '75': 4290, tkl: 4690, '96': 5490, full: 5990 };
