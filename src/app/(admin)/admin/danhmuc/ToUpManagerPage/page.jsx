"use client";
import { useEffect, useRef, useState } from "react";
import Stat from "@/components/admin/stat";
import OrderItem from "@/components/admin/toupManager/orderItem";
import Pagination from "@/components/common/Pagination";
import { getAllOrder, getAllOrderByStatus, searchOrder } from "@/services/order.service";
import { toast } from "react-toastify";
import { FiShoppingCart, FiSearch, FiFilter } from "react-icons/fi";

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
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1E293B]/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-xl">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
                        <FiShoppingCart className="text-cyan-400" /> Quản lý Đơn hàng
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Theo dõi và xử lý các đơn nạp tiền/game
                    </p>
                </div>

                {/* Search */}
                <div className="relative group">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="Tìm mã đơn / email..."
                        className="bg-[#0F172A] border border-white/10 text-slate-200 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 w-full md:w-80 transition-all"
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Stat
                    title="Tổng đơn"
                    info={stats.total}
                    onClick={() => handleClickStat("all")}
                    className={activeFilter === 'all' ? 'border-blue-500/50 bg-blue-500/10' : ''}
                />
                <Stat
                    title="Chờ xử lý"
                    info={stats.pending}
                    className={`text-yellow-400 ${activeFilter === 'pending' ? 'border-yellow-500/50 bg-yellow-500/10' : ''}`}
                    onClick={() => handleClickStat("pending")}
                />
                <Stat
                    title="Đang xử lý"
                    info={stats.processing}
                    className={`text-sky-400 ${activeFilter === 'processing' ? 'border-sky-500/50 bg-sky-500/10' : ''}`}
                    onClick={() => handleClickStat("processing")}
                />
                <Stat
                    title="Thành công"
                    info={stats.success}
                    className={`text-emerald-400 ${activeFilter === 'success' ? 'border-emerald-500/50 bg-emerald-500/10' : ''}`}
                    onClick={() => handleClickStat("success")}
                />
                <Stat
                    title="Đã hủy"
                    info={stats.cancelled}
                    className={`text-rose-400 ${activeFilter === 'cancelled' ? 'border-rose-500/50 bg-rose-500/10' : ''}`}
                    onClick={() => handleClickStat("cancelled")}
                />
            </div>

            {/* Order Filter Status Label */}
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium pl-2">
                <FiFilter className="text-cyan-400" />
                Đang xem: <span className="text-white font-bold uppercase">{activeFilter === 'all' ? 'Tất cả' : activeFilter}</span>
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
