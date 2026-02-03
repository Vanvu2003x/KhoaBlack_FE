"use client"
import { useState, useEffect, useCallback } from "react"
import api from "@/utils/axios"
import { FiTrendingUp, FiCreditCard, FiActivity, FiUsers } from "react-icons/fi"

export default function RevenueManagerPage() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true)
            const res = await api.get("/api/statistics/revenue/dashboard")
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
            {/* Header - Premium Design */}
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6">
                {/* Background Glow Effects */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/20 rounded-full blur-2xl"></div>

                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Animated Icon Container */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                            <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                                Báo Cáo Doanh Thu
                            </h1>
                            <p className="text-slate-400 text-sm mt-0.5">Thống kê chi tiết doanh thu, chi phí và lợi nhuận</p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-emerald-400 text-sm font-medium">Cập nhật realtime</span>
                    </div>
                </div>
            </div>

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
            <div className="relative overflow-hidden bg-slate-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">
                            <span className="text-2xl">📈</span> Lợi Nhuận 30 Ngày Qua
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Xu hướng doanh thu, chi phí và lợi nhuận theo thời gian</p>
                    </div>
                    {/* Legend - Moved to Header */}
                    <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-full border border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow shadow-emerald-500/50"></div>
                            <span className="text-slate-300 text-xs font-medium">Doanh thu</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow shadow-blue-500/50"></div>
                            <span className="text-slate-300 text-xs font-medium">Chi phí</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow shadow-purple-500/50"></div>
                            <span className="text-slate-300 text-xs font-medium">Lợi nhuận</span>
                        </div>
                    </div>
                </div>

                <SimpleBarChart data={stats?.chart || []} />
            </div>

            {/* Top Customers Section */}
            <TopCustomersTable />
        </div>
    )
}

function TopCustomersTable() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTopUsers = async () => {
            try {
                const res = await api.get("/api/statistics/revenue/top-sources")
                if (res.data?.status) {
                    setUsers(res.data.data)
                }
            } catch (error) {
                console.error("Error fetching top users:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTopUsers()
    }, [])

    const formatVND = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0)
    }

    if (loading) return null
    if (!users || users.length === 0) return null

    return (
        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-300 via-orange-200 to-amber-300 bg-clip-text text-transparent flex items-center gap-2">
                        <span className="text-2xl">🏆</span> Khách Hàng Thân Thiết
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Top những khách hàng đóng góp doanh thu cao nhất</p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/5">
                <table className="w-full text-sm">
                    <thead className="bg-slate-800/80 text-slate-300 text-left uppercase text-xs font-semibold tracking-wider">
                        <tr>
                            <th className="py-4 px-6">Khách hàng</th>
                            <th className="py-4 px-6">Số đơn hàng</th>
                            <th className="py-4 px-6">Tổng chi tiêu</th>
                            <th className="py-4 px-6">Lợi nhuận</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 bg-slate-900/30">
                        {users.map((user, index) => (
                            <tr key={index} className="hover:bg-slate-800/50 transition-colors group">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-lg
                                            ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-white ring-2 ring-yellow-500/30' :
                                                index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white ring-2 ring-slate-400/30' :
                                                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-amber-700 text-white ring-2 ring-orange-500/30' :
                                                        'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium group-hover:text-purple-400 transition-colors">{user.username || 'Unknown'}</div>
                                            <div className="text-slate-500 text-xs">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-700">
                                        {user.total_orders} đơn
                                    </span>
                                </td>
                                <td className="py-4 px-6 font-bold text-emerald-400">{formatVND(user.total_spent)}</td>
                                <td className="py-4 px-6 font-bold text-purple-400">{formatVND(user.total_profit)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// Total Card (Row 1)
function TotalCard({ icon: Icon, label, value, color }) {
    return (
        <div className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Icon className="w-16 h-16" />
            </div>
            <div className="relative z-10 flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium opacity-90">{label}</span>
            </div>
            <p className="relative z-10 text-2xl font-bold tracking-tight">{value}</p>
        </div>
    )
}

// Period Card (Row 2 - Ngày/Tuần/Tháng)
function PeriodCard({ title, revenue, spending, profit, formatVND }) {
    return (
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 hover:bg-slate-800/50 transition-colors backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center justify-between">
                {title}
                <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700">Thống kê</span>
            </h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center group">
                    <span className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">Doanh thu</span>
                    <span className="text-emerald-400 font-bold group-hover:text-emerald-300 transition-colors">{formatVND(revenue)}</span>
                </div>
                {/* Visual Bar */}
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }}></div>
                </div>

                <div className="flex justify-between items-center group">
                    <span className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">Chi phí</span>
                    <span className="text-blue-400 font-bold group-hover:text-blue-300 transition-colors">{formatVND(spending)}</span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-700">
                    <span className="text-slate-300 text-sm font-medium">Lợi nhuận</span>
                    <span className="text-purple-400 font-bold text-lg">{formatVND(profit)}</span>
                </div>
            </div>
        </div>
    )
}

// -------------------------------------------------------------
// PREMIUM BAR CHART COMPONENT
// -------------------------------------------------------------
function SimpleBarChart({ data }) {
    const [selectedIndex, setSelectedIndex] = useState(null)

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <div className="bg-slate-800/50 p-4 rounded-full mb-4">
                    <span className="text-4xl">📊</span>
                </div>
                <p>Chưa có dữ liệu thống kê</p>
            </div>
        )
    }

    // Sort data by date
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date))

    useEffect(() => {
        if (data && data.length > 0 && selectedIndex === null) {
            setSelectedIndex(data.length - 1)
        }
    }, [data])

    // Find max value for scaling
    const maxValue = Math.max(...sortedData.flatMap(d => [d.revenue || 0, d.spending || 0, Math.abs(d.profit) || 0]), 1)

    const formatVND = (amount) => {
        if (Math.abs(amount) >= 1000000000) return (amount / 1000000000).toFixed(1) + 'B'
        if (Math.abs(amount) >= 1000000) return (amount / 1000000).toFixed(1) + 'M'
        if (Math.abs(amount) >= 1000) return (amount / 1000).toFixed(0) + 'K'
        return new Intl.NumberFormat('vi-VN').format(amount || 0)
    }

    const selectedData = selectedIndex !== null ? sortedData[selectedIndex] : null

    return (
        <div className="space-y-6">
            {/* Selected Date Detail Card */}
            <div className={`transition-all duration-500 transform ${selectedData ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 h-0 overflow-hidden'}`}>
                {selectedData && (
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-1 shadow-2xl relative overflow-hidden group">

                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors duration-500"></div>

                        <div className="relative p-5 flex flex-col md:flex-row items-center justify-between gap-6">

                            {/* Date Display */}
                            <div className="flex items-center gap-4 min-w-[200px]">
                                <div className="bg-slate-700/50 p-3 rounded-xl border border-slate-600/50 text-center min-w-[60px]">
                                    <div className="text-xs text-slate-400 uppercase tracking-wide">Tháng {new Date(selectedData.date).getMonth() + 1}</div>
                                    <div className="text-2xl font-bold text-white">{new Date(selectedData.date).getDate()}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-400">Thống kê ngày</div>
                                    <div className="text-lg font-semibold text-white capitalize">
                                        {new Date(selectedData.date).toLocaleDateString('vi-VN', { weekday: 'long' })}
                                    </div>
                                </div>
                            </div>

                            {/* Metrics Grid */}
                            <div className="flex-1 w-full grid grid-cols-3 gap-1 md:gap-4 divide-x divide-slate-700/50">
                                <div className="px-2 md:px-4 text-center">
                                    <div className="text-xs text-emerald-400 mb-1 font-medium tracking-wide">DOANH THU</div>
                                    <div className="text-lg md:text-xl font-bold text-white">{formatVND(selectedData.revenue)}</div>
                                </div>
                                <div className="px-2 md:px-4 text-center">
                                    <div className="text-xs text-blue-400 mb-1 font-medium tracking-wide">CHI PHÍ</div>
                                    <div className="text-lg md:text-xl font-bold text-white">{formatVND(selectedData.spending)}</div>
                                </div>
                                <div className="px-2 md:px-4 text-center">
                                    <div className={`text-xs mb-1 font-medium tracking-wide ${selectedData.profit >= 0 ? 'text-purple-400' : 'text-red-400'}`}>LỢI NHUẬN</div>
                                    <div className={`text-lg md:text-xl font-bold ${selectedData.profit >= 0 ? 'text-purple-300' : 'text-red-300'}`}>
                                        {selectedData.profit > 0 ? '+' : ''}{formatVND(selectedData.profit)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bar Chart Visualization */}
            <div className="h-64 flex items-end justify-between gap-1 md:gap-2 pb-2 pl-2 overflow-x-auto relative">
                {/* Y-Axis Lines (Background) */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0 opacity-10">
                    <div className="w-full border-t border-white"></div>
                    <div className="w-full border-t border-white"></div>
                    <div className="w-full border-t border-white"></div>
                    <div className="w-full border-t border-white"></div>
                </div>

                {sortedData.map((item, index) => {
                    const revenueHeight = ((item.revenue || 0) / maxValue) * 100
                    const spendingHeight = ((item.spending || 0) / maxValue) * 100
                    const profitHeight = (Math.abs(item.profit || 0) / maxValue) * 100
                    const date = new Date(item.date)
                    const isSelected = selectedIndex === index

                    return (
                        <div
                            key={index}
                            className={`group flex flex-col items-center justify-end h-full flex-1 min-w-[20px] cursor-pointer transition-all duration-300 z-10 ${isSelected ? 'scale-105 mx-1' : 'hover:scale-105'}`}
                            onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
                        >
                            {/* Bars Container */}
                            <div className="w-full flex items-end justify-center gap-[1px] md:gap-[2px] h-[85%] relative">

                                {/* Revenue Bar */}
                                <div
                                    className={`w-1.5 md:w-3 rounded-t-sm transition-all duration-500 ease-out relative group-hover:shadow-[0_0_10px_rgba(16,185,129,0.5)] ${isSelected ? 'bg-gradient-to-t from-emerald-700 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.6)]' : 'bg-emerald-600/60 hover:bg-emerald-500'}`}
                                    style={{ height: `${Math.max(revenueHeight, 5)}%` }}
                                ></div>

                                {/* Spending Bar */}
                                <div
                                    className={`w-1.5 md:w-3 rounded-t-sm transition-all duration-500 ease-out relative group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] ${isSelected ? 'bg-gradient-to-t from-blue-700 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-blue-600/60 hover:bg-blue-500'}`}
                                    style={{ height: `${Math.max(spendingHeight, 5)}%` }}
                                ></div>

                                {/* Profit Bar */}
                                <div
                                    className={`w-1.5 md:w-3 rounded-t-sm transition-all duration-500 ease-out relative
                                        ${item.profit >= 0
                                            ? (isSelected ? 'bg-gradient-to-t from-purple-700 to-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.6)]' : 'bg-purple-600/60 hover:bg-purple-500 group-hover:shadow-[0_0_10px_rgba(147,51,234,0.5)]')
                                            : (isSelected ? 'bg-gradient-to-t from-red-700 to-red-400 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-red-600/60 hover:bg-red-500 group-hover:shadow-[0_0_10px_rgba(239,68,68,0.5)]')
                                        }`}
                                    style={{ height: `${Math.max(profitHeight, 5)}%` }}
                                ></div>

                                {/* Tooltip (Only on hover, not selected) */}
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center bg-slate-900 border border-slate-700 rounded-lg p-2 z-50 pointer-events-none shadow-xl min-w-[100px] opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] text-slate-400">{date.getDate()}/{date.getMonth() + 1}</span>
                                    <span className="text-xs font-bold text-white">{formatVND(item.revenue)}</span>
                                </div>
                            </div>

                            {/* Date Label */}
                            <div className={`mt-2 text-[9px] md:text-[10px] font-medium transition-colors ${isSelected ? 'text-white bg-slate-700/80 px-1.5 py-0.5 rounded-md' : 'text-slate-500'}`}>
                                {date.getDate()}/{date.getMonth() + 1}
                            </div>

                            {/* Selection indicator line */}
                            {isSelected && <div className="w-1 h-1 bg-white rounded-full mt-1"></div>}
                        </div>
                    )
                })}
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 px-2 mt-4 pt-4 border-t border-slate-800">
                <span>Dữ liệu 30 ngày gần nhất</span>
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-600 animate-pulse"></span>
                    Cập nhật tự động
                </span>
            </div>
        </div>
    )
}
