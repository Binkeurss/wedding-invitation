/* Nạp ảnh qua cổng bảo mật: trang chỉ gửi khoá mời ?k=… tới /api/manifest, nhận lại liên kết ký có hạn. */
/* ---------- Ảnh nạp qua cổng bảo mật (Cloudflare Worker): mã nguồn công khai không chứa URL ảnh ---------- */
async function loadSecureImages() {
  const gw = (WED.gateway || '').replace(/\/+$/, '');
  const key = new URLSearchParams(location.search).get('k');
  if (!/^(https:\/\/|http:\/\/localhost)/i.test(gw)) return;
  const okUrl = u => typeof u === 'string' && (
    u.startsWith(gw + '/img/') ||
    /^https?:\/\//i.test(u) ||
    /cloudinary\.com\//i.test(u)
  );
  try {
    const url = key ? `${gw}/manifest?k=${encodeURIComponent(key)}` : `${gw}/manifest`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return;
    const { images = {} } = await res.json();
    document.querySelectorAll('[data-cloudinary]').forEach(el => {
      const u = images[el.dataset.cloudinary];
      if (!okUrl(u)) return;
      el.style.backgroundImage = `url("${u.replace(/["\\]/g, '')}")`;
      el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center';
    });
    if (okUrl(images.photo)) {
      const ph = $('#photoPlaceholder'); if (ph) ph.remove();
      mk('image', { href: images.photo, x: 20, y: 20, width: 260, height: 260, preserveAspectRatio: 'xMidYMid slice' }, $('#photoSlot'));
    }
    document.querySelectorAll('#events2 .ev svg').forEach(svg => {
      const id = (svg.querySelector('use')?.getAttribute('href') || '').replace('#', '');
      if (!okUrl(images[id])) return;
      const img = document.createElement('img');
      img.className = 'icimg'; img.alt = ''; img.src = images[id];
      svg.replaceWith(img);
    });
    history.replaceState(null, '', location.pathname + location.search.replace(/([?&])k=[^&]*&?/, '$1').replace(/[?&]$/, '') + location.hash);
  } catch (e) { /* lỗi mạng: giữ placeholder */ }
}
loadSecureImages();
loadSecureImages();
