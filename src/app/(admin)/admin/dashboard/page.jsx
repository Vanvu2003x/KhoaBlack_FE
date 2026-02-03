"use client"
import { useState, useEffect, useCallback } from "react"
import api from "@/utils/axios"
import { FiTrendingUp, FiCreditCard, FiActivity, FiUsers } from "react-icons/fi"

export default function DashboardPage() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true)
            const res = await api.get("/statistics/revenue/dashboard")
            if (res.data?.status) {
                setStats(res.data.data)
            }
        } catch (error) {
            console.error("Error fetching dashboard stats:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    const formatVND = (amount) => {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + 'M'
        }
        if (amount >= 1000) {
            return (amount / 1000).toFixed(0) + 'K'
        }
        return new Intl.NumberFormat('vi-VN').format(amount || 0)
    }

    const formatFullVND = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(amount || 0)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <h1 className="text-2xl font-bold text-white">📊 Báo Cáo Thống Kê</h1>

            {/* Row 1: Tổng (All Time) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <TotalCard
                    icon={FiTrendingUp}
                    label="Tổng Doanh Thu"
                    value={formatFullVND(stats?.total?.revenue)}
                    color="from-green-500 to-emerald-600"
                />
                <TotalCard
                    icon={FiCreditCard}
                    label="Tổng Chi Phí"
                    value={formatFullVND(stats?.total?.spending)}
                    color="from-blue-500 to-cyan-600"
                />
                <TotalCard
                    icon={FiActivity}
                    label="Tổng Lợi Nhuận"
                    value={formatFullVND(stats?.total?.profit)}
                    color="from-purple-500 to-pink-600"
                />
                <TotalCard
                    icon={FiUsers}
                    label="Số Dư Khách Hàng"
                    value={formatFullVND(stats?.total_user_balance)}
                    color="from-orange-500 to-amber-600"
                />
            </div>

            {/* Row 2: 3 Columns - Ngày / Tuần / Tháng */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PeriodCard
                    title="Hôm Nay"
                    revenue={stats?.today?.revenue}
                    spending={stats?.today?.spending}
                    profit={stats?.today?.profit}
                    formatVND={formatVND}
                />
                <PeriodCard
                    title="Tuần Này"
                    revenue={stats?.this_week?.revenue}
                    spending={stats?.this_week?.spending}
                    profit={stats?.this_week?.profit}
                    formatVND={formatVND}
                />
                <PeriodCard
                    title="Tháng Này"
                    revenue={stats?.this_month?.revenue}
                    spending={stats?.this_month?.spending}
                    profit={stats?.this_month?.profit}
                    formatVND={formatVND}
                />
            </div>

            {/* Chart - Biểu đồ 30 ngày */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">📈 Lợi Nhuận 30 Ngày Qua</h2>
                <SimpleBarChart data={stats?.chart || []} />
            </div>
        </div>
    )
}

// Total Card (Row 1)
function TotalCard({ icon: Icon, label, value, color }) {
    return (
        <div className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg`}>
            <div className="flex items-center gap-3 mb-3">
                <Icon className="w-6 h-6 opacity-80" />
                <span className="text-sm opacity-90">{label}</span>
            </div>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    )
}

// Period Card (Row 2 - Ngày/Tuần/Tháng)
function PeriodCard({ title, revenue, spending, profit, formatVND }) {
    return (
        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Doanh thu</span>
                    <span className="text-green-400 font-medium">{formatVND(revenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Chi phí</span>
                    <span className="text-blue-400 font-medium">{formatVND(spending)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <span className="text-slate-300 text-sm font-medium">Lợi nhuận</span>
                    <span className="text-purple-400 font-bold">{formatVND(profit)}</span>
                </div>
            </div>
        </div>
    )
}

// Simple Bar Chart (CSS only, no library needed)
function SimpleBarChart({ data }) {
    if (!data || data.length === 0) {
        return <p className="text-slate-500 text-center py-8">Chưa có dữ liệu</p>
    }

    const maxProfit = Math.max(...data.map(d => d.profit), 1)

    return (
        <div className="flex items-end gap-1 h-40 overflow-x-auto pb-2">
            {data.map((item, index) => {
                const height = (item.profit / maxProfit) * 100
                const date = new Date(item.date)
                const day = date.getDate()

                return (
                    <div key={index} className="flex flex-col items-center min-w-[20px] group">
                        <div
                            className="w-4 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t hover:from-purple-500 hover:to-purple-300 transition-all cursor-pointer relative"
                            style={{ height: `${Math.max(height, 2)}%` }}
                            title={`${day}/${date.getMonth() + 1}: ${new Intl.NumberFormat('vi-VN').format(item.profit)}đ`}
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 px-2 py-1 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {new Intl.NumberFormat('vi-VN').format(item.profit)}đ
                            </div>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">{day}</span>
                    </div>
                )
            })}
        </div>
    )
}
