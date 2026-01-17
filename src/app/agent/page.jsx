"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    acceptOrder,
    cancelOrder1,
    completeOrder,
    getOrdersByUserNap,
    getOrderSummary,
} from "@/services/order.service";
import { useToast } from "@/components/ui/Toast";
import { getRole } from "@/services/auth.service";

const urlBase = process.env.NEXT_PUBLIC_API_URL;

const statuses = [
    { key: "pending", label: "Đang chờ" },
    { key: "processing", label: "Đang xử lý" },
    { key: "success", label: "Thành công" },
    { key: "cancel", label: "Đã hủy" },
];

export default function AgentManager() {
    const toast = useToast();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState("pending");
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState([]);
    const [pendingTotal, setPendingTotal] = useState(0);
    const [processingOrderId, setProcessingOrderId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [isAuthChecked, setIsAuthChecked] = useState(false); // ✅ trạng thái xác thực

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Vui lòng đăng nhập");
                window.location.replace('/')
                return;
            }

            try {
                const res = await getRole(token);

                if (res.role !== "agent" && res.role !== "admin") {

                    toast.error("Bạn không có quyền truy cập");
                    window.location.replace('/')
                    return;
                }
                setIsAuthChecked(true); // ✅ cho phép load nội dung
            } catch (err) {
                toast.error("Không xác thực được quyền");
                window.location.replace('/')
            }
        };

        checkAuth();
    }, [router]);

    // --- Fetch orders ---
    const fetchOrders = async (st) => {
        setLoading(true);
        try {
            const resOrders = await getOrdersByUserNap(st);
            setOrders(resOrders.orders || []);

            const resSummary = await getOrderSummary();
            setStats(resSummary.stats || []);
            setPendingTotal(resSummary.pending_total || 0);

            setCurrentPage(1);
        } catch (err) {
            toast.error("Lỗi khi tải đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthChecked) {   // ✅ chỉ fetch khi đã xác thực
            fetchOrders(status);
        }
    }, [status, isAuthChecked]);

    // --- Actions ---
    const handleReceiveOrder = async (orderId) => {
        setProcessingOrderId(orderId);
        try {
            await acceptOrder(orderId);
            toast.success("Nhận đơn thành công");
            setStatus("processing");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Lỗi khi nhận đơn");
        } finally {
            setProcessingOrderId(null);
        }
    };

    const handleCompleteOrder = async (orderId) => {
        setProcessingOrderId(orderId);
        try {
            await completeOrder(orderId);
            toast.success("Đơn hàng đã hoàn thành");
            fetchOrders(status);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Lỗi khi hoàn thành đơn");
        } finally {
            setProcessingOrderId(null);
        }
    };

    const handleCancelOrder = async (orderId) => {
        setProcessingOrderId(orderId);
        try {
            await cancelOrder1(orderId, "cancel");
            toast.success("Đơn hàng đã bị hủy");
            fetchOrders(status);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Lỗi khi hủy đơn");
        } finally {
            setProcessingOrderId(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.replace("/");
    };

    // --- Pagination ---
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(orders.length / itemsPerPage);

    if (!isAuthChecked) {
        return <p className="p-6">Đang kiểm tra quyền truy cập...</p>; // ✅ chặn load trước
    }

    return (
        <div className="p-6 relative">
            {/* Nút thoát */}
            <button
                onClick={handleLogout}
                className="absolute top-6 right-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Thoát khỏi trang quản trị
            </button>

            <h1 className="text-xl font-bold mb-4">Quản lý đơn nạp</h1>

            {/* Trạng thái và số lượng */}
            <div className="flex gap-2 mb-2">
                {statuses.map((s) => {
                    let statCount = stats.find((st) => st.status === s.key)?.total || 0;
                    if (s.key === "pending") statCount = pendingTotal;
                    return (
                        <button
                            key={s.key}
                            onClick={() => setStatus(s.key)}
                            className={`px-4 py-2 border text-sm font-medium ${status === s.key
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {s.label} ({statCount})
                        </button>
                    );
                })}
            </div>

            {/* Danh sách đơn */}
            {loading ? (
                <p>Đang tải...</p>
            ) : currentOrders.length === 0 ? (
                <p className="text-gray-500">Không có đơn nào</p>
            ) : (
                <div className="grid gap-4">
                    {currentOrders.map((order) => (
                        <div
                            key={order.id}
                            className="border p-4 bg-white shadow-sm hover:shadow-md transition"
                        >
                            <p><span className="font-semibold">Mã đơn:</span> {order.id}</p>
                            <p>
                                <span className="font-semibold">Trạng thái:</span>{" "}
                                <span
                                    className={`px-2 py-1 text-xs rounded ${order.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : order.status === "success"
                                            ? "bg-green-100 text-green-800"
                                            : order.status === "cancel"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {order.status}
                                </span>
                            </p>
                            <p><span className="font-semibold">Số tiền:</span> {order.amount} VNĐ</p>
                            <p className="text-gray-500 text-sm">
                                Cập nhật: {new Date(order.update_at).toLocaleString()}
                            </p>
                            <div className="mt-3 flex items-start gap-3">
                                {order.thumbnail && (
                                    <img
                                        src={urlBase + order.thumbnail}
                                        alt={order.package_name}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                )}
                                <div>
                                    <p><span className="font-semibold">Loại gói:</span> {order.package_type}</p>
                                    <p><span className="font-semibold">Tên gói:</span> {order.package_name}</p>
                                    <p><span className="font-semibold">Game:</span> {order.game_name}</p>
                                </div>
                            </div>

                            {/* Nút nhận đơn */}
                            {status === "pending" && (
                                <button
                                    onClick={() => handleReceiveOrder(order.id)}
                                    disabled={processingOrderId === order.id}
                                    className={`mt-3 px-4 py-2 rounded text-white ${processingOrderId === order.id ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                                >
                                    Nhận đơn
                                </button>
                            )}

                            {/* Thông tin tài khoản */}
                            {(status === "processing" || status === "success" || status === "cancel") && (
                                <div className="mt-4 border-t pt-3">
                                    <h3 className="font-semibold mb-2">Thông tin tài khoản</h3>
                                    <p><span className="font-medium">UID:</span> {order.account_info.uid || "—"}</p>
                                    <p><span className="font-medium">Server:</span> {order.account_info.server || "—"}</p>
                                    <p><span className="font-medium">ID Server:</span> {order.account_info.id_server || "—"}</p>
                                    <p><span className="font-medium">Tài khoản:</span> {order.account_info.username || "—"}</p>
                                    <p><span className="font-medium">Mật khẩu:</span> {order.account_info.password || "—"}</p>
                                    <p><span className="">Số Zalo Liên Hệ:</span> {order.account_info.zaloNumber || "—"}</p>
                                    <p><span className="">Ghi chú:</span> {order.account_info.note || "—"}</p>

                                    {/* Nút hành động chỉ xuất hiện khi đang xử lý */}
                                    {status === "processing" && (
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => handleCompleteOrder(order.id)}
                                                disabled={processingOrderId === order.id}
                                                className={`px-4 py-2 rounded text-white ${processingOrderId === order.id ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                                            >
                                                Hoàn thành
                                            </button>
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                disabled={processingOrderId === order.id}
                                                className={`px-4 py-2 rounded text-white ${processingOrderId === order.id ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded bg-gray-100 disabled:opacity-50"
                    >
                        &lt;
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 border rounded ${currentPage === i + 1
                                ? "bg-blue-600 text-white"
                                : "bg-white hover:bg-gray-100"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded bg-gray-100 disabled:opacity-50"
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
}
