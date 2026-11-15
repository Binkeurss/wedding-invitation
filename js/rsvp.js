/* Gửi xác nhận tham dự lên /api/rsvp (Google Sheet) + dải "thang máy" hiện người đã xác nhận.
   Nạp SAU ui.js: khai báo lại submitRSVP nên sẽ thay hàm giả lập trong ui.js. */

async function submitRSVP(data) {
  const hp = document.querySelector('#rsvpForm [name="website"]');
  const res = await fetch('/api/rsvp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, website: hp ? hp.value : '' })
  });
  if (!res.ok) throw new Error('rsvp ' + res.status);
  if (data.attend) liveAdd({ name: data.name, side: data.side });
  setTimeout(liveLoad, 2500); // đồng bộ lại với Sheet
}

/* ---------- Dải thang máy: mỗi lượt hiện 3 người, cả nhóm trượt lên, nhóm 3 người mới vào từ dưới ---------- */
const LIVE_STEP_MS = 3000;
const LIVE_SLIDE_MS = 900;
let liveItems = [], liveTotal = 0, liveSig = '', liveTimer = null;

function liveRow(it) {
  const row = document.createElement('div'); row.className = 'live-row';
  row.tabIndex = 0;
  const av = document.createElement('span'); av.className = 'av';
  const last = (it.name.trim().split(/\s+/).pop() || '?');
  av.textContent = Array.from(last)[0].toUpperCase();
  const tx = document.createElement('div'); tx.className = 'tx';
  const b = document.createElement('b'); b.textContent = it.name;
  const s = document.createElement('small'); s.textContent = (it.side === 'groom' ? 'Nhà trai' : 'Nhà gái') + ' · sẽ tham dự';
  tx.append(b, s);
  const ok = document.createElement('span'); ok.className = 'ok'; ok.textContent = '✓';

  const popup = document.createElement('div');
  popup.className = 'live-popup';
  popup.innerHTML = `<strong>${it.name}</strong><span>${it.side === 'groom' ? 'Nhà trai' : 'Nhà gái'} · sẽ tham dự</span>`;

  row.addEventListener('click', () => {
    row.classList.toggle('active');
    $$('.live-row').forEach(r => { if (r !== row) r.classList.remove('active'); });
  });
  row.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      row.classList.toggle('active');
      $$('.live-row').forEach(r => { if (r !== row) r.classList.remove('active'); });
    }
  });

  row.append(av, tx, ok, popup);
  return row;
}

function liveBuild() {
  const root = document.getElementById('live');
  const view = document.getElementById('liveView');
  const track = document.getElementById('liveTrack');
  if (!root || !view || !track) return;
  clearInterval(liveTimer); liveTimer = null;
  track.style.transition = 'none'; track.style.transform = 'none'; track.textContent = '';

  if (!liveItems.length) { root.hidden = true; root.classList.remove('on'); return; }
  document.getElementById('liveCount').textContent = liveTotal;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const list = liveItems.slice();
  const still = list.length <= 3 || reduce;
  if (!still) { let i = 0; while (list.length % 3) list.push(liveItems[i++ % liveItems.length]); }

  const pages = [];
  const size = still ? Math.min(3, list.length) : 3;
  for (let i = 0; i < list.length && (!still || i < 3); i += size) pages.push(list.slice(i, i + size));
  root.classList.toggle('still', still);
  view.style.setProperty('--n', size);

  // Đảm bảo hiển thị đủ số card, bao gồm gap và padding
  const rowHeight = parseFloat(
      getComputedStyle(root).getPropertyValue('--row')
  ) || 58;

  const gap = 10;
  const padding = 8;

  view.style.height =
      `${rowHeight * size + Math.max(0, size - 1) * gap + padding * 2}px`;
  const mk = rows => { const p = document.createElement('div'); p.className = 'live-page'; rows.forEach(r => p.appendChild(liveRow(r))); return p; };
  pages.forEach(p => track.appendChild(mk(p)));

  view.onmouseenter = () => { clearInterval(liveTimer); liveTimer = null; };
  view.onmouseleave = () => { if (!document.hidden && liveItems.length > 3 && !reduce) liveBuild(); };

  root.hidden = false;
  requestAnimationFrame(() => root.classList.add('on'));
  if (still || pages.length < 2) return;

  track.appendChild(mk(pages[0])); // bản sao trang đầu để vòng lặp liền mạch
  const total = pages.length + 1;
  let idx = 0;
  liveTimer = setInterval(() => {
    if (document.hidden || view.matches(':hover')) return;
    idx++;
    track.style.transition = `transform ${LIVE_SLIDE_MS}ms cubic-bezier(.65,0,.35,1)`;
    track.style.transform = `translateY(${(-idx * 100 / total).toFixed(4)}%)`;
    if (idx === pages.length) {
      setTimeout(() => { track.style.transition = 'none'; track.style.transform = 'none'; idx = 0; }, LIVE_SLIDE_MS + 60);
    }
  }, LIVE_STEP_MS);
}

function liveAdd(it) {
  liveItems.unshift({ name: String(it.name).slice(0, 40), side: it.side });
  liveTotal++; liveSig = '';
  liveBuild();
}

async function liveLoad() {
  try {
    const res = await fetch('/api/rsvp', { cache: 'no-store' });
    if (!res.ok) return;
    const d = await res.json();
    const items = Array.isArray(d.items) ? d.items : [];
    const sig = items.map(i => i.name + i.ts).join('|') + '#' + d.total;
    if (sig === liveSig) return;
    liveSig = sig; liveItems = items; liveTotal = Number(d.total) || items.length;
    liveBuild();
  } catch (e) { /* không có API hoặc đang offline: ẩn dải */ }
}

liveLoad();
setInterval(() => { if (!document.hidden) liveLoad(); }, 60000);