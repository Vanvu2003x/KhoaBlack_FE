"use client";
import { useState } from "react";
import { FaMailBulk, FaKey } from "react-icons/fa";
import { toast } from "react-toastify";
import { Login, ForgotPassword, ResetPassword } from "@/services/auth.service";
import { X } from "lucide-react"; // icon dấu X gọn đẹp

export default function LoginForm({ onClose }) {
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
            localStorage.setItem("token", userData.token);
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

    const buttonClass =
        "flex-1 bg-[#222222] text-white font-bold py-2 rounded-md hover:bg-black transition";

    return (
        <div className="relative max-w-md mx-auto px-8 py-6 bg-white rounded-2xl shadow-lg space-y-4">
            {/* Nút X */}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10 p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-red-500"
            >
                <X size={20} />
            </button>


            {/* Logo + Title */}
            <div className="flex items-center justify-center gap-4">
                <img src="/imgs/logo.png" alt="Logo" className="w-32" />
                <div className="text-blue-700 font-bold text-2xl border-b-4 border-red-300 pb-1">
                    Napgameuytin
                </div>
            </div>

            {/* Nội dung đăng nhập hoặc quên mật khẩu */}
            {!showForgot ? (
                <>
                    <div className="flex items-center gap-3 border-b border-gray-300 py-2">
                        <FaMailBulk className="text-gray-600" />
                        <input
                            type="email"
                            placeholder="Nhập email"
                            className="flex-1 border-none outline-none text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

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

                    <div
                        className="text-right text-blue-600 text-sm cursor-pointer hover:underline"
                        onClick={() => setShowForgot(true)}
                    >
                        Quên mật khẩu?
                    </div>

                    <button onClick={handleLogin} className={`${buttonClass} w-full`}>
                        Đăng nhập
                    </button>
                </>
            ) : (
                <>
                    {forgotStep === 1 ? (
                        <>
                            <div className="text-center text-gray-700 font-medium mb-2">
                                Lấy lại mật khẩu
                            </div>
                            <div className="flex items-center gap-3 border-b border-gray-300 py-2">
                                <FaMailBulk className="text-gray-600" />
                                <input
                                    type="email"
                                    placeholder="Nhập email của bạn"
                                    className="flex-1 border-none outline-none text-sm"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-between mt-4 gap-2">
                                <button onClick={handleSendEmail} className={buttonClass}>
                                    Gửi email
                                </button>
                                <button
                                    onClick={() => setShowForgot(false)}
                                    className={buttonClass + " bg-gray-500 hover:bg-gray-700"}
                                >
                                    Hủy
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-center text-gray-700 font-medium mb-2">
                                Nhập OTP và mật khẩu mới
                            </div>
                            <div className="flex items-center gap-3 border-b border-gray-300 py-2">
                                <input
                                    type="text"
                                    placeholder="Nhập OTP"
                                    className="flex-1 border-none outline-none text-sm"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-3 border-b border-gray-300 py-2">
                                <FaKey className="text-gray-600" />
                                <input
                                    type="password"
                                    placeholder="Mật khẩu mới"
                                    className="flex-1 border-none outline-none text-sm"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-3 border-b border-gray-300 py-2">
                                <FaKey className="text-gray-600" />
                                <input
                                    type="password"
                                    placeholder="Nhập lại mật khẩu mới"
                                    className="flex-1 border-none outline-none text-sm"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-between mt-4 gap-2">
                                <button onClick={handleResetPassword} className={buttonClass}>
                                    Đổi mật khẩu
                                </button>
                                <button
                                    onClick={() => {
                                        setForgotStep(1);
                                        setOtp("");
                                        setNewPassword("");
                                        setConfirmPassword("");
                                    }}
                                    className={buttonClass + " bg-gray-500 hover:bg-gray-700"}
                                >
                                    Hủy
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
