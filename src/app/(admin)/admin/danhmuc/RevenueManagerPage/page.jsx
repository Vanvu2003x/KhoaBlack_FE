"use client";
import { useEffect, useState } from "react";
import Stat from "@/components/admin/stat";
import LineChartComponent from "@/components/admin/revenueManager/chart";
import { getTopupStats } from "@/services/toup-wallet-logs.service";
import { getOrderStatistics } from "@/services/order.service";
import { FiBarChart2, FiTrendingUp, FiTrendingDown, FiDollarSign, FiActivity } from "react-icons/fi";

const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        currencyDisplay: "code",
        minimumFractionDigits: 0,
    }).format(value);
};

export default function RevenueManagerPage() {
    const [TotalRevenue, setTotalRevenue] = useState(0);
    const [TotalRevenueThisMonth, setTotalRevenueThisMonth] = useState(0);
    const [TotalRevenueThisDay, setTotalRevenueThisDay] = useState(0);
    const [TotalRevenueByDate, setTotalRevenueByDate] = useState([]);

    const [TotalCost, setTotalCost] = useState(0);
    const [TotalCostThisMonth, setTotalCostThisMonth] = useState(0);
    const [TotalCostThisDay, setTotalCostThisDay] = useState(0)
    const [TotalCostByDate, setTotalCostByDate] = useState([]);

    const [mergedChartData, setMergedChartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTopupStats();
                if (data.status) {
                    setTotalRevenue(data.tong_tien_da_nap);
                    setTotalRevenueThisMonth(data.tong_tien_thang_nay);
                    setTotalRevenueThisDay(data.tong_tien_hom_nay);
                    setTotalRevenueByDate(data.thong_ke_30_ngay || []);
                }

                const data2 = await getOrderStatistics();
                if (data2) {
                    setTotalCost(data2.total_cost)
                    setTotalCostThisMonth(data2.total_cost_this_month)
                    setTotalCostThisDay(data2.total_cost_today)

                    setTotalCostByDate(data2.last_30_days)
                    console.log(data2)
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu thống kê:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const allDatesSet = new Set([
            ...TotalRevenueByDate.map((item) =>
                new Date(item.date).toISOString().slice(0, 10)
            ),
            ...TotalCostByDate.map((item) =>
                new Date(item.date).toISOString().slice(0, 10)
            ),
        ]);

        const allDates = Array.from(allDatesSet).sort();

        const merged = allDates.map((date) => {
            const revItem = TotalRevenueByDate.find(
                (item) => new Date(item.date).toISOString().slice(0, 10) === date
            );
            const costItem = TotalCostByDate.find(
                (item) => new Date(item.date).toISOString().slice(0, 10) === date
            );

            return {
                date,
                total_amount: revItem ? parseInt(revItem.total_amount) : 0,
                total_cost: costItem ? parseInt(costItem.total_cost) : 0,
            };
        });

        setMergedChartData(merged);
    }, [TotalRevenueByDate, TotalCostByDate]);



    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1E293B]/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-xl">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
                        <FiBarChart2 className="text-teal-400" /> Báo cáo Doanh thu
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Thống kê chi tiết doanh thu và chi phí
                    </p>
                </div>
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Stat
                    className={"!bg-[#1E293B]/50 border-blue-500/50 text-blue-400 hover:bg-blue-500/10"}
                    title="Tổng doanh thu"
                    info={formatCurrency(TotalRevenue)}
                    icon={<FiDollarSign className="text-blue-500" size={24} />}
                />
                <Stat
                    className={"!bg-[#1E293B]/50 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"}
                    title="Doanh thu tháng này"
                    info={formatCurrency(TotalRevenueThisMonth)}
                    icon={<FiTrendingUp className="text-cyan-500" size={24} />}
                />
                <Stat
                    className={"!bg-[#1E293B]/50 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"}
                    title="Doanh thu hôm nay"
                    info={formatCurrency(TotalRevenueThisDay)}
                    icon={<FiActivity className="text-emerald-500" size={24} />}
                />
            </div>

            {/* Cost Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Stat
                    className={"!bg-[#1E293B]/50 border-rose-500/50 text-rose-400 hover:bg-rose-500/10"}
                    title="Tổng chi phí"
                    info={formatCurrency(TotalCost)}
                    icon={<FiTrendingDown className="text-rose-500" size={24} />}
                />
                <Stat
                    className={"!bg-[#1E293B]/50 border-orange-500/50 text-orange-400 hover:bg-orange-500/10"}
                    title="Chi phí tháng này"
                    info={formatCurrency(TotalCostThisMonth)}
                />
                <Stat
                    className={"!bg-[#1E293B]/50 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"}
                    title="Chi phí hôm nay"
                    info={formatCurrency(TotalCostThisDay)}
                />
            </div>

            {/* Chart Section */}
            <div className="bg-[#1E293B]/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
                <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
                    <FiActivity className="text-cyan-400" /> Biểu đồ so sánh Doanh thu & Chi phí (30 ngày)
                </h3>
                <div className="w-full h-[450px]">
                    {mergedChartData.length > 0 ? (
                        <LineChartComponent rawData={mergedChartData} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                            <FiBarChart2 size={48} className="mb-4 opacity-50" />
                            <div className="text-lg font-medium">Chưa có dữ liệu biểu đồ</div>
                            <p className="text-sm mt-1">Dữ liệu sẽ hiển thị khi có giao dịch phát sinh</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
