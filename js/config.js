const TZ = 'Asia/Ho_Chi_Minh';
const CONFIG = {
  groom: 'Lâm Vũ Mạnh',
  bride: 'Vũ Ngọc Ánh',
  // buổi lễ: dòng đầu tiên là mốc đếm ngược & lịch
  ceremonies: [
    { label: 'Đón Khách', iso: '2026-12-13T10:30:00+07:00' },
    { label: 'Đãi Tiệc',  iso: '2026-12-13T11:30:00+07:00' }
  ],
  // TODO: thay bằng số điện thoại thật
  contacts: [
    { group: 'Cô dâu & Chú rể', people: [
      { role: 'Chú rể', name: 'Lâm Mạnh Vũ', phone: '0822312655' },
      { role: 'Cô dâu', name: 'Vũ Ngọc Ánh', phone: '0869936019' }
    ]}
  ],
  // TODO: thay bằng tài khoản thật
  bank: [
    { side: 'Nhà trai', holder: 'TEN CHU TAI KHOAN', bank: 'Vietcombank', number: '0000000001' },
    { side: 'Nhà gái',  holder: 'TEN CHU TAI KHOAN', bank: 'Vietcombank', number: '0000000002' }
  ]
};
