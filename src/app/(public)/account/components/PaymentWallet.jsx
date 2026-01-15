"use client";
import { getUrlPayment } from "@/services/payment.service";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function PaymentWallet({ onClose }) {
    const router = useRouter();
    const [isFocused, setIsFocused] = useState(false);
    const [amount, setAmount] = useState("");
    const [displayAmount, setDisplayAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasClicked, setHasClicked] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    // Load lại cooldown khi mở
    useEffect(() => {
        const history = JSON.parse(localStorage.getItem("paymentHistory") || "[]");
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        // Lọc chỉ giữ lại trong 1h gần nhất
        const validHistory = history.filter(ts => now - ts < oneHour);
        localStorage.setItem("paymentHistory", JSON.stringify(validHistory));

        if (validHistory.length >= 5) {
            const earliest = validHistory[0]; // lần sớm nhất trong 1h
            const remain = Math.ceil((oneHour - (now - earliest)) / 1000);
            setCooldown(remain);
        }
    }, []);

    // Đếm ngược cooldown
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handlePayment = async () => {
        if (isLoading || hasClicked || cooldown > 0) return;

        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        let history = JSON.parse(localStorage.getItem("paymentHistory") || "[]");

        // Lọc lại trong vòng 1h
        history = history.filter(ts => now - ts < oneHour);

        if (history.length >= 5) {
            const earliest = history[0];
            const remain = Math.ceil((oneHour - (now - earliest)) / 1000);
            setCooldown(remain);
            return;
        }

        setHasClicked(true);

        const requestData = {
            amount: parseInt(amount),
            description: `Thanh toán nạp vào ví`,
        };

        setIsLoading(true);

        try {
            const dataPayment = await getUrlPayment(requestData);
            dataPayment.description = requestData.description;

            if (dataPayment) {
                localStorage.setItem("tttt", JSON.stringify(dataPayment));

                // Lưu thêm vào history
                history.push(now);
                localStorage.setItem("paymentHistory", JSON.stringify(history));

                router.push("/payment");
            }
        } catch (error) {
            console.error("Lỗi khi tạo link thanh toán:", error);
            alert("Tạo liên kết thanh toán thất bại. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
            setHasClicked(false);
            onClose?.(); // Optional chaining to prevent error
        }
    };

    const formatAmount = (value) => {
        const cleaned = value.replace(/\D/g, "");
        return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        setAmount(raw);
        setDisplayAmount(formatAmount(raw));
    };

    const handleSuggestionClick = (item) => {
        const raw = item.replace(/\D/g, "");
        setAmount(raw);
        setDisplayAmount(formatAmount(raw));
    };

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="max-w-2xl w-full relative z-50">
            {/* Main Card with clean backdrop */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="text-center pt-5 sm:pt-10 pb-4 sm:pb-8 px-4 sm:px-8 border-b border-white/10 relative">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 sm:top-5 right-3 sm:right-5 p-1.5 sm:p-2 rounded-lg bg-slate-800/80 text-slate-300 border border-white/10"
                    >
                        <span className="text-lg sm:text-2xl leading-none">×</span>
                    </button>

                    <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1.5 sm:mb-3 pr-8">
                        Nạp Tiền Vào Ví
                    </h2>
                    <p className="text-slate-400 text-[11px] sm:text-sm">Chọn hoặc nhập số tiền bạn muốn nạp</p>
                </div>

                <div className="p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-8">
                    {/* Input Amount - Clean & Minimal */}
                    <div className="space-y-2 sm:space-y-3">
                        <label htmlFor="amount" className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-1.5 sm:gap-2">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Số tiền
                        </label>
                        <div className={`
                            relative bg-white/5 rounded-2xl border-2 transition-all duration-300
                            ${isFocused
                                ? "border-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                                : "border-white/10 hover:border-white/20"
                            }
                        `}>
                            <input
                                type="text"
                                id="amount"
                                onChange={handleChange}
                                value={displayAmount}
                                placeholder="Nhập số tiền"
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => {
                                    if (amount === "") setIsFocused(false);
                                }}
                                className="w-full bg-transparent outline-none px-3 sm:px-6 py-2.5 sm:py-4 text-lg sm:text-2xl font-bold text-white placeholder-slate-500"
                            />
                            <span className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-blue-400 font-semibold text-[10px] sm:text-sm bg-blue-400/10 px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-md sm:rounded-lg">
                                VNĐ
                            </span>
                        </div>
                    </div>

                    {/* Denomination Buttons - Simple & Clean */}
                    <div className="space-y-2.5 sm:space-y-4">
                        <p className="text-xs sm:text-sm font-semibold text-slate-300">
                            Mệnh giá phổ biến
                        </p>
                        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {["50.000đ", "100.000đ", "200.000đ", "500.000đ", "1.000.000đ", "2.000.000đ"].map((item) => {
                                const isSelected = displayAmount === item.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

                                return (
                                    <li
                                        key={item}
                                        onClick={() => handleSuggestionClick(item)}
                                        className="cursor-pointer transition-all duration-300 hover:scale-105"
                                    >
                                        <div className={`
                                            relative rounded-xl overflow-hidden transition-all duration-300 border-2
                                            ${isSelected
                                                ? "bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                                : "bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10"
                                            }
                                        `}>
                                            <div className="px-2 sm:px-4 py-2 sm:py-4 text-center">
                                                <div className={`
                                                    text-xs sm:text-base font-bold transition-all duration-300
                                                    ${isSelected ? "text-white" : "text-slate-200"}
                                                `}>
                                                    {item}
                                                </div>
                                            </div>

                                            {/* Selected indicator */}
                                            {isSelected && (
                                                <div className="absolute top-2 right-2">
                                                    <div className="bg-white rounded-full p-0.5">
                                                        <svg className="w-3 h-3 text-blue-600" fill="none" strokeWidth="3" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Subtle shine effect */}
                                            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Info notice - Minimal */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                        <div className="flex items-start gap-2 sm:gap-3">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="space-y-1">
                                <p className="text-blue-300 text-xs sm:text-sm font-semibold">
                                    Lưu ý
                                </p>
                                <p className="text-[10px] sm:text-xs text-blue-200/70 leading-relaxed">
                                    Vui lòng kiểm tra kỹ thông tin trước khi xác nhận. Chụp lại màn hình giao dịch để đối chiếu khi cần.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Button - Clean Design */}
                    <button
                        onClick={handlePayment}
                        disabled={isLoading || !amount || hasClicked || cooldown > 0}
                        className={`
                            w-full py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 transform active:scale-[0.98] relative overflow-hidden
                            ${isLoading || !amount || hasClicked || cooldown > 0
                                ? "bg-slate-700/50 text-slate-400 cursor-not-allowed border-2 border-slate-600/50"
                                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] border-2 border-blue-400/50 hover:from-blue-600 hover:to-purple-700"
                            }
                        `}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
                            {cooldown > 0 ? (
                                <>
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {`Vui lòng đợi ${formatTime(cooldown)}`}
                                </>
                            ) : isLoading ? (
                                <>
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Đang xử lý...
                                </>
                            ) : (
                                "Xác Nhận Nạp Tiền"
                            )}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
