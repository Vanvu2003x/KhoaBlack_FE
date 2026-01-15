"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/services/websocket.sever";
import { useToast } from "@/components/ui/Toast";
import { cancelPaymentAPI } from "@/services/payment.service";
import { FiCopy, FiClock, FiCheckCircle, FiAlertTriangle, FiX, FiShield, FiCreditCard } from "react-icons/fi";

export default function ThanhToan() {
    const toast = useToast();
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

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Đã sao chép!", { autoClose: 1000, position: "bottom-center" });
    };

    return (
        <div className="min-h-screen bg-[#090514] text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">


            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]"></div>
            </div>

            {!paymentSuccess && tttt && (
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 animate-fadeInUp">

                    {/* Left Column: Invoice Info */}
                    <div className="space-y-6">
                        <div className="bg-[#151021]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                                    <FiCreditCard className="text-blue-400" /> Thông tin đơn hàng
                                </h2>
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse">
                                    <FiClock /> {formatTime(countdown)}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm"> {/* Spaced items */}
                                    <span className="text-slate-400">Mã đơn hàng</span>
                                    <span className="font-mono mt-1 text-white bg-slate-800 px-2 py-0.5 rounded text-xs select-all">
                                        #{tttt.id}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Người mua</span>
                                    <span className="text-white font-medium">{tttt.name}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Email</span>
                                    <span className="text-white font-medium">{tttt.email}</span>
                                </div>
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mt-4">
                                    <div className="text-xs text-blue-300 mb-1">Đang thanh toán cho</div>
                                    <div className="text-white font-bold text-lg">{tttt.description}</div>
                                    <div className="text-2xl font-black text-blue-400 mt-2">
                                        {Number(tttt.amount).toLocaleString("vi-VN")} <span className="text-sm text-slate-400">VNĐ</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#151021]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
                            <div className="flex items-center gap-3 text-sm text-yellow-400 bg-yellow-400/10 p-3 rounded-xl border border-yellow-400/10">
                                <FiAlertTriangle className="shrink-0 text-xl" />
                                <p>Vui lòng chuyển khoản đúng <strong>Số tiền</strong> và <strong>Nội dung</strong> để hệ thống tự động duyệt đơn.</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={cancelPayment} className="flex-1 py-3 rounded-xl border border-red-500/30 text-red-400 font-bold hover:bg-red-500/10 transition-all flex items-center justify-center gap-2">
                                    <FiX /> Hủy đơn hàng
                                </button>
                                <button onClick={() => window.location.reload()} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/25">
                                    Tôi đã thanh toán
                                </button>
                            </div>
                            <p className="text-center text-xs text-slate-500 mt-2">
                                Hệ thống sẽ tự động xác nhận sau 1-3 phút.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Payment Details & QR */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-[#151021]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-gradient-x"></div>

                            <div className="p-6 pb-8">
                                <div className="text-center mb-8 relative">
                                    <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -z-10"></div>
                                    <span className="bg-[#151021] px-4 text-sm font-bold text-slate-400 uppercase tracking-widest relative z-10 border border-white/5 rounded-full py-1">
                                        Quét QR để thanh toán
                                    </span>
                                </div>

                                <div className="flex justify-center mb-8">
                                    <div className="relative group/qr p-3 rounded-2xl bg-white shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-transform duration-300 hover:scale-[1.02]">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl -z-10 opacity-50 blur-lg group-hover/qr:opacity-100 transition-opacity"></div>
                                        {/* QR Code display */}
                                        <img src={tttt.urlPayment} alt="QR thanh toán" className="w-[220px] h-[220px] object-contain mix-blend-multiply" />
                                    </div>
                                </div>

                                {/* Bank Info Details with Copy buttons */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-[#090514]/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Ngân hàng</div>
                                            <div className="font-bold text-white flex items-center gap-2">
                                                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                                {tttt.bank_name}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-[#090514]/50 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all group/item">
                                        <div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Số tài khoản</div>
                                            <div className="font-bold text-blue-400 font-mono text-lg tracking-wider">{tttt.accountNumber}</div>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(tttt.accountNumber)}
                                            className="p-2.5 bg-white/5 hover:bg-blue-500 hover:text-white text-slate-400 rounded-lg transition-all active:scale-95"
                                            title="Sao chép số tài khoản"
                                        >
                                            <FiCopy size={18} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-[#090514]/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Chủ tài khoản</div>
                                            <div className="font-bold text-white flex items-center gap-2">
                                                <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                                                {decodeURIComponent(tttt.accountHolder)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all group/item">
                                        <div>
                                            <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Nội dung chuyển khoản</div>
                                            <div className="font-bold text-blue-300 font-mono text-lg">{tttt.memo}</div>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(tttt.memo)}
                                            className="p-2.5 bg-blue-500/10 hover:bg-blue-500 hover:text-white text-blue-400 rounded-lg transition-all active:scale-95"
                                            title="Sao chép nội dung"
                                        >
                                            <FiCopy size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
                            <FiShield /> Thanh toán an toàn và bảo mật 100%
                        </div>
                    </div>
                </div>
            )}

            {paymentSuccess && tttt && (
                <div className="w-full max-w-md bg-[#151021] border border-green-500/30 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(34,197,94,0.2)] animate-scaleIn">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                        <FiCheckCircle size={40} />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Thanh toán thành công!</h2>
                    <p className="text-slate-400 text-sm mb-6">Đơn hàng của bạn đã được xác nhận.</p>

                    <div className="bg-[#090514] rounded-xl p-4 mb-6 border border-white/5 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Mã đơn hàng</span>
                            <span className="text-white font-mono">#{tttt.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Số tiền</span>
                            <span className="text-green-400 font-bold">{Number(tttt.amount).toLocaleString("vi-VN")} đ</span>
                        </div>
                        <div className="pt-3 border-t border-white/5 text-left text-sm text-slate-400">
                            {tttt.description}
                        </div>
                    </div>

                    <button
                        onClick={() => router.back()}
                        className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/25 transition-all"
                    >
                        Quay về trang chủ ({successCountdown}s)
                    </button>
                </div>
            )}

            {!tttt && !paymentSuccess && (
                <div className="text-center p-8 bg-[#151021] rounded-2xl border border-red-500/20 shadow-xl max-w-md">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                        <FiX size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Không tìm thấy đơn hàng</h3>
                    <p className="text-slate-400 text-sm mb-6">Đơn hàng đã hết hạn hoặc không tồn tại.</p>
                    <button onClick={() => router.push('/')} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-bold transition-all">
                        Trở về trang chủ
                    </button>
                </div>
            )}
        </div>
    );
}

