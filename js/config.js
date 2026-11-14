const TZ = 'Asia/Ho_Chi_Minh';
const CONFIG = {
  groom: 'Lâm Vũ Mạnh',
  bride: 'Vũ Ngọc Ánh',
  // buổi lễ: dòng đầu tiên là mốc đếm ngược & lịch
  ceremonies: [
    { label: 'Đón Khánh', iso: '2026-12-13T10:00:00+07:00' },
    { label: 'Đãi Tiệc',  iso: '2026-12-13T11:30:00+07:00' }
  ],
  // TODO: thay bằng số điện thoại thật
  contacts: [
    { group: 'Nhà trai', people: [
      { role: 'Chú rể', name: 'Vũ Mạnh',          phone: '0900 000 001' },
      { role: 'Cha',    name: 'Lâm Văn Đượm',     phone: '0900 000 002' },
      { role: 'Mẹ',     name: 'Huỳnh Thị Phượng', phone: '0900 000 003' }
    ]},
    { group: 'Nhà gái', people: [
      { role: 'Cô dâu', name: 'Ngọc Ánh',     phone: '0900 000 004' },
      { role: 'Cha',    name: 'Vũ Bảo Duật',  phone: '0900 000 005' },
      { role: 'Mẹ',     name: 'Phạm Thị Tin', phone: '0900 000 006' }
    ]}
  ],
  // TODO: thay bằng tài khoản thật
  bank: [
    { side: 'Nhà trai', holder: 'TEN CHU TAI KHOAN', bank: 'Vietcombank', number: '0000000001' },
    { side: 'Nhà gái',  holder: 'TEN CHU TAI KHOAN', bank: 'Vietcombank', number: '0000000002' }
  ]
};
