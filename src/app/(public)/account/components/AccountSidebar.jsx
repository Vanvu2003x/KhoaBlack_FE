"use client";

import { FaUser, FaHistory, FaGamepad, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";

export default function AccountSidebar({ activeTab, setActiveTab }) {
    const mainMenu = [
        { id: "overview", label: "Tổng quan", icon: <FaUser /> },
        { id: "wallet-history", label: "Lịch sử nạp ví", icon: <FaHistory /> },
        { id: "order-history", label: "Lịch sử nạp game", icon: <FaGamepad /> },
        { id: "acc-history", label: "Lịch sử mua acc", icon: <FaShoppingCart /> },
    ];

    return (
        <div className="w-full lg:w-64 flex-shrink-0 bg-[#1E293B]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-2 lg:p-4 h-fit sticky top-4 z-10">
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide -mx-2 px-2 lg:mx-0 lg:px-0">
                {mainMenu.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 text-sm lg:text-base
                            ${isActive
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 px-4"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white bg-transparent"
                                }`}
                        >
                            <span className="text-xl lg:text-lg">{item.icon}</span>
                            <span className={`${isActive ? "block" : "hidden"} lg:block`}>{item.label}</span>
                        </button>
                    );
                })}

                {/* Mobile Logout Button (Integrated into scroll) */}
                <button className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all whitespace-nowrap flex-shrink-0 text-sm bg-red-500/5 border border-red-500/10">
                    <FaSignOutAlt />
                    <span>Đăng xuất</span>
                </button>
            </div>

            <div className="hidden lg:block my-4 border-t border-white/5 mx-2"></div>

            <button className="hidden lg:flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
                <FaSignOutAlt />
                <span>Đăng xuất</span>
            </button>
        </div>
    );
}
