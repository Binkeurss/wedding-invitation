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
  const openBtn = $('#openRsvp');
  const form = $('#rsvpForm');
  const btn = $('#rsvpSubmit');
  const done = $('#rsvpDone');
  const modal = $('#rsvpModal');

  if (!openBtn || !form || !btn || !done || !modal) return;

  const valid = () => {
    const attend = form.querySelector('input[name="attend"]:checked');
    const name = form.elements.name.value.trim();
    return !!attend && name.length >= 2;
  };

  const refresh = () => {
    btn.disabled = !valid();
  };

  openBtn.addEventListener('click', () => openModal('#rsvpModal'));
  form.addEventListener('input', refresh);
  form.addEventListener('change', refresh);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!valid()) return;

    const attend = form.querySelector('input[name="attend"]:checked');
    const side = form.querySelector('input[name="side"]:checked');
    const data = {
      attend: attend.value === 'yes',
      name: form.elements.name.value.trim(),
      side: side ? side.value : 'bride',
      phone: form.elements.phone.value.trim(),
      note: form.elements.note.value.trim()
    };

    btn.disabled = true;
    btn.textContent = 'Đang gửi...';

    try {
      await submitRSVP(data);
      $('#rsvpDoneMsg').textContent = data.attend
        ? `${CONFIG.groom} & ${CONFIG.bride} đã nhận được xác nhận của bạn và rất mong được đón bạn.`
        : `${CONFIG.groom} & ${CONFIG.bride} đã nhận được phản hồi của bạn. Cảm ơn bạn đã dành lời chúc!`;
      form.hidden = true;
      done.hidden = false;
    } catch (err) {
      toast('Gửi chưa được, vui lòng thử lại');
      btn.disabled = false;
    } finally {
      btn.textContent = 'Gửi đến cô dâu chú rể';
    }
  });

  refresh();
  new MutationObserver(() => {
    if (modal.classList.contains('open') && done.hidden === false) {
      form.reset();
      form.hidden = false;
      done.hidden = true;
      refresh();
    }
  }).observe(modal, { attributes: true, attributeFilter: ['class'] });
}

initReveal();
initModals();
initContact();
initRsvp();
