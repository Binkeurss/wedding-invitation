/* GET /api/img/<tên>?e=<hạn>&s=<chữ ký>  ->  ảnh (lấy từ Cloudinary dạng authenticated; URL thật không bao giờ ra trình duyệt) */
const { hmac, safeEqual, originOk, getMap, cloudinaryUrl } = require('../_lib');

module.exports = async (req, res) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');
  const map = getMap();
  if (!map || !process.env.SIGNING_SECRET) return res.status(500).end('config');

  const name = String((req.query && req.query.name) || '');
  const e = parseInt((req.query && req.query.e) || '0', 10);
  const s = String((req.query && req.query.s) || '');
  if (!Object.prototype.hasOwnProperty.call(map, name) || !e || e < Math.floor(Date.now() / 1000)) return res.status(404).end('Not found');
  if (!safeEqual(hmac(process.env.SIGNING_SECRET, `${name}.${e}`), s)) return res.status(403).end('Forbidden');
  // chống nhúng ảnh sang trang khác
  if (!originOk(req, req.headers.referer)) return res.status(403).end('Forbidden');

  let up;
  try { up = await fetch(cloudinaryUrl(map[name])); } catch { return res.status(502).end('Upstream error'); }
  if (!up.ok) return res.status(502).end('Upstream error');
  res.setHeader('Content-Type', up.headers.get('content-type') || 'image/jpeg');
  res.setHeader('Cache-Control', 'private, max-age=600');
  res.setHeader('Content-Disposition', 'inline');
  res.status(200).end(Buffer.from(await up.arrayBuffer()));
};
