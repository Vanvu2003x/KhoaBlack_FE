"use client";
import Stat from "@/components/admin/stat";
import { getListLogs, getListLogsPending, manualChargeBalance } from "@/services/toup-wallet-logs.service";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Pagination from "@/components/common/Pagination";
import { toast } from "react-toastify";

export default function WalletManagerPage() {
    const [transactions, setTransactions] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [totalTs, setTotalTs] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [mode, setMode] = useState("all");
    const [totalTsPending, setTotalTsPending] = useState(0);
    const [searchEmail, setSearchEmail] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    const statusOptions = ["Đang Chờ", "Thành Công", "Thất Bại"];
    const itemsPerPage = 10;

    const handleChangeStatus = async (id, newStatus) => {
        try {
            const res = await manualChargeBalance(id, newStatus);
            mode === "all" ? await handlerFindAll() : await handlerFindPending();
            toast.success("Cập nhật trạng thái thành công 🎉");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Lỗi cập nhật trạng thái");
        }
    };

    const handlerFindAll = async () => {
        try {
            setMode("all");
            const data = await getListLogs(currentPage, searchEmail);
            const pendingData = await getListLogsPending();

            setTotalTs(data.totalItem);
            setTransactions(data.data);
            setTotalTsPending(pendingData.totalItem);
            setTotalPage(Math.ceil(data.totalItem / itemsPerPage));
        } catch (error) {
            console.error("Lỗi khi lấy giao dịch:", error);
            setTransactions([]);
        }
    };

    const handlerFindPending = async () => {
        try {
            setMode("pending");
            const data = await getListLogsPending();
            setTransactions(data.data);
            setTotalPage(1);
        } catch (error) {
            console.error("Lỗi khi lấy giao dịch đang xử lý:", error);
            setTransactions([]);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        setSearchEmail(inputEmail.trim());
    };

    useEffect(() => {
        if (mode === "all") {
            handlerFindAll();
        }
    }, [currentPage, searchEmail]);

    return (
        <div className="p-10 bg-[#F4F6FA] min-h-screen">
            {/* Thống kê */}
            <div className="md:flex gap-4 md:flex-row flex-col mb-10">
                <Stat onClick={handlerFindAll} title="Tổng số giao dịch" info={totalTs} className="border-blue-500 border-2 text-blue-600" />
                <Stat
                    onClick={handlerFindPending}
                    title="Giao dịch đang xử lí"
                    info={totalTsPending}
                    className="border-yellow-600 text-yellow-600"
                />
            </div>

            {/* Lịch sử giao dịch */}
            <div className="p-6 bg-white shadow rounded-xl">
                <div className="flex justify-between mb-4">
                    <div className="text-xl items-center font-semibold text-blue-600">Lịch sử giao dịch</div>
                    <form onSubmit={handleSearchSubmit} className="flex items-center p-2 border-2 gap-1 rounded">
                        <input
                            type="text"
                            className="outline-0"
                            placeholder="Nhập email user muốn tìm kiếm"
                            value={inputEmail}
                            onChange={(e) => setInputEmail(e.target.value)}
                        />
                        <button type="submit" className="text-blue-600 hover:text-blue-800">
                            <FaSearch />
                        </button>
                    </form>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Mã GD</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Số tiền</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ngày tạo</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cập nhật</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                                        Không có giao dịch nào.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-sm text-gray-800">{tx.id}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{tx.email}</td>
                                        <td className="px-4 py-2 text-sm text-right text-blue-600 font-medium">
                                            {tx.amount.toLocaleString()}₫
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                            <select
                                                value={tx.status}
                                                onChange={(e) => handleChangeStatus(tx.id, e.target.value)}
                                                className={`px-2 py-1 rounded-full text-xs font-semibold outline-none
                                                    ${tx.status === "Thành Công"
                                                        ? "bg-green-100 text-green-600"
                                                        : tx.status === "Thất Bại"
                                                            ? "bg-red-100 text-red-600"
                                                            : "bg-yellow-100 text-yellow-600"
                                                    }`}
                                            >
                                                {statusOptions.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-700">
                                            {new Date(tx.created_at).toLocaleString("vi-VN")}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-700">
                                            {tx.update_at
                                                ? new Date(tx.update_at).toLocaleString("vi-VN")
                                                : "Chưa cập nhật"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {mode === "all" && (
                    <Pagination
                        currentPage={currentPage}
                        totalPage={totalPage}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                )}
            </div>
        </div>
    );
}
