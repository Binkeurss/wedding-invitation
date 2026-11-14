/* Thư viện dùng chung cho các hàm Vercel. File bắt đầu bằng "_" không trở thành endpoint. */
const crypto = require('node:crypto');

const b64url = (buf) => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const hmac = (secret, msg) => b64url(crypto.createHmac('sha256', secret).update(msg).digest());

function safeEqual(a, b) {
  const x = crypto.createHash('sha256').update(String(a)).digest();
  const y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

const list = (v) => String(v || '').split(',').map((s) => s.trim()).filter(Boolean);

// Cho phép: cùng domain (host của request) hoặc nằm trong ALLOWED_ORIGINS (tuỳ chọn, ví dụ domain tuỳ chỉnh).
function originOk(req, value) {
  if (!value) return true; // fetch cùng nguồn gốc kiểu GET thường không gửi Origin
  let o; try { o = new URL(value).origin; } catch { return false; }
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  return o === `https://${host}` || o === `http://${host}` || list(process.env.ALLOWED_ORIGINS).includes(o);
}

function parseImageEntry(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;

  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      const path = decodeURIComponent(url.pathname || '');
      const match = path.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.([a-z0-9]+))?$/i);
      const id = match ? match[1] : path.replace(/^\//, '');
      const ext = match && match[2] ? match[2] : 'jpg';
      return { id, ext, t: '' };
    } catch {
      return null;
    }
  }

  const pipeParts = raw.split('|').map((s) => s.trim()).filter(Boolean);
  if (pipeParts.length >= 2) {
    return {
      id: pipeParts[0],
      ext: pipeParts[1] || 'jpg',
      t: pipeParts[2] || ''
    };
  }

  const dotMatch = raw.match(/^(.*?)(?:\.([a-z0-9]+))$/i);
  if (dotMatch) {
    return {
      id: dotMatch[1],
      ext: dotMatch[2] || 'jpg',
      t: ''
    };
  }

  return {
    id: raw,
    ext: 'jpg',
    t: ''
  };
}

function getMap() {
  try {
    const legacy = JSON.parse(process.env.IMAGE_MAP || '{}');
    if (legacy && typeof legacy === 'object' && !Array.isArray(legacy) && Object.keys(legacy).length) {
      return legacy;
    }
  } catch { /* fallback sang file trong repo */ }

  try {
    const repoMap = require('../images-map.js');
    if (repoMap && typeof repoMap === 'object' && Object.keys(repoMap).length) {
      return repoMap;
    }
  } catch { /* fallback sang biến riêng lẻ */ }

  const map = {};
  for (const [envName, rawValue] of Object.entries(process.env)) {
    if (!/^CLOUDINARY_IMAGE_/i.test(envName)) continue;

    const name = envName.replace(/^CLOUDINARY_IMAGE_/i, '').trim();
    if (!name) continue;

    const image = parseImageEntry(rawValue);
    if (!image) continue;

    map[name.toLowerCase()] = image;
  }

  return Object.keys(map).length ? map : {};
}
function getTtl() { return Math.min(Math.max(parseInt(process.env.TTL_SECONDS || '3600', 10) || 3600, 60), 86400); }

// Chữ ký URL ảnh Cloudinary "authenticated": 8 ký tự đầu của base64url(SHA-1("<biến đổi>/<public_id>" + API_SECRET))
function cloudinaryUrl({ id, ext = 'jpg', t = '' }) {
  const toSign = (t ? t + '/' : '') + id;
  const sig = b64url(crypto.createHash('sha1').update(toSign + process.env.CLOUDINARY_API_SECRET).digest()).slice(0, 8);
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD}/image/authenticated/s--${sig}--/${toSign}.${ext}`;
}

module.exports = { hmac, safeEqual, list, originOk, getMap, getTtl, cloudinaryUrl };
