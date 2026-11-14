/* CẤU HÌNH CÔNG KHAI. Không chứa URL ảnh, khoá hay bí mật nào.
   Ảnh chỉ được gọi theo TÊN (hero, story1..3, album1..8, thanks, photo, ic-rings, ic-car, ic-dinner, ic-couple);
   URL thật nằm trong biến môi trường của Vercel (xem api/ và .env.example). */
const TZ = 'Asia/Ho_Chi_Minh';
const WED = {
  gateway: location.origin + '/api',   // hàm Vercel cùng domain
  ceremonies: [
{ label: 'LỄ VU QUY', iso: '2026-12-13T10:30:00+07:00', venue: 'NHƯ Ý PALACE', addr: '10.8602885, 106.958646', lunar: '(Tức ngày 5 tháng 11 năm Bính Ngọ)' },
{ label: 'TIỆC MỪNG CƯỚI', iso: '2026-12-13T16:30:00+07:00', venue: 'NHƯ Ý PALACE', addr: '10.8602885, 106.958646', lunar: '(Tức ngày 5 tháng 11 năm Bính Ngọ)' }
  ]
};
