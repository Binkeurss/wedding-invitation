// Open the invitation only after the visitor presses the cover button.
(() => {
  const cover = document.getElementById('cover');
  const openButton = document.getElementById('openInvitation');
  if (!cover || !openButton) { window.__heroGo = true; window.dispatchEvent(new Event('scroll')); return; }
  document.body.classList.add('cover-locked');
  // Tuyết rơi: ~44 hạt tròn mềm + vài bông hoa nhỏ, thông số ngẫu nhiên (tạo bằng JS để nhẹ HTML)
  const snow = document.getElementById('snow');
  if (snow) {
    const r = (a, b) => a + Math.random() * (b - a);
    const n = window.innerWidth < 520 ? 34 : 52;
    for (let k = 0; k < n; k++) {
      const f = document.createElement('span');
      const flower = k % 9 === 0;
      f.className = 'snowflake' + (flower ? ' flower' : '');
      if (flower) f.textContent = '✻';
      f.style.cssText = `--x:${r(0, 98).toFixed(1)}%;--s:${flower ? r(10, 17).toFixed(0) : r(4, 12).toFixed(1)}px;--o:${r(.6, 1).toFixed(2)};--t:${r(10, 22).toFixed(1)}s;--delay:${(-r(0, 22)).toFixed(1)}s;--drift:${r(-46, 46).toFixed(0)}px`;
      snow.appendChild(f);
    }
  }
  openButton.addEventListener('click', () => {
    cover.classList.add('is-hidden');
    // ảnh bìa + tên hiện ra ngay khi thiệp mở (chậm, mượt)
    window.setTimeout(() => { window.__heroGo = true; window.dispatchEvent(new Event('scroll')); }, 250);
    document.body.classList.remove('cover-locked');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.setTimeout(() => cover.setAttribute('aria-hidden', 'true'), 850);
  });
})();
