"use client"
import { useEffect, useState } from "react";
import Stat from "@/components/admin/stat";
import api from "@/utils/axios";
import { cancelOrder, getAllOrder, sendAcc } from "@/services/accOrder";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function AccSellingPage() {
    const [listOrder, setListOrder] = useState([]);
    const [totalOrder, setTotalOrder] = useState(0);
    const [totalOrderPending, setTotalOrderPending] = useState(0);
    const [totalOrderDone, setTotalOrderDone] = useState(0);
    const [totalOrderCancel, setTotalOrderCancel] = useState(0);
    const [timkiem, setTimkiem] = useState("");
    const [filterStatus, setFilterStatus] = useState(""); // thêm state filter
    const [previewImage, setPreviewImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [accInfo, setAccInfo] = useState({ username: "", password: "", note: "" });
    const [sending, setSending] = useState(false);
    const ordersPerPage = 10;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await getAllOrder();
            if (res.success) {
                const orders = Array.isArray(res.data) ? res.data : [res.data];
                setListOrder(orders);
                setTotalOrder(orders.length);
                setTotalOrderPending(orders.filter(o => o.status === "pending").length);
                setTotalOrderDone(orders.filter(o => o.status === "success").length);
                setTotalOrderCancel(orders.filter(o => o.status === "cancel").length);
            }
        } catch (err) {
            console.error("Fetch orders error:", err);
        }
    };

    // Lọc theo tìm kiếm + trạng thái
    const filteredOrders = listOrder.filter(o =>
        (timkiem === "" || o.id.toString().includes(timkiem)) &&
        (filterStatus === "" || o.status === filterStatus)
    );

    // Pagination
    const indexOfLast = currentPage * ordersPerPage;
    const indexOfFirst = indexOfLast - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const handleSendAcc = async () => {
        setSending(true);
        try {
            await sendAcc(selectedOrder.id, {
                ttacc: {
                    account: accInfo.username,
                    password: accInfo.password,
                    note: accInfo.note
                }
            });
            alert("Đã gửi acc thành công ✅");
            setShowForm(false);
            setAccInfo({ username: "", password: "", note: "" });
            fetchOrders();
        } catch (err) {
            console.error("Send acc error:", err);
            alert("Gửi acc thất bại ❌");
        } finally {
            setSending(false);
        }
    };

    // Hủy đơn
    const handleCancelOrder = async (orderId) => {
        if (!confirm("Bạn có chắc muốn hủy đơn này?")) return;
        try {
            await cancelOrder(orderId);
            alert("Đã hủy đơn ✅");
            fetchOrders();
        } catch (err) {
            console.error("Hủy đơn lỗi:", err);
            alert("Hủy đơn thất bại ❌");
        }
    };

    return (
        <div className="p-10">
            {/* Thống kê với click filter */}
            <div className="md:flex w-full gap-5 flex-wrap">
                <Stat info={totalOrder} title={"Tổng số giao dịch"} onClick={() => setFilterStatus("")} />
                <Stat info={totalOrderPending} title={"Đang chờ"} onClick={() => setFilterStatus("pending")} />
                <Stat info={totalOrderDone} title={"Thành công"} onClick={() => setFilterStatus("success")} />
                <Stat info={totalOrderCancel} title={"Đã hủy"} onClick={() => setFilterStatus("cancel")} />
            </div>

            {/* Tìm kiếm */}
            <div className="mt-6">
                <input
                    type="text"
                    value={timkiem}
                    onChange={(e) => {
                        setTimkiem(e.target.value);
                        setCurrentPage(1);
                    }}
                    placeholder="Tìm kiếm theo mã đơn hàng"
                    className="w-full md:w-1/3 p-2 border text-black outline-0"
                />
            </div>

            {/* Bảng đơn */}
            <table className="w-full text-left text-sm border border-gray-700 min-w-[900px] mt-3">
                <thead className="bg-gray-800 text-gray-200">
                    <tr>
                        <th className="p-2 w-16"></th>
                        <th className="p-2">Mã đơn</th>
                        <th className="p-2">Khách hàng</th>
                        <th className="p-2">Acc ID</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Liên hệ</th>
                        <th className="p-2">Ảnh Acc</th>
                        <th className="p-2">Thời gian</th>
                        <th className="p-2 min-w-[110px]">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map(order => (
                        <tr key={order.id} className="border-t border-gray-700 mt-6">
                            <td className="p-2">
                                {order.game_thumbnail && (
                                    <img
                                        src={`${apiBaseUrl}${order.game_thumbnail}`}
                                        alt="game-thumb"
                                        className="w-12 h-12 object-cover border cursor-pointer"
                                    />
                                )}
                            </td>
                            <td className="p-2">{order.id}</td>
                            <td className="p-2">{order.user_name} ({order.user_email})</td>
                            <td className="p-2">{order.acc_id}</td>
                            <td className="p-2">{order.price}đ</td>
                            <td className="p-2 cursor-pointer">
                                {order.status === "pending" && <span className="text-yellow-400">Đang chờ</span>}
                                {order.status === "success" && <span className="text-green-400">Thành công</span>}
                                {order.status === "canceled" && <span className="text-red-400">Đã hủy</span>}
                            </td>
                            <td className="p-2">
                                <div>Email:{order.contact_info?.email}</div>
                                <div>Phone:{order.contact_info?.phone}</div>
                                <div>Zalo:{order.contact_info?.zalo}</div>
                            </td>
                            <td className="p-2">
                                {order.acc_image && (
                                    <img
                                        src={`${apiBaseUrl}/uploads/${order.acc_image}`}
                                        alt="acc-img"
                                        className="w-16 h-16 object-cover border cursor-pointer"
                                        onClick={() => setPreviewImage(`${apiBaseUrl}/uploads/${order.acc_image}`)}
                                    />
                                )}
                            </td>
                            <td className="p-2">{new Date(order.create_at).toLocaleString("vi-VN")}</td>
                            <td className="p-1 text-sm min-w-[110px] flex flex-col gap-2">
                                {order.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() => { setSelectedOrder(order); setShowForm(true) }}
                                            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Gửi Acc
                                        </button>
                                        <button
                                            onClick={() => handleCancelOrder(order.id)}
                                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Hủy Đơn
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-4 gap-2">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-3 py-1 border disabled:opacity-50"
                >
                    Prev
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`px-3 py-1 border ${currentPage === idx + 1 ? "bg-gray-700 text-white" : ""}`}
                    >
                        {idx + 1}
                    </button>
                ))}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-3 py-1 border disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Modal preview ảnh */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={() => setPreviewImage(null)}
                >
                    <img
                        src={previewImage}
                        alt="preview"
                        className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
                    />
                </div>
            )}

            {/* Modal gửi acc */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Gửi acc cho đơn #{selectedOrder?.id}</h2>
                        <input
                            type="text"
                            placeholder="Username"
                            value={accInfo.username}
                            onChange={(e) => setAccInfo({ ...accInfo, username: e.target.value })}
                            className="w-full p-2 border mb-3"
                        />
                        <input
                            type="text"
                            placeholder="Password"
                            value={accInfo.password}
                            onChange={(e) => setAccInfo({ ...accInfo, password: e.target.value })}
                            className="w-full p-2 border mb-3"
                        />
                        <textarea
                            placeholder="Ghi chú (tùy chọn)"
                            value={accInfo.note}
                            onChange={(e) => setAccInfo({ ...accInfo, note: e.target.value })}
                            className="w-full p-2 border mb-3 min-h-[80px]"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowForm(false)}
                                disabled={sending}
                                className={`px-3 py-1 border rounded ${sending ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSendAcc}
                                disabled={sending}
                                className={`px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 ${sending ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {sending ? "Đang gửi..." : "Gửi"}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
