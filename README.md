This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🚀 Deploy lên VPS

### 1. Cấu hình Environment

Tạo file `.env.local` trên VPS:

```env
# ⚠️ QUAN TRỌNG: Phải khớp với backend CORS_ORIGINS
NEXT_PUBLIC_API_URL=https://api.khoablacktopup.vn
NEXT_PUBLIC_APP_URL=https://khoablacktopup.vn

# Socket (optional - mặc định dùng API_URL)
# NEXT_PUBLIC_SOCKET_URL=https://api.khoablacktopup.vn
```

### 2. Build & Start

```bash
# Install dependencies
npm install

# Build production
npm run build

# Start với PM2
pm2 start npm --name "khoablack-fe" -- start

# Hoặc chạy trực tiếp
npm start
```

### 3. Cấu hình Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name khoablacktopup.vn www.khoablacktopup.vn;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### ⚠️ Lưu ý quan trọng

| Điểm | Chi tiết |
|------|----------|
| **NEXT_PUBLIC_API_URL** | Phải là HTTPS và khớp với backend CORS |
| **Không trailing slash** | ✅ `https://api.khoablacktopup.vn` ❌ `https://api.khoablacktopup.vn/` |
| **HTTPS bắt buộc** | Cả FE và BE phải dùng HTTPS |
| **Rebuild sau khi đổi env** | `npm run build` lại sau khi sửa `.env.local` |

### ✅ Verify Socket hoạt động

Mở DevTools (F12) → Console → Tìm:
```
✅ Socket connected successfully!
   Socket ID: xxxxx
   Transport: websocket
```

