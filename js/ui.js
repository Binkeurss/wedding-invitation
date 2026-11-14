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

let lastFocus = null;
function openModal(id) {
  const m = $(id);
  if (!m) return;
  lastFocus = document.activeElement;
  m.classList.add('open');
  m.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lock');
  setTimeout(() => ($('.x', m) || m).focus({ preventScroll: true }), 50);
}
function closeModal(m) {
  if (!m) return;
  m.classList.remove('open');
  m.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lock');
  if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
}
function initModals() {
  $$('.modal').forEach(m => m.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(m); }));
  addEventListener('keydown', e => { if (e.key === 'Escape') $$('.modal.open').forEach(closeModal); });
}
function initContact() {
  const btn = $('#openContact');
  if (btn) btn.addEventListener('click', () => openModal('#contactModal'));
}
function initRsvp() {
  const btn = $('#openRsvp');
  if (btn) btn.addEventListener('click', () => openModal('#rsvpModal'));
}

initReveal();
initModals();
initContact();
initRsvp();
