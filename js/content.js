/* Dựng nội dung: ngày giờ, lịch, đếm ngược, mừng cưới, danh bạ liên hệ */
/* ---------- 3. Ngày giờ, lịch, đếm ngược ---------- */
function initDates() {
  const first = new Date(CONFIG.ceremonies[0].iso);
  const p = parts(first, { day: '2-digit', month: '2-digit', year: 'numeric' });
  const hm = viFmt(first, { hour: '2-digit', minute: '2-digit', hour12: false });
  const wd = viFmt(first, { weekday: 'long' });

  // khối giờ + ngày lớn
  $('#times').innerHTML = CONFIG.ceremonies.map(c =>
    `<li><span>${esc(c.label)}</span>${viFmt(new Date(c.iso), { hour: '2-digit', minute: '2-digit', hour12: false })}</li>`).join('');
  $('#bdWeekday').textContent = wd.toUpperCase();
  $('#bdDay').textContent = +p.day;
  $('#bdMonth').textContent = 'THÁNG ' + +p.month;
  $('#bdYear').textContent = p.year;

  $('#calDate').textContent = `${p.year}.${p.month}.${p.day}`;
  $('#calTime').textContent = `${wd.charAt(0).toUpperCase() + wd.slice(1)}, ${hm}`;

  // lịch (bắt đầu từ Chủ nhật)
  const y = +p.year, m = +p.month, day = +p.day;
  const offset = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const dim = new Date(Date.UTC(y, m, 0)).getUTCDate();
  let h = '<div class="cal-grid">' + ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => `<span class="h">${d}</span>`).join('');
  for (let i = 0; i < offset; i++) h += '<span></span>';
  for (let n = 1; n <= dim; n++) {
    const sun = (offset + n - 1) % 7 === 0;
    h += `<span class="d${sun ? ' sun' : ''}${n === day ? ' on' : ''}">${n}</span>`;
  }
  $('#cal').innerHTML = h + '</div>';

  // đếm ngược: tính lại từ Date.now() mỗi giây
  const target = first.getTime();
  const vals = $$('#cd b');
  const note = $('#cdNote');
  const tick = () => {
    const s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
    vals.forEach((el, i) => { const t = i === 0 ? pad(v[i]) : pad(v[i]); if (el.textContent !== t) el.textContent = t; });
    note.textContent = s > 0
      ? `Còn ${v[0]} ngày nữa là đến đám cưới của ${CONFIG.groom} và ${CONFIG.bride}.`
      : `Cảm ơn bạn đã chung vui cùng ${CONFIG.groom} và ${CONFIG.bride}!`;
  };
  tick(); setInterval(tick, 1000);
}

/* ---------- 4. Mừng cưới ---------- */
function initAccount() {
  const box = $('#accList');
  box.innerHTML = `
    <button type="button" class="account-trigger" id="openAccountModal" aria-label="Xem ảnh mừng cưới">
      <span>Mừng cưới</span>
    </button>
  `;

  const trigger = $('#openAccountModal');
  if (trigger) trigger.addEventListener('click', () => openModal('#accountModal'));
}

/* ---------- 6. Popup liên hệ ---------- */
function renderContacts() {
  $('#contactBody').innerHTML = CONFIG.contacts.map(g => `
    <section class="ct-group">
      <h3>${esc(g.group)}</h3>
      ${g.people.map(p => {
        const tel = p.phone.replace(/[^\d+]/g, '');
        return `<div class="ct">
          <span class="r">${esc(p.role)}</span>
          <div class="n"><b>${esc(p.name)}</b><span>${esc(p.phone)}</span></div>
          <div class="btns">
            <a href="tel:${tel}" aria-label="Gọi ${esc(p.name)}"><svg class="ic"><use href="#i-phone"/></svg></a>
            <a href="sms:${tel}" aria-label="Nhắn tin cho ${esc(p.name)}"><svg class="ic"><use href="#i-mail"/></svg></a>
          </div>
        </div>`;
      }).join('')}
    </section>`).join('');
}


initDates();
initAccount();
renderContacts();
