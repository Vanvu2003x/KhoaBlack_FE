import "./globals.css";

// Base metadata for all pages (can be overridden by individual pages)
export const metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://khoablacktopup.vn"),
    title: {
        default: "KhoaBlackTopUp - Nạp Game Tốc Độ, Uy Tín, Chất Lượng",
        template: "%s | KhoaBlackTopUp",
    },
    description: "KhoaBlackTopUp - Dịch vụ nạp game hàng đầu Việt Nam với tốc độ nhanh chóng, giao dịch tự động 24/7. Mua bán nick game uy tín, bảo mật tuyệt đối, chiết khấu cao nhất thị trường.",
    keywords: [
        "nạp game",
        "mua nick game",
        "shop acc game",
        "khoablack",
        "topup game",
        "nạp game uy tín",
        "khoa black top up",
        "khoablacktopup",
        "nạp game tự động",
        "mua acc game giá rẻ"
    ],
    authors: [{ name: "KhoaBlack" }],
    creator: "KhoaBlack",
    publisher: "KhoaBlackTopUp",
    icons: {
        icon: '/imgs/image.png',
        shortcut: '/imgs/image.png',
        apple: '/imgs/image.png',
    },
    openGraph: {
        type: "website",
        locale: "vi_VN",
        url: "https://khoablacktopup.vn",
        siteName: "KhoaBlackTopUp",
        title: "KhoaBlackTopUp - Nạp Game Tốc Độ, Uy Tín, Chất Lượng",
        description: "Dịch vụ nạp game hàng đầu Việt Nam với tốc độ nhanh chóng, giao dịch tự động 24/7. Bảo mật tuyệt đối, chiết khấu cao nhất thị trường.",
        images: [
            {
                url: "/imgs/image.png",
                width: 1200,
                height: 630,
                alt: "KhoaBlackTopUp - Nạp Game Uy Tín",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "KhoaBlackTopUp - Nạp Game Tốc Độ, Uy Tín, Chất Lượng",
        description: "Dịch vụ nạp game hàng đầu Việt Nam. Giao dịch tự động 24/7, bảo mật tuyệt đối.",
        images: ["/imgs/image.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: "https://khoablacktopup.vn",
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

