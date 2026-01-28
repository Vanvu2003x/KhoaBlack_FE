"use client";
import { useState } from "react";
import { FaMailBulk, FaKey } from "react-icons/fa";
import { useToast } from "@/components/ui/Toast";
import { Login, ForgotPassword, ResetPassword } from "@/services/auth.service";
import { X } from "lucide-react"; // icon dấu X gọn đẹp

export default function LoginForm({ onClose, onSwitch }) {
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showForgot, setShowForgot] = useState(false);

    const [forgotStep, setForgotStep] = useState(1);
    const [forgotEmail, setForgotEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleLogin = async () => {
        try {
            const userData = await Login(email, password);
            localStorage.setItem("name", userData.name_user);
            // localStorage.setItem("token", userData.token); // Token is now in cookie
            toast.success("Đăng nhập thành công");
            window.location.reload();
        } catch (error) {
            toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        }
    };

    const handleSendEmail = async () => {
        if (!forgotEmail) return toast.error("Vui lòng nhập email");
        try {
            await ForgotPassword(forgotEmail);
            toast.success("Vui lòng kiểm tra email để nhận OTP");
            setForgotStep(2);
        } catch (err) {
            toast.error("Gửi email thất bại, vui lòng thử lại");
        }
    };

    const handleResetPassword = async () => {
        if (!otp || !newPassword || !confirmPassword)
            return toast.error("Vui lòng điền đầy đủ thông tin");
        if (newPassword !== confirmPassword)
            return toast.error("Mật khẩu nhập lại không khớp");

        try {
            await ResetPassword(forgotEmail, otp, newPassword);
            toast.success("Đổi mật khẩu thành công");
            setShowForgot(false);
            setForgotStep(1);
            setForgotEmail("");
            setOtp("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            toast.error("OTP không đúng hoặc hết hạn, vui lòng thử lại");
        }
    };

    return (
        <div className="relative max-w-md mx-auto px-10 py-8 bg-[#0F172A]/95 backdrop-blur-xl rounded-3xl shadow-2xl space-y-6 border border-slate-700 animate-[fadeIn_0.3s_ease-out]">
            {/* Nút X */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"
            >
                <X size={22} />
            </button>


            {/* Logo + Title */}
            <div className="flex flex-col items-center justify-center gap-3">
                <div className="relative w-28 h-28 transform hover:scale-105 transition-transform duration-300">
                    <img src="/imgs/image.png" alt="Logo" className="w-full h-full object-contain drop-shadow-md" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    {!showForgot ? "Đăng Nhập" : "Quên Mật Khẩu"}
                </div>
                <p className="text-sm text-slate-400">
                    {!showForgot ? "Chào mừng bạn trở lại!" : "Khôi phục quyền truy cập của bạn"}
                </p>
            </div>

            {/* Nội dung đăng nhập hoặc quên mật khẩu */}
            {!showForgot ? (
                <div className="space-y-4">
                    <div className="group flex items-center gap-3 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all bg-slate-800/50 hover:bg-slate-800">
                        <FaMailBulk className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="email"
                            placeholder="Email đăng nhập"
                            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-slate-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

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

                    <div className="flex justify-end">
                        <span
                            className="text-sm font-medium text-slate-400 hover:text-blue-400 cursor-pointer transition-colors"
                            onClick={() => setShowForgot(true)}
                        >
                            Quên mật khẩu?
                        </span>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 hover:to-indigo-600 transform transition-all active:scale-[0.98]"
                    >
                        Đăng nhập ngay
                    </button>

                    {/* Switch to Register */}
                    {onSwitch && (
                        <div className="text-center mt-4">
                            <span className="text-slate-400 text-sm">Chưa có tài khoản? </span>
                            <button
                                onClick={onSwitch}
                                className="text-blue-400 hover:text-blue-300 text-sm font-bold transition-colors"
                            >
                                Đăng ký ngay
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {forgotStep === 1 ? (
                        <>
                            <div className="text-center text-slate-400 text-sm mb-4 px-4">
                                Nhập email của bạn để nhận mã OTP xác thực
                            </div>
                            <div className="group flex items-center gap-3 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-all bg-slate-800/50">
                                <FaMailBulk className="text-slate-400" />
                                <input
                                    type="email"
                                    placeholder="Nhập email của bạn"
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-slate-500"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-3 mt-4">
                                <button onClick={handleSendEmail} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                                    Gửi mã OTP
                                </button>
                                <button
                                    onClick={() => setShowForgot(false)}
                                    className="w-full bg-slate-800 text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-700 transition-colors"
                                >
                                    Quay lại
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-center text-slate-400 text-sm mb-4">
                                Mã OTP đã được gửi. Vui lòng kiểm tra email.
                            </div>
                            <div className="space-y-4">
                                <div className="group flex items-center gap-3 border border-slate-700 rounded-xl px-4 py-3 bg-slate-800/50">
                                    <input
                                        type="text"
                                        placeholder="Nhập mã OTP"
                                        className="flex-1 bg-transparent border-none outline-none text-sm text-center font-bold tracking-widest text-white placeholder-slate-500"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                                <div className="group flex items-center gap-3 border border-slate-700 rounded-xl px-4 py-3 bg-slate-800/50">
                                    <FaKey className="text-slate-400" />
                                    <input
                                        type="password"
                                        placeholder="Mật khẩu mới"
                                        className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-slate-500"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className="group flex items-center gap-3 border border-slate-700 rounded-xl px-4 py-3 bg-slate-800/50">
                                    <FaKey className="text-slate-400" />
                                    <input
                                        type="password"
                                        placeholder="Xác nhận mật khẩu mới"
                                        className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-slate-500"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 mt-6">
                                <button onClick={handleResetPassword} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/30 transition-all">
                                    Xác nhận đổi mật khẩu
                                </button>
                                <button
                                    onClick={() => {
                                        setForgotStep(1);
                                        setOtp("");
                                        setNewPassword("");
                                        setConfirmPassword("");
                                    }}
                                    className="w-full bg-slate-800 text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-700 transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
