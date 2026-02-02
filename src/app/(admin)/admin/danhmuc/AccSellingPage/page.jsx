"use client"
import { useEffect, useState } from "react";
import api from "@/utils/axios";
import { cancelOrder, getAllOrder, sendAcc } from "@/services/accOrder";
import { useToast } from "@/components/ui/Toast";
import { FiSearch, FiShoppingCart, FiFilter, FiSend, FiX, FiCheckCircle, FiClock, FiGrid, FiUser, FiPhone, FiMail, FiMessageSquare, FiImage } from "react-icons/fi";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

const StatCard = ({ title, value, color, bg, borderColor, active, onClick }) => (
    <button
        onClick={onClick}
        className={`
            relative overflow-hidden rounded-2xl p-4 border transition-all duration-300 group text-left w-full h-full
            ${active
                ? `bg-gradient-to-br ${bg} ${borderColor} shadow-lg shadow-${color.split('-')[1]}-500/10 scale-105`
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'}
        `}
    >
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</h3>
            {active && <div className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')} animate-pulse`}></div>}
        </div>
        <p className={`text-3xl font-black ${active ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
            {value}
        </p>
    </button>
);

const AccOrderCard = ({ order, onSendAcc, onCancel, onViewImage }) => {
    return (
        <div className="group relative bg-[#1E293B]/40 backdrop-blur-md rounded-2xl border border-white/5 hover:border-teal-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10 overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${order.status === 'success' ? 'bg-emerald-500' :
                order.status === 'pending' ? 'bg-yellow-500' : 'bg-rose-500'
                }`}></div>

            <div className="p-5 pl-7">
                <div className="flex flex-col md:flex-row gap-5 items-start">
                    {/* Game & Image */}
                    <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden border border-white/10 bg-slate-900 relative group/img shadow-lg">
                        {order.game_thumbnail ? (
                            <img
                                src={order.game_thumbnail?.startsWith('http') ? order.game_thumbnail : `${apiBaseUrl}${order.game_thumbnail}`}
                                alt="Game"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                                <FiGrid size={24} />
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm py-1 flex justify-center">
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                Acc #{order.acc_id}
                            </span>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 w-full text-left">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-slate-500 font-mono text-xs">#{order.id}</span>
                                    <h3 className="font-bold text-white text-lg">{order.user_name}</h3>
                                </div>
                                <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                        <FiMail className="text-blue-400" /> {order.user_email}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiClock /> {new Date(order.created_at || order.create_at).toLocaleString("vi-VN")}
                                    </span>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-opacity-10 backdrop-blur-sm ${order.status === 'success' ? 'bg-emerald-500 border-emerald-500/30 text-emerald-400' :
                                order.status === 'pending' ? 'bg-yellow-500 border-yellow-500/30 text-yellow-400' :
                                    'bg-rose-500 border-rose-500/30 text-rose-400'
                                }`}>
                                {order.status === 'pending' ? 'Chờ xử lý' :
                                    order.status === 'success' ? 'Hoàn thành' : 'Đã hủy'}
                            </span>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-white/5 mb-4"></div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Giá bán</span>
                                <span className="text-teal-400 font-bold font-mono text-lg">
                                    {Number(order.price).toLocaleString()}đ
                                </span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Liên hệ Contact</span>
                                <div className="flex gap-3 text-xs font-medium text-slate-300">
                                    <span className="flex items-center gap-1"><FiPhone className="text-slate-500" /> {order.contact_info?.phone || "N/A"}</span>
                                    <span className="w-px h-4 bg-slate-700"></span>
                                    <span className="flex items-center gap-1"><FiMessageSquare className="text-slate-500" /> {order.contact_info?.zalo || "N/A"}</span>
                                    <span className="w-px h-4 bg-slate-700"></span>
                                    <span className="flex items-center gap-1"><FiMail className="text-slate-500" /> {order.contact_info?.email || "N/A"}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                {order.acc_image && (
                                    <button
                                        onClick={() => onViewImage(order.acc_image?.startsWith('http') ? order.acc_image : `${apiBaseUrl}/uploads/${order.acc_image}`)}
                                        className="text-xs font-bold text-slate-400 hover:text-teal-400 flex items-center gap-1 ml-auto transition-colors"
                                    >
                                        <FiImage /> Xem ảnh
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        {(order.status === "pending" || order.status === "success") && (
                            <div className="flex gap-2 justify-end pt-2 border-t border-white/5">
                                {order.status === "pending" && (
                                    <button
                                        onClick={onCancel}
                                        className="px-4 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                                    >
                                        Hủy Đơn
                                    </button>
                                )}
                                <button
                                    onClick={onSendAcc}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
                                >
                                    <FiSend /> {order.status === "success" ? "Gửi Lại Thông Tin" : "Gửi Thông Tin Acc"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AccSellingPage() {
    const toast = useToast();
    const [listOrder, setListOrder] = useState([]);
    const [totalOrder, setTotalOrder] = useState(0);
    const [totalOrderPending, setTotalOrderPending] = useState(0);
    const [totalOrderDone, setTotalOrderDone] = useState(0);
    const [totalOrderCancel, setTotalOrderCancel] = useState(0);
    const [timkiem, setTimkiem] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
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
            const data = await getAllOrder();
            // Since service now returns res.data.data directly
            const orders = Array.isArray(data) ? data : [];
            setListOrder(orders);
            setTotalOrder(orders.length);
            setTotalOrderPending(orders.filter(o => o.status === "pending").length);
            setTotalOrderDone(orders.filter(o => o.status === "success").length);
            setTotalOrderCancel(orders.filter(o => o.status === "cancel").length);
        } catch (err) {
            console.error("Fetch orders error:", err);
            toast.error("Không thể tải danh sách đơn hàng");
        }
    };

    const filteredOrders = listOrder.filter(o =>
        (timkiem === "" || o.id.toString().includes(timkiem)) &&
        (filterStatus === "" || o.status === filterStatus)
    );

    const indexOfLast = currentPage * ordersPerPage;
    const indexOfFirst = indexOfLast - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const handleSendAcc = async () => {
        if (!accInfo.username || !accInfo.password) {
            toast.error("Vui lòng nhập tài khoản và mật khẩu");
            return;
        }

        setSending(true);
        try {
            await sendAcc(selectedOrder.id, {
                ttacc: {
                    acc_username: accInfo.username,
                    acc_password: accInfo.password,
                    acc_info: accInfo.note
                }
            });
            toast.success("Đã gửi thông tin tài khoản thành công ✅");
            setShowForm(false);
            setAccInfo({ username: "", password: "", note: "" });
            fetchOrders();
        } catch (err) {
            console.error("Send acc error:", err);
            toast.error(err.response?.data?.message || "Gửi tài khoản thất bại ❌");
        } finally {
            setSending(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!confirm("Bạn có chắc muốn hủy đơn này? Hệ thống sẽ hoàn tiền cho người mua.")) return;
        try {
            await cancelOrder(orderId);
            toast.success("Đã hủy đơn và hoàn tiền thành công ✅");
            fetchOrders();
        } catch (err) {
            console.error("Hủy đơn lỗi:", err);
            toast.error(err.response?.data?.message || "Hủy đơn thất bại ❌");
        }
    };

    return (
        <div className="space-y-8 animate-[fadeIn_0.5s_ease-out] pb-20">
            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-8">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-teal-400 via-emerald-500 to-green-500 bg-clip-text text-transparent mb-2">
                            Giao dịch Acc Game
                        </h1>
                        <p className="text-slate-400 font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                            Quản lý đơn hàng mua tài khoản
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group w-full md:w-96">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl blur opacity-25 group-focus-within:opacity-75 transition duration-500"></div>
                        <div className="relative bg-slate-900 rounded-xl p-1 flex items-center">
                            <FiSearch className="ml-3 text-slate-400 group-focus-within:text-teal-400 transition-colors" size={20} />
                            <input
                                type="text"
                                value={timkiem}
                                onChange={(e) => {
                                    setTimkiem(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Tìm mã đơn hàng..."
                                className="w-full bg-transparent text-white px-3 py-2 outline-none placeholder-slate-500 font-medium"
                            />
                            {timkiem && (
                                <button
                                    onClick={() => setTimkiem('')}
                                    className="p-1 hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
                                >
                                    <FiX />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    value={totalOrder}
                    title="Tổng giao dịch"
                    color="text-teal-400"
                    bg="from-teal-500/20 to-teal-600/5"
                    borderColor="border-teal-500/20"
                    active={filterStatus === ''}
                    onClick={() => setFilterStatus("")}
                />
                <StatCard
                    value={totalOrderPending}
                    title="Đang chờ xử lý"
                    color="text-yellow-400"
                    bg="from-yellow-500/20 to-yellow-600/5"
                    borderColor="border-yellow-500/20"
                    active={filterStatus === 'pending'}
                    onClick={() => setFilterStatus("pending")}
                />
                <StatCard
                    value={totalOrderDone}
                    title="Đã thành công"
                    color="text-emerald-400"
                    bg="from-emerald-500/20 to-emerald-600/5"
                    borderColor="border-emerald-500/20"
                    active={filterStatus === 'success'}
                    onClick={() => setFilterStatus("success")}
                />
                <StatCard
                    value={totalOrderCancel}
                    title="Đã hủy"
                    color="text-rose-400"
                    bg="from-rose-500/20 to-rose-600/5"
                    borderColor="border-rose-500/20"
                    active={filterStatus === 'cancel'}
                    onClick={() => setFilterStatus("cancel")}
                />
            </div>

            {/* Content Divider */}
            <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                <div className="px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <FiFilter className="text-teal-400" />
                    Trạng thái: <span className="text-white">{filterStatus === '' ? 'Tất cả' : filterStatus}</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
            </div>

            {/* List Orders */}
            <div className="space-y-4">
                {currentOrders.length > 0 ? (
                    currentOrders.map(order => (
                        <AccOrderCard
                            key={order.id}
                            order={order}
                            onSendAcc={() => {
                                setSelectedOrder(order);
                                setAccInfo({
                                    username: order.acc_username || "",
                                    password: order.acc_password || "",
                                    note: order.acc_info || ""
                                });
                                setShowForm(true);
                            }}
                            onCancel={() => handleCancelOrder(order.id)}
                            onViewImage={setPreviewImage}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 bg-[#1E293B]/30 rounded-3xl border border-dashed border-slate-700">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-bold text-slate-300">Không có đơn hàng nào</h3>
                        <p className="text-slate-500 mt-2">Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filteredOrders.length > 0 && (
                <div className="flex justify-center pt-6">
                    <div className="bg-[#1E293B] p-2 rounded-xl border border-white/5 shadow-lg flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:hover:bg-transparent text-slate-300 text-sm font-bold transition-colors"
                        >
                            Prev
                        </button>
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentPage(idx + 1)}
                                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold border transition-colors ${currentPage === idx + 1 ? "bg-teal-500/20 text-teal-400 border-teal-500/50" : "border-transparent text-slate-400 hover:bg-white/5"}`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:hover:bg-transparent text-slate-300 text-sm font-bold transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* MODALS */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]"
                    onClick={() => setPreviewImage(null)}
                >
                    <img
                        src={previewImage}
                        alt="preview"
                        className="max-h-[90vh] max-w-full rounded-2xl shadow-2xl animate-[scaleIn_0.2s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md"
                        onClick={() => setPreviewImage(null)}
                    >
                        <FiX size={24} />
                    </button>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
                    <div className="relative bg-[#0F172A] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl p-0 overflow-hidden animate-[scaleIn_0.2s_ease-out]">
                        {/* Header Modal */}
                        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-6 border-b border-white/10 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FiSend className="text-blue-400" /> Gửi Acc
                                </h2>
                                <p className="text-xs text-blue-300 mt-1">Gửi thông tin tài khoản cho khách hàng</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-lg"><FiX size={20} /></button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-[#1E293B] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                <div>
                                    <span className="text-[10px] uppercase text-slate-500 font-bold block">Khách hàng</span>
                                    <span className="text-white font-bold">{selectedOrder?.user_name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] uppercase text-slate-500 font-bold block">Mã đơn</span>
                                    <span className="text-teal-400 font-mono font-bold">#{selectedOrder?.id}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block ml-1">Username / Tài khoản</label>
                                    <input
                                        type="text"
                                        placeholder="Nhập tài khoản game..."
                                        value={accInfo.username}
                                        onChange={(e) => setAccInfo({ ...accInfo, username: e.target.value })}
                                        className="w-full bg-[#1E293B] border border-white/10 px-4 py-3 rounded-xl text-white focus:border-blue-500/50 outline-none transition-colors placeholder-slate-600"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block ml-1">Password / Mật khẩu</label>
                                    <input
                                        type="text"
                                        placeholder="Nhập mật khẩu game..."
                                        value={accInfo.password}
                                        onChange={(e) => setAccInfo({ ...accInfo, password: e.target.value })}
                                        className="w-full bg-[#1E293B] border border-white/10 px-4 py-3 rounded-xl text-white focus:border-blue-500/50 outline-none transition-colors placeholder-slate-600"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block ml-1">Ghi chú (Tùy chọn)</label>
                                    <textarea
                                        placeholder="Lời nhắn cho khách hàng..."
                                        value={accInfo.note}
                                        onChange={(e) => setAccInfo({ ...accInfo, note: e.target.value })}
                                        className="w-full bg-[#1E293B] border border-white/10 px-4 py-3 rounded-xl text-white focus:border-blue-500/50 outline-none transition-colors placeholder-slate-600 min-h-[100px] resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 pt-0 flex gap-3">
                            <button
                                onClick={() => setShowForm(false)}
                                disabled={sending}
                                className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 font-bold transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSendAcc}
                                disabled={sending}
                                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg hover:shadow-blue-500/20 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                            >
                                {sending ? "Đang gửi..." : "Gửi thông tin"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
