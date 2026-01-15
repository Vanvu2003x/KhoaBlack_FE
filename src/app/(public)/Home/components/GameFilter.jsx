"use client";

import { FaSearch, FaGamepad, FaKey, FaIdCard, FaShoppingCart } from "react-icons/fa";

export const FILTERS = [
    { label: "Tất cả", value: "all", icon: <FaGamepad /> },
    { label: "Mua Nick Game", value: "ACC", icon: <FaShoppingCart /> },
    { label: "Nạp Game (Login)", value: "LOG", icon: <FaKey /> },
    { label: "Nạp Game (UID)", value: "UID", icon: <FaIdCard /> },
];

export default function GameFilter({ activeFilter, setActiveFilter, searchTerm, setSearchTerm }) {
    return (
        <div className="bg-[#1E293B] p-2 rounded-2xl flex flex-col md:flex-row gap-4 mb-8 border border-white/5 shadow-lg">
            {/* Search */}
            <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                    type="text"
                    className="w-full bg-[#0F172A] text-white pl-10 pr-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-gray-500 transition-all font-medium"
                    placeholder="Tìm game, vật phẩm, ID người dùng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-[#0F172A] p-1 rounded-xl overflow-x-auto no-scrollbar border border-white/5">
                {FILTERS.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => {
                            setActiveFilter(filter.value);
                            setSearchTerm(""); // Reset search when changing filter
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all
                            ${activeFilter === filter.value
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/50"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        {filter.icon}
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
