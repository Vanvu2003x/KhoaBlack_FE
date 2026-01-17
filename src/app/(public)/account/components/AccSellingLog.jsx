"use client";
import { useEffect, useState } from "react";
import Pagination from "@/components/common/Pagination";
import { FaShoppingCart, FaEye, FaEyeSlash, FaImage } from "react-icons/fa";
import { getMyOrder } from "@/services/accOrder";

export default function AccSellingLog() {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [lightboxImg, setLightboxImg] = useState(null);

    const itemsPerPage = 10;

    const fetchOrders = async () => {
        try {
            const res = await getMyOrder();
            setOrders(res || []); // Ensure array
        } catch (err) {
            console.error("Lỗi khi lấy đơn mua acc:", err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const totalPage = Math.ceil(orders.length / itemsPerPage);
    const currentOrders = orders.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="bg-[#1E293B]/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/5 space-y-6 relative">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                    <FaShoppingCart className="text-purple-400" /> Lịch sử mua acc
                </h2>
                <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">Tổng: {orders.length} đơn</span>
            </div>

            <div className="space-y-3">
                {currentOrders.length === 0 ? (
                    <div className="text-center text-slate-500 italic py-12 bg-slate-900/20 rounded-xl border border-dashed border-slate-700">
                        Chưa có lịch sử mua acc nào.
                    </div>
                ) : (
                    currentOrders.map((order) => {
                        const isExpanded = expandedOrderId === order.id;
                        return (
                            <div
                                key={order.id}
                                className={`
                                    rounded-xl border transition-all duration-300 overflow-hidden
                                    ${isExpanded
                                        ? "bg-slate-800/80 border-purple-500/30 shadow-lg shadow-purple-500/10"
                                        : "bg-[#0F172A]/40 border-white/5 hover:border-white/10 hover:bg-[#0F172A]/60"}
                                `}
                            >
                                {/* Header Row */}
                                <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    {/* Game Info */}
                                    <div className="flex items-center gap-4 md:w-1/3">
                                        <div className="relative group cursor-pointer" onClick={() => setLightboxImg(process.env.NEXT_PUBLIC_API_URL + order.game_thumbnail)}>
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all rounded-lg"></div>
                                            <img
                                                src={process.env.NEXT_PUBLIC_API_URL + order.game_thumbnail}
                                                alt="Game"
                                                className="w-14 h-14 object-cover rounded-lg border border-white/10 shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-200">{order.user_name}</div>
                                            <div className="text-xs text-slate-500 font-mono mt-1">Order #{order.id}</div>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="md:w-1/4 text-center md:text-left">
                                        <div className="text-emerald-400 font-bold font-mono text-lg">
                                            {order.price.toLocaleString()}đ
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="md:w-1/4 text-center">
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

                                    {/* Action */}
                                    <div className="flex justify-end min-w-[140px]">
                                        <button
                                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                            className={`
                                                flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border
                                                ${isExpanded
                                                    ? "bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/25"
                                                    : "bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white"}
                                            `}
                                        >
                                            {isExpanded ? <><FaEyeSlash /> Ẩn thông tin</> : <><FaEye /> Xem chi tiết</>}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="bg-slate-900/50 border-t border-white/5 p-5 animate-[fadeIn_0.3s_ease-out]">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                    <span className="text-slate-400">ID Account:</span>
                                                    <span className="font-mono text-slate-200">{order.acc_id}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                    <span className="text-slate-400">Người mua:</span>
                                                    <span className="text-slate-200">{order.user_email}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                    <span className="text-slate-400">Ngày mua:</span>
                                                    <span className="text-slate-200">
                                                        {order.created_at ? new Date(order.created_at).toLocaleString("vi-VN") : ".."}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                    <span className="text-slate-400">Cập nhật:</span>
                                                    <span className="text-slate-200">
                                                        {order.updated_at ? (
                                                            new Date(order.updated_at).toLocaleString("vi-VN")
                                                        ) : (
                                                            <span className="text-slate-600 italic text-xs">Chưa cập nhật</span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-3 bg-slate-800/30 p-4 rounded-xl border border-white/5">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Thông tin liên hệ</h4>
                                                <div className="grid grid-cols-2 gap-2 text-slate-300">
                                                    <span className="text-slate-500">SĐT:</span> <span>{order.contact_info.phone}</span>
                                                    <span className="text-slate-500">Zalo:</span> <span>{order.contact_info.zalo}</span>
                                                    <span className="text-slate-500">Note:</span> <span className="italic">{order.contact_info.note || "Không có"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5">
                                            <button
                                                onClick={() => setLightboxImg(process.env.NEXT_PUBLIC_API_URL + "/uploads/" + order.acc_image)}
                                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-black/20 px-4 py-3 rounded-xl w-full border border-white/5 hover:border-white/20"
                                            >
                                                <img
                                                    src={process.env.NEXT_PUBLIC_API_URL + "/uploads/" + order.acc_image}
                                                    className="w-8 h-8 rounded object-cover"
                                                    alt="Detail"
                                                />
                                                <span className="text-xs font-bold flex-1 text-left ml-2">HIỂNH THỊ ẢNH CHI TIẾT ACCOUNT</span>
                                                <FaImage className="text-lg" />
                                            </button>
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
                    <Pagination currentPage={page} totalPage={totalPage} onPageChange={setPage} />
                </div>
            )}

            {lightboxImg && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] cursor-zoom-out p-5 animate-[fadeIn_0.2s_ease-out]"
                    onClick={() => setLightboxImg(null)}
                >
                    <img src={lightboxImg} alt="full" className="max-h-full max-w-full rounded-lg shadow-2xl" />
                </div>
            )}
        </div>
    );
}
