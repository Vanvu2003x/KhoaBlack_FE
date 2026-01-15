"use client"
import { useEffect, useState } from "react";
import Stat from "@/components/admin/stat";
import api from "@/utils/axios";
import { cancelOrder, getAllOrder, sendAcc } from "@/services/accOrder";
import { FiSearch, FiShoppingCart, FiFilter, FiSend, FiX, FiCheckCircle } from "react-icons/fi";

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
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1E293B]/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-xl">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
                        <FiShoppingCart className="text-teal-400" /> Giao dịch Acc
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Quản lý các giao dịch mua bán tài khoản game
                    </p>
                </div>

                {/* Search */}
                <div className="relative group">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                    <input
                        type="text"
                        value={timkiem}
                        onChange={(e) => {
                            setTimkiem(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Tìm mã đơn hàng..."
                        className="bg-[#0F172A] border border-white/10 text-slate-200 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 w-full md:w-80 transition-all"
                    />
                </div>
            </div>

            {/* Thống kê với click filter */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Stat
                    info={totalOrder}
                    title="Tổng giao dịch"
                    onClick={() => setFilterStatus("")}
                    className={filterStatus === '' ? 'border-teal-500/50 bg-teal-500/10' : ''}
                />
                <Stat
                    info={totalOrderPending}
                    title="Đang chờ"
                    onClick={() => setFilterStatus("pending")}
                    className={`text-yellow-400 ${filterStatus === 'pending' ? 'border-yellow-500/50 bg-yellow-500/10' : ''}`}
                />
                <Stat
                    info={totalOrderDone}
                    title="Thành công"
                    onClick={() => setFilterStatus("success")}
                    className={`text-emerald-400 ${filterStatus === 'success' ? 'border-emerald-500/50 bg-emerald-500/10' : ''}`}
                />
                <Stat
                    info={totalOrderCancel}
                    title="Đã hủy"
                    onClick={() => setFilterStatus("cancel")}
                    className={`text-rose-400 ${filterStatus === 'cancel' ? 'border-rose-500/50 bg-rose-500/10' : ''}`}
                />
            </div>

            {/* Filter Status Label */}
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium pl-2">
                <FiFilter className="text-teal-400" />
                Đang xem: <span className="text-white font-bold uppercase">{filterStatus === '' ? 'Tất cả' : filterStatus}</span>
            </div>

            {/* Bảng đơn */}
            <div className="bg-[#1E293B]/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#0F172A] text-slate-300 uppercase font-medium text-xs">
                            <tr>
                                <th className="p-4 w-16">Game</th>
                                <th className="p-4">Mã đơn</th>
                                <th className="p-4">Khách hàng</th>
                                <th className="p-4">Acc ID</th>
                                <th className="p-4">Giá</th>
                                <th className="p-4">Trạng thái</th>
                                <th className="p-4">Liên hệ</th>
                                <th className="p-4">Ảnh Acc</th>
                                <th className="p-4">Thời gian</th>
                                <th className="p-4 min-w-[120px]">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300">
                            {currentOrders.map(order => (
                                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        {order.game_thumbnail && (
                                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                                                <img
                                                    src={`${apiBaseUrl}${order.game_thumbnail}`}
                                                    alt="game-thumb"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 font-mono font-bold text-white">#{order.id}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-white">{order.user_name}</div>
                                        <div className="text-xs text-slate-500">{order.user_email}</div>
                                    </td>
                                    <td className="p-4 font-mono">{order.acc_id}</td>
                                    <td className="p-4 font-bold text-teal-400">{Number(order.price).toLocaleString()}đ</td>
                                    <td className="p-4">
                                        {order.status === "pending" && <span className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-xs font-bold border border-yellow-500/20">Đang chờ</span>}
                                        {order.status === "success" && <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-xs font-bold border border-emerald-500/20">Thành công</span>}
                                        {order.status === "cancel" && <span className="bg-rose-500/10 text-rose-500 px-2 py-1 rounded text-xs font-bold border border-rose-500/20">Đã hủy</span>}
                                    </td>
                                    <td className="p-4 text-xs space-y-1">
                                        <div className="flex gap-1"><span className="text-slate-500">Email:</span> {order.contact_info?.email}</div>
                                        <div className="flex gap-1"><span className="text-slate-500">Phone:</span> {order.contact_info?.phone}</div>
                                        <div className="flex gap-1"><span className="text-slate-500">Zalo:</span> {order.contact_info?.zalo}</div>
                                    </td>
                                    <td className="p-4">
                                        {order.acc_image && (
                                            <div className="w-12 h-12 rounded overflow-hidden border border-white/10 cursor-pointer hover:border-teal-500 transition-colors" onClick={() => setPreviewImage(`${apiBaseUrl}/uploads/${order.acc_image}`)}>
                                                <img
                                                    src={`${apiBaseUrl}/uploads/${order.acc_image}`}
                                                    alt="acc-img"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-xs text-slate-500">{new Date(order.create_at).toLocaleString("vi-VN")}</td>
                                    <td className="p-4 space-y-2">
                                        {order.status === "pending" && (
                                            <>
                                                <button
                                                    onClick={() => { setSelectedOrder(order); setShowForm(true) }}
                                                    className="w-full px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 text-xs font-bold transition-all"
                                                >
                                                    Gửi Acc
                                                </button>
                                                <button
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    className="w-full px-3 py-1.5 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-lg hover:bg-rose-600/30 text-xs font-bold transition-all"
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
                </div>

                {/* Pagination */}
                {filteredOrders.length === 0 && (
                    <div className="p-10 text-center text-slate-500">Không có dữ liệu</div>
                )}
                <div className="flex justify-center items-center p-4 border-t border-white/5 gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:hover:bg-transparent text-slate-300 text-sm transition-colors"
                    >
                        Prev
                    </button>
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentPage(idx + 1)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${currentPage === idx + 1 ? "bg-teal-500/20 text-teal-400 border-teal-500/50" : "border-transparent text-slate-400 hover:bg-white/5"}`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:hover:bg-transparent text-slate-300 text-sm transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modal preview ảnh */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]"
                    onClick={() => setPreviewImage(null)}
                >
                    <img
                        src={previewImage}
                        alt="preview"
                        className="max-h-[90vh] max-w-full rounded-lg shadow-2xl animate-[scaleIn_0.2s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        className="absolute top-4 right-4 text-white/50 hover:text-white"
                        onClick={() => setPreviewImage(null)}
                    >
                        ✕ Close
                    </button>
                </div>
            )}

            {/* Modal gửi acc */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
                    <div className="relative bg-[#1E293B] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6 animate-[scaleIn_0.2s_ease-out]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FiSend className="text-blue-400" /> Gửi thông tin Acc
                            </h2>
                            <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white"><FiX size={24} /></button>
                        </div>

                        <div className="bg-[#0F172A] p-3 rounded-xl border border-white/5 mb-4 text-sm">
                            <div className="flex justify-between text-slate-400 mb-1"><span>Đơn hàng:</span> <span className="text-white font-bold">#{selectedOrder?.id}</span></div>
                            <div className="flex justify-between text-slate-400"><span>Acc ID:</span> <span className="text-white font-bold">{selectedOrder?.acc_id}</span></div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Tài khoản / Username</label>
                                <input
                                    type="text"
                                    placeholder="Nhập tên tài khoản..."
                                    value={accInfo.username}
                                    onChange={(e) => setAccInfo({ ...accInfo, username: e.target.value })}
                                    className="w-full bg-[#0F172A] border border-white/10 px-4 py-2.5 rounded-xl text-white focus:border-blue-500/50 outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Mật khẩu / Password</label>
                                <input
                                    type="text"
                                    placeholder="Nhập mật khẩu..."
                                    value={accInfo.password}
                                    onChange={(e) => setAccInfo({ ...accInfo, password: e.target.value })}
                                    className="w-full bg-[#0F172A] border border-white/10 px-4 py-2.5 rounded-xl text-white focus:border-blue-500/50 outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Ghi chú (Tùy chọn)</label>
                                <textarea
                                    placeholder="Ghi chú thêm cho khách hàng..."
                                    value={accInfo.note}
                                    onChange={(e) => setAccInfo({ ...accInfo, note: e.target.value })}
                                    className="w-full bg-[#0F172A] border border-white/10 px-4 py-2.5 rounded-xl text-white focus:border-blue-500/50 outline-none transition-colors min-h-[80px]"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowForm(false)}
                                disabled={sending}
                                className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSendAcc}
                                disabled={sending}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all"
                            >
                                {sending ? "Đang gửi..." : "Gửi ngay"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
