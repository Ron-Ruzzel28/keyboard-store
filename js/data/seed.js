// Deterministic demo data for reviews, orders, customers and discounts. Replace with real API data later.
function mulberry(seed) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export const REVIEWS = [
  { id: 'r1', name: 'Mika Santos', rating: 5, productId: 'keychron-q1-pro', product: 'Keychron Q1 Pro', text: 'The gasket mount is unreal. Typing on this feels like a cushioned thock, and the wireless connection has never dropped once.', date: '2026-09-14', status: 'published', hue: 190 },
  { id: 'r2', name: 'Jared Lim', rating: 5, productId: 'wooting-lekker', product: 'Wooting Lekker', text: 'Rapid trigger changed how I play. Setting actuation at 0.8 mm for movement and 2 mm for typing is a cheat code.', date: '2026-09-02', status: 'published', hue: 268 },
  { id: 'r3', name: 'Bea Navarro', rating: 4, productId: 'pbtfans-bow', product: 'PBTfans BOW', text: 'The colors are even better in person and the PBT is properly thick. The only miss is that the novelty kit sells out fast.', date: '2026-08-27', status: 'published', hue: 355 },
  { id: 'r4', name: 'Dev Patel', rating: 5, productId: 'outemu-silent-peach', product: 'Outemu Silent Peach', text: 'I code in a shared apartment at midnight and my partner has not complained once. Genuinely quiet without feeling mushy.', date: '2026-08-19', status: 'published', hue: 145 },
  { id: 'r5', name: 'Lia Fernandez', rating: 5, productId: 'nuphy-air75-v2', product: 'NuPhy Air75 V2', text: 'Heavy, beautiful and well-tuned. The knob alone is worth it. It looks like a piece of hardware from the future.', date: '2026-08-11', status: 'published', hue: 28 },
  { id: 'r6', name: 'Carlo Reyes', rating: 4, productId: 'ducky-one-3-tkl', product: 'Ducky One 3 TKL', text: 'Built like a brick in the best way. Wired only, which suits my desk. Would love a braided cable included.', date: '2026-07-30', status: 'published', hue: 218 },
  { id: 'r7', name: 'Sofia Tan', rating: 5, productId: 'akko-black-gold', product: 'Akko Black & Gold', text: 'Turned my plain keyboard into something I want to show off. Fit perfectly and packaging was lovely.', date: '2026-07-21', status: 'published', hue: 190 },
  { id: 'r8', name: 'Marcus Chen', rating: 5, productId: 'rk61', product: 'Royal Kludge RK61', text: 'My first mechanical keyboard and a great one to start with. The glowing case is a showstopper.', date: '2026-07-08', status: 'published', hue: 268 },
];

export const DISCOUNTS = [
  { id: 'd1', code: 'KEYFORGE10', type: 'percent', value: 10, minSubtotal: 0, active: true, uses: 128 },
  { id: 'd2', code: 'WELCOME500', type: 'fixed', value: 500, minSubtotal: 3000, active: true, uses: 64 },
  { id: 'd3', code: 'FREESHIP', type: 'shipping', value: 0, minSubtotal: 0, active: true, uses: 211 },
];

const FIRST = ['Mika', 'Jared', 'Bea', 'Dev', 'Lia', 'Carlo', 'Sofia', 'Marcus', 'Ana', 'Noel', 'Ivy', 'Rafa', 'Tess', 'Gio', 'Hana'];
const LAST = ['Santos', 'Lim', 'Navarro', 'Patel', 'Fernandez', 'Reyes', 'Tan', 'Chen', 'Cruz', 'Garcia', 'Ramos', 'Uy', 'Dela Cruz', 'Bautista', 'Mendoza'];
const STATUS = ['Delivered', 'Delivered', 'Delivered', 'Shipped', 'Packed', 'Processing', 'Out for delivery', 'Cancelled'];
const CITY = ['Quezon City', 'Makati', 'Cebu City', 'Davao City', 'Pasig', 'Baguio', 'Iloilo City'];
const PAY = ['Credit/Debit Card', 'GCash', 'Maya', 'Cash on Delivery'];

export function seedCustomers() {
  const rnd = mulberry(7);
  return FIRST.map((f, i) => ({
    id: 'c' + (i + 1), name: `${f} ${LAST[i]}`, email: `${f.toLowerCase()}.${LAST[i].toLowerCase().replace(/\s/g, '')}@example.com`,
    city: CITY[Math.floor(rnd() * CITY.length)], joined: new Date(Date.UTC(2025, Math.floor(rnd() * 12), 1 + Math.floor(rnd() * 27))).toISOString().slice(0, 10),
  }));
}

export function seedOrders(products) {
  const rnd = mulberry(42);
  const customers = seedCustomers();
  const orders = [];
  const today = new Date('2026-10-08T09:00:00Z').getTime();
  for (let i = 0; i < 64; i++) {
    const c = customers[Math.floor(rnd() * customers.length)];
    const n = 1 + Math.floor(rnd() * 3);
    const items = [];
    for (let j = 0; j < n; j++) {
      const p = products[Math.floor(rnd() * products.length)];
      items.push({ productId: p.id, name: p.name, category: p.category, qty: 1 + Math.floor(rnd() * 2), price: p.price, image: p.image });
    }
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const shipping = subtotal >= 5000 ? 0 : 150;
    const days = Math.floor(Math.pow(rnd(), 1.4) * 60);
    orders.push({
      id: 'KF-' + (10400 - i), customerId: c.id, customer: c.name, email: c.email,
      date: new Date(today - days * 86400000 - Math.floor(rnd() * 40000000)).toISOString(),
      status: days < 2 ? 'Processing' : days < 4 ? 'Packed' : days < 6 ? 'Shipped' : STATUS[Math.floor(rnd() * STATUS.length)],
      payment: PAY[Math.floor(rnd() * PAY.length)], items, subtotal, shipping, discount: 0, total: subtotal + shipping, city: c.city,
    });
  }
  return orders.sort((a, b) => b.date.localeCompare(a.date));
}
