/* CẤU HÌNH CÔNG KHAI. Không chứa URL ảnh, khoá hay bí mật nào.
   Ảnh chỉ được gọi theo TÊN (hero, story1..3, album1..8, thanks, photo, ic-rings, ic-car, ic-dinner, ic-couple);
   URL thật nằm trong biến môi trường của Vercel (xem api/ và .env.example). */
const TZ = 'Asia/Ho_Chi_Minh';
const WED = {
  gateway: location.origin + '/api',   // hàm Vercel cùng domain
  music: {
    tracks: [
      '/music/beautiful_in_white.mp3',
      '/music/chi_can_co_nhau.mp3',
      '/music/cuoi_nhau_di.mp3',
      '/music/cuoi_nhau_di_live.mp3',
      '/music/dam_cuoi_tren_duong_que.mp3',
      '/music/don_gian_anh_yeu_em.mp3',
      '/music/duong_quyen_tinh_yeu.mp3',
      '/music/everytime_we_touch.mp3',
      '/music/hon_ca_yeu.mp3',
      '/music/i_do.mp3',
      '/music/khi_hoan_chau_cach_cach.mp3',
      '/music/may_hong_dua_loi.mp3',
      '/music/minh_yeu_nhau_di.mp3',
      '/music/mot_doi.mp3',
      '/music/my_love.mp3',
      '/music/ngay_dau_tien.mp3',
      '/music/ngay_hanh_phuc.mp3',
      '/music/ngay_hanh_phuc_lofi.mp3',
      '/music/ngoi_nha_hanh_phuc.mp3',
      '/music/noi_gio_len.mp3',
      '/music/noi_nay_co_anh.mp3',
      '/music/perfect.mp3',
      '/music/sugar.mp3',
      '/music/ta_la_cua_nhau.mp3',
      '/music/thuyen_hoa_remix.mp3',
      '/music/tinh_yeu_mau_hong_lofi.mp3',
      '/music/until_you.mp3',
      '/music/vo_tuyet_voi_nhat.mp3',
      '/music/what_makes_you_beautiful.mp3',
      '/music/xung_doi_cuoi_thoi.mp3',
      '/music/yeu_anh_cu_de_em.mp3',
      '/music/yeu_em_hon_moi_ngay.mp3',
      '/music/anh_nang_cua_anh.mp3',
      '/music/anh_nang_cua_anh_duc_phuc.mp3',
      '/music/a_little_love.mp3'
    ],
    volume: 0.65,
    autoplay: true,
    loop: true,
    muted: false
  },
  ceremonies: [
{ label: 'LỄ VU QUY', iso: '2026-12-13T10:30:00+07:00', venue: 'NHƯ Ý PALACE', addr: '10.8602885, 106.958646', lunar: '(Tức ngày 5 tháng 11 năm Bính Ngọ)' },
{ label: 'TIỆC MỪNG CƯỚI', iso: '2026-12-13T16:30:00+07:00', venue: 'NHƯ Ý PALACE', addr: '10.8602885, 106.958646', lunar: '(Tức ngày 5 tháng 11 năm Bính Ngọ)' }
  ]
};
