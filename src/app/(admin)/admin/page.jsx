"use client"
import Link from "next/link"
import { FiDollarSign, FiArrowRight } from "react-icons/fi"

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <h1 className="text-2xl font-bold text-white">📊 Trang Quản Trị</h1>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/admin/danhmuc/RevenueManagerPage">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FiDollarSign className="w-8 h-8 opacity-80" />
                                <div>
                                    <h2 className="text-lg font-semibold">Báo Cáo Doanh Thu</h2>
                                    <p className="text-sm opacity-80">Xem thống kê doanh thu, chi phí và lợi nhuận</p>
                                </div>
                            </div>
                            <FiArrowRight className="w-6 h-6 opacity-80" />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Welcome Message */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-2">👋 Chào mừng bạn!</h2>
                <p className="text-slate-400">
                    Sử dụng menu bên trái để điều hướng đến các chức năng quản trị khác nhau.
                </p>
            </div>
        </div>
    )
}

