"use client";
import { useEffect, useState } from "react";
import Pagination from "@/components/common/Pagination";
import { FaShoppingCart } from "react-icons/fa";
import { getMyOrder } from "@/services/accOrder";

export default function AccSellingLog() {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [lightboxImg, setLightboxImg] = useState(null);

    const itemsPerPage = 10; // số item mỗi trang

    const fetchOrders = async () => {
        try {
            const res = await getMyOrder();
            setOrders(res.data);
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
        <div className="bg-white p-4 rounded-xl shadow space-y-6 border relative">
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FaShoppingCart className="text-indigo-500" /> Lịch sử mua acc
                </h2>
                <span className="text-sm text-gray-600">Tổng số đơn: {orders.length}</span>
            </div>

            <div className="space-y-2">
                {currentOrders.length === 0 ? (
                    <div className="text-center text-gray-400 italic py-4">
                        Không có đơn mua acc nào.
                    </div>
                ) : (
                    currentOrders.map((order) => {
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
                                            src={process.env.NEXT_PUBLIC_API_URL + order.game_thumbnail}
                                            alt="acc"
                                            className="w-12 h-12 object-cover rounded cursor-pointer border"
                                            onClick={() => setLightboxImg(process.env.NEXT_PUBLIC_API_URL + order.game_thumbnail)}
                                        />
                                        <div className="text-sm font-medium text-gray-800">{order.user_name}</div>
                                    </div>

                                    <div className="text-sm font-semibold text-green-600 text-center md:w-1/4">
                                        {order.price.toLocaleString()}đ
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
                                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                            className="text-xs text-blue-600 hover:text-blue-800 border border-blue-300 px-2 py-1 rounded"
                                        >
                                            {isExpanded ? "Ẩn" : "Xem thông tin"}
                                        </button>
                                    </div>
                                </div>

                                {/* Chi tiết order */}
                                {isExpanded && (
                                    <div className="border-t pt-3 space-y-2 text-sm text-gray-700">
                                        <div>
                                            <strong>ID Acc:</strong> {order.acc_id}
                                        </div>
                                        <div>
                                            <strong>Email user:</strong> {order.user_email}
                                        </div>
                                        <div>
                                            <strong>Số điện thoại:</strong> {order.contact_info.phone}
                                        </div>
                                        <div>
                                            <strong>Zalo:</strong> {order.contact_info.zalo}
                                        </div>
                                        <div>
                                            <strong>Ghi chú:</strong> {order.contact_info.note || "-"}
                                        </div>
                                        <div>
                                            <strong>Ngày tạo:</strong>{" "}
                                            {new Date(order.create_at).toLocaleString("vi-VN")}
                                        </div>
                                        <div>
                                            <strong>Ngày cập nhật:</strong>{" "}
                                            {new Date(order.update_at).toLocaleString("vi-VN")}
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <img
                                                src={process.env.NEXT_PUBLIC_API_URL + "/uploads/" + order.acc_image}
                                                alt="game"
                                                className="w-16 h-16 object-cover rounded cursor-pointer border"
                                                onClick={() => setLightboxImg(process.env.NEXT_PUBLIC_API_URL + "/uploads/" + order.acc_image)}
                                            />
                                            <div className="text-sm font-medium">Bấm vào xem chi tiết ảnh</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {totalPage > 1 && (
                <div className="pt-2">
                    <Pagination currentPage={page} totalPage={totalPage} onPageChange={setPage} />
                </div>
            )}

            {/* Lightbox */}
            {lightboxImg && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-pointer"
                    onClick={() => setLightboxImg(null)}
                >
                    <img src={lightboxImg} alt="full" className="max-h-[90%] max-w-[90%]" />
                </div>
            )}
        </div>
    );
}
