/* ---------- ĐỘNG CƠ CUỘN (xem tài liệu v2 mục 3c) ---------- */
const items = [];
const H = () => innerHeight;
function addReveal(el) {
  items.push({ el, p: 0, t: 0, docTop: 0, delay: parseFloat(el.dataset.d || 0) * (Math.min(innerWidth, 450) / 450),
    measure() { const r = el.getBoundingClientRect(); this.docTop = r.top + scrollY; },
    target() { const top = this.docTop - scrollY; return clamp((H() * .94 - top - this.delay) / (H() * .2)); },
    apply(p) { el.style.setProperty('--p', p.toFixed(3)); } });
}
document.querySelectorAll('[data-r]').forEach(addReveal);

const hero = $('#hero');
items.push({ p: 0, t: 0, rate: 1.7, measure() {}, target() { return window.__heroGo ? 1 : 0; }, apply(p) { hero.style.setProperty('--hp', p.toFixed(3)); } });

const tl = $('#tl');
items.push({ p: 0, t: 0, top: 0, h: 1, measure() { const r = tl.getBoundingClientRect(); this.top = r.top + scrollY; this.h = r.height; },
  target() { return clamp((scrollY + H() * .8 - this.top) / (this.h * .78)); },
  apply(p) {
    let acc = 0;
    lens.forEach((L, i) => {
      const local = DRAW_ON_SCROLL ? clamp((p * total - acc) / L) : 1;
      maskPaths[i].style.strokeDashoffset = (L * (1 - local)).toFixed(2); acc += L;
    });
    ribbons.style.opacity = DRAW_ON_SCROLL ? 1 : clamp(p * 6).toFixed(2);
    leafEls.forEach(l => l.inner.style.setProperty('--p', clamp((p - l.at) / .1 + .15).toFixed(3)));
  } });

const blob = $('#inkBlob');
items.push({ p: 0, t: 0, top: 0, measure() { this.top = $('#ink').getBoundingClientRect().top + scrollY; },
  target() { return clamp((H() * .92 - (this.top - scrollY)) / (H() * .5)); },
  apply(p) { const s = .45 + .55 * (1 - Math.pow(1 - p, 3)); blob.setAttribute('transform', `translate(150 150) scale(${s.toFixed(3)}) translate(-150 -150)`); dots.style.opacity = clamp((p - .35) / .5).toFixed(2); } });

function layout() {
  const saved = items.map(o => o.p);
  document.querySelectorAll('[data-r]').forEach(el => el.style.setProperty('--p', 1));
  items.forEach(o => o.measure && o.measure());
  items.forEach((o, i) => o.apply && o.apply(saved[i]));
}
let last = performance.now(), dirty = true;
addEventListener('scroll', () => dirty = true, { passive: true });
addEventListener('resize', () => { layout(); dirty = true; });
function tick(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  const kd = 1 - Math.exp(-dt * 9);
  if (dirty) { items.forEach(o => o.t = o.target()); dirty = false; }
  for (const o of items) {
    const d = o.t - o.p;
    const k = reduce ? 1 : (o.rate ? 1 - Math.exp(-dt * o.rate) : kd);
    if (Math.abs(d) > .0004) { o.p += d * k; o.apply(o.p); } else if (o.p !== o.t) { o.p = o.t; o.apply(o.p); }
  }
  requestAnimationFrame(tick);
}
layout(); dirty = true;
(document.fonts && document.fonts.ready || Promise.resolve()).then(() => { layout(); dirty = true; });
addEventListener('load', () => { layout(); dirty = true; });
requestAnimationFrame(tick);
window.__engine = { items };
