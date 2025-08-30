import "./globals.css";
export const metadata = {
  title: "Napgameuytin",
  description: "Nạp game uy tín chất lượng nhannh chóng",
};

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
                <ToastContainer position="top-right" autoClose={2000} />
            </body>
        </html>
    )
}
