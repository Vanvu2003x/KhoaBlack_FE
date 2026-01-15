import "./globals.css";
export const metadata = {
    title: "Napgameuytin",
    description: "Nạp game uy tín chất lượng nhanh chóng",
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
