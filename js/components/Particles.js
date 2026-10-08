// Small canvas particle field for the hero. Pauses off-screen and respects reduced motion.
import { reduceMotion } from '../core/dom.js';

export function particles(canvas, { count = 46 } = {}) {
  if (reduceMotion()) return () => {};
  const ctx = canvas.getContext('2d');
  let w, h, dpr, raf, running = true, dots = [];
  const mouse = { x: -999, y: -999 };
  const hue = () => +getComputedStyle(document.documentElement).getPropertyValue('--accent-h') || 190;
  function size() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = w < 700 ? Math.round(count * 0.5) : count;
    dots = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + 0.4, vx: (Math.random() - 0.5) * 0.18, vy: -Math.random() * 0.25 - 0.05, a: Math.random() * 0.5 + 0.2 }));
  }
  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    const hh = hue();
    for (const d of dots) {
      d.x += d.vx; d.y += d.vy;
      const dx = d.x - mouse.x, dy = d.y - mouse.y, dist = Math.hypot(dx, dy);
      if (dist < 120) { d.x += (dx / dist) * 0.6; d.y += (dy / dist) * 0.6; }
      if (d.y < -4) { d.y = h + 4; d.x = Math.random() * w; }
      if (d.x < -4) d.x = w + 4; if (d.x > w + 4) d.x = -4;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283);
      ctx.fillStyle = `hsl(${hh} 100% 72% / ${d.a})`; ctx.shadowColor = `hsl(${hh} 100% 60%)`; ctx.shadowBlur = 8; ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }
  const onMove = (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
  const io = new IntersectionObserver(([en]) => { running = en.isIntersecting; if (running) { cancelAnimationFrame(raf); frame(); } });
  io.observe(canvas);
  size(); frame();
  window.addEventListener('resize', size);
  window.addEventListener('pointermove', onMove, { passive: true });
  return () => { running = false; cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', size); window.removeEventListener('pointermove', onMove); };
}
