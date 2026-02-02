"use client";
import { useEffect, useState } from "react";
import { FiBarChart2, FiTrendingUp, FiTrendingDown, FiDollarSign, FiActivity, FiDownload } from "react-icons/fi";
import StatCard from "@/components/admin/revenueManager/StatCard";
import LineChartComponent from "@/components/admin/revenueManager/chart";
import ProfitMarginChart from "@/components/admin/revenueManager/ProfitMarginChart";
import PeriodSelector from "@/components/admin/revenueManager/PeriodSelector";
import GrowthIndicator from "@/components/admin/revenueManager/GrowthIndicator";
import TopSourcesWidget from "@/components/admin/revenueManager/TopSourcesWidget";
import { getTopupStats } from "@/services/toup-wallet-logs.service";
import { getOrderStatistics } from "@/services/order.service";
import { getProfitMargin, getGrowthRates, getTopRevenueSources } from "@/services/revenue.service";

const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        currencyDisplay: "code",
        minimumFractionDigits: 0,
    }).format(value);
};

export default function RevenueManagerPage() {
    // Revenue state
    const [TotalRevenue, setTotalRevenue] = useState(0);
    const [TotalRevenueThisMonth, setTotalRevenueThisMonth] = useState(0);
    const [TotalRevenueThisDay, setTotalRevenueThisDay] = useState(0);
    const [TotalRevenueByDate, setTotalRevenueByDate] = useState([]);

    // Cost state
    const [TotalCost, setTotalCost] = useState(0);
    const [TotalCostThisMonth, setTotalCostThisMonth] = useState(0);
    const [TotalCostThisDay, setTotalCostThisDay] = useState(0);
    const [TotalCostByDate, setTotalCostByDate] = useState([]);

    // Profit & Analytics state
    const [profitData, setProfitData] = useState(null);
    const [growthData, setGrowthData] = useState(null);
    const [topSources, setTopSources] = useState([]);

    // UI state
    const [period, setPeriod] = useState('daily');
    const [mergedChartData, setMergedChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch revenue data
                const revenueData = await getTopupStats();
                if (revenueData.status) {
                    setTotalRevenue(revenueData.tong_tien_da_nap);
                    setTotalRevenueThisMonth(revenueData.tong_tien_thang_nay);
                    setTotalRevenueThisDay(revenueData.tong_tien_hom_nay);
                    setTotalRevenueByDate(revenueData.thong_ke_30_ngay || []);
                }

                // Fetch cost data
                const costData = await getOrderStatistics();
                if (costData) {
                    setTotalCost(costData.total_cost);
                    setTotalCostThisMonth(costData.total_cost_this_month);
                    setTotalCostThisDay(costData.total_cost_today);
                    setTotalCostByDate(costData.last_30_days || []);
                }

                // Fetch profit margin data
                const profit = await getProfitMargin();
                if (profit.status) {
                    setProfitData(profit);
                }

                // Fetch growth rates
                const growth = await getGrowthRates();
                if (growth.status) {
                    setGrowthData(growth);
                }

                // Fetch top revenue sources
                const sources = await getTopRevenueSources(5);
                if (sources.status) {
                    setTopSources(sources.top_sources || []);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu thống kê:", error);
            } finally {
                setLoading(false);
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

    const totalProfit = profitData ? profitData.total.profit : TotalRevenue - TotalCost;
    const monthProfit = profitData ? profitData.this_month.profit : TotalRevenueThisMonth - TotalCostThisMonth;
    const todayProfit = profitData ? profitData.today.profit : TotalRevenueThisDay - TotalCostThisDay;

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-[#1E293B]/80 via-[#1E293B]/60 to-[#1E293B]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
                        <FiBarChart2 className="text-cyan-400" size={32} />
                        Báo cáo Doanh thu & Lợi nhuận
                    </h1>
                    <div className="text-slate-400 text-sm mt-2 flex items-center gap-2">
                        Thống kê chi tiết doanh thu, chi phí và lợi nhuận
                        {growthData && (
                            <GrowthIndicator
                                value={growthData.monthly.growth_rate}
                                label="so với tháng trước"
                            />
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <PeriodSelector value={period} onChange={setPeriod} />
                    <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                        <FiDownload size={18} />
                        Xuất báo cáo
                    </button>
                </div>
            </div>

            {/* Key Metrics - Revenue & Profit */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng doanh thu"
                    value={TotalRevenue}
                    icon={<FiDollarSign size={28} />}
                    gradient="from-blue-500/20 to-cyan-500/20"
                    iconColor="text-blue-400"
                    borderColor="border-blue-500/50"
                    trend={growthData?.monthly.growth_rate}
                />
                <StatCard
                    title="Doanh thu tháng này"
                    value={TotalRevenueThisMonth}
                    icon={<FiTrendingUp size={28} />}
                    gradient="from-cyan-500/20 to-teal-500/20"
                    iconColor="text-cyan-400"
                    borderColor="border-cyan-500/50"
                    trend={growthData?.daily.growth_rate}
                />
                <StatCard
                    title="Lợi nhuận tháng này"
                    value={monthProfit}
                    icon={<FiActivity size={28} />}
                    gradient="from-emerald-500/20 to-green-500/20"
                    iconColor="text-emerald-400"
                    borderColor="border-emerald-500/50"
                    trend={profitData?.this_month.margin_percent}
                />
                <StatCard
                    title="Lợi nhuận hôm nay"
                    value={todayProfit}
                    icon={<FiTrendingUp size={28} />}
                    gradient="from-amber-500/20 to-orange-500/20"
                    iconColor="text-amber-400"
                    borderColor="border-amber-500/50"
                    trend={profitData?.today.margin_percent}
                />
            </div>

            {/* Main Chart & Top Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue vs Cost Chart */}
                <div className="lg:col-span-2 bg-[#1E293B]/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                            <FiActivity className="text-cyan-400" />
                            Biểu đồ Doanh thu & Chi phí (30 ngày)
                        </h3>
                    </div>
                    <div className="w-full h-[400px]">
                        {mergedChartData.length > 0 ? (
                            <LineChartComponent rawData={mergedChartData} />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                <FiBarChart2 size={48} className="mb-4 opacity-50 animate-pulse" />
                                <div className="text-lg font-medium">Đang tải dữ liệu...</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Revenue Sources */}
                <div className="lg:col-span-1">
                    <TopSourcesWidget sources={topSources} loading={loading} />
                </div>
            </div>

            {/* Cost Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Tổng chi phí"
                    value={TotalCost}
                    icon={<FiTrendingDown size={28} />}
                    gradient="from-rose-500/20 to-pink-500/20"
                    iconColor="text-rose-400"
                    borderColor="border-rose-500/50"
                />
                <StatCard
                    title="Chi phí tháng này"
                    value={TotalCostThisMonth}
                    icon={<FiDollarSign size={28} />}
                    gradient="from-orange-500/20 to-red-500/20"
                    iconColor="text-orange-400"
                    borderColor="border-orange-500/50"
                />
                <StatCard
                    title="Chi phí hôm nay"
                    value={TotalCostThisDay}
                    icon={<FiActivity size={28} />}
                    gradient="from-yellow-500/20 to-amber-500/20"
                    iconColor="text-yellow-400"
                    borderColor="border-yellow-500/50"
                />
            </div>

            {/* Profit Margin Chart */}
            <div className="bg-[#1E293B]/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                            <FiTrendingUp className="text-amber-400" />
                            Biểu đồ Lợi nhuận (30 ngày)
                        </h3>
                        {profitData && (
                            <p className="text-sm text-slate-400 mt-1">
                                Tỷ suất lợi nhuận tháng này:
                                <span className={`ml-2 font-bold ${profitData.this_month.margin_percent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {profitData.this_month.margin_percent.toFixed(2)}%
                                </span>
                            </p>
                        )}
                    </div>
                </div>
                <div className="w-full h-[450px]">
                    {mergedChartData.length > 0 ? (
                        <ProfitMarginChart rawData={mergedChartData} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                            <FiBarChart2 size={48} className="mb-4 opacity-50 animate-pulse" />
                            <div className="text-lg font-medium">Đang tải dữ liệu...</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
