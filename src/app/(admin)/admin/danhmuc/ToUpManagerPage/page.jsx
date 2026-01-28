"use client";
import { useEffect, useRef, useState } from "react";
import OrderItem from "@/components/admin/toupManager/orderItem";
import Pagination from "@/components/common/Pagination";
import { getAllOrder, getAllOrderByStatus, searchOrder } from "@/services/order.service";
import { toast } from "react-toastify";
import { FiShoppingCart, FiSearch, FiFilter, FiX, FiCreditCard, FiClock, FiLoader, FiCheckCircle, FiXCircle } from "react-icons/fi";

const StatCard = ({ title, value, icon, color, bg, borderColor, active, onClick }) => (
    <button
        onClick={onClick}
        className={`
            relative overflow-hidden rounded-2xl p-4 border transition-all duration-300 group text-left w-full
            ${active
                ? `bg-gradient-to-br ${bg} ${borderColor} shadow-lg shadow-${color.split('-')[1]}-500/10 scale-105`
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'}
        `}
    >
        <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg bg-slate-950/50 ${color}`}>
                {icon}
            </div>
            {active && <div className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')} animate-pulse`}></div>}
        </div>
        <div className="space-y-1">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</h3>
            <p className={`text-2xl font-black ${active ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                {value}
            </p>
        </div>
    </button>
);

export default function Toup() {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        processing: 0,
        success: 0,
        cancelled: 0,
    });

    const [listOrders, setListOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchKeyword, setSearchKeyword] = useState("");
    const listRef = useRef(null);

    const fetchOrders = async () => {
        try {
            if (searchKeyword.trim()) {
                const res = await searchOrder(searchKeyword.trim(), currentPage);
                console.log(res)
                setListOrders(res.orders?.orders || []);
                setTotalPages(Math.ceil((res.orders?.total || 0) / 10));

                if (!res.orders || res.orders.length === 0) {
                    toast.info("🔎 Không tìm thấy đơn hàng nào phù hợp.");
                }
                return;
            }

            if (activeFilter === "all") {
                const res = await getAllOrder(currentPage);
                setStats({
                    total: res.total,
                    pending: res.stats?.pending || 0,
                    processing: res.stats?.processing || 0,
                    success: res.stats?.success || 0,
                    cancelled: res.stats?.cancelled || 0,
                });

                setListOrders(res.orders || []);
                setTotalPages(Math.ceil(res.total / 10));
            } else {
                const res = await getAllOrderByStatus(activeFilter, currentPage);
                setListOrders(res.orders || []);
                setTotalPages(Math.ceil(res.total / 10));

                if (!res.orders || res.orders.length === 0) {
                    toast.info("📂 Không có đơn hàng trong trạng thái này.");
                }
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
            toast.error("❌ Lỗi khi tải danh sách đơn hàng.");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage, activeFilter, searchKeyword]);

    useEffect(() => {
        if (listOrders.length > 0 && listRef.current) {
            listRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [listOrders]);

    const handleClickStat = (filter) => {
        setActiveFilter(filter);
        setCurrentPage(1);
        setSearchKeyword("");
    };

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-8 mb-8">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
                            Quản lý Đơn Nạp
                        </h1>
                        <p className="text-slate-400 font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Hệ thống xử lý đơn hàng tự động & thủ công
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group w-full md:w-96">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-25 group-focus-within:opacity-75 transition duration-500"></div>
                        <div className="relative bg-slate-900 rounded-xl p-1 flex items-center">
                            <FiSearch className="ml-3 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={20} />
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder="Tìm kiếm theo mã đơn, email..."
                                className="w-full bg-transparent text-white px-3 py-2 outline-none placeholder-slate-500 font-medium"
                            />
                            {searchKeyword && (
                                <button
                                    onClick={() => setSearchKeyword('')}
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
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                    title="Tổng đơn hàng"
                    value={stats.total}
                    icon={<FiCreditCard />}
                    color="text-slate-200"
                    bg="from-slate-500/20 to-slate-600/5"
                    borderColor="border-slate-500/20"
                    active={activeFilter === 'all'}
                    onClick={() => handleClickStat("all")}
                />
                <StatCard
                    title="Chờ xử lý"
                    value={stats.pending}
                    icon={<FiClock />}
                    color="text-yellow-400"
                    bg="from-yellow-500/20 to-yellow-600/5"
                    borderColor="border-yellow-500/20"
                    active={activeFilter === 'pending'}
                    onClick={() => handleClickStat("pending")}
                />
                <StatCard
                    title="Đang thực hiện"
                    value={stats.processing}
                    icon={<FiLoader />}
                    color="text-sky-400"
                    bg="from-sky-500/20 to-sky-600/5"
                    borderColor="border-sky-500/20"
                    active={activeFilter === 'processing'}
                    onClick={() => handleClickStat("processing")}
                />
                <StatCard
                    title="Thành công"
                    value={stats.success}
                    icon={<FiCheckCircle />}
                    color="text-emerald-400"
                    bg="from-emerald-500/20 to-emerald-600/5"
                    borderColor="border-emerald-500/20"
                    active={activeFilter === 'success'}
                    onClick={() => handleClickStat("success")}
                />
                <StatCard
                    title="Đã hủy"
                    value={stats.cancelled}
                    icon={<FiXCircle />}
                    color="text-rose-400"
                    bg="from-rose-500/20 to-rose-600/5"
                    borderColor="border-rose-500/20"
                    active={activeFilter === 'cancelled'}
                    onClick={() => handleClickStat("cancelled")}
                />
            </div>

            {/* Content Divider */}
            <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                <div className="px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <FiFilter className="text-cyan-400" />
                    Đang xem: <span className="text-white">{activeFilter === 'all' ? 'Tất cả' : activeFilter}</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
            </div>

            {/* Order list */}
            <div ref={listRef} className="space-y-4">
                {listOrders.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-4">
                            {listOrders.map((order, index) => (
                                <OrderItem
                                    key={order.id}
                                    order={{ ...order, stt: (currentPage - 1) * 10 + index + 1 }}
                                    onStatusChange={() => {
                                        fetchOrders();
                                        toast.success("✅ Cập nhật trạng thái thành công!");
                                    }}
                                />
                            ))}
                        </div>

                        <div className="flex justify-center pt-6 pb-12">
                            <div className="bg-[#1E293B] p-2 rounded-xl border border-white/5 shadow-lg">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPage={totalPages}
                                    onPageChange={(page) => setCurrentPage(page)}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 bg-[#1E293B]/30 rounded-3xl border border-dashed border-slate-700">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-bold text-slate-300">Không có đơn hàng nào</h3>
                        <p className="text-slate-500 mt-2">Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác</p>
                    </div>
                )}
            </div>
        </div>
    );
}
