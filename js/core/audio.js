// Synthesised switch sounds (WebAudio), modelled on how a real board is heard: finger/leaf contact, a bottom-out
// impact that rings the case and plate (modal resonances), a spring ping, a top-out clack on release, stabiliser
// rattle on wide keys and a small cavity reverb. Every press is randomised a little so typing never loops.
import { state } from './store.js';

let ctx, master, bus, noiseBuf;

function impulse(c, secs = 0.09, decay = 5) {
  const n = Math.floor(c.sampleRate * secs), b = c.createBuffer(2, n, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay); }
  return b;
}

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 3; comp.attack.value = 0.002; comp.release.value = 0.12;
    master.connect(comp); comp.connect(ctx.destination);
    // Voices -> bus -> (dry + short cavity reverb) -> master
    bus = ctx.createGain();
    const dry = ctx.createGain(); dry.gain.value = 0.86;
    const wet = ctx.createGain(); wet.gain.value = 0.2;
    const verb = ctx.createConvolver(); verb.buffer = impulse(ctx);
    bus.connect(dry); dry.connect(master);
    bus.connect(verb); verb.connect(wet); wet.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') ctx.resume();
  master.gain.value = Math.pow(state.settings.volume, 1.6);
  return true;
}

const rnd = (a, b) => a + Math.random() * (b - a);

// Filtered noise burst with a fast attack and exponential decay (impacts, clicks, rattle).
function burst(at, { type = 'bandpass', freq = 1800, q = 1, dur = 0.02, gain = 0.5, attack = 0.0006 }) {
  const src = ctx.createBufferSource(); src.buffer = noiseBuf;
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, at); g.gain.linearRampToValueAtTime(gain, at + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, at + attack + dur);
  src.connect(f); f.connect(g); g.connect(bus);
  src.start(at, Math.random() * 0.15); src.stop(at + attack + dur + 0.02);
}
// Damped sine: one vibrational mode of the case, plate or spring.
function mode(at, { freq, dur = 0.08, gain = 0.3, bend = 0.97, attack = 0.001 }) {
  const o = ctx.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(freq, at); o.frequency.exponentialRampToValueAtTime(freq * bend, at + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, at); g.gain.linearRampToValueAtTime(gain, at + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, at + attack + dur);
  o.connect(g); g.connect(bus); o.start(at); o.stop(at + attack + dur + 0.02);
}

// Bottom-out: the key hits the plate. p = pitch factor, v = velocity, damp = how deadened the board is.
function bottomOut(t, { p, v, w = 1, body = 1, ring = 1, damp = 0 }) {
  const lowW = Math.pow(w, -0.22);                  // wide keys sit lower in pitch
  const f0 = 210 * p * lowW;                        // case "thock" fundamental
  burst(t, { type: 'lowpass', freq: 2300 * p * (1 - damp * 0.55), q: 0.7, dur: 0.012, gain: 0.55 * v });
  burst(t, { freq: 1150 * p, q: 1.1, dur: 0.028, gain: 0.5 * v * body });
  mode(t, { freq: f0, dur: 0.11 * (1 - damp * 0.5), gain: 0.46 * v * body });
  mode(t, { freq: f0 * 2.31, dur: 0.07, gain: 0.2 * v * body, bend: 0.96 });
  mode(t, { freq: f0 * 3.74, dur: 0.045, gain: 0.1 * v * ring * (1 - damp) });
  if (ring) mode(t + 0.001, { freq: 2650 * p, dur: 0.05, gain: 0.07 * v * ring * (1 - damp) });  // plate ping
}
// Top-out: the key returns and its stem strikes the housing.
function topOut(t, { p, v, damp = 0, gain = 1 }) {
  if (damp > 0.7) return;
  burst(t, { type: 'highpass', freq: 2600 * p, q: 0.8, dur: 0.01, gain: 0.26 * v * gain });
  burst(t, { freq: 1500 * p, q: 1.2, dur: 0.02, gain: 0.2 * v * gain });
  mode(t, { freq: 1380 * p, dur: 0.022, gain: 0.05 * v * gain });
}
function springPing(t, { p, v }) {
  if (Math.random() < 0.4) return;
  const f = rnd(3300, 4700) * p;
  mode(t, { freq: f, dur: rnd(0.06, 0.11), gain: 0.018 * v, bend: 0.995 });
  mode(t, { freq: f * 1.52, dur: 0.05, gain: 0.008 * v, bend: 0.995 });
}
function stabilizer(t, w, v) {
  const n = w >= 6 ? 4 : 3;                          // space bar rattles longer than shift/enter
  for (let i = 0; i < n; i++) burst(t + 0.006 + i * rnd(0.004, 0.009), { type: 'highpass', freq: rnd(4200, 6200), dur: 0.006, gain: 0.07 * v });
  if (w >= 6) mode(t + 0.01, { freq: 520, dur: 0.05, gain: 0.04 * v });
}

// Per-switch behaviour: what happens before the bottom-out, and how loud/hard it lands.
const PROFILES = {
  linear: {
    down(t, o) { springPing(t, o); bottomOut(t + 0.016, { ...o, body: 1 }); },
    up(t, o) { topOut(t, o); },
  },
  tactile: {
    down(t, o) {
      burst(t, { freq: 1900 * o.p, q: 1.6, dur: 0.012, gain: 0.26 * o.v });            // bump
      mode(t, { freq: 310 * o.p, dur: 0.03, gain: 0.12 * o.v });
      springPing(t + 0.004, o); bottomOut(t + 0.026, { ...o, body: 0.92 });
    },
    up(t, o) { topOut(t, o); },
  },
  clicky: {
    down(t, o) {
      burst(t, { type: 'highpass', freq: 3400, q: 1, dur: 0.01, gain: 0.62 * o.v });     // click jacket snaps
      mode(t, { freq: 4150 * o.p, dur: 0.028, gain: 0.2 * o.v, bend: 0.9 });
      mode(t + 0.0015, { freq: 2850 * o.p, dur: 0.035, gain: 0.14 * o.v, bend: 0.94 });  // leaf ring
      bottomOut(t + 0.03, { ...o, body: 0.72, ring: 1.4 });
    },
    up(t, o) {
      burst(t, { type: 'highpass', freq: 4300, dur: 0.008, gain: 0.34 * o.v });          // second, softer click
      mode(t, { freq: 3300 * o.p, dur: 0.02, gain: 0.07 * o.v }); topOut(t + 0.008, { ...o, gain: 0.8 });
    },
  },
  silent: {
    down(t, o) { bottomOut(t + 0.017, { ...o, v: o.v * 0.5, body: 0.65, ring: 0, damp: 0.9 }); },   // rubber dampers
    up(t, o) { burst(t, { type: 'lowpass', freq: 1400, dur: 0.012, gain: 0.07 * o.v }); },
  },
  magnetic: {
    down(t, o) { bottomOut(t + 0.014, { ...o, v: o.v * 0.9, body: 1.05, ring: 0.5, damp: 0.25 }); },  // no leaf, no scratch
    up(t, o) { topOut(t, { ...o, gain: 0.55 }); },
  },
};

// Plate / build character shifts the whole sound: pitch and ring.
const PLATE_PITCH = { aluminum: 1.14, polycarbonate: 0.82, fr4: 1, brass: 0.88 };
let lastT = 0;

export function playSwitch(type = 'linear', { force = false, release = false, width = 1, plate = 'fr4' } = {}) {
  if (!force && !state.settings.sound) return;
  if (!ensure()) return;
  const t = ctx.currentTime + 0.005;
  const prof = PROFILES[type] || PROFILES.linear;
  const o = { p: (PLATE_PITCH[plate] || 1) * rnd(0.95, 1.06), v: rnd(0.82, 1.05), w: width };
  if (t - lastT < 0.03) o.v *= 0.75;                 // fast rolls are a touch quieter
  lastT = t;
  prof.down(t, o);
  if (width >= 2) stabilizer(t + 0.014, width, o.v);
  if (release) prof.up(t + rnd(0.075, 0.11), { ...o, v: o.v * 0.9 });
}

// A run of keystrokes at a natural cadence: uneven gaps, a couple of fast pairs and one space bar.
export function playTyping(type = 'linear', { plate = 'fr4' } = {}) {
  if (!ensure()) return 0;
  const gaps = [0, 0.14, 0.24, 0.41, 0.49, 0.67, 0.8, 0.98];
  const prof = PROFILES[type] || PROFILES.linear;
  gaps.forEach((g, i) => {
    const t = ctx.currentTime + 0.02 + g + rnd(-0.012, 0.012);
    const w = i === 5 ? 6.25 : 1;
    const o = { p: (PLATE_PITCH[plate] || 1) * rnd(0.93, 1.08), v: rnd(0.78, 1.05), w };
    prof.down(t, o);
    if (w >= 2) stabilizer(t + 0.014, w, o.v);
    prof.up(t + rnd(0.07, 0.11), { ...o, v: o.v * 0.9 });
  });
  return 1150;
}
