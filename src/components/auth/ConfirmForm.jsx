"use client";

import { createOrder } from "@/services/order.service";
import { useToast } from "@/components/ui/Toast";
import { io } from "socket.io-client";
import { FiAlertTriangle, FiCheck, FiCheckCircle, FiClock, FiGlobe, FiInfo, FiKey, FiMessageSquare, FiPackage, FiServer, FiShield, FiUser, FiX, FiArrowRight } from "react-icons/fi";
import React from 'react';
import Link from 'next/link';

export default function ConfirmForm({ data, onClick }) {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [orderResult, setOrderResult] = React.useState(null);

    // Success State UI
    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

                {/* Success Modal */}
                <div className="relative bg-[#151021] border border-green-500/30 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
                    {/* Green gradient top bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>

                    {/* Decorations */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>

                    <div className="p-8 text-center relative z-10">
                        {/* Animated Success Icon */}
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                            <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                                <FiCheckCircle size={48} className="text-white animate-bounceIn" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">Đặt hàng thành công!</h2>
                        <p className="text-slate-400 text-sm mb-6">Đơn hàng của bạn đang được xử lý</p>

                        {/* Order Info */}
                        <div className="bg-[#090514] border border-white/5 rounded-xl p-4 mb-6 text-left space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">Gói nạp</span>
                                <span className="text-white font-medium">{data.package.package_name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">Số tiền</span>
                                <span className="text-green-400 font-bold">{data.package.price.toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">UID</span>
                                <span className="text-white font-medium">{data.uid || data.username}</span>
                            </div>
                            <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-yellow-400 text-xs">
                                <FiClock className="shrink-0" />
                                <span>Thời gian xử lý: 1-5 phút</span>
                            </div>
                        </div>

                        {/* Instruction */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                            <p className="text-blue-300 text-sm">
                                Để theo dõi tình trạng đơn hàng, vào <strong className="text-white">Tài khoản</strong> → <strong className="text-white">Lịch sử nạp game</strong>
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClick}
                                className="flex-1 py-3 bg-[#1E1730] hover:bg-[#281f3d] text-slate-300 font-bold rounded-xl transition-all border border-white/5"
                            >
                                Đóng
                            </button>
                            <Link
                                href="/account"
                                className="flex-[2] py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/25 transition-all flex items-center justify-center gap-2"
                            >
                                Đi đến Tài khoản <FiArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* CSS for animations */}
                <style jsx global>{`
                    @keyframes bounceIn {
                        0% { transform: scale(0); opacity: 0; }
                        50% { transform: scale(1.2); }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    .animate-bounceIn {
                        animation: bounceIn 0.5s ease-out forwards;
                    }
                `}</style>
            </div>
        );
    }

    // Normal Confirm UI
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={!isSubmitting ? onClick : undefined}
            ></div>

            {/* Modal Container */}
            <div className="relative bg-[#151021] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

                {/* Header */}
                <div className="p-6 pb-2 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <FiShield className="text-purple-500" /> Xác nhận thanh toán
                        </h2>
                        <button
                            onClick={onClick}
                            disabled={isSubmitting}
                            className="text-slate-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiX size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 space-y-4 relative z-10 max-h-[70vh] overflow-y-auto custom-scrollbar">

                    {/* Package Info Card */}
                    <div className="bg-[#090514] border border-white/5 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
                            <FiPackage size={24} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 font-bold uppercase mb-0.5">Gói nạp</div>
                            <div className="text-white font-bold">{data.package.package_name}</div>
                            <div className="text-xs text-blue-400 font-medium bg-blue-500/10 px-1.5 py-0.5 rounded inline-block mt-1">
                                {data.package.package_type}
                            </div>
                        </div>
                        <div className="ml-auto text-right">
                            <div className="text-xs text-slate-500 font-bold uppercase mb-0.5">Giá tiền</div>
                            <div className="text-green-400 font-bold text-lg">
                                {data.package.price.toLocaleString()}đ
                            </div>
                        </div>
                    </div>

                    {/* Account Info List */}
                    <div className="space-y-3">
                        {data.server && (
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-slate-400 text-sm flex items-center gap-2">
                                    <FiServer className="text-slate-600" /> Server
                                </span>
                                <span className="text-white font-medium">{data.server}</span>
                            </div>
                        )}
                        {data.idServer && (
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-slate-400 text-sm flex items-center gap-2">
                                    <FiGlobe className="text-slate-600" /> Zone ID
                                </span>
                                <span className="text-white font-medium">{data.idServer}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 text-sm flex items-center gap-2">
                                <FiUser className="text-slate-600" /> UID / Tài khoản
                            </span>
                            <span className="text-white font-medium text-right max-w-[200px] truncate" title={data.uid || data.username}>
                                {data.uid || data.username}
                            </span>
                        </div>

                        {["LOG", "log"].includes(data.package.package_type) && data.password && (
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-slate-400 text-sm flex items-center gap-2">
                                    <FiKey className="text-slate-600" /> Mật khẩu
                                </span>
                                <span className="text-white font-medium font-mono">******</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-slate-400 text-sm flex items-center gap-2">
                                <FiMessageSquare className="text-slate-600" /> Zalo
                            </span>
                            <span className="text-white font-medium">{data.zaloNumber}</span>
                        </div>

                        {data.note && (
                            <div className="py-2">
                                <span className="text-slate-400 text-sm flex items-center gap-2 mb-1">
                                    <FiInfo className="text-slate-600" /> Ghi chú
                                </span>
                                <div className="text-slate-300 text-sm bg-white/5 p-2 rounded italic">
                                    "{data.note}"
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Warning */}
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex gap-3">
                        <FiAlertTriangle className="text-yellow-500 shrink-0 mt-0.5" />
                        <p className="text-yellow-200 text-xs leading-relaxed">
                            Vui lòng kiểm tra kỹ thông tin. Đơn hàng sẽ không thể hoàn tiền nếu bạn điền sai thông tin nhân vật.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-4 flex gap-3 relative z-10">
                    <button
                        onClick={onClick}
                        disabled={isSubmitting}
                        className="flex-1 py-3 bg-[#1E1730] hover:bg-[#281f3d] text-slate-300 font-bold rounded-xl transition-all border border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Quay lại
                    </button>

                    <button
                        disabled={isSubmitting}
                        onClick={async () => {
                            if (isSubmitting) return;
                            setIsSubmitting(true);
                            // Gom dữ liệu account_info
                            const accountInfo = {
                                uid: data.uid,
                                server: data.server,
                                id_server: data.idServer,
                                zaloNumber: data.zaloNumber,
                                note: data.note || "",
                            };
                            if (data.username) accountInfo.username = data.username;
                            if (data.password) accountInfo.password = data.password;

                            const payload = {
                                package_id: data.package.id,
                                amount: data.package.price,
                                account_info: JSON.stringify(accountInfo),
                            };

                            try {
                                const result = await createOrder(payload);
                                setOrderResult(result);
                                setIsSuccess(true);

                                const socket = io(process.env.NEXT_PUBLIC_API_URL, {
                                    withCredentials: true,
                                });

                                socket.on("balance_update", (newBalance) => {
                                    console.log("Số dư mới:", newBalance);
                                    localStorage.setItem("balance", newBalance);
                                });
                            } catch (error) {
                                const message =
                                    error?.response?.data?.message ||
                                    "Tạo đơn hàng thất bại!";
                                toast.error(message);
                                setIsSubmitting(false);
                            }
                        }}
                        className="flex-[2] py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Đang xử lý...</span>
                            </>
                        ) : (
                            <>
                                <FiCheck strokeWidth={3} /> Xác nhận nạp
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
