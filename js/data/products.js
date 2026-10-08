// Sample catalogue built from real brands/models. PRICES AND SPECS ARE ILLUSTRATIVE TEST DATA, not official.
// Photos: put a file in assets/products/ and register it in photos.js (see assets/products/README.md). Otherwise procedural SVG art is shown.
// Swap this file (and api.js) for a real API/database later.
import { PHOTOS } from './photos.js';
const img = (id, o) => ({ ...o, ...(PHOTOS[id] ? { src: `assets/products/${PHOTOS[id]}` } : {}) });
const base = (cat) => ({ category: cat, rating: 4.7, reviews: 100, featured: false, new: false, bestSeller: false });
const colors = (list) => ({ type: 'Color', options: list.map(([name, hex]) => ({ name, hex, price: 0 })) });
const switchVar = (names) => ({ type: 'Switch', options: names.map((n, i) => ({ name: n, price: 0 })) });
const kit = { type: 'Build', options: [{ name: 'Assembled', price: 0 }, { name: 'Barebones kit', price: -1500 }] };

// id, name, brand, layout, material, switch, price, rating, reviews, stock, flags, art[hue, theme, case], short, specs
const KB_ROWS = [
  ['keychron-q1-pro', 'Keychron Q1 Pro', 'Keychron', '75', 'Aluminum', 'Tactile', 11500, 4.8, 612, 38, 'fb', [190, 'stealth', 'silver'], 'Wireless 75% in full aluminum, gasket mount', { Connectivity: 'USB-C · Bluetooth 5.1', 'Plate material': 'Polycarbonate', 'Mounting style': 'Gasket mount', 'Hot-swap': 'Yes · 3/5-pin' }],
  ['keychron-q2', 'Keychron Q2', 'Keychron', '65', 'Aluminum', 'Linear', 9200, 4.7, 540, 44, 'b', [218, 'stealth', 'blue'], 'Compact 65% with a double-gasket aluminum body', { Connectivity: 'USB-C (wired)', 'Plate material': 'Brass', 'Mounting style': 'Gasket mount', 'Hot-swap': 'Yes' }],
  ['keychron-q3-pro', 'Keychron Q3 Pro', 'Keychron', 'tkl', 'Aluminum', 'Linear', 12400, 4.7, 288, 21, '', [268, 'stealth', 'black'], 'Wireless TKL, QMK/VIA, aluminum case', { Connectivity: 'USB-C · Bluetooth 5.1', 'Plate material': 'Polycarbonate', 'Mounting style': 'Double gasket', 'Hot-swap': 'Yes' }],
  ['keychron-v1', 'Keychron V1', 'Keychron', '75', 'ABS', 'Linear', 5200, 4.6, 903, 90, 'b', [145, 'snow', 'white'], 'Budget 75% custom with knob and QMK', { Connectivity: 'USB-C (wired)', 'Plate material': 'PC', 'Mounting style': 'Gasket mount', 'Hot-swap': 'Yes' }],
  ['keychron-k2', 'Keychron K2', 'Keychron', '75', 'ABS', 'Tactile', 4800, 4.5, 1210, 120, 'b', [28, 'stealth', 'black'], 'Wireless 75% for Mac and Windows', { Connectivity: 'USB-C · Bluetooth 5.1', 'Plate material': 'Steel', 'Mounting style': 'Tray mount', 'Hot-swap': 'Optional' }],
  ['wooting-60he', 'Wooting 60HE', 'Wooting', '60', 'ABS', 'Magnetic', 11900, 4.9, 476, 15, 'fn', [190, 'stealth', 'black'], 'Hall Effect 60% with rapid trigger', { Connectivity: 'USB-C (wired)', 'Plate material': 'PC', 'Mounting style': 'Tray mount', 'Hot-swap': 'Yes · Lekker' }],
  ['wooting-80he', 'Wooting 80HE', 'Wooting', 'tkl', 'ABS', 'Magnetic', 15900, 4.9, 219, 9, 'n', [218, 'stealth', 'black'], 'Hall Effect TKL, adjustable actuation', { Connectivity: 'USB-C (wired)', 'Plate material': 'PC', 'Mounting style': 'Tray mount', 'Hot-swap': 'Yes · Lekker' }],
  ['nuphy-air75-v2', 'NuPhy Air75 V2', 'NuPhy', '75', 'ABS', 'Linear', 6900, 4.6, 701, 52, 'b', [268, 'snow', 'white'], 'Low-profile 75% wireless', { Connectivity: 'USB-C · Bluetooth 5.0 · 2.4 GHz', 'Plate material': 'Aluminum', 'Mounting style': 'Tray mount', 'Hot-swap': 'Yes · low-profile' }],
  ['akko-5075b-plus', 'Akko 5075B Plus', 'Akko', '75', 'ABS', 'Linear', 5600, 4.6, 664, 77, 'b', [190, 'retro', 'white'], 'Tri-mode 75% with gasket mount', { Connectivity: 'USB-C · Bluetooth 5.0 · 2.4 GHz', 'Plate material': 'PC', 'Mounting style': 'Gasket mount', 'Hot-swap': 'Yes' }],
  ['monsgeek-m1', 'MonsGeek M1', 'MonsGeek', '75', 'Aluminum', 'Linear', 7400, 4.7, 391, 33, '', [355, 'cyberpunk', 'purple'], 'Aluminum 75% enthusiast board with knob', { Connectivity: 'USB-C (wired)', 'Plate material': 'PC', 'Mounting style': 'Gasket mount', 'Hot-swap': 'Yes' }],
  ['ducky-one-3-tkl', 'Ducky One 3 TKL', 'Ducky', 'tkl', 'ABS', 'Tactile', 7100, 4.7, 355, 41, 'b', [28, 'samurai', 'black'], 'Doubleshot PBT caps, hot-swap, QUACK mechanism', { Connectivity: 'USB-C (wired)', 'Plate material': 'PC', 'Mounting style': 'Gasket mount', 'Hot-swap': 'Yes' }],
  ['varmilo-va87m', 'Varmilo VA87M', 'Varmilo', 'tkl', 'ABS', 'Tactile', 7800, 4.6, 242, 19, '', [355, 'retro', 'white'], 'Themed dye-sub PBT keycaps, typing-first TKL', { Connectivity: 'USB-C (wired)', 'Plate material': 'Steel', 'Mounting style': 'Tray mount', 'Hot-swap': 'No' }],
  ['leopold-fc980m', 'Leopold FC980M', 'Leopold', 'full', 'ABS', 'Tactile', 7900, 4.7, 188, 24, '', [190, 'snow', 'silver'], 'Classic full-size with a PBT double-shot set', { Connectivity: 'USB-C (wired)', 'Plate material': 'Steel', 'Mounting style': 'Tray mount', 'Hot-swap': 'No' }],
  ['hhkb-professional-hybrid', 'HHKB Professional Hybrid Type-S', 'HHKB', '60', 'ABS', 'Silent', 21900, 4.8, 305, 12, 'f', [145, 'snow', 'white'], 'Topre electro-capacitive minimalist 60%', { Connectivity: 'USB-C · Bluetooth 5.0', 'Plate material': 'Steel', 'Mounting style': 'Tray mount', 'Hot-swap': 'No · Topre' }],
  ['realforce-r3', 'Realforce R3', 'Realforce', 'full', 'ABS', 'Silent', 18900, 4.8, 167, 8, '', [218, 'stealth', 'black'], 'Topre full-size with variable key weight', { Connectivity: 'USB-C · Bluetooth 5.0', 'Plate material': 'Steel', 'Mounting style': 'Tray mount', 'Hot-swap': 'No · Topre' }],
  ['glorious-gmmk-pro', 'Glorious GMMK Pro', 'Glorious', '75', 'Aluminum', 'Linear', 10900, 4.6, 520, 26, '', [190, 'stealth', 'silver'], 'Gasket-mounted aluminum 75% with rotary knob', { Connectivity: 'USB-C (wired)', 'Plate material': 'Aluminum', 'Mounting style': 'Gasket mount', 'Hot-swap': 'Yes' }],
  ['razer-huntsman-v3-pro-tkl', 'Razer Huntsman V3 Pro TKL', 'Razer', 'tkl', 'Aluminum', 'Magnetic', 12900, 4.7, 312, 17, 'n', [145, 'stealth', 'black'], 'Analog optical TKL with rapid trigger', { Connectivity: 'USB-C (wired)', 'Plate material': 'Aluminum', 'Mounting style': 'Tray mount', 'Hot-swap': 'No' }],
  ['logitech-g-pro-x-tkl', 'Logitech G Pro X TKL', 'Logitech G', 'tkl', 'ABS', 'Linear', 9900, 4.6, 450, 36, 'b', [218, 'stealth', 'black'], 'Wireless esports TKL with swappable switches', { Connectivity: 'USB-C · Lightspeed 2.4 GHz', 'Plate material': 'Steel', 'Mounting style': 'Tray mount', 'Hot-swap': 'Yes' }],
  ['epomaker-th80-pro', 'Epomaker TH80 Pro', 'Epomaker', '75', 'ABS', 'Linear', 4400, 4.5, 987, 110, 'b', [268, 'aurora', 'white'], 'Budget gasket-mount 75% with knob', { Connectivity: 'USB-C · Bluetooth 5.0 · 2.4 GHz', 'Plate material': 'PC', 'Mounting style': 'Gasket mount', 'Hot-swap': 'Yes' }],
  ['qk65-v2', 'QwertyKeys QK65 V2', 'QwertyKeys', '65', 'Aluminum', 'Linear', 8800, 4.7, 134, 6, 'n', [28, 'stealth', 'silver'], 'Custom 65% kit, enthusiast classic', { Connectivity: 'USB-C (wired)', 'Plate material': 'Aluminum', 'Mounting style': 'Gasket mount', 'Hot-swap': 'Yes' }],
  ['lemokey-l3', 'Lemokey L3', 'Lemokey', 'tkl', 'Aluminum', 'Linear', 11900, 4.6, 98, 14, 'n', [190, 'stealth', 'silver'], 'Wireless QMK board from Keychron', { Connectivity: 'USB-C · Bluetooth 5.1 · 2.4 GHz', 'Plate material': 'Polycarbonate', 'Mounting style': 'Gasket mount', 'Hot-swap': 'Yes' }],
  ['keychron-q5', 'Keychron Q5', 'Keychron', '96', 'Aluminum', 'Linear', 13200, 4.7, 203, 18, '', [145, 'stealth', 'black'], '96% aluminum with knob and QMK', { Connectivity: 'USB-C (wired)', 'Plate material': 'Brass', 'Mounting style': 'Double gasket', 'Hot-swap': 'Yes' }],
  ['rk61', 'Royal Kludge RK61', 'Royal Kludge', '60', 'ABS', 'Linear', 2400, 4.3, 2140, 200, 'b', [355, 'stealth', 'black'], 'Budget wireless 60% entry board', { Connectivity: 'USB-C · Bluetooth 5.0 · 2.4 GHz', 'Plate material': 'Steel', 'Mounting style': 'Tray mount', 'Hot-swap': 'Yes' }],
  ['ajazz-ak820', 'Ajazz AK820', 'Ajazz', '75', 'ABS', 'Linear', 3500, 4.4, 756, 85, 'b', [190, 'snow', 'white'], 'Budget gasket 75% with screen', { Connectivity: 'USB-C · Bluetooth 5.0 · 2.4 GHz', 'Plate material': 'PC', 'Mounting style': 'Gasket mount', 'Hot-swap': 'Yes' }],
];

const KC_ROWS = [
  ['gmk-laser', 'GMK Laser', 'GMK', 'ABS', 'cyberpunk', 11900, 5, 180, 7, 'f', 'Doubleshot ABS, Cherry profile', 'Double-shot ABS', 'Cherry', '1.5 mm'],
  ['gmk-olivia-plus', 'GMK Olivia++', 'GMK', 'ABS', 'samurai', 10500, 4.9, 210, 5, '', 'Dark with rose-gold legends, doubleshot ABS', 'Double-shot ABS', 'Cherry', '1.5 mm'],
  ['pbtfans-bow', 'PBTfans BOW', 'PBTfans', 'PBT', 'snow', 6900, 4.8, 340, 30, 'b', 'Black on white doubleshot PBT', 'Double-shot PBT', 'Cherry', '1.5 mm'],
  ['pbtfans-blush', 'PBTfans Blush', 'PBTfans', 'PBT', 'retro', 7200, 4.7, 160, 18, '', 'Soft pink doubleshot PBT', 'Double-shot PBT', 'Cherry', '1.5 mm'],
  ['akko-black-gold', 'Akko Black & Gold', 'Akko', 'PBT', 'samurai', 2200, 4.6, 520, 70, 'b', 'ASA-profile PBT with gold legends', 'Double-shot PBT', 'ASA', '1.4 mm'],
  ['akko-cinnamoroll', 'Akko Cinnamoroll', 'Akko', 'PBT', 'snow', 3400, 4.7, 410, 24, 'n', 'Themed dye-sub PBT set', 'Dye-sublimation', 'MDA', '1.4 mm'],
  ['akko-world-tour-tokyo', 'Akko World Tour Tokyo', 'Akko', 'PBT', 'aurora', 3300, 4.7, 290, 36, '', 'Neon city dye-sub PBT', 'Dye-sublimation', 'OSA', '1.4 mm'],
  ['ducky-joker', 'Ducky Joker', 'Ducky', 'PBT', 'cyberpunk', 4200, 4.6, 205, 22, '', 'Purple/green doubleshot PBT', 'Double-shot PBT', 'OEM', '1.5 mm'],
  ['drop-mt3-susuwatari', 'Drop MT3 Susuwatari', 'Drop', 'ABS', 'stealth', 8900, 4.8, 145, 11, '', 'Deep-dish MT3 profile, ABS', 'Double-shot ABS', 'MT3', '1.5 mm'],
  ['varmilo-sakura', 'Varmilo Sakura', 'Varmilo', 'PBT', 'retro', 3600, 4.7, 260, 28, '', 'Floral dye-sub PBT', 'Dye-sublimation', 'Cherry', '1.5 mm'],
  ['epomaker-themed', 'Epomaker Themed PBT', 'Epomaker', 'PBT', 'aurora', 1900, 4.5, 700, 90, 'b', 'Value themed PBT set', 'Dye-sublimation', 'Cherry', '1.4 mm'],
  ['dwarf-factory-artisan', 'Dwarf Factory Artisan', 'Dwarf Factory', 'Resin', 'galaxy', 2900, 4.9, 120, 0, 'n', 'Hand-cast resin artisan, limited', 'Hand-poured resin', 'Cherry (R4)', '—'],
];

const SW_ROWS = [
  ['gateron-oil-king', 'Gateron Oil King', 'Gateron', 'Linear', 1450, 4.9, 640, 160, 'fb', 'Factory-lubed linear, 55 g, deep thock', 55, 62, 'Soft, deep thock', 'Yes'],
  ['gateron-ink-black-v2', 'Gateron Ink Black V2', 'Gateron', 'Linear', 1250, 4.8, 570, 140, 'b', 'Smooth linear, 60 g, black housing', 60, 67, 'Smooth, mid-pitched', 'No'],
  ['cherry-mx-red', 'Cherry MX Red', 'Cherry MX', 'Linear', 1300, 4.6, 880, 190, 'b', 'The classic linear, 45 g', 45, 60, 'Crisp, light', 'No'],
  ['cherry-mx-brown', 'Cherry MX Brown', 'Cherry MX', 'Tactile', 1300, 4.5, 790, 180, '', 'The classic tactile, 45 g', 55, 60, 'Soft, bumpy', 'No'],
  ['kailh-box-white', 'Kailh Box White', 'Kailh', 'Clicky', 1100, 4.6, 410, 75, '', 'Dustproof clicky, 50 g', 50, 60, 'Loud, crisp click', 'No'],
  ['kailh-speed-silver', 'Kailh Speed Silver', 'Kailh', 'Linear', 1050, 4.5, 310, 60, '', 'Short 1.1 mm actuation linear', 45, 50, 'Light, snappy', 'No'],
  ['akko-cream-yellow', 'Akko CS Cream Yellow', 'Akko', 'Linear', 900, 4.6, 520, 130, 'b', 'POM linear, creamy and cheap', 45, 50, 'Creamy, muted', 'Yes'],
  ['ttc-gold-pink', 'TTC Gold Pink', 'TTC', 'Linear', 1200, 4.7, 280, 66, '', 'Pre-lubed linear, 37 g', 37, 45, 'Light, poppy', 'Yes'],
  ['gazzew-boba-u4t', 'Gazzew Boba U4T', 'Gazzew', 'Tactile', 1800, 4.8, 360, 48, 'f', 'Silent tactile with a rounded bump', 62, 68, 'Silent, deep', 'No'],
  ['zealpc-tealios-v2', 'ZealPC Tealios V2', 'ZealPC', 'Linear', 2400, 4.7, 150, 22, '', 'Premium smooth linear, 67 g', 67, 78, 'Clean, bright', 'No'],
  ['outemu-silent-peach', 'Outemu Silent Peach', 'Outemu', 'Silent', 700, 4.3, 430, 140, 'b', 'Budget silent tactile', 55, 60, 'Dampened', 'No'],
  ['wooting-lekker', 'Wooting Lekker', 'Wooting', 'Magnetic', 2600, 4.9, 190, 31, 'n', 'Hall Effect switch, 0.1–4.0 mm adjustable', 40, 45, 'Smooth, neutral', 'Yes'],
];

const FLAG = (f) => ({ featured: f.includes('f'), new: f.includes('n'), bestSeller: f.includes('b') });

const keyboards = KB_ROWS.map(([id, name, brand, layout, material, sw, price, rating, reviews, stock, flags, [hue, theme, caseId], short, spec], i) => ({
  ...base('keyboards'), ...FLAG(flags), id, name, brand, layout, material, switchType: sw, price, rating, reviews, stock, short, addedAt: 40 - i,
  description: `${short}. A ${layout === 'tkl' ? 'tenkeyless' : layout === 'full' ? 'full-size' : layout + '%'} board from ${brand}.`,
  image: img(id, { kind: 'keyboard', layout, hue, theme, case: caseId }),
  variants: [colors([['Default', '#2a2f3d'], ['Alternate', '#e6e9f0']]), ...(spec['Hot-swap'].startsWith('No') ? [] : [switchVar(['Linear', 'Tactile', 'Clicky'])]), kit].filter(Boolean),
  specifications: { Layout: layout === 'tkl' ? 'TKL' : layout === 'full' ? 'Full size' : layout + '%', 'Case material': material === 'ABS' ? 'ABS plastic' : material, 'Plate material': spec['Plate material'], PCB: spec['Hot-swap'], 'Mounting style': spec['Mounting style'], Connectivity: spec.Connectivity, Brand: brand },
}));

const keycaps = KC_ROWS.map(([id, name, brand, material, theme, price, rating, reviews, stock, flags, short, method, profile, thick], i) => ({
  ...base('keycaps'), ...FLAG(flags), id, name, brand, material, theme, price, rating, reviews, stock, short, addedAt: 30 - i,
  description: `${short}. From ${brand}.`,
  image: img(id, { kind: material === 'Resin' ? 'artisan' : 'keycaps', theme }),
  variants: [{ type: 'Kit', options: [{ name: 'Base kit', price: 0 }, { name: 'Base + Novelties', price: Math.round(price * 0.25) }] }],
  specifications: { Material: material, Profile: profile, Compatibility: 'MX-style stems', 'Manufacturing method': method, Thickness: thick, Brand: brand },
}));

const switches = SW_ROWS.map(([id, name, brand, type, price, rating, reviews, stock, flags, short, act, bottom, sound, lube], i) => ({
  ...base('switches'), ...FLAG(flags), id, name, brand, switchType: type, price, rating, reviews, stock, short, addedAt: 20 - i,
  description: `${short}. By ${brand}, sold in packs of 70.`,
  image: img(id, { kind: 'switch', switchType: type.toLowerCase(), hue: { Linear: 355, Tactile: 28, Clicky: 218, Silent: 268, Magnetic: 190 }[type] }),
  variants: [{ type: 'Pack', options: [{ name: '35 pcs', price: -Math.round(price * 0.4) }, { name: '70 pcs', price: 0 }, { name: '110 pcs', price: Math.round(price * 0.5) }] }],
  specifications: { 'Switch type': type, 'Actuation force': `${act} gf`, 'Bottom-out force': `${bottom} gf`, 'Total travel': type === 'Magnetic' ? '4.0 mm (adjustable)' : '3.6–4.0 mm', 'Sound profile': sound, 'Factory lubrication': lube, Brand: brand },
}));

export const PRODUCTS = [...keyboards, ...keycaps, ...switches];

export const CATEGORIES = [
  { id: 'keyboards', name: 'Keyboards', icon: 'keyboard', blurb: 'Keychron, Wooting, NuPhy, Akko, HHKB and more.', tags: ['60%', '65%', '75%', 'TKL', '96%', 'Full Size'], hue: 190 },
  { id: 'keycaps', name: 'Keycaps', icon: 'keycap', blurb: 'GMK, PBTfans, Akko, Ducky and artisan sets.', tags: ['PBT', 'ABS', 'Double-shot', 'Artisan', 'Themed sets', 'Custom sets'], hue: 268 },
  { id: 'switches', name: 'Switches', icon: 'switch', blurb: 'Gateron, Cherry, Kailh, Gazzew, Wooting and more.', tags: ['Linear', 'Tactile', 'Clicky', 'Silent', 'Magnetic'], hue: 28 },
];
