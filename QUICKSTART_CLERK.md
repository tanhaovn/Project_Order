# Quick Start - Clerk Authentication

## Setup nhanh trong 3 bước:

### 1. Tạo tài khoản Clerk
- Vào: https://clerk.com/
- Sign up (miễn phí)
- Tạo application mới

### 2. Lấy API Key
- Vào Dashboard → API Keys
- Copy **Publishable Key**
- Paste vào file `.env.local`:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

### 3. Chạy app
```bash
npm run dev
```

Xong! Truy cập http://localhost:5173/login để đăng nhập.

## Test thử

1. Mở http://localhost:5173
2. Sẽ tự động redirect đến `/login`
3. Click "Sign up" để tạo tài khoản
4. Sau khi đăng ký, sẽ redirect về dashboard

## Tính năng

✅ Đăng nhập / Đăng ký
✅ Bảo vệ tất cả routes
✅ Hiển thị avatar & tên user trong sidebar
✅ Nút đăng xuất
✅ Auto redirect khi chưa login

## Cần help?

Xem file `CLERK_SETUP.md` để biết chi tiết hơn.
