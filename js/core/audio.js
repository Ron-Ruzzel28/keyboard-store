// Synthesised switch sounds (WebAudio): no audio files needed. Respects the global sound setting + volume.
import { state } from './store.js';

let ctx, master, noiseBuf;

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp); comp.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') ctx.resume();
  master.gain.value = Math.pow(state.settings.volume, 1.6);
  return true;
}

function noise(at, { type = 'bandpass', freq = 1800, q = 1, dur = 0.03, gain = 0.5 }) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, at); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(f); f.connect(g); g.connect(master);
  src.start(at, Math.random() * 0.1); src.stop(at + dur + 0.02);
}
function tone(at, { freq = 160, to = 80, dur = 0.09, gain = 0.5, wave = 'sine' }) {
  const o = ctx.createOscillator(); o.type = wave;
  o.frequency.setValueAtTime(freq, at); o.frequency.exponentialRampToValueAtTime(Math.max(20, to), at + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, at); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g); g.connect(master); o.start(at); o.stop(at + dur + 0.02);
}

const PROFILES = {
  linear: (t, up) => { if (up) { noise(t, { freq: 2600, dur: 0.02, gain: 0.12 }); return; } noise(t, { freq: 1500, q: 0.9, dur: 0.035, gain: 0.5 }); tone(t, { freq: 190, to: 90, dur: 0.1, gain: 0.55, wave: 'triangle' }); },
  tactile: (t, up) => { if (up) { noise(t, { freq: 2400, dur: 0.02, gain: 0.14 }); return; } noise(t, { freq: 2800, q: 1.4, dur: 0.012, gain: 0.35 }); noise(t + 0.018, { freq: 1400, dur: 0.035, gain: 0.45 }); tone(t + 0.018, { freq: 220, to: 100, dur: 0.1, gain: 0.5, wave: 'triangle' }); },
  clicky: (t, up) => { if (up) { noise(t, { type: 'highpass', freq: 4200, dur: 0.012, gain: 0.3 }); return; } noise(t, { type: 'highpass', freq: 3600, q: 1, dur: 0.018, gain: 0.7 }); tone(t, { freq: 4300, to: 3200, dur: 0.02, gain: 0.25 }); noise(t + 0.032, { freq: 1700, dur: 0.03, gain: 0.45 }); tone(t + 0.032, { freq: 200, to: 90, dur: 0.08, gain: 0.35, wave: 'triangle' }); },
  silent: (t, up) => { if (up) return; noise(t, { type: 'lowpass', freq: 900, dur: 0.04, gain: 0.22 }); tone(t, { freq: 130, to: 70, dur: 0.08, gain: 0.22, wave: 'sine' }); },
  magnetic: (t, up) => { if (up) { noise(t, { freq: 2200, dur: 0.015, gain: 0.08 }); return; } noise(t, { type: 'lowpass', freq: 1300, dur: 0.04, gain: 0.36 }); tone(t, { freq: 175, to: 85, dur: 0.11, gain: 0.5, wave: 'sine' }); tone(t, { freq: 520, to: 400, dur: 0.03, gain: 0.07 }); },
};

export function playSwitch(type = 'linear', { force = false, release = false } = {}) {
  if (!force && !state.settings.sound) return;
  if (!ensure()) return;
  const t = ctx.currentTime + 0.005;
  (PROFILES[type] || PROFILES.linear)(t, false);
  if (release) (PROFILES[type] || PROFILES.linear)(t + 0.09, true);
}

// A short run of keystrokes at a natural cadence.
export function playTyping(type = 'linear') {
  if (!ensure()) return 0;
  const gaps = [0, 0.13, 0.25, 0.4, 0.5, 0.66, 0.78, 0.95];
  gaps.forEach((g, i) => {
    const t = ctx.currentTime + 0.02 + g;
    const jitter = (Math.random() - 0.5) * 0.02;
    (PROFILES[type] || PROFILES.linear)(t + jitter, false);
    (PROFILES[type] || PROFILES.linear)(t + jitter + 0.07 + (i % 3) * 0.01, true);
  });
  return 1000;
}
