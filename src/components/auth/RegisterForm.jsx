"use client";

import { CheckMail, Login, Register } from "@/services/auth.service";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { FaCheckCircle, FaKey, FaMailBulk, FaUser } from "react-icons/fa";
import { X } from "lucide-react"; // icon X

export default function RegisterForm({ onClose, onSwitch }) {
    const toast = useToast();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [OTP, setOTP] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [loadingOTP, setLoadingOTP] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const router = useRouter();

    const isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleRegister = async () => {
        if (!username) return toast.error("Chưa nhập tên người dùng");
        if (!email) return toast.error("Chưa nhập email");
        if (!isValidEmail(email)) return toast.error("Email không hợp lệ");
        if (!password) return toast.error("Chưa nhập mật khẩu");
        if (!rePassword) return toast.error("Chưa nhập lại mật khẩu");
        if (password !== rePassword) return toast.error("Hai mật khẩu không trùng khớp");
        if (!OTP) return toast.error("Chưa nhập mã OTP");

        if (isLoading) return;
        setIsLoading(true);

        try {
            const userData = await Register(username, email, password, OTP);
            // Backend now automatically logs in and sets cookie
            // Balance will be updated via socket connection, no need to store in localStorage
            localStorage.setItem("name", userData.name_user);
            toast.success("Đăng ký thành công!");
            window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.message || "Đăng ký thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOtp = async () => {
        if (!email) return toast.error("Vui lòng nhập email trước");
        if (!isValidEmail(email)) return toast.error("Email không hợp lệ");

        setLoadingOTP(true);
        try {
            const checkMail = await CheckMail(email);
            if (checkMail.status === "ok") {
                setShowOTP(true);
                setSeconds(60);
                toast.success("OTP đã được gửi tới email");
            } else {
                toast.error(checkMail.message || "Email đã được đăng ký.");
            }
        } catch (error) {
            toast.error("Lỗi khi gửi OTP!");
        } finally {
            setLoadingOTP(false);
        }
    };

    useEffect(() => {
        setSeconds(0);
        setShowOTP(false);
        setOTP("");
    }, [email]);

    useEffect(() => {
        if (seconds === 0) return;

        const timer = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds]);

    return (
        <div className="relative max-w-md mx-auto px-10 py-8 bg-[#0F172A]/95 backdrop-blur-xl rounded-3xl shadow-2xl space-y-6 border border-slate-700 animate-[fadeIn_0.3s_ease-out]">
            {/* Nút đóng */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"
                >
                    <X size={22} />
                </button>
            )}

            <div className="flex flex-col items-center justify-center gap-3">
                <div className="relative w-28 h-28 transform hover:scale-105 transition-transform duration-300">
                    <img src="/imgs/image.png" alt="Logo" className="w-full h-full object-contain drop-shadow-md" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Đăng ký tài khoản
                </div>
                <p className="text-sm text-slate-400">Tạo tài khoản để trải nghiệm dịch vụ</p>
            </div>

            <div className="space-y-4">
                {/* Tên */}
                <div className="group flex items-center gap-3 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all bg-slate-800/50 hover:bg-slate-800">
                    <FaUser className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Họ và tên"
                        className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-slate-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                {/* Email + Gửi OTP */}
                <div className="relative group flex items-center gap-3 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all bg-slate-800/50 hover:bg-slate-800">
                    <FaMailBulk className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="email"
                        placeholder="Địa chỉ Email"
                        className="flex-1 bg-transparent border-none outline-none text-sm pr-24 text-white placeholder-slate-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        onClick={handleSendOtp}
                        disabled={seconds > 0 || loadingOTP}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white rounded-lg px-3 py-1.5 transition-all shadow-sm whitespace-nowrap ${seconds > 0 || loadingOTP
                            ? "bg-slate-600 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-500/30 shadow-md"
                            }`}
                    >
                        {loadingOTP ? (
                            <svg className="animate-spin h-4 w-4 mx-auto text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3h-4z"></path>
                            </svg>
                        ) : seconds > 0 ? `${seconds}s` : "Gửi OTP"}
                    </button>
                </div>

                {/* Nhập OTP */}
                {showOTP && (
                    <div className="group flex items-center gap-3 border rounded-xl px-4 py-3 bg-blue-900/20 border-blue-500/50 focus-within:border-blue-400 animate-[slideDown_0.2s_ease-out]">
                        <FaCheckCircle className="text-green-400" />
                        <input
                            type="text"
                            placeholder="Nhập mã OTP vừa nhận"
                            className="flex-1 bg-transparent border-none outline-none text-sm font-semibold text-blue-200 placeholder-blue-400/50"
                            value={OTP}
                            onChange={(e) => setOTP(e.target.value)}
                        />
                    </div>
                )}

                {/* Mật khẩu */}
                <div className="group flex items-center gap-3 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all bg-slate-800/50 hover:bg-slate-800">
                    <FaKey className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-slate-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* Nhập lại mật khẩu */}
                <div className="group flex items-center gap-3 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all bg-slate-800/50 hover:bg-slate-800">
                    <FaKey className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="password"
                        placeholder="Xác nhận mật khẩu"
                        className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-slate-500"
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                    />
                </div>

                {/* Nút đăng ký */}
                <button
                    onClick={handleRegister}
                    disabled={isLoading}
                    className={`w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 hover:to-indigo-600 transform transition-all active:scale-[0.98] ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3h-4z"></path>
                            </svg>
                            <span>Đang xử lý...</span>
                        </div>
                    ) : (
                        "Đăng ký tài khoản"
                    )}
                </button>

                {/* Switch to Login */}
                {onSwitch && (
                    <div className="text-center mt-4">
                        <span className="text-slate-400 text-sm">Đã có tài khoản? </span>
                        <button
                            onClick={onSwitch}
                            className="text-blue-400 hover:text-blue-300 text-sm font-bold transition-colors"
                        >
                            Đăng nhập
                        </button>
                    </div>
                )}
            </div>
        </div >
    );
}
