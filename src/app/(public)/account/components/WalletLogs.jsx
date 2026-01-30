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
                const totalItem = Number(res.totalLog) || 0;
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
        <div className="bg-[#1E293B]/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Lịch sử nạp ví
                </h2>
                <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">
                    Tổng: {total} đơn
                </span>
            </div>

            <div className="overflow-x-auto">
                {logs.length === 0 ? (
                    <div className="text-center text-slate-500 italic py-12 bg-slate-900/20 rounded-xl border border-dashed border-slate-700">
                        Chưa có lịch sử nạp ví nào.
                    </div>
                ) : (
                    <table className="w-full text-sm text-left text-slate-300 border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400 uppercase text-xs tracking-wider">
                                <th className="py-4 px-4 font-semibold">Mã giao dịch</th>
                                <th className="py-4 px-4 font-semibold">Số tiền</th>
                                <th className="py-4 px-4 font-semibold text-center" style={{ width: 140 }}>Trạng thái</th>
                                <th className="py-4 px-4 font-semibold">Ngày tạo</th>
                                <th className="py-4 px-4 font-semibold">Cập nhật</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {logs.map((log) => (
                                <tr
                                    key={log.id}
                                    className="hover:bg-white/5 transition duration-200"
                                >
                                    <td className="py-4 px-4 font-mono text-slate-400 font-medium">#{log.id}</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold font-mono">
                                        {(log.amount || 0).toLocaleString()}đ
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <span
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-block w-full border ${log.status === "pending" || log.status === "Đang Chờ"
                                                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                                : (log.status === "success" || log.status === "Thành Công")
                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                                                    : (log.status === "cancelled" || log.status === "Thất Bại")
                                                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                        : "bg-slate-700 text-slate-300 border-slate-600"
                                                }`}
                                        >
                                            {log.status === "success" ? "Thành Công" : log.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-slate-400">
                                        {new Date(log.created_at).toLocaleString("vi-VN")}
                                    </td>
                                    <td className="py-4 px-4 text-slate-500 text-xs">
                                        {log.update_at ? (
                                            new Date(log.update_at).toLocaleString("vi-VN")
                                        ) : (
                                            <span className="opacity-50 italic">Chưa cập nhật</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {totalPage > 1 && (
                <div className="pt-4 flex justify-center">
                    <Pagination currentPage={page} totalPage={totalPage} onPageChange={setPage} />
                </div>
            )}
        </div>
    );
}
