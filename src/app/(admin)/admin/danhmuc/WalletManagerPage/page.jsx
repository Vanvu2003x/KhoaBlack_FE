"use client";
import { getListLogs, getListLogsPending, manualChargeBalance } from "@/services/toup-wallet-logs.service";
import { useEffect, useState, Fragment } from "react";
import { FiSearch, FiDollarSign, FiClock, FiCheckCircle, FiChevronDown, FiCheck } from "react-icons/fi";
import { Listbox, Transition } from "@headlessui/react";
import Pagination from "@/components/common/Pagination";
import { toast } from "react-toastify";

export default function WalletManagerPage() {
    const [transactions, setTransactions] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [totalTs, setTotalTs] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [mode, setMode] = useState("all");
    const [totalTsPending, setTotalTsPending] = useState(0);
    const [inputEmail, setInputEmail] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const statusOptions = ["Đang Chờ", "Thành Công", "Thất Bại", "Đã Hủy"];
    const itemsPerPage = 10;

    const handleChangeStatus = async (id, newStatus) => {
        try {
            await manualChargeBalance(id, newStatus);
            toast.success("Cập nhật trạng thái thành công 🎉");
            // Refresh data
            mode === "all" ? await handlerFindAll() : await handlerFindPending();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Lỗi cập nhật trạng thái");
        }
    };

    const handlerFindAll = async () => {
        try {
            setMode("all");
            // Pass searchTerm to service
            const data = await getListLogs(currentPage, searchTerm);
            const pendingData = await getListLogsPending();

            setTotalTs(data.totalItem || 0);
            setTransactions(data.data || []);
            setTotalTsPending(pendingData.totalItem || 0);
            setTotalPage(Math.ceil((data.totalItem || 0) / itemsPerPage));
        } catch (error) {
            console.error("Lỗi khi lấy giao dịch:", error);
            setTransactions([]);
        }
    };

    const handlerFindPending = async () => {
        try {
            setMode("pending");
            const data = await getListLogsPending();
            setTransactions(data.data || []);
            setTotalPage(1);
        } catch (error) {
            console.error("Lỗi khi lấy giao dịch đang xử lý:", error);
            setTransactions([]);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        setSearchTerm(inputEmail.trim());
    };

    useEffect(() => {
        if (mode === "all") {
            handlerFindAll();
        }
    }, [currentPage, searchTerm]);

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">

            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row gap-6">

                {/* Intro Title */}
                <div className="flex-1 bg-[#1E293B]/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col justify-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Quản lý Nạp Tiền
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Theo dõi và xử lý các giao dịch nạp tiền vào ví
                    </p>
                </div>

                {/* Stat Cards */}
                <div
                    onClick={handlerFindAll}
                    className="cursor-pointer group bg-[#1E293B]/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-xl hover:border-blue-500/30 transition-all min-w-[200px]"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                            <FiDollarSign size={20} />
                        </div>
                        <span className="text-slate-400 text-sm font-medium">Tổng giao dịch</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                        {totalTs}
                    </p>
                </div>

                <div
                    onClick={handlerFindPending}
                    className="cursor-pointer group bg-[#1E293B]/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-xl hover:border-yellow-500/30 transition-all min-w-[200px]"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                            <FiClock size={20} />
                        </div>
                        <span className="text-slate-400 text-sm font-medium">Đang xử lý</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-100 group-hover:text-yellow-400 transition-colors">
                        {totalTsPending}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-[#1E293B]/50 backdrop-blur-xl rounded-2xl border border-white/5 shadow-xl overflow-hidden pb-12 transition-all">

                {/* Toolbar */}
                <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                        {mode === 'all' ? 'Tất cả giao dịch' : 'Giao dịch đang xử lý'}
                    </h2>

                    <form onSubmit={handleSearchSubmit} className="relative group w-full sm:w-72">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            className="w-full bg-[#0F172A] border border-white/10 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                            placeholder="Tìm kiếm theo email..."
                            value={inputEmail}
                            onChange={(e) => setInputEmail(e.target.value)}
                        />
                    </form>
                </div>

                {/* Table */}
                <div className="overflow-visible min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0F172A]/50 text-slate-400 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Mã GD</th>
                                <th className="px-6 py-4">Người dùng</th>
                                <th className="px-6 py-4 text-right">Số tiền</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4">Thời gian</th>
                                <th className="px-6 py-4">Cập nhật</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        Không có giao dịch nào được tìm thấy.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-slate-400 text-xs">
                                            #{tx.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-200">{tx.email || 'N/A'}</div>
                                            <div className="text-xs text-slate-500">{tx.name_user || 'Unknown'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-blue-400 font-mono">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tx.amount)}
                                        </td>
                                        <td className="px-6 py-4 relative z-0 hover:z-10 w-48">
                                            <StatusSelect
                                                currentStatus={tx.status}
                                                onChange={(val) => handleChangeStatus(tx.id, val)}
                                                options={statusOptions}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {new Date(tx.created_at).toLocaleString("vi-VN")}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">
                                            {tx.update_at
                                                ? new Date(tx.update_at).toLocaleString("vi-VN")
                                                : "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {mode === "all" && totalPage > 1 && (
                    <div className="p-6 border-t border-white/5 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPage={totalPage}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusSelect({ currentStatus, onChange, options }) {
    const getStatusStyle = (status) => {
        switch (status) {
            case "Thành Công": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "Đang Chờ": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
            case "Thất Bại":
            case "Đã Hủy": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            default: return "bg-slate-700 text-slate-300 border-slate-600";
        }
    };

    return (
        <Listbox value={currentStatus} onChange={onChange}>
            <div className="relative">
                <Listbox.Button className={`relative w-full cursor-pointer rounded-lg py-1.5 pl-3 pr-8 text-left border text-xs font-bold shadow-sm focus:outline-none transition-all ${getStatusStyle(currentStatus)}`}>
                    <span className="block truncate">{currentStatus}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <FiChevronDown className="h-4 w-4 opacity-70" aria-hidden="true" />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-[#1E293B] py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm border border-white/10 z-[50]">
                        {options.map((status, idx) => (
                            <Listbox.Option
                                key={idx}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none py-2 pl-3 pr-4 ${active ? 'bg-blue-500/20 text-blue-300' : 'text-slate-300'
                                    }`
                                }
                                value={status}
                            >
                                {({ selected }) => (
                                    <>
                                        <span className={`block truncate ${selected ? 'font-medium text-blue-400' : 'font-normal'}`}>
                                            {status}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-400">
                                                <FiCheck className="h-4 w-4" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
}
