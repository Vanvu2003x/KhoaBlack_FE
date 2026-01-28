// Metadata for account pages (can't use dynamic metadata in client components)
export const metadata = {
    title: "Tài Khoản Của Tôi | KhoaBlack",
    description: "Quản lý tài khoản, xem lịch sử giao dịch, nạp tiền và theo dõi đơn hàng tại KhoaBlack.",
    robots: {
        index: false, // Don't index user account pages
        follow: false,
    },
};

export default function AccountLayout({ children }) {
    return children;
}
