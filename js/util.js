/* Tiện ích dùng chung (script cổ điển: các const ở cấp cao nhất được chia sẻ giữa các file) */
const NS = 'http://www.w3.org/2000/svg';
const $ = (s, r = document) => r.querySelector(s);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mk = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent && parent.appendChild(e); return e; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* Trong video gốc, cây leo và nét "and" đã đầy đủ khi vào màn hình (chỉ mờ → rõ).
   Đặt true nếu muốn thêm hiệu ứng vẽ dần theo cuộn (ĐỀ XUẤT, không có trong video). */
const DRAW_ON_SCROLL = false;
