import PublicLayout from "./PublicLayOut";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <PublicLayout>{children}</PublicLayout>
            </body>
        </html>
    );
}
