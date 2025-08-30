"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/services/websocket.sever";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cancelPaymentAPI } from "@/services/payment.service";

export default function ThanhToan() {
    const [tttt, setTttt] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [successCountdown, setSuccessCountdown] = useState(15);
    const router = useRouter();

    const redirectBack = () => {
        toast.warn("Trang thanh toán đã hết hạn!", { position: "top-center", autoClose: 3000 });
        setTimeout(() => router.back(), 3000);
    };

    const cancelPayment = async () => {
        if (!tttt) return;
        try {
            await cancelPaymentAPI(tttt.id);
            localStorage.removeItem("tttt");
            setTttt(null);
            toast.info("Bạn đã hủy thanh toán.", { position: "top-center", autoClose: 2000 });
            setTimeout(() => router.back(), 2500);
        } catch (error) {
            console.error("Lỗi khi hủy thanh toán:", error);
            toast.error("Hủy thanh toán thất bại!", { position: "top-center" });
        }
    };

    // Lấy dữ liệu thanh toán khi load trang
    useEffect(() => {
        const value = localStorage.getItem("tttt");
        if (value) {
            try {
                const parsed = JSON.parse(value);
                if (!parsed.createdAt) {
                    parsed.createdAt = Date.now();
                    localStorage.setItem("tttt", JSON.stringify(parsed));
                }
                const elapsed = Math.floor((Date.now() - parsed.createdAt) / 1000);
                const remaining = 1200 - elapsed;
                if (remaining <= 0) {
                    localStorage.removeItem("tttt");
                    redirectBack();
                } else {
                    setTttt(parsed);
                    setCountdown(remaining);
                }
            } catch (e) {
                console.error("Dữ liệu localStorage không hợp lệ:", e);
            }
        }
    }, []);

    // Đếm ngược thời gian còn lại của trang thanh toán
    useEffect(() => {
        if (!tttt || countdown === null) return;
        if (countdown <= 0) {
            localStorage.removeItem("tttt");
            setTttt(null);
            redirectBack();
            return;
        }
        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [countdown, tttt]);

    // Socket lắng nghe kết quả thanh toán
    useEffect(() => {
        const socket = getSocket();
        socket.on("payment_success", (data) => {
            console.log("📩 Payment success:", data);
            if (data.balance != null) {
                localStorage.setItem("balance", String(data.balance));
            }
            localStorage.removeItem("tttt");
            toast.success(data.message || "Thanh toán thành công!", { position: "top-center", autoClose: 2000 });
            setPaymentSuccess(true);
        });
        return () => socket.off("payment_success");
    }, []);

    // Đếm ngược 15 giây khi ở trang success
    useEffect(() => {
        if (!paymentSuccess) return;
        if (successCountdown <= 0) {
            router.back();
            return;
        }
        const timer = setInterval(() => {
            setSuccessCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [paymentSuccess, successCountdown]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    return (
        <>
            <ToastContainer />
            {!paymentSuccess && tttt && (
                <div className="w-full p-4 bg-[#F3F4F6] min-h-screen flex flex-col items-center">
                    <div className="bg-white p-4 mb-4 w-full max-w-3xl text-[16px] rounded shadow">
                        <div className="text-blue-500 font-semibold mb-3 flex justify-between items-center">
                            <span>Hóa đơn: {tttt.id} — Chờ thanh toán</span>
                            <span className="text-red-500 text-sm font-medium">
                                ⏳ Hết hạn sau: {formatTime(countdown)}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
                            <div>Người mua: {tttt.name}</div>
                            <div>Email: {tttt.email}</div>
                            <div>Sản phẩm: {tttt.description}</div>
                            <div>
                                Tổng tiền: <span className="font-medium">{Number(tttt.amount).toLocaleString("vi-VN")} VNĐ</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full max-w-3xl bg-white p-4 md:flex gap-4 items-start rounded shadow">
                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left border border-gray-400 text-sm md:text-base border-collapse rounded">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-3 py-2 border border-gray-400" colSpan={2}>Thông tin thanh toán</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td className="px-3 py-2 border border-gray-400 font-medium">Ngân hàng</td><td className="px-3 py-2 border border-gray-400">{tttt.bank_name}</td></tr>
                                    <tr><td className="px-3 py-2 border border-gray-400 font-medium">Số tài khoản</td><td className="px-3 py-2 border border-gray-400">{tttt.accountNumber}</td></tr>
                                    <tr><td className="px-3 py-2 border border-gray-400 font-medium">Chủ tài khoản</td><td className="px-3 py-2 border border-gray-400">{decodeURIComponent(tttt.accountHolder)}</td></tr>
                                    <tr><td className="px-3 py-2 border border-gray-400 font-medium">Số tiền</td><td className="px-3 py-2 border border-gray-400">{Number(tttt.amount).toLocaleString("vi-VN")} VNĐ</td></tr>
                                    <tr><td className="px-3 py-2 border border-gray-400 font-medium">Nội dung chuyển khoản</td><td className="px-3 py-2 border border-gray-400 text-blue-600 font-semibold">{tttt.memo}</td></tr>
                                </tbody>
                            </table>
                            <div className="mt-4">
                                <button onClick={cancelPayment} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Hủy thanh toán</button>
                            </div>
                        </div>
                        <div className="w-full md:w-[300px] mt-4 md:mt-0 border-3 border-black rounded overflow-hidden">
                            <img src={tttt.urlPayment} alt="QR thanh toán" className="w-full" />
                        </div>
                    </div>
                </div>
            )}

            {paymentSuccess && tttt && (
                <div className="flex flex-col items-center justify-center bg-green-50 py-16">
                    <div className="bg-white rounded shadow max-w-lg w-full text-center p-6">
                        <h2 className="text-3xl font-bold text-green-700 mb-4">Thanh toán thành công 🎉</h2>
                        <p className="mb-2">Mã đơn hàng: <span className="font-mono">{tttt.id}</span></p>
                        <p className="mb-2">Số tiền: <strong>{Number(tttt.amount).toLocaleString("vi-VN")} VNĐ</strong></p>
                        {tttt.description && <p className="mb-4">Thông tin: {tttt.description}</p>}
                        <p className="text-gray-500">Tự quay lại sau {successCountdown} giây...</p>
                        <button onClick={() => router.back()} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                            Quay về trang trước
                        </button>
                    </div>
                </div>
            )}

            {!tttt && !paymentSuccess && (
                <p className="p-4 text-center text-red-600">Đơn hàng đã được xử lý xong hoặc đã hết hạn.</p>
            )}
        </>
    );
}
