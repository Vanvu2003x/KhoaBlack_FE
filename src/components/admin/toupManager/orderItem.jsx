"use client";

import { changeStatus } from "@/services/order.service";
import { useState } from "react";
import { GoDotFill } from "react-icons/go";
import { toast } from "react-toastify";

const urlBaseAPI = process.env.NEXT_PUBLIC_API_URL;

export default function OrderItem({ order, onStatusChange }) {
    const [showAccount, setShowAccount] = useState(false);
    const [orderStatus, setOrderStatus] = useState(order.status);
    const [loading, setLoading] = useState(false);

    const getDotColor = (status) => {
        switch (status) {
            case "pending":
                return "text-yellow-500";
            case "processing":
                return "text-sky-600";
            case "success":
                return "text-emerald-600";
            case "cancel":
                return "text-pink-600";
            default:
                return "text-gray-400";
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
        <div className="p-5 bg-white shadow-sm border hover:shadow-md transition space-y-4">
            <div className="flex gap-6 items-center">
                {order.thumbnail && (
                    <div className="w-24 h-24 overflow-hidden border flex-shrink-0">
                        <img
                            src={urlBaseAPI + order.thumbnail}
                            alt="Gói nạp"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="flex-1 flex flex-col gap-2 text-sm text-gray-800">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                        <div className="flex flex-col gap-1">
                            <span>
                                <strong>Mã đơn:</strong> {order.id}
                            </span>
                            <span>
                                <strong>Người order:</strong>{" "}
                                {(order.user_name) +
                                    " (" +
                                    (order.user_email) +
                                    ")"}
                            </span>
                            <span>
                                <strong>Người nạp:</strong>{" "}
                                {order.user_nap_name && order.user_nap_email
                                    ? `${order.user_nap_name} (${order.user_nap_email})`
                                    : "Chưa có CTV hoặc ai nhận đơn"}
                            </span>

                        </div>

                        {/* Chọn trạng thái */}
                        <div className="flex items-center gap-2">
                            <GoDotFill className={`${getDotColor(orderStatus)} text-lg`} />
                            <select
                                value={orderStatus}
                                onChange={(e) => handleChangeStatus(e.target.value)}
                                disabled={loading}
                                className={`border rounded px-2 py-1 text-sm capitalize font-semibold ${getDotColor(orderStatus)}`}
                            >
                                <option value="pending" style={{ color: "#eab308" }}>pending</option>
                                <option value="processing" style={{ color: "#0284c7" }}>processing</option>
                                <option value="success" style={{ color: "#059669" }}>success</option>
                                <option value="cancel" style={{ color: "#e11d48" }}>cancel</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-6 flex-wrap text-sm text-gray-700">
                        <div>
                            <span className="font-medium">Số tiền:</span>{" "}
                            <span className="text-blue-600 font-semibold">{formatCurrency(order.amount)}</span>
                        </div>
                        <div>
                            <span className="font-medium">Lợi nhuận:</span>{" "}
                            <span className="text-green-600 font-semibold">
                                {formatCurrency(order.profit || 0)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b pb-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="flex flex-col sm:items-start items-center text-center sm:text-left">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gói nạp</span>
                        <span className="text-base sm:text-lg font-semibold text-gray-800 mt-1">
                            {order.package_name || "Không rõ"}
                        </span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Kiểu nạp</span>
                        <span className="text-base font-semibold text-gray-800 mt-1">
                            {order.package_type || "Không rõ"}
                        </span>
                    </div>
                    <div className="flex flex-col sm:items-end items-center text-center sm:text-right">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Game</span>
                        <span className="text-base sm:text-lg font-semibold text-gray-800 mt-1">
                            {order.game_name || "Không rõ"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="text-sm text-gray-500">
                Cập nhật: {order.update_at ? new Date(order.update_at).toLocaleString("vi-VN") : "Không rõ"}
            </div>

            <div>
                <button
                    onClick={() => setShowAccount(!showAccount)}
                    className="text-sm text-blue-600 underline hover:text-blue-800 transition"
                >
                    {showAccount ? "Ẩn tài khoản" : "Xem tài khoản"}
                </button>
                {showAccount && order.account_info && (
                    <div className="mt-2 text-sm bg-gray-50 border border-gray-300 p-3 text-gray-700 space-y-1">
                        {Object.entries(order.account_info).map(([key, value]) => (
                            <div key={key}>
                                <span className="font-medium">{key}:</span> {value || "Không có"}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
