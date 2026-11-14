/* Hiệu ứng hiện từ dưới lên khi cuộn */
/* ---------- 2. Hiệu ứng hiện từ dưới lên khi cuộn ---------- */
function initReveal() {
  const els = $$('[data-reveal]');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  els.forEach(e => io.observe(e));
}


/* Ảnh hero đứng yên; phóng nhẹ khi cuộn cho có chiều sâu */
function initHeroParallax() {
  const bg = $('.hero-bg');
  if (!bg || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let ticking = false;
  const upd = () => {
    const p = Math.min(1, scrollY / innerHeight);
    bg.style.transform = `scale(${(1 + p * 0.08).toFixed(4)})`;
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
  upd();
}

initReveal();
initHeroParallax();
