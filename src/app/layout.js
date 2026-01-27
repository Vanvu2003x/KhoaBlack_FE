import "./globals.css";
export const metadata = {
    title: "KhoaBlackTopup",
    description: "Nạp game uy tín chất lượng nhanh chóng",
    icons: {
        icon: [
            { url: '/imgs/image.png' },
            { url: '/imgs/image.png', sizes: '32x32', type: 'image/png' },
            { url: '/imgs/image.png', sizes: '16x16', type: 'image/png' },
        ],
        apple: [
            { url: '/imgs/image.png' },
        ],
        shortcut: ['/imgs/image.png'],
    },
};

import { ToastProvider } from "@/components/ui/Toast";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </body>
        </html>
    )
}
