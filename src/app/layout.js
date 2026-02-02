import "./globals.css";

// Base metadata for all pages (can be overridden by individual pages)
export const metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://khoablacktopup.vn"),
    title: {
        default: "KhoaBlackTopup - Nạp Game & Mua Nick Game Uy Tín",
        template: "%s | KhoaBlackTopup",
    },
    description: "KhoaBlackTopup - Hệ thống nạp game, mua bán nick game uy tín, giá rẻ, tự động 24/7. Chiết khấu cao, bảo mật tuyệt đối.",
    keywords: ["nạp game", "mua nick game", "shop acc game", "khoablack", "topup game", "nạp game uy tín"],
    authors: [{ name: "KhoaBlack" }],
    creator: "KhoaBlack",
    publisher: "KhoaBlack",
    icons: {
        icon: '/imgs/image.png',
        shortcut: '/imgs/image.png',
        apple: '/imgs/image.png',
    },
    openGraph: {
        type: "website",
        locale: "vi_VN",
        siteName: "KhoaBlackTopup",
    },
    twitter: {
        card: "summary_large_image",
    },
    robots: {
        index: true,
        follow: true,
    },
    verification: {
        // Add your verification codes here
        // google: "your-google-verification-code",
    },
};

// Viewport configuration (Next.js 14+)
export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: "#1a1a2e",
};

import { ToastProvider } from "@/components/ui/Toast";

export default function RootLayout({ children }) {
    return (
        <html lang="vi">
            <body>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </body>
        </html>
    )
}

