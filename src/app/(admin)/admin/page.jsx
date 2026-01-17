"use client";
import { useEffect, useState } from "react";
import { FiUsers, FiShoppingCart, FiDollarSign, FiCreditCard } from "react-icons/fi";
import { getCostSummary, getOrderSummary3 } from "@/services/order.service"; // Ensure these exist or mock them
// NOTE: I will mock stats for now as I don't want to overcomplicate the dashboard logic in this step, 
// but will try to fetch if services available.
// getCostSummary was in OrderService (step 392).

export default function AdPanel() {
    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 md:p-12 shadow-2xl shadow-indigo-500/20">
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                        Xin chào, Admin 👋
                    </h1>
                    <p className="text-indigo-100 text-lg max-w-2xl">
                        Chào mừng bạn quay trở lại. Dưới đây là tổng quan về hoạt động của hệ thống ngày hôm nay.
                    </p>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-black/10 rounded-full blur-2xl"></div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng Doanh Thu"
                    value="-- ₫"
                    icon={FiDollarSign}
                    color="emerald"
                    trend="+12% so với tháng trước"
                />
                <StatCard
                    title="Đơn Hàng Mới"
                    value="--"
                    icon={FiShoppingCart}
                    color="blue"
                    trend="5 đơn chờ xử lý"
                />
                <StatCard
                    title="Khách Hàng Mới"
                    value="--"
                    icon={FiUsers}
                    color="purple"
                    trend="+28 người tuần này"
                />
                <StatCard
                    title="Nạp Ví Hôm Nay"
                    value="-- ₫"
                    icon={FiCreditCard}
                    color="orange"
                    trend="Cập nhật 5p trước"
                />
            </div>

            {/* Recent Activity Section Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#1E293B]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 rounded-full bg-cyan-500"></span>
                        Biểu đồ Doanh thu
                    </h3>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/20">
                        <span className="text-slate-500 font-medium">Coming Soon: Revenue Chart Implementation</span>
                    </div>
                </div>

                <div className="bg-[#1E293B]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 rounded-full bg-pink-500"></span>
                        Hoạt động gần đây
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                                    <FiUsers />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-200">User #{1000 + i} vừa đăng ký</p>
                                    <p className="text-xs text-slate-500">2 phút trước</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, trend }) {
    const colorStyles = {
        emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    };

    return (
        <div className="bg-[#1E293B]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${colorStyles[color]} transition-colors`}>
                    <Icon size={24} />
                </div>
                {/* Optional Badge */}
            </div>
            <div>
                <p className="text-slate-400 font-medium text-sm mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-white mb-2 font-mono">{value}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                    {trend}
                </p>
            </div>
        </div>
    );
}
