/* /api/rsvp
   POST  { attend, name, side, phone, note, website } -> ghi vào Google Sheet qua Apps Script
   GET   -> { items:[{name,side,ts}], total }  (chỉ người tham dự, KHÔNG có số điện thoại / ghi chú)
   Biến môi trường: SHEETS_WEBHOOK_URL (URL Web app của Apps Script), SHEETS_TOKEN (trùng TOKEN trong Script properties) */

const hits = new Map(); // giới hạn tốc độ đơn giản theo IP (chỉ mang tính tham khảo trên serverless)
function limited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000;
  const arr = (hits.get(ip) || []).filter(t => now - t < win);
  if (arr.length >= 5) { hits.set(ip, arr); return true; }
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 500) hits.clear();
  return false;
}

async function callSheet(payload) {
  const r = await fetch(process.env.SHEETS_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ ...payload, token: process.env.SHEETS_TOKEN }),
    redirect: 'follow'
  });
  const text = await r.text();
  try { return JSON.parse(text); }
  catch {
    // thường gặp: Apps Script chưa deploy "Anyone" hoặc sai URL nên Google trả về trang đăng nhập HTML
    console.error('[rsvp] Apps Script không trả JSON. HTTP', r.status, '| đầu phản hồi:', text.slice(0, 160).replace(/\s+/g, ' '));
    return { ok: false, error: 'bad_response', status: r.status };
  }
}

// lý do thất bại gửi kèm cho dễ gỡ lỗi (không chứa dữ liệu nhạy cảm)
const why = r => (r && r.error ? String(r.error) : 'unknown');

// bỏ ký tự đầu có thể bị Google Sheets hiểu là công thức, bỏ ký tự điều khiển
const clean = (s, max) => String(s ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().replace(/^[=+\-@]+/, '').slice(0, max);

module.exports = async (req, res) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  if (!process.env.SHEETS_WEBHOOK_URL || !process.env.SHEETS_TOKEN) {
    return res.status(503).json({ error: 'config' });
  }

  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120');
    try {
      const r = await callSheet({ action: 'recent' });
      if (!r.ok) { console.error('[rsvp] GET lỗi:', r); return res.status(502).json({ error: 'sheet', why: why(r) }); }
      const items = (r.items || []).slice(0, 24).map(i => ({
        name: clean(i.name, 40), side: i.side === 'groom' ? 'groom' : 'bride', ts: Number(i.ts) || 0
      })).filter(i => i.name);
      return res.status(200).json({ items, total: Number(r.total) || items.length });
    } catch (e) { console.error('[rsvp] GET gọi Apps Script thất bại:', e); return res.status(502).json({ error: 'sheet', why: 'fetch_failed' }); }
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  res.setHeader('Cache-Control', 'no-store');

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = null; } }
  if (!b || typeof b !== 'object') return res.status(400).json({ error: 'body' });

  if (b.website) return res.status(200).json({ ok: true }); // ô ẩn bị điền: bot, giả vờ thành công

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'rate' });

  const name = clean(b.name, 60);
  const phone = String(b.phone ?? '').replace(/[^\d+\-\s().]/g, '').trim().slice(0, 20);
  const note = clean(b.note, 300);
  if (name.length < 2) return res.status(400).json({ error: 'name' });
  if (typeof b.attend !== 'boolean') return res.status(400).json({ error: 'attend' });
  const side = b.side === 'groom' ? 'groom' : 'bride';

  try {
    const r = await callSheet({ action: 'add', name, side, attend: b.attend, phone, note });
    if (!r.ok) { console.error('[rsvp] POST lỗi:', r); return res.status(502).json({ error: 'sheet', why: why(r) }); }
    return res.status(200).json({ ok: true });
  } catch (e) { console.error('[rsvp] POST gọi Apps Script thất bại:', e); return res.status(502).json({ error: 'sheet', why: 'fetch_failed' }); }
};