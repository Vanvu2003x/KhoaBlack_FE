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
        <div className="group relative bg-[#1E293B]/40 backdrop-blur-md rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 overflow-hidden">
            {/* Status Color Line */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${getDotColor(orderStatus).replace('text-', 'bg-')} transition-colors duration-300`}></div>

            <div className="p-5 pl-7">
                <div className="flex flex-col md:flex-row gap-5 items-start">
                    {/* Image */}
                    <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden border border-white/10 bg-slate-900 relative group/img shadow-lg">
                        {order.thumbnail ? (
                            <img
                                src={urlBaseAPI + order.thumbnail}
                                alt="Package"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-800/50">
                                <FiPackage size={28} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover/img:bg-transparent transition-colors"></div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
                                        #{order.id}
                                    </span>
                                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                                        {order.package_name || "Gói không tên"}
                                    </h3>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                                    <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg">
                                        <FiUser className="text-blue-400" />
                                        <span className="text-slate-300 font-medium">{order.user_name}</span>
                                    </div>
                                    <div className="hidden md:block w-1 h-1 rounded-full bg-slate-700"></div>
                                    <div className="flex items-center gap-1.5">
                                        <FiClock className="text-slate-500" />
                                        <span>{order.update_at ? new Date(order.update_at).toLocaleString("vi-VN") : "N/A"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions / Status */}
                            <div className="flex items-center gap-3 self-end md:self-auto">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-opacity-10 backdrop-blur-sm ${orderStatus === 'success' ? 'bg-emerald-500 border-emerald-500/30 text-emerald-400' :
                                        orderStatus === 'pending' ? 'bg-yellow-500 border-yellow-500/30 text-yellow-400' :
                                            orderStatus === 'processing' ? 'bg-sky-500 border-sky-500/30 text-sky-400' :
                                                'bg-pink-500 border-pink-500/30 text-pink-400'
                                    }`}>
                                    {orderStatus}
                                </span>

                                <select
                                    value={orderStatus}
                                    onChange={(e) => handleChangeStatus(e.target.value)}
                                    disabled={loading}
                                    className="bg-[#0F172A] border border-white/10 text-white text-xs py-1.5 pl-2 pr-6 rounded-lg outline-none focus:border-cyan-500/50 cursor-pointer hover:bg-white/5 transition-colors appearance-none"
                                    style={{ backgroundImage: 'none' }}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="success">Success</option>
                                    <option value="cancel">Cancel</option>
                                </select>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-white/5 mb-4"></div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Giá trị đơn</span>
                                <span className="text-blue-400 font-bold font-mono text-base">{formatCurrency(order.amount)}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Lợi nhuận</span>
                                <span className="text-emerald-400 font-bold font-mono text-base">{formatCurrency(order.profit || 0)}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Game</span>
                                <span className="text-slate-300 font-medium truncate">{order.game_name || "N/A"}</span>
                            </div>
                            <div className="flex justify-end items-center">
                                <button
                                    onClick={() => setShowAccount(!showAccount)}
                                    className={`
                                        flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                                        ${showAccount
                                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                            : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-transparent"}
                                    `}
                                >
                                    <FiMonitor size={14} />
                                    {showAccount ? "Đóng info" : "Xem info"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expanded Account Info */}
            <div className={`
                overflow-hidden transition-all duration-300 ease-in-out bg-[#0F172A]/50 border-t border-white/5
                ${showAccount ? "max-h-96 opacity-100 p-5 pl-7" : "max-h-0 opacity-0"}
             `}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {order.user_nap_name && (
                        <div className="md:col-span-2 mb-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                            <span className="text-emerald-400 text-xs font-bold uppercase flex items-center gap-2">
                                <FiUser /> Người thực hiện nạp
                            </span>
                            <span className="text-white font-bold">{order.user_nap_name}</span>
                        </div>
                    )}

                    {order.account_info ? Object.entries(JSON.parse(order.account_info)).map(([key, value]) => (
                        <div key={key} className="flex flex-col group/item">
                            <span className="text-[10px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-1">
                                {key.replace(/_/g, ' ')}
                            </span>
                            <div className="relative">
                                <div className="p-2.5 rounded-lg bg-[#020617] border border-white/10 text-slate-200 font-mono text-sm select-all hover:border-cyan-500/30 transition-colors truncate">
                                    {String(value) || "Trống"}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-2 text-center text-slate-500 italic py-4">
                            Không có thông tin tài khoản đính kèm
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
