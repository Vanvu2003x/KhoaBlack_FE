import "./globals.css";
export const metadata = {
    title: "KhoaBlackTopup",
    description: "Nạp game uy tín chất lượng nhanh chóng",
    icons: {
        icon: '/imgs/image.png',
        shortcut: '/imgs/image.png',
        apple: '/imgs/image.png',
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
