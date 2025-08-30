"use client";

import { CheckMail, Login, Register } from "@/services/auth.service";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaCheckCircle, FaKey, FaMailBulk, FaUser } from "react-icons/fa";
import { X } from "lucide-react"; // icon X

export default function RegisterForm({ onClose }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [OTP, setOTP] = useState("");

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

        try {
            await Register(username, email, password, OTP);
            const userData = await Login(email, password);
            localStorage.setItem("name", userData.name_user);
            localStorage.setItem("balance", userData.balance);
            localStorage.setItem("token", userData.token);
            window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.message);
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
        <div className="relative max-w-md mx-auto px-8 py-6 bg-white rounded-2xl shadow-lg space-y-4">
            {/* Nút đóng */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-red-500"
                >
                    <X size={20} />
                </button>
            )}

            <div className="flex items-center justify-center gap-4">
                <img src="/imgs/logo.png" alt="Logo" className="w-32" />
                <div className="text-blue-700 font-bold text-2xl border-b-4 border-red-300 pb-1">
                    Napgameuytin
                </div>
            </div>

            {/* Tên */}
            <div className="flex items-center gap-3 border-b border-gray-300 py-2">
                <FaUser className="text-gray-600" />
                <input
                    type="text"
                    placeholder="Nhập tên của bạn"
                    className="flex-1 border-none outline-none text-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            {/* Email + Gửi OTP */}
            <div className="flex items-center gap-3 border-b border-gray-300 py-2 relative">
                <FaMailBulk className="text-gray-600" />
                <input
                    type="email"
                    placeholder="Nhập email"
                    className="flex-1 border-none outline-none text-sm pr-24"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    onClick={handleSendOtp}
                    disabled={seconds > 0 || loadingOTP}
                    className={`absolute text-xs text-white rounded right-2 bottom-2 px-3 py-1 transition ${seconds > 0 || loadingOTP
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gray-600 hover:bg-gray-700"
                        }`}
                >
                    {loadingOTP ? (
                        <svg
                            className="animate-spin h-4 w-4 mx-auto text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3h-4z"
                            ></path>
                        </svg>
                    ) : seconds > 0 ? `${seconds}s` : "Lấy OTP"}
                </button>
            </div>

            {/* Nhập OTP */}
            {showOTP && (
                <div className="flex items-center gap-3 border-b border-gray-300 py-2 transition-opacity duration-300 opacity-100">
                    <FaCheckCircle className="text-gray-600" />
                    <input
                        type="text"
                        placeholder="Nhập mã OTP"
                        className="flex-1 border-none outline-none text-sm"
                        value={OTP}
                        onChange={(e) => setOTP(e.target.value)}
                    />
                </div>
            )}

            {/* Mật khẩu */}
            <div className="flex items-center gap-3 border-b border-gray-300 py-2">
                <FaKey className="text-gray-600" />
                <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    className="flex-1 border-none outline-none text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {/* Nhập lại mật khẩu */}
            <div className="flex items-center gap-3 border-b border-gray-300 py-2">
                <FaKey className="text-gray-600" />
                <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    className="flex-1 border-none outline-none text-sm"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                />
            </div>

            {/* Nút đăng ký */}
            <button
                onClick={handleRegister}
                className="w-full mt-4 bg-[#222222] text-white font-bold py-2 rounded-md hover:bg-black transition">
                Đăng ký
            </button>
        </div>
    );
}
