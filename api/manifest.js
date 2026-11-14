/* GET /api/manifest?k=<khoá mời>  ->  { expires, images: { hero: "/api/img/hero?e=..&s=..", ... } } */
const { hmac, safeEqual, list, originOk, getMap, getTtl } = require('./_lib');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  if (req.method !== 'GET') return res.status(405).json({ error: 'method' });
  if (!originOk(req, req.headers.origin)) return res.status(403).json({ error: 'origin' });
  const map = getMap();
  if (!map || !process.env.SIGNING_SECRET) return res.status(500).json({ error: 'config' });

  const k = String((req.query && req.query.k) || '');
  if (!list(process.env.INVITE_KEYS).some((x) => safeEqual(x, k))) return res.status(401).json({ error: 'key' });

  const exp = Math.floor(Date.now() / 1000) + getTtl();
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || (/^localhost(:|$)/.test(host) ? 'http' : 'https');
  const images = {};
  for (const name of Object.keys(map)) {
    images[name] = `${proto}://${host}/api/img/${encodeURIComponent(name)}?e=${exp}&s=${hmac(process.env.SIGNING_SECRET, `${name}.${exp}`)}`;
  }
  res.status(200).json({ expires: exp, images });
};
