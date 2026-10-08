// Sample catalogue. Swap this file (and api.js) for a real API/database later:
// every product is plain JSON and `image` is a descriptor rendered by components/ProductArt.js.
const colors = (list) => ({ type: 'Color', options: list.map(([name, hex]) => ({ name, hex, price: 0 })) });
const switchVar = { type: 'Switch', options: [{ name: 'Linear', price: 0 }, { name: 'Tactile', price: 0 }, { name: 'Clicky', price: 0 }] };
const kit = { type: 'Build', options: [{ name: 'Assembled', price: 0 }, { name: 'Barebones kit', price: -1500 }] };

const KB = (o) => ({ category: 'keyboards', rating: 4.7, reviews: 100, featured: false, new: false, bestSeller: false, ...o });
const KC = (o) => ({ category: 'keycaps', rating: 4.7, reviews: 100, featured: false, new: false, bestSeller: false, ...o });
const SW = (o) => ({ category: 'switches', rating: 4.7, reviews: 100, featured: false, new: false, bestSeller: false, ...o });

export const PRODUCTS = [
  KB({
    id: 'nova-65', name: 'Nova 65 Mechanical Keyboard', layout: '65', material: 'Aluminum', switchType: 'Linear',
    description: 'A gasket-mounted 65% in CNC aluminum with a tri-mode wireless PCB, hot-swap sockets and pre-lubed stabilizers. Quiet, balanced and ready out of the box.',
    short: 'Gasket-mount 65% with tri-mode wireless', price: 6490, rating: 4.8, reviews: 214, stock: 38, featured: true, bestSeller: true, addedAt: 20,
    image: { kind: 'keyboard', layout: '65', hue: 190, theme: 'stealth', case: 'black' },
    variants: [colors([['Obsidian', '#14161c'], ['Arctic', '#e6e9f0'], ['Violet', '#4a2cb3'], ['Ocean', '#1b4fd6']]), switchVar, kit],
    specifications: { Layout: '65% · 68 keys', 'Case material': 'CNC aluminum', 'Plate material': 'FR4', PCB: 'Hot-swap, south-facing RGB, 1000 Hz', 'Mounting style': 'Gasket mount', Connectivity: 'USB-C · Bluetooth 5.1 · 2.4 GHz', Battery: '4000 mAh (up to 90 h, RGB off)', Dimensions: '325 × 118 × 28 mm', Weight: '1.62 kg' },
  }),
  KB({
    id: 'aurora-75-pro', name: 'Aurora 75 Pro', layout: '75', material: 'Aluminum', switchType: 'Tactile',
    description: 'A 75% flagship with a rotary knob, per-key aurora lighting and a brass-weighted base. Foam-dampened for a deep, creamy sound.',
    short: '75% with knob, brass weight and aurora RGB', price: 8990, rating: 4.9, reviews: 167, stock: 14, featured: true, new: true, addedAt: 29,
    image: { kind: 'keyboard', layout: '75', hue: 268, theme: 'aurora', case: 'purple' },
    variants: [colors([['Twilight', '#4a2cb3'], ['Obsidian', '#14161c'], ['Silver', '#a4abb8']]), switchVar, kit],
    specifications: { Layout: '75% · 84 keys + knob', 'Case material': 'CNC aluminum, brass weight', 'Plate material': 'Polycarbonate', PCB: 'Hot-swap, per-key RGB, VIA/QMK', 'Mounting style': 'Gasket mount', Connectivity: 'USB-C · Bluetooth 5.1 · 2.4 GHz', Battery: '5000 mAh', Dimensions: '328 × 138 × 31 mm', Weight: '2.05 kg' },
  }),
  KB({
    id: 'titan-tkl', name: 'Titan TKL', layout: 'tkl', material: 'Aluminum', switchType: 'Tactile',
    description: 'A heavyweight tenkeyless built like a tool: full aluminum case, steel plate and a wired-only PCB with zero latency.',
    short: 'Tenkeyless, full aluminum, wired', price: 7990, rating: 4.7, reviews: 142, stock: 22, bestSeller: true, addedAt: 12,
    image: { kind: 'keyboard', layout: 'tkl', hue: 355, theme: 'samurai', case: 'black' },
    variants: [colors([['Graphite', '#14161c'], ['Silver', '#a4abb8']]), switchVar, kit],
    specifications: { Layout: 'TKL · 87 keys', 'Case material': 'Anodized aluminum', 'Plate material': 'Brass', PCB: 'Hot-swap, USB polling 8000 Hz', 'Mounting style': 'Top mount', Connectivity: 'USB-C (detachable)', Battery: 'None (wired)', Dimensions: '358 × 140 × 34 mm', Weight: '2.4 kg' },
  }),
  KB({
    id: 'pulse-60', name: 'Pulse 60', layout: '60', material: 'Polycarbonate', switchType: 'Linear',
    description: 'A translucent polycarbonate 60% that turns every lighting effect into a glowing case. Small footprint, big personality.',
    short: 'Translucent 60% with glowing case', price: 3990, rating: 4.6, reviews: 308, stock: 61, bestSeller: true, addedAt: 8,
    image: { kind: 'keyboard', layout: '60', hue: 218, theme: 'snow', case: 'transparent' },
    variants: [colors([['Frost', '#b9c4dd'], ['Smoke', '#2a2e3a']]), switchVar, kit],
    specifications: { Layout: '60% · 61 keys', 'Case material': 'Polycarbonate', 'Plate material': 'Polycarbonate', PCB: 'Hot-swap, south-facing RGB', 'Mounting style': 'Tray mount', Connectivity: 'USB-C · Bluetooth 5.0', Battery: '3000 mAh', Dimensions: '294 × 104 × 24 mm', Weight: '0.78 kg' },
  }),
  KB({
    id: 'eclipse-96', name: 'Eclipse 96', layout: '96', material: 'Aluminum', switchType: 'Linear',
    description: 'All the keys of a full-size in a footprint that leaves room for your mouse. Eclipse pairs a solid aluminum shell with a gasket plate and sound-tuned foam.',
    short: '96% compact full-size with numpad', price: 9490, rating: 4.8, reviews: 93, stock: 9, new: true, addedAt: 27,
    image: { kind: 'keyboard', layout: '96', hue: 28, theme: 'cyberpunk', case: 'black' },
    variants: [colors([['Eclipse Black', '#14161c'], ['Moon White', '#e6e9f0']]), switchVar, kit],
    specifications: { Layout: '96% · 101 keys', 'Case material': 'CNC aluminum', 'Plate material': 'FR4', PCB: 'Hot-swap, per-key RGB', 'Mounting style': 'Gasket mount', Connectivity: 'USB-C · Bluetooth 5.1 · 2.4 GHz', Battery: '6000 mAh', Dimensions: '383 × 135 × 30 mm', Weight: '2.2 kg' },
  }),
  KB({
    id: 'atlas-full', name: 'Atlas Full Size', layout: 'full', material: 'Aluminum', switchType: 'Silent',
    description: 'The complete 104-key experience for accountants, analysts and anyone who lives in spreadsheets. Silent switches and a dampened case keep the office peaceful.',
    short: 'Full-size, silent switches, dampened case', price: 10990, rating: 4.7, reviews: 71, stock: 17, addedAt: 3,
    image: { kind: 'keyboard', layout: 'full', hue: 145, theme: 'retro', case: 'silver' },
    variants: [colors([['Silver', '#a4abb8'], ['Black', '#14161c']]), { type: 'Switch', options: [{ name: 'Silent', price: 0 }, { name: 'Linear', price: 0 }, { name: 'Tactile', price: 0 }] }, kit],
    specifications: { Layout: 'Full size · 104 keys', 'Case material': 'Aluminum', 'Plate material': 'FR4', PCB: 'Hot-swap, white backlight', 'Mounting style': 'Gasket mount', Connectivity: 'USB-C · Bluetooth 5.1', Battery: '8000 mAh', Dimensions: '440 × 135 × 32 mm', Weight: '2.6 kg' },
  }),

  KC({
    id: 'cyberpunk-pbt', name: 'Cyberpunk PBT Keycap Set', material: 'PBT', theme: 'cyberpunk',
    description: 'Neon legends over a violet base. Thick PBT with a dye-sublimated finish that will not shine or fade.',
    short: '140-key dye-sub PBT in violet and neon', price: 2490, rating: 4.8, reviews: 189, stock: 44, featured: true, bestSeller: true, addedAt: 18,
    image: { kind: 'keycaps', theme: 'cyberpunk' },
    variants: [{ type: 'Kit', options: [{ name: 'Base kit (140)', price: 0 }, { name: 'Base + Novelties (160)', price: 600 }] }],
    specifications: { Material: 'PBT', Profile: 'Cherry', Compatibility: 'MX-style stems · 60%–Full size · ISO & ANSI', 'Number of keys': '140', 'Manufacturing method': 'Dye-sublimation', Thickness: '1.5 mm' },
  }),
  KC({
    id: 'midnight-samurai', name: 'Midnight Samurai Keycaps', material: 'PBT', theme: 'samurai',
    description: 'Ink-black double-shot PBT with a single vermilion accent on the modifiers. Restraint, executed well.',
    short: 'Double-shot PBT, black with red accents', price: 2890, rating: 4.9, reviews: 156, stock: 31, featured: true, addedAt: 22,
    image: { kind: 'keycaps', theme: 'samurai' },
    variants: [{ type: 'Kit', options: [{ name: 'Base kit (135)', price: 0 }, { name: 'Base + Numpad (151)', price: 500 }] }],
    specifications: { Material: 'PBT', Profile: 'OEM', Compatibility: 'MX-style stems · ANSI', 'Number of keys': '135', 'Manufacturing method': 'Double-shot injection', Thickness: '1.6 mm' },
  }),
  KC({
    id: 'aurora-gradient', name: 'Aurora Gradient Keycaps', material: 'ABS', theme: 'aurora',
    description: 'A gradient that flows from deep teal to northern-lights green across the whole board. Shine-through legends make it glow with RGB.',
    short: 'Double-shot ABS gradient, shine-through', price: 3290, rating: 4.7, reviews: 84, stock: 19, new: true, featured: true, addedAt: 28,
    image: { kind: 'keycaps', theme: 'aurora' },
    variants: [{ type: 'Kit', options: [{ name: 'Base kit (130)', price: 0 }, { name: 'Base + Accents (150)', price: 700 }] }],
    specifications: { Material: 'ABS', Profile: 'SA-low', Compatibility: 'MX-style stems · 60%–TKL', 'Number of keys': '130', 'Manufacturing method': 'Double-shot injection', Thickness: '1.4 mm' },
  }),
  KC({
    id: 'retro-cream', name: 'Retro Cream Keycaps', material: 'ABS', theme: 'retro',
    description: 'The warm beige of 1980s terminals with muted orange modifiers. Smooth ABS, and it will yellow beautifully with age.',
    short: 'Beige ABS with terminal-style modifiers', price: 1790, rating: 4.6, reviews: 262, stock: 80, bestSeller: true, addedAt: 5,
    image: { kind: 'keycaps', theme: 'retro' },
    variants: [{ type: 'Kit', options: [{ name: 'Base kit (118)', price: 0 }, { name: 'Base + Numpad (134)', price: 400 }] }],
    specifications: { Material: 'ABS', Profile: 'Cherry', Compatibility: 'MX-style stems · ANSI & ISO', 'Number of keys': '118', 'Manufacturing method': 'Double-shot injection', Thickness: '1.3 mm' },
  }),
  KC({
    id: 'artisan-galaxy', name: 'Artisan Galaxy Keycap', material: 'Resin', theme: 'galaxy',
    description: 'A hand-poured resin artisan with a suspended nebula and flecks of gold leaf. Every cap is unique. Limited run of 200.',
    short: 'Hand-poured resin artisan, one of 200', price: 1490, rating: 5, reviews: 47, stock: 0, addedAt: 24,
    image: { kind: 'artisan', theme: 'galaxy' },
    variants: [{ type: 'Colorway', options: [{ name: 'Nebula', price: 0, hex: '#8b5cff' }, { name: 'Supernova', price: 0, hex: '#ff7a3d' }, { name: 'Aurora', price: 0, hex: '#3ee0a8' }] }],
    specifications: { Material: 'Resin', Profile: 'Cherry (R4)', Compatibility: 'MX-style stems', 'Number of keys': '1 artisan', 'Manufacturing method': 'Hand-poured resin casting', Edition: 'Limited, 200 pieces' },
  }),

  SW({
    id: 'frost-linear', name: 'Frost Linear Switch', switchType: 'Linear', theme: 'cyan',
    description: 'A factory-lubed linear with a polished stem and a light 45 g spring. Smooth from the first millimeter to the bottom.',
    short: 'Smooth 45 g linear, pre-lubed', price: 990, rating: 4.8, reviews: 341, stock: 120, featured: true, bestSeller: true, addedAt: 14,
    image: { kind: 'switch', switchType: 'linear', hue: 190 },
    variants: [{ type: 'Pack', options: [{ name: '35 pcs', price: -400 }, { name: '70 pcs', price: 0 }, { name: '110 pcs', price: 520 }] }],
    specifications: { 'Switch type': 'Linear', 'Actuation force': '45 gf', 'Bottom-out force': '50 gf', 'Pre-travel': '2.0 mm', 'Total travel': '3.6 mm', 'Sound profile': 'Soft, mid-pitched thock', 'Factory lubrication': 'Yes, Krytox 205g0 on stem & rails' },
  }),
  SW({
    id: 'ember-tactile', name: 'Ember Tactile Switch', switchType: 'Tactile', theme: 'orange',
    description: 'A rounded tactile bump at the top of the stroke gives clear feedback without the harshness of older designs.',
    short: 'Rounded tactile bump, 55 g', price: 1190, rating: 4.7, reviews: 229, stock: 96, addedAt: 11,
    image: { kind: 'switch', switchType: 'tactile', hue: 28 },
    variants: [{ type: 'Pack', options: [{ name: '35 pcs', price: -450 }, { name: '70 pcs', price: 0 }, { name: '110 pcs', price: 600 }] }],
    specifications: { 'Switch type': 'Tactile', 'Actuation force': '55 gf', 'Bottom-out force': '62 gf', 'Pre-travel': '2.0 mm', 'Total travel': '3.8 mm', 'Sound profile': 'Warm, medium', 'Factory lubrication': 'Yes, light film on stem' },
  }),
  SW({
    id: 'silent-night', name: 'Silent Night Switch', switchType: 'Silent', theme: 'purple',
    description: 'Dampening pads at the top and bottom of the stroke take the clack out of every keystroke. Ideal for shared rooms.',
    short: 'Dampened silent linear, 45 g', price: 1290, rating: 4.6, reviews: 175, stock: 74, addedAt: 9,
    image: { kind: 'switch', switchType: 'silent', hue: 268 },
    variants: [{ type: 'Pack', options: [{ name: '35 pcs', price: -480 }, { name: '70 pcs', price: 0 }, { name: '110 pcs', price: 640 }] }],
    specifications: { 'Switch type': 'Silent linear', 'Actuation force': '45 gf', 'Bottom-out force': '52 gf', 'Pre-travel': '1.9 mm', 'Total travel': '3.8 mm', 'Sound profile': 'Near-silent, cushioned', 'Factory lubrication': 'Yes, dry film on slider' },
  }),
  SW({
    id: 'crystal-clicky', name: 'Crystal Clicky Switch', switchType: 'Clicky', theme: 'blue',
    description: 'A click-jacket mechanism gives a crisp, high-pitched click at actuation. Loud, bright, and unapologetically satisfying.',
    short: 'Crisp click jacket, 50 g', price: 1090, rating: 4.5, reviews: 118, stock: 8, addedAt: 6,
    image: { kind: 'switch', switchType: 'clicky', hue: 218 },
    variants: [{ type: 'Pack', options: [{ name: '35 pcs', price: -420 }, { name: '70 pcs', price: 0 }, { name: '110 pcs', price: 560 }] }],
    specifications: { 'Switch type': 'Clicky', 'Actuation force': '50 gf', 'Bottom-out force': '60 gf', 'Pre-travel': '2.2 mm', 'Total travel': '3.8 mm', 'Sound profile': 'Loud, high-pitched click', 'Factory lubrication': 'No, clean for clear clicks' },
  }),
  SW({
    id: 'magnetic-pro', name: 'Magnetic Pro Switch', switchType: 'Magnetic', theme: 'cyan',
    description: 'Hall Effect sensing with adjustable actuation from 0.1 to 4.0 mm and rapid trigger. Requires a compatible Hall Effect PCB.',
    short: 'Hall Effect, adjustable 0.1–4.0 mm', price: 1690, rating: 4.9, reviews: 203, stock: 55, new: true, featured: true, addedAt: 30,
    image: { kind: 'switch', switchType: 'magnetic', hue: 190 },
    variants: [{ type: 'Pack', options: [{ name: '35 pcs', price: -600 }, { name: '70 pcs', price: 0 }, { name: '110 pcs', price: 800 }] }],
    specifications: { 'Switch type': 'Magnetic (Hall Effect)', 'Actuation force': '40 gf', 'Bottom-out force': '45 gf', 'Pre-travel': '0.1–4.0 mm adjustable', 'Total travel': '4.0 mm', 'Sound profile': 'Smooth, neutral thock', 'Factory lubrication': 'Yes, full factory lube' },
  }),
];

export const CATEGORIES = [
  { id: 'keyboards', name: 'Keyboards', icon: 'keyboard', blurb: 'Complete boards from 60% to full-size.', tags: ['60%', '65%', '75%', 'TKL', '96%', 'Full Size'], hue: 190 },
  { id: 'keycaps', name: 'Keycaps', icon: 'keycap', blurb: 'Sets for every taste, profile and plastic.', tags: ['PBT', 'ABS', 'Double-shot', 'Artisan', 'Themed sets', 'Custom sets'], hue: 268 },
  { id: 'switches', name: 'Switches', icon: 'switch', blurb: 'Find the feel and sound that suits you.', tags: ['Linear', 'Tactile', 'Clicky', 'Silent', 'Magnetic'], hue: 28 },
];
