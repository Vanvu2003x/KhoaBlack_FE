export const metadata = {
    title: "Thanh Toán | KhoaBlack",
    description: "Thanh toán đơn hàng qua chuyển khoản ngân hàng. Hệ thống tự động xác nhận.",
    robots: {
        index: false, // Don't index payment pages
        follow: false,
    },
};

export default function PaymentLayout({ children }) {
    return children;
}
