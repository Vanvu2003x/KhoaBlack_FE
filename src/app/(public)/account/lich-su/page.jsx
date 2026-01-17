"use client";
import React, { useEffect, useState } from "react";
import { FiClock, FiPlus, FiMinus, FiActivity, FiArrowRight, FiFilter } from "react-icons/fi";
import { format } from "date-fns";
import { toast } from "react-toastify";
// Helper to fetch (assuming you have an axios instance or use fetch)
import api from "@/utils/axios"; // Adjust import path if needed

export default function HistoryPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchHistory();
    }, [page]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            // API endpoint based on route.js: /api/order/transaction-history
            const res = await api.get(`/api/order/transaction-history?page=${page}`);
            if (res.data) {
                setTransactions(res.data.transactions || []);
                setTotalPages(res.data.totalPages || 1);
            }
        } catch (error) {
            console.error(error);
            // toast.error("Không thể tải lịch sử giao dịch");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="bg-[#151021] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                            <FiActivity size={24} />
                        </span>
                        Lịch sử biến động
                    </h1>
                    <p className="text-slate-400 mt-2 max-w-2xl">
                        Theo dõi chi tiết các giao dịch nạp tiền và thanh toán của bạn.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="bg-[#151021] border border-white/5 rounded-2xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    <div className="col-span-4 md:col-span-3">Thời gian</div>
                    <div className="col-span-8 md:col-span-5">Nội dung</div>
                    <div className="col-span-6 md:col-span-2 text-right">Số tiền</div>
                    <div className="col-span-6 md:col-span-2 text-right">Số dư cuối</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/5">
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="grid grid-cols-12 gap-4 p-4 animate-pulse">
                                <div className="col-span-3 h-4 bg-white/5 rounded"></div>
                                <div className="col-span-5 h-4 bg-white/5 rounded"></div>
                                <div className="col-span-2 h-4 bg-white/5 rounded ml-auto w-20"></div>
                                <div className="col-span-2 h-4 bg-white/5 rounded ml-auto w-20"></div>
                            </div>
                        ))
                    ) : transactions.length > 0 ? (
                        transactions.map((tx) => {
                            // Determine if this is a credit (add money) or debit (subtract money)
                            const isCredit = tx.type === 'credit' || tx.type === 'wallet';
                            const displayAmount = Math.abs(parseInt(tx.amount));

                            return (
                                <div key={tx.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors group">
                                    <div className="col-span-4 md:col-span-3 text-slate-400 text-sm flex items-center gap-2">
                                        <FiClock className="text-slate-600 group-hover:text-purple-400 transition-colors" />
                                        {format(new Date(tx.created_at), "HH:mm dd/MM/yyyy")}
                                    </div>
                                    <div className="col-span-8 md:col-span-5 text-white font-medium break-words text-sm">
                                        {tx.description || "Giao dịch hệ thống"}
                                        <div className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider font-bold opacity-60">
                                            {isCredit ? 'Nạp tiền' : 'Thanh toán'}
                                        </div>
                                    </div>
                                    <div className={`col-span-6 md:col-span-2 text-right font-bold font-mono ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                                        {isCredit ? '+' : '-'}{displayAmount.toLocaleString()}đ
                                    </div>
                                    <div className="col-span-6 md:col-span-2 text-right text-slate-300 font-mono text-sm">
                                        {parseInt(tx.balance_after || 0).toLocaleString()}đ
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-12 text-center text-slate-500">
                            <FiActivity size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Chưa có giao dịch nào</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-white/5 flex justify-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white disabled:opacity-50 transition-colors"
                        >
                            Trước
                        </button>
                        <span className="px-4 py-2 text-slate-400">
                            Trang {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white disabled:opacity-50 transition-colors"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
