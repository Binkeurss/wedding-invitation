# Thiệp cưới Vũ Mạnh & Ngọc Ánh – bản Vercel (ảnh nằm sau biến môi trường)

```
index.html            khung trang + liên kết CSS/JS
css/style.css         toàn bộ giao diện
js/util.js            tiện ích
js/config.js          thông tin buổi lễ (KHÔNG chứa URL ảnh/khoá)
js/content.js         dựng nội dung: sự kiện, lịch, đếm ngược, lịch trình
js/secure-images.js   nạp ảnh theo TÊN qua /api (đọc khoá ?k=…)
js/ui.js, engine.js, cover.js   nút nhạc, hiệu ứng cuộn, màn mở thiệp + tuyết
api/manifest.js       kiểm tra khoá mời, trả liên kết ảnh ký sẵn, có hạn
api/img/[name].js     kiểm tra chữ ký, lấy ảnh từ Cloudinary rồi trả về
api/_lib.js           HMAC, ký URL Cloudinary
.env.example          mẫu biến môi trường
```

## Triển khai
1. Đẩy thư mục này lên GitHub (repo private cũng được nếu Vercel của bạn cho phép), Vercel > Add New Project > Import. Không cần Next.js, Framework Preset chọn "Other".
2. Vercel > Settings > Environment Variables: nhập các biến trong `.env.example`.
3. Cloudinary: tải ảnh lên với chế độ **Authenticated** (Upload type = authenticated), điền `public_id` vào biến môi trường dạng từng ảnh một.
   Ví dụ: `CLOUDINARY_IMAGE_hero=wedding/hero|jpg|c_limit,w_1400,q_auto`.
   Tên ảnh hợp lệ: hero, story1–3, album1–8, thanks, photo, ic-rings, ic-car, ic-dinner, ic-couple.
4. Redeploy sau mỗi lần đổi biến môi trường.
5. Gửi khách liên kết: `https://tên-miền/?k=KHOÁ_MỜI&to=Tên khách`. Thiếu hoặc sai `k` thì không ảnh nào hiện.
6. Tên miền riêng: Vercel > Domains (giấu được `github.io`; `*.vercel.app` cũng không lộ tên GitHub).

Chạy thử cục bộ: `npm i -g vercel`, tạo `.env.local` từ `.env.example`, chạy `vercel dev`.

## Đổi khoá
Sửa `INVITE_KEYS` (và `SIGNING_SECRET` nếu muốn huỷ mọi liên kết ảnh đang lưu hành) rồi redeploy.

## Giới hạn (nói thẳng)
- Mã nguồn công khai không chứa URL/khoá ảnh. Nhưng khách có khoá mời vẫn xem được ảnh nên vẫn có thể lưu hoặc chụp màn hình; không cách nào ngăn hoàn toàn.
- Liên kết ảnh có hạn (mặc định 1 giờ), kiểm tra chữ ký và Referer, nên không dùng lại hay nhúng sang trang khác được.
- Đã thử bằng giả lập (khoá sai/đúng, chữ ký sai, hết hạn, Origin/Referer lạ, trang nạp ảnh). CHƯA thử với tài khoản Cloudinary thật: chữ ký URL authenticated viết theo tài liệu, hãy kiểm tra ảnh đầu tiên sau khi deploy.
- Chưa kiểm tra điều khoản gói Vercel Hobby (dùng phi thương mại) và việc deploy repo private trên Hobby.
- Google Drive không được hỗ trợ (không ký URL kiểu này được).
