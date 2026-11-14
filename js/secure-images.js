/* Nạp ảnh theo TÊN qua /api/manifest (đọc khoá ?k=… nếu có). Mã nguồn công khai không chứa URL ảnh. */
/* ---------- 1. Nạp ảnh Cloudinary theo tên ---------- */
async function loadImages() {
  let images = {};
  try {
    const key = new URLSearchParams(location.search).get('k');
    const res = await fetch('/api/manifest' + (key ? '?k=' + encodeURIComponent(key) : ''), { cache: 'no-store' });
    if (!res.ok) { console.warn('manifest lỗi', res.status); return; }
    images = (await res.json()).images || {};
  } catch (e) { console.warn('Không gọi được /api/manifest (đang chạy bằng `vercel dev` chưa?)', e); return; }

  $$('[data-cloudinary]').forEach(el => {
    const url = images[el.dataset.cloudinary];
    if (typeof url !== 'string' || !/^(\/api\/img\/|https?:\/\/)/i.test(url)) return;
    const img = new Image();
    img.onload = () => {
      el.style.backgroundImage = `url("${url.replace(/["\\]/g, '')}")`;
      el.classList.add('loaded');
    };
    img.src = url;
  });
}


loadImages();
