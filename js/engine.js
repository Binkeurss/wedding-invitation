/* ---------- ĐỘNG CƠ CUỘN + reveal nhẹ cho trang hiện tại ---------- */
const items = [];
const H = () => innerHeight;
const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function addReveal(el) {
  items.push({
    el,
    p: 0,
    t: 0,
    docTop: 0,
    delay: parseFloat(el.dataset.d || 0) * (Math.min(innerWidth, 450) / 450),
    measure() { const r = el.getBoundingClientRect(); this.docTop = r.top + scrollY; },
    target() { const top = this.docTop - scrollY; return clamp((H() * .94 - top - this.delay) / (H() * .2)); },
    apply(p) { el.style.setProperty('--p', p.toFixed(3)); }
  });
}

document.querySelectorAll('[data-reveal]').forEach(addReveal);

const hero = $('#hero');
if (hero) {
  items.push({
    p: 0,
    t: 0,
    rate: 1.7,
    measure() {},
    target() { return window.__heroGo ? 1 : 0; },
    apply(p) { hero.style.setProperty('--hp', p.toFixed(3)); }
  });
}

function layout() {
  const saved = items.map(o => o.p);
  document.querySelectorAll('[data-reveal]').forEach(el => el.style.setProperty('--p', 1));
  items.forEach(o => o.measure && o.measure());
  items.forEach((o, i) => o.apply && o.apply(saved[i]));
}

let last = performance.now(), dirty = true;
addEventListener('scroll', () => dirty = true, { passive: true });
addEventListener('resize', () => { layout(); dirty = true; });

function tick(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  const kd = 1 - Math.exp(-dt * 9);
  if (dirty) {
    items.forEach(o => o.t = o.target ? o.target() : 0);
    dirty = false;
  }
  for (const o of items) {
    const d = o.t - o.p;
    const k = reduce ? 1 : (o.rate ? 1 - Math.exp(-dt * o.rate) : kd);
    if (Math.abs(d) > .0004) { o.p += d * k; o.apply(o.p); }
    else if (o.p !== o.t) { o.p = o.t; o.apply(o.p); }
  }
  requestAnimationFrame(tick);
}

layout(); dirty = true;
(document.fonts && document.fonts.ready || Promise.resolve()).then(() => { layout(); dirty = true; });
addEventListener('load', () => { layout(); dirty = true; });
requestAnimationFrame(tick);
window.__engine = { items };
