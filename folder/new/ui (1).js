/* UI: popup (liên hệ, xác nhận tham dự), form RSVP */
/* ---------- 5. Popup dùng chung ---------- */
let lastFocus = null;
function openModal(id) {
  const m = $(id); lastFocus = document.activeElement;
  m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); document.body.classList.add('lock');
  setTimeout(() => ($('.x', m) || m).focus({ preventScroll: true }), 50);
}
function closeModal(m) {
  m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lock');
  lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
}
function initModals() {
  $$('.modal').forEach(m => m.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(m); }));
  addEventListener('keydown', e => { if (e.key === 'Escape') $$('.modal.open').forEach(closeModal); });
}


function initContact() {
  $('#openContact').addEventListener('click', () => openModal('#contactModal'));
}

/* ---------- 7. Popup xác nhận tham dự (mới chỉ UI) ---------- */
/* TODO: nối database ở đây. Nhận object { attend, name, side, phone, note } và trả về Promise.
   Ví dụ sau này:  return fetch('/api/rsvp', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }) */
function submitRSVP(data) {
  console.log('RSVP (chưa lưu DB):', data);
  return new Promise(res => setTimeout(res, 600));
}

function initRsvp() {
  const form = $('#rsvpForm'), btn = $('#rsvpSubmit'), done = $('#rsvpDone');
  const modal = $('#rsvpModal');
  $('#openRsvp').addEventListener('click', () => openModal('#rsvpModal'));

  const valid = () => !!form.attend.value && form.elements.name.value.trim().length >= 2;
  const refresh = () => { btn.disabled = !valid(); };
  form.addEventListener('input', refresh);
  form.addEventListener('change', refresh);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!valid()) return;
    const data = {
      attend: form.attend.value === 'yes',
      name: form.elements.name.value.trim(),
      side: form.side.value,
      phone: form.phone.value.trim(),
      note: form.note.value.trim()
    };
    btn.disabled = true; btn.textContent = 'Đang gửi...';
    try {
      await submitRSVP(data);
      $('#rsvpDoneMsg').textContent = data.attend
        ? `${CONFIG.groom} & ${CONFIG.bride} đã nhận được xác nhận của bạn và rất mong được đón bạn.`
        : `${CONFIG.groom} & ${CONFIG.bride} đã nhận được phản hồi của bạn. Cảm ơn bạn đã dành lời chúc!`;
      form.hidden = true; done.hidden = false;
    } catch (err) {
      toast('Gửi chưa được, vui lòng thử lại');
      btn.disabled = false;
    } finally { btn.textContent = 'Gửi đến cô dâu chú rể'; }
  });

  // mở lại popup thì về form trống
  new MutationObserver(() => {
    if (modal.classList.contains('open') && !done.hidden) { form.reset(); form.hidden = false; done.hidden = true; refresh(); }
  }).observe(modal, { attributes: true, attributeFilter: ['class'] });
}


initModals();
initContact();
initRsvp();
