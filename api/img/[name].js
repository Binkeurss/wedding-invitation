/* GET /api/img/<tên> -> ảnh (bỏ chặn ký/secret/referer để app hoạt động ngay với URL public của Cloudinary) */
const { getMap, publicCloudinaryUrl } = require('../_lib');

module.exports = async (req, res) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');

  const map = getMap();
  if (!map) return res.status(500).end('config');

  const name = String((req.query && req.query.name) || '');
  if (!Object.prototype.hasOwnProperty.call(map, name)) return res.status(404).end('Not found');

  let up;
  try { up = await fetch(publicCloudinaryUrl(map[name])); } catch { return res.status(502).end('Upstream error'); }
  if (!up.ok) return res.status(502).end('Upstream error');

  res.setHeader('Content-Type', up.headers.get('content-type') || 'image/jpeg');
  res.setHeader('Cache-Control', 'public, max-age=600');
  res.setHeader('Content-Disposition', 'inline');
  res.status(200).end(Buffer.from(await up.arrayBuffer()));
};
