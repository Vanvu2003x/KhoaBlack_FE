"use client";
import { useEffect, useState } from "react";
import Stat from "@/components/admin/stat";
import LineChartComponent from "@/components/admin/revenueManager/chart";
import { getTopupStats } from "@/services/toup-wallet-logs.service";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { getOrderStatistics } from "@/services/order.service";

const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        currencyDisplay: "code",
        minimumFractionDigits: 0,
    }).format(value);
};

export default function RevenueManagerPage() {
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());

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
        <div className="bg-[#F4F6FA] p-10">
            <div className="flex gap-4 justify-between">
                <Stat
                    className={"border-blue-600 text-blue-600 bg-teal-300"}
                    title="Tổng doanh thu"
                    info={formatCurrency(TotalRevenue)}
                />
                <Stat
                    className={"border-pink-600 text-pink-600"}
                    title="Tổng doanh thu tháng này"
                    info={formatCurrency(TotalRevenueThisMonth)}
                />
                <Stat
                    className={"border-green-600 text-green-600"}
                    title="Tổng doanh thu hôm nay"
                    info={formatCurrency(TotalRevenueThisDay)}
                />
            </div>

            <div className="flex gap-4 justify-between mt-6">
                <Stat
                    className={"border-red-600 text-red-600 bg-red-100"}
                    title="Tổng chi phí"
                    info={formatCurrency(TotalCost)}
                />
                <Stat
                    className={"border-orange-600 text-orange-600 bg-orange-100"}
                    title="Chi phí tháng này"
                    info={formatCurrency(TotalCostThisMonth)}
                />
                <Stat
                    className={"border-yellow-600 text-yellow-600 bg-yellow-100"}
                    title="Chi phí hôm nay"
                    info={formatCurrency(TotalCostThisDay)}
                />
            </div>

            <div className="w-full p-4 border-2 mt-4 bg-teal-100">
                {mergedChartData.length > 0 ? (
                    <LineChartComponent rawData={mergedChartData} />
                ) : (
                    <div className="text-center py-10 text-gray-500 italic">
                        Không có dữ liệu biểu đồ
                    </div>
                )}
            </div>

        </div>
    );
}
