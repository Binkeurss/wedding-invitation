const to = new URLSearchParams(location.search).get('to');
if (to) $('#guest').textContent = to.slice(0, 40);

const fmt = (d, o) => new Intl.DateTimeFormat('vi-VN', { timeZone: TZ, ...o }).format(d);
const evBox = $('#events');
WED.ceremonies.forEach((c, i) => {
  const d = new Date(c.iso);
  const hm = fmt(d, { hour: '2-digit', minute: '2-digit', hour12: false });
  const wd = fmt(d, { weekday: 'long' }).toUpperCase();
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric' }).formatToParts(d).map(p => [p.type, p.value]));
  const mapCoordinates = '10.8602885,106.958646';
  const mapQuery = encodeURIComponent(mapCoordinates);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  evBox.insertAdjacentHTML('beforeend', `
    <section class="sec evt" data-r>
      <h4>${esc(c.label)}</h4>
      <p class="tm">${hm}, ${esc(wd)}</p>
      <p class="dt">${parts.day} / ${parts.month} / ${parts.year}</p>
      <p class="lunar">${esc(c.lunar)}</p>
      <h5>ĐỊA CHỈ</h5>
      <p class="venue">${esc(c.venue)}</p>
      <p class="addr">${esc(c.addr)}</p>
      <div class="map-actions">
        <a class="pill" href="${directionsUrl}" target="_blank" rel="noopener noreferrer">Chỉ đường</a>
      </div>
      <iframe class="map-frame" src="${mapEmbedUrl}" title="Bản đồ ${esc(c.venue)}"
        loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
    </section>`);
  if (i < WED.ceremonies.length - 1) evBox.insertAdjacentHTML('beforeend', '<div class="rule" data-r="fade"></div>');
});

/* ---------- LỊCH: bắt đầu từ Thứ Hai, không có hàng tên thứ, ngày cưới khoanh trái tim vàng ---------- */
(function calendar() {
  const d = new Date(WED.ceremonies[0].iso);
  const y = +new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric' }).format(d);
  const m = +new Intl.DateTimeFormat('en-GB', { timeZone: TZ, month: 'numeric' }).format(d);
  const day = +new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: 'numeric' }).format(d);
  const first = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;      // 0 = Thứ Hai
  const dim = new Date(Date.UTC(y, m, 0)).getUTCDate();
  let h = `<div class="hd" data-r="fade"><span>Tháng ${m}</span><span>${y}</span></div><div class="grid">`;
  for (let i = 0; i < first; i++) h += '<div class="c"></div>';
  for (let n = 1; n <= dim; n++) {
    const heart = n === day ? '<svg viewBox="-24 -22 48 46"><path d="M0 -5 C-4 -16 -22 -12 -20 2 C-18 14 -6 19 0 25 C6 19 18 14 20 2 C22 -12 4 -16 0 -5Z"/></svg>' : '';
    h += `<div class="c" data-r="scale" data-d="${Math.floor((first + n - 1) / 7) * 14 + ((first + n - 1) % 7) * 3}">${heart}${n}</div>`;
  }
  $('#cal').innerHTML = h + '</div>';
})();

/* ---------- ĐẾM NGƯỢC: tính từ Date.now() mỗi giây (không cộng dồn, không trôi) ---------- */
const target = new Date(WED.ceremonies[0].iso).getTime();
const cdEls = [...document.querySelectorAll('#cd > div')];
const pad = n => String(n).padStart(2, '0');
function tickCd() {
  let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
  const v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
  cdEls.forEach((el, i) => { const t = el.firstElementChild; const val = i === 0 ? String(v[i]) : pad(v[i]); if (t.textContent !== val) t.textContent = val; });
}
tickCd(); setInterval(tickCd, 1000);

/* ---------- LỊCH TRÌNH (toạ độ trong hệ của khung hình video, x gốc = mép trái của vùng chụp) ---------- */
const EVENTS = [
  { t: '14:30', n: 'Lễ Vu Quy', x: 190, y: 92,  icon: 'ic-rings', big: 1 },
  { t: '15:00', n: 'Đưa Dâu',   x: 275, y: 266, icon: 'ic-car' },
  { t: '16:30', n: 'Tiệc Cưới', x: 117, y: 414, icon: 'ic-dinner' },
  { t: '19:30', n: 'Tiệc Tối',  x: 270, y: 510, icon: 'ic-couple' }
];
const VINE = [
  'M300 128 C296 190 240 250 175 288 C125 310 92 335 98 372 C101 402 150 412 215 410',
  'M238 455 C300 450 356 480 368 540 C372 568 366 584 350 600',
  'M338 612 L296 644'
];
const LEAVES = [ { x: 307, y: 105, rot: 18, s: 64, at: 0.0 }, { x: 162, y: 296, rot: -28, s: 61, at: 0.28 },
                 { x: 224, y: 436, rot: 8, s: 58, at: 0.60 }, { x: 348, y: 604, rot: 38, s: 62, at: 0.88 } ];

const evBox2 = $('#events2');
for (const e of EVENTS) {
  const w = document.createElement('div'); w.className = 'ev';
  w.style.left = `calc(${e.x - 7} * var(--u))`; w.style.top = `calc(${e.y} * var(--u))`;
  const iconUrl = '';
  w.innerHTML = `<div data-r data-d="0"><b>${e.t}</b><span>${e.n}</span>${iconUrl && /^https:\/\/res\.cloudinary\.com\//i.test(iconUrl) ? `<img class="icimg" alt="" src="${iconUrl}">` : `<svg aria-hidden="true"${e.big ? ' style="width:calc(92*var(--u));height:calc(92*var(--u));margin-top:calc(-4*var(--u))"' : ''}><use href="#${e.icon}"/></svg>`}</div>`;
  evBox2.appendChild(w);
}

function ribbon(d, w0 = .4, w1 = 1.25, N = 90) {
  const p = mk('path', { d }); const L = p.getTotalLength(); const left = [], right = [];
  for (let i = 0; i <= N; i++) {
    const s = L * i / N, a = p.getPointAtLength(s), b = p.getPointAtLength(Math.min(L, s + .6)), c = p.getPointAtLength(Math.max(0, s - .6));
    let nx = -(b.y - c.y), ny = b.x - c.x; const m = Math.hypot(nx, ny) || 1; nx /= m; ny /= m;
    const t = i / N, w = w0 + (w1 - w0) * Math.pow(Math.sin(Math.PI * t), .6) / 2;
    left.push([a.x + nx * w, a.y + ny * w]); right.push([a.x - nx * w, a.y - ny * w]);
  }
  return 'M' + left.map(q => q.map(v => v.toFixed(2)).join(' ')).join(' L') + ' L' + right.reverse().map(q => q.map(v => v.toFixed(2)).join(' ')).join(' L') + 'Z';
}
const ribbons = $('#ribbons'), maskPaths = [$('#mA'), $('#mB'), $('#mC')], lens = [];
VINE.forEach((d, i) => {
  mk('path', { d: ribbon(d) }, ribbons);
  maskPaths[i].setAttribute('d', d);
  const L = maskPaths[i].getTotalLength(); lens.push(L);
  maskPaths[i].style.strokeDasharray = L; maskPaths[i].style.strokeDashoffset = L;
});
const total = lens.reduce((a, b) => a + b, 0);
const leafEls = LEAVES.map(l => {
  const g = mk('g', { transform: `translate(${l.x} ${l.y})` }, $('#leaves'));
  const inner = mk('g', { class: 'leafpop' }, g); inner.style.setProperty('--rot', l.rot + 'deg');
  inner.style.filter = 'drop-shadow(0 1.5px 2px rgba(0,0,0,.22))';
  mk('use', { href: '#leaf', x: -l.s / 2, y: -l.s / 2, width: l.s, height: l.s }, inner);
  return { inner, at: l.at };
});

const dots = $('#inkDots');
[[34,70,5],[22,108,3],[276,88,6],[290,140,3.5],[268,222,4],[60,246,5],[88,268,3],[232,262,3],[14,170,2.5],[188,22,3],[116,18,4],[250,40,3]].forEach(([cx,cy,r]) => mk('circle', { cx, cy, r }, dots));
