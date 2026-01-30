"use client";
import { useEffect, useState } from "react";
import { getOrderByUserID } from "@/services/order.service";
import Pagination from "@/components/common/Pagination";
import { FaGamepad } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";

export default function DetailLog() {
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [showPassword, setShowPassword] = useState({});

    const fetchOrders = async (page) => {
        try {
            const res = await getOrderByUserID(page);
            setOrders(res.orders || []);
            setTotal(res.total || 0);
            setTotalPage(Math.ceil((res.total || 0) / 10));
        } catch (err) {
            console.error("Lỗi khi lấy đơn hàng:", err);
        }
    };

    useEffect(() => {
        fetchOrders(page);
    }, [page]);

    return (
        <div className="bg-[#1E293B]/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/5 space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent flex items-center gap-2">
                    <FaGamepad className="text-orange-400" /> Lịch sử nạp game
                </h2>
                <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">Tổng: {total} đơn</span>
            </div>

            <div className="space-y-3">
                {orders.length === 0 ? (
                    <div className="text-center text-slate-500 italic py-12 bg-slate-900/20 rounded-xl border border-dashed border-slate-700">
                        Chưa có đơn hàng nào.
                    </div>
                ) : (
                    orders.map((order) => {
                        const isExpanded = expandedOrderId === order.id;

                        // Parse account_info if it's a string
                        let accountInfo = order.account_info;
                        if (typeof accountInfo === 'string') {
                            try {
                                accountInfo = JSON.parse(accountInfo);
                            } catch (e) {
                                accountInfo = {};
                            }
                        }
                        accountInfo = accountInfo || {};

                        return (
                            <div
                                key={order.id}
                                className={`
                                    rounded-xl border transition-all duration-300 overflow-hidden
                                    ${isExpanded
                                        ? "bg-slate-800/80 border-orange-500/30 shadow-lg shadow-orange-500/10"
                                        : "bg-[#0F172A]/40 border-white/5 hover:border-white/10 hover:bg-[#0F172A]/60"}
                                `}
                            >
                                {/* Header */}
                                <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex items-center gap-4 md:w-1/3">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-red-500/20 rounded-lg"></div>
                                            <img
                                                src={process.env.NEXT_PUBLIC_API_URL + order.thumbnail}
                                                alt={order.package_name}
                                                className="w-12 h-12 rounded-lg object-cover border border-white/5"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-200">{order.package_name}</div>
                                            <div className="text-xs text-slate-500 mt-1">{order.game_name}</div>
                                        </div>
                                    </div>

                                    <div className="text-center md:text-left md:w-1/4">
                                        <div className="text-emerald-400 font-bold font-mono text-lg">
                                            {(order.amount || 0).toLocaleString()}đ
                                        </div>
                                    </div>

                                    <div className="text-center md:w-1/4">
                                        <span
                                            className={`text-xs px-3 py-1.5 rounded-lg font-bold uppercase tracking-wide border ${order.status === "pending"
                                                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                                : order.status === "success"
                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                    : "bg-red-500/10 text-red-500 border-red-500/20"
                                                }`}
                                        >
                                            {order.status === "success" ? "Thành Công" : order.status}
                                        </span>
                                    </div>

                                    <div className="flex justify-end min-w-[140px]">
                                        <button
                                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                            className={`
                                                text-xs px-4 py-2 rounded-lg font-bold transition-all border
                                                 ${isExpanded
                                                    ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/25"
                                                    : "bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white"}
                                            `}
                                        >
                                            {isExpanded ? "Ẩn thông tin" : "Xem chi tiết"}
                                        </button>
                                    </div>
                                </div>

                                {/* Chi tiết đơn hàng */}
                                {isExpanded && (
                                    <div className="bg-slate-900/50 border-t border-white/5 p-5 animate-[fadeIn_0.3s_ease-out]">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                    <span className="text-slate-400">Loại gói:</span>
                                                    <span className="font-bold text-slate-200">{order.package_type}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                    <span className="text-slate-400">Ngày tạo:</span>
                                                    <span className="text-slate-200">{new Date(order.create_at).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                    <span className="text-slate-400">Cập nhật:</span>
                                                    <span className="text-slate-200">
                                                        {order.update_at ? (
                                                            new Date(order.update_at).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
                                                        ) : (
                                                            <span className="text-slate-600 italic text-xs">Chưa cập nhật</span>
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                    <span className="text-slate-400">UID in-game:</span>
                                                    <span className="font-mono text-slate-200 bg-slate-800 px-2 py-0.5 rounded">{accountInfo.uid || accountInfo.username || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                    <span className="text-slate-400">Server:</span>
                                                    <span className="text-slate-200">{accountInfo.server?.trim() || accountInfo.id_server || "N/A"}</span>
                                                </div>
                                            </div>

                                            {/* Nếu là LOG mới hiển thị Username + Password */}
                                            {order.package_type === "LOG" && (
                                                <div className="space-y-3 bg-slate-800/30 p-4 rounded-xl border border-white/5">
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Thông tin đăng nhập</h4>
                                                    <div>
                                                        <label className="text-slate-500 text-xs block mb-1">Tài khoản</label>
                                                        <div className="flex justify-between items-center bg-slate-900 rounded-lg px-3 py-2 border border-white/5">
                                                            <span className="text-slate-200">{accountInfo.username}</span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="text-slate-500 text-xs block mb-1">Mật khẩu</label>
                                                        <div className="relative">
                                                            <input
                                                                type={showPassword[order.id] ? "text" : "password"}
                                                                value={accountInfo.password || ''}
                                                                readOnly
                                                                className="w-full bg-slate-900 text-slate-200 px-3 py-2 rounded-lg border border-white/5 focus:outline-none font-mono"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="absolute top-1/2 right-2 -translate-y-1/2 text-slate-400 hover:text-white"
                                                                onClick={() =>
                                                                    setShowPassword((prev) => ({
                                                                        ...prev,
                                                                        [order.id]: !prev[order.id],
                                                                    }))
                                                                }
                                                            >
                                                                {showPassword[order.id] ? (
                                                                    <EyeOff size={16} />
                                                                ) : (
                                                                    <Eye size={16} />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {totalPage > 1 && (
                <div className="pt-4 flex justify-center">
                    <Pagination
                        currentPage={page}
                        totalPage={totalPage}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </div>
    );
}
