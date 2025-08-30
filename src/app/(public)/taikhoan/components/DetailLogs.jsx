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
        <div className="bg-white p-4 rounded-xl shadow space-y-6 border">
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FaGamepad className="text-indigo-500" /> Lịch sử nạp game
                </h2>
                <span className="text-sm text-gray-600">Tổng số đơn: {total}</span>
            </div>

            <div className="space-y-2">
                {orders.length === 0 ? (
                    <div className="text-center text-gray-400 italic py-4">
                        Không có đơn hàng nào.
                    </div>
                ) : (
                    orders.map((order) => {
                        const isExpanded = expandedOrderId === order.id;
                        return (
                            <div
                                key={order.id}
                                className="bg-gray-50 hover:bg-gray-100 p-3 rounded-lg border transition space-y-2"
                            >
                                {/* Header */}
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
                                    <div className="flex items-center gap-3 md:w-1/3">
                                        <img
                                            src={process.env.NEXT_PUBLIC_API_URL + order.thumbnail}
                                            alt={order.package_name}
                                            className="w-10 h-10 rounded object-cover border"
                                        />
                                        <div className="text-sm font-medium text-gray-800">
                                            {order.package_name}
                                        </div>
                                    </div>

                                    <div className="text-sm font-semibold text-green-600 text-center md:w-1/4">
                                        {order.amount.toLocaleString()}đ
                                    </div>

                                    <div className="md:w-1/4 text-center">
                                        <span
                                            className={`text-xs px-2 py-1 rounded font-semibold uppercase tracking-wide ${order.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : order.status === "success"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="flex gap-2 justify-end min-w-[150px]">
                                        <button
                                            onClick={() =>
                                                setExpandedOrderId(isExpanded ? null : order.id)
                                            }
                                            className="text-xs text-blue-600 hover:text-blue-800 border border-blue-300 px-2 py-1 rounded"
                                        >
                                            {isExpanded ? "Ẩn" : "Xem thông tin"}
                                        </button>
                                    </div>
                                </div>

                                {/* Chi tiết đơn hàng */}
                                {isExpanded && (
                                    <div className="border-t pt-3 space-y-2 text-sm text-gray-700">
                                        <div><strong>Tên game:</strong> {order.game_name}</div>
                                        <div><strong>Loại:</strong> {order.package_type}</div>
                                        <div>
                                            <strong>Ngày tạo:</strong>{" "}
                                            {new Date(order.create_at).toLocaleString("vi-VN")}
                                        </div>

                                        {/* UID + Server */}
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <div className="flex-1">
                                                <label className="text-gray-600">UID:</label>
                                                <div>{order.account_info.uid}</div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-gray-600">Server:</label>
                                                <div>{order.account_info.server?.trim()}</div>
                                            </div>
                                        </div>

                                        {/* Nếu là LOG mới hiển thị Username + Password */}
                                        {order.package_type === "LOG" && (
                                            <div className="flex flex-col md:flex-row gap-2">
                                                <div className="flex-1">
                                                    <label className="text-gray-600">Tài khoản:</label>
                                                    <div>{order.account_info.username}</div>
                                                </div>

                                                <div className="flex-1">
                                                    <label className="text-gray-600">Mật khẩu:</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showPassword[order.id] ? "text" : "password"}
                                                            value={order.account_info.password}
                                                            readOnly
                                                            className="w-full border px-2 py-1 rounded pr-8 bg-gray-100"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500"
                                                            onClick={() =>
                                                                setShowPassword((prev) => ({
                                                                    ...prev,
                                                                    [order.id]: !prev[order.id],
                                                                }))
                                                            }
                                                        >
                                                            {showPassword[order.id] ? (
                                                                <EyeOff size={18} />
                                                            ) : (
                                                                <Eye size={18} />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {totalPage > 1 && (
                <div className="pt-2">
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
