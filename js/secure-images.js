/* Nạp ảnh qua cổng bảo mật: nếu không có gateway/manifest thì vẫn giữ placeholder và render trang bình thường. */
async function loadSecureImages() {
  const config = window.WED || {};
  const gw = (config.gateway || '').replace(/\/+$/, '');
  const key = new URLSearchParams(location.search).get('k');
  const hasGateway = /^https?:\/\//i.test(gw) || /^http:\/\/localhost/i.test(gw);
  if (!hasGateway) return;

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
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
    });

    if (window.mk && okUrl(images.photo)) {
      const ph = $('#photoPlaceholder');
      if (ph) ph.remove();
      window.mk('image', { href: images.photo, x: 20, y: 20, width: 260, height: 260, preserveAspectRatio: 'xMidYMid slice' }, $('#photoSlot'));
    }
  } catch (e) {
    // giữ placeholder nếu gateway không khả dụng hoặc fetch thất bại
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSecureImages, { once: true });
} else {
  loadSecureImages();
}
