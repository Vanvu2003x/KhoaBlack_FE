"use client";
import { useEffect, useRef, useState } from "react";
import Stat from "@/components/admin/stat";
import OrderItem from "@/components/admin/toupManager/orderItem";
import Pagination from "@/components/common/Pagination";
import { getAllOrder, getAllOrderByStatus, searchOrder } from "@/services/order.service";
import { toast } from "react-toastify";

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
        <div className="p-4 sm:p-10 bg-[#F4F6FA] min-h-screen">
            {/* Stats */}
            <div className="md:flex gap-3 flex-wrap mb-6">
                <Stat title="Tổng đơn" info={stats.total} onClick={() => handleClickStat("all")} />
                <Stat title="Chờ xử lý" info={stats.pending} className="border-yellow-400 text-yellow-500" onClick={() => handleClickStat("pending")} />
                <Stat title="Đang xử lý" info={stats.processing} className="border-sky-500 text-sky-600" onClick={() => handleClickStat("processing")} />
                <Stat title="Thành công" info={stats.success} className="border-emerald-500 text-emerald-600" onClick={() => handleClickStat("success")} />
                <Stat title="Đã hủy" info={stats.cancelled} className="border-rose-500 text-rose-600" onClick={() => handleClickStat("cancelled")} />
            </div>

            {/* Header + Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                <h2 className="text-xl font-semibold">Danh sách đơn hàng</h2>
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="Tìm theo mã đơn / email..."
                        className="border border-gray-300 outline-none bg-white px-3 py-1 text-sm rounded w-[220px]"
                    />
                </div>
            </div>

            {/* Order list */}
            <div className="bg-white p-4 rounded-md shadow" ref={listRef}>
                {listOrders.length > 0 ? (
                    <>
                        <div className="space-y-4">
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

                        <Pagination
                            currentPage={currentPage}
                            totalPage={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </>
                ) : (
                    <div className="text-gray-500 text-center py-8">Không có đơn hàng nào</div>
                )}
            </div>
        </div>
    );
}
