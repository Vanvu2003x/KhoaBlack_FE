"use client";
import { useEffect, useState } from "react";
import Pagination from "@/components/common/Pagination";
import { getLogByUser } from "@/services/toup-wallet-logs.service";

export default function WalletLog() {
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);

    const fetchLogs = async (page) => {
        try {
            const res = await getLogByUser(page);
            if (res.status) {
                setLogs(res.data || []);
                const totalItem = Number(res.totalItem) || 0;
                setTotal(totalItem);
                setTotalPage(Math.ceil(totalItem / 10));
            } else {
                setLogs([]);
                setTotal(0);
                setTotalPage(0);
            }
        } catch (error) {
            console.error("Lỗi khi lấy lịch sử nạp ví:", error);
            setLogs([]);
            setTotal(0);
            setTotalPage(0);
        }
    };

    useEffect(() => {
        fetchLogs(page);
    }, [page]);

    return (
        <div className="bg-white p-6 rounded-xl shadow space-y-4 border">
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-xl font-semibold text-gray-800">Lịch sử nạp ví</h2>
                <span className="text-sm text-gray-600">Tổng số đơn: {total}</span>
            </div>

            {/* Container cho phép kéo ngang trên điện thoại */}
            <div className="overflow-x-auto">
                {logs.length === 0 ? (
                    <div className="text-center text-gray-400 italic py-8">
                        Không có lịch sử nạp ví nào.
                    </div>
                ) : (
                    <table className="w-full text-sm text-left text-gray-700 border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-gray-300">
                                <th className="py-2 px-3">Mã giao dịch</th>
                                <th className="py-2 px-3">Số tiền</th>
                                {/* Cột trạng thái cố định width 120px */}
                                <th className="py-2 px-3" style={{ width: 120 }}>Trạng thái</th>
                                <th className="py-2 px-3">Ngày tạo</th>
                                <th className="py-2 px-3">Cập nhật</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr
                                    key={log.id}
                                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                                >
                                    <td className="py-2 px-3 font-mono">{log.id}</td>
                                    <td className="py-2 px-3 text-blue-600 font-semibold">
                                        {log.amount.toLocaleString()}đ
                                    </td>
                                    <td className="py-2 px-3" style={{ width: 120 }}>
                                        <span
                                            className={`px-2 py-1 rounded text-white text-xs font-semibold inline-block text-center w-full ${log.status === "Đang Chờ"
                                                    ? "bg-yellow-400"
                                                    : log.status === "Thành Công"
                                                        ? "bg-green-600"
                                                        : log.status === "Thất Bại"
                                                            ? "bg-red-600"
                                                            : "bg-gray-400"
                                                }`}
                                        >
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-3">
                                        {new Date(log.created_at).toLocaleString("vi-VN")}
                                    </td>
                                    <td className="py-2 px-3">
                                        {new Date(log.update_at).toLocaleString("vi-VN")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {totalPage > 1 && (
                <div className="pt-4">
                    <Pagination currentPage={page} totalPage={totalPage} onPageChange={setPage} />
                </div>
            )}
        </div>
    );
}
