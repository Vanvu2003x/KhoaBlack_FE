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

                router.push("/thanhtoan");
            }
        } catch (error) {
            console.error("Lỗi khi tạo link thanh toán:", error);
            alert("Tạo liên kết thanh toán thất bại. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
            setHasClicked(false);
            onClose();
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
        <div className="flex justify-center items-center w-full h-screen relative">
            <div className="absolute w-full h-screen top-0 left-0 bg-black/30"></div>
            <div className="max-w-md mx-auto bg-white p-4 rounded shadow z-50">
                <div className="text-center mt-3 mb-6 text-2xl font-bold text-blue-500 border-b-4 pb-4 border-pink-500">
                    Nạp tiền vào Ví
                </div>

                <div className="relative w-full mb-6">
                    <label
                        htmlFor="amount"
                        className={`absolute left-4 bottom-[38px] px-2 bg-white text-blue-500 
                            ${isFocused || amount !== "" ? "w-fit opacity-100" : "w-0 opacity-0 overflow-hidden"}`}
                    >
                        Nhập mệnh giá
                    </label>
                    <input
                        type="text"
                        id="amount"
                        onChange={handleChange}
                        value={displayAmount}
                        placeholder={isFocused ? "" : "Nhập mệnh giá"}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => {
                            if (amount === "") setIsFocused(false);
                        }}
                        className="w-full border-gray-500 focus:border-blue-500 outline-0 border-2 rounded p-3"
                    />
                </div>

                <ul className="grid grid-cols-2 gap-2 mb-6 border-b-4 border-pink-500 pb-7">
                    {["50.000đ", "100.000đ", "200.000đ", "500.000đ", "1.000.000đ", "2.000.000đ"].map((item) => (
                        <li
                            key={item}
                            onClick={() => handleSuggestionClick(item)}
                            className="bg-gray-100 px-4 py-2 rounded text-center cursor-pointer hover:bg-gray-200"
                        >
                            {item}
                        </li>
                    ))}
                </ul>

                <div className="text-red-500 text-sm font-bold">
                    Vui lòng kiểm tra kỹ thông tin trước khi tiến hành nạp!
                </div>
                <div className="text-xs text-gray-500 my-2">
                    Lời khuyên của chủ Shop: Chụp lại thông tin chuyển khoản, khi có lỗi xảy ra liên hệ Shop ở phần Liên hệ.
                </div>

                <button
                    onClick={handlePayment}
                    disabled={isLoading || !amount || hasClicked || cooldown > 0}
                    className={`w-full cursor-pointer text-white font-semibold py-3 rounded transition-colors 
                        ${isLoading || !amount || hasClicked || cooldown > 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-gray-500 hover:bg-gray-700"
                        }`}
                >
                    {cooldown > 0
                        ? `Bạn đã đạt giới hạn. Vui lòng thử lại sau ${formatTime(cooldown)}`
                        : isLoading
                            ? "Đang xử lý..."
                            : "Xác nhận nạp"}
                </button>
            </div>
        </div>
    );
}
