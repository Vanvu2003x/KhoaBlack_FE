"use client";

import { changeStatus } from "@/services/order.service";
import { useState } from "react";
import { GoDotFill } from "react-icons/go";
import { useToast } from "@/components/ui/Toast";
import { FiClock, FiUser, FiPackage, FiMonitor } from "react-icons/fi";

const urlBaseAPI = process.env.NEXT_PUBLIC_API_URL;

export default function OrderItem({ order, onStatusChange }) {
    const toast = useToast();
    const [showAccount, setShowAccount] = useState(false);
    const [orderStatus, setOrderStatus] = useState(order.status);
    const [loading, setLoading] = useState(false);

    const getDotColor = (status) => {
        switch (status) {
            case "pending":
                return "text-yellow-500";
            case "processing":
                return "text-sky-500";
            case "success":
                return "text-emerald-500";
            case "cancel":
                return "text-pink-500";
            default:
                return "text-slate-500";
        }
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

    const handleChangeStatus = async (newStatus) => {
        if (newStatus === orderStatus) return;
        setLoading(true);
        try {
            const res = await changeStatus(order.id, newStatus);
            // toast.success(res.message);
            setOrderStatus(newStatus);
            onStatusChange?.(order.id, newStatus);
        } catch (error) {
            toast.error("Không thể cập nhật trạng thái");
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 bg-[#1E293B]/50 backdrop-blur-xl rounded-2xl border border-white/5 shadow-lg hover:border-cyan-500/30 transition-all duration-300 space-y-5">
            <div className="flex gap-6 items-start">
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-[#0F172A] relative group">
                    {order.thumbnail ? (
                        <img
                            src={urlBaseAPI + order.thumbnail}
                            alt="Gói nạp"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-600">
                            <FiPackage size={24} />
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col gap-3">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-white font-bold text-lg">
                                <span className="text-cyan-400">#{order.id}</span>
                                <span className="text-slate-400 text-sm font-normal">|</span>
                                <span>{order.package_name || "Gói nạp không tên"}</span>
                            </div>

                            <div className="flex flex-col gap-1 text-sm text-slate-400">
                                <span className="flex items-center gap-2">
                                    <FiUser size={14} className="text-slate-500" />
                                    Order: <span className="text-slate-300">{order.user_name}</span>
                                    <span className="text-slate-600">({order.user_email})</span>
                                </span>
                                <span className="flex items-center gap-2">
                                    <FiMonitor size={14} className="text-slate-500" />
                                    Nạp: {order.user_nap_name ? (
                                        <span className="text-emerald-400">{order.user_nap_name}</span>
                                    ) : (
                                        <span className="italic text-slate-600">Chưa có CTV nhận</span>
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Status Select */}
                        <div className="flex items-center gap-2 bg-[#0F172A] px-3 py-1.5 rounded-lg border border-white/10">
                            <GoDotFill className={`${getDotColor(orderStatus)} text-lg`} />
                            <select
                                value={orderStatus}
                                onChange={(e) => handleChangeStatus(e.target.value)}
                                disabled={loading}
                                className={`bg-transparent outline-none text-sm font-bold capitalize cursor-pointer ${getDotColor(orderStatus)}`}
                            >
                                <option value="pending" className="bg-[#1E293B] text-yellow-500">Pending</option>
                                <option value="processing" className="bg-[#1E293B] text-sky-500">Processing</option>
                                <option value="success" className="bg-[#1E293B] text-emerald-500">Success</option>
                                <option value="cancel" className="bg-[#1E293B] text-pink-500">Cancel</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pt-2 border-t border-white/5">
                        <div className="bg-[#0F172A] px-3 py-1.5 rounded-lg border border-white/5">
                            <span className="text-xs text-slate-500 block">Giá tiền</span>
                            <span className="text-blue-400 font-mono font-bold">{formatCurrency(order.amount)}</span>
                        </div>
                        <div className="bg-[#0F172A] px-3 py-1.5 rounded-lg border border-white/5">
                            <span className="text-xs text-slate-500 block">Lợi nhuận</span>
                            <span className="text-green-400 font-mono font-bold">{formatCurrency(order.profit || 0)}</span>
                        </div>
                        <div className="ml-auto text-xs text-slate-500 flex items-center gap-1">
                            <FiClock /> {order.update_at ? new Date(order.update_at).toLocaleString("vi-VN") : "N/A"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-[#0F172A]/50 rounded-xl p-3 border border-dashed border-slate-700">
                <div className="text-center md:text-left">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Loại Gói</span>
                    <div className="text-sm font-semibold text-slate-200">{order.package_type || "N/A"}</div>
                </div>
                <div className="text-center md:text-left">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Game</span>
                    <div className="text-sm font-semibold text-slate-200">{order.game_name || "N/A"}</div>
                </div>
                <div className="text-center md:text-left">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">ID Server</span>
                    <div className="text-sm font-semibold text-slate-200">{JSON.parse(order.account_info || '{}').id_server || "N/A"}</div>
                </div>
                <div className="text-center md:text-right">
                    <button
                        onClick={() => setShowAccount(!showAccount)}
                        className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline transition-colors"
                    >
                        {showAccount ? "Ẩn tài khoản" : "Xem tài khoản game"}
                    </button>
                </div>
            </div>

            {/* Account Info Details */}
            {showAccount && order.account_info && (
                <div className="mt-2 text-sm bg-[#0F172A] border border-slate-700 rounded-xl p-4 animate-[fadeIn_0.3s_ease-out]">
                    <h4 className="text-slate-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                        <FiUser /> Thông tin đăng nhập
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(JSON.parse(order.account_info)).map(([key, value]) => (
                            <div key={key} className="flex flex-col">
                                <span className="text-xs text-slate-500 capitalize">{key.replace('_', ' ')}</span>
                                <span className="text-slate-200 font-mono bg-white/5 px-2 py-1 rounded inline-block w-fit select-all">
                                    {String(value) || "Trống"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
