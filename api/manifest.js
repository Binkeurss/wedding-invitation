/* GET /api/manifest -> { expires, images: { hero: "https://res.cloudinary.com/.../hero.jpg", ... } } */
const { getMap, getTtl, publicCloudinaryUrl } = require('./_lib');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  if (req.method !== 'GET') return res.status(405).json({ error: 'method' });

  const map = getMap();
  if (!map) return res.status(500).json({ error: 'config' });

  const exp = Math.floor(Date.now() / 1000) + getTtl();
  const images = {};
  for (const name of Object.keys(map)) {
    images[name] = publicCloudinaryUrl(map[name]);
  }
  res.status(200).json({ expires: exp, images });
};
