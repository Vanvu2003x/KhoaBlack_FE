"use client";
import { useEffect, useState } from "react";
import { FaCrown, FaTrophy } from "react-icons/fa";
import { getLeaderboard, getBestSellers } from "@/services/statistics.service";

export default function Sidebar() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Leaderboard
                const lbRes = await getLeaderboard();
                if (lbRes && lbRes.data) setLeaderboard(lbRes.data);

                // Fetch Best Sellers
                const bsRes = await getBestSellers();
                if (bsRes && bsRes.data) setBestSellers(bsRes.data);
            } catch (error) {
                console.error("Sidebar Data Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Refresh every 30 seconds to keep data updated (real-time-ish)
        const interval = setInterval(fetchData, 30000);

        return () => clearInterval(interval);
    }, []);

    // Helper to mask ID
    const maskID = (id) => {
        if (!id) return "***";
        return `ID: ${id.substring(0, 3)}***${id.substring(id.length - 2)}`;
    };

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', '');
    };

    // Default skeletons/empty state if loading
    if (loading) return (
        <aside className="w-full flex flex-col gap-6 animate-pulse">
            <div className="bg-[#1E293B] h-64 rounded-3xl"></div>
            <div className="bg-[#1E293B] h-64 rounded-3xl"></div>
        </aside>
    );

    return (
        <aside className="w-full flex flex-col gap-6">

            {/* Leaderboard Card */}
            <div className="bg-[#1E293B] rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <FaTrophy className="text-9xl text-yellow-500" />
                </div>

                <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2 box-border border-l-4 border-yellow-500 pl-3">
                    <span className="text-yellow-400"><FaCrown /></span> BẢNG PHONG THẦN
                </h3>

                <div className="space-y-4 relative">
                    {leaderboard.length > 0 ? leaderboard.map((user, index) => {
                        let rowStyle = "bg-white/5 border-white/5 hover:bg-white/10";
                        let rankColor = "bg-white/10 text-gray-400";

                        if (index === 0) {
                            rowStyle = "bg-gradient-to-r from-yellow-500/20 to-yellow-900/10 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]";
                            rankColor = "bg-gradient-to-br from-yellow-300 to-yellow-600 text-white shadow-lg shadow-yellow-500/20";
                        } else if (index === 1) {
                            rowStyle = "bg-gradient-to-r from-slate-400/20 to-slate-600/10 border-slate-400/50";
                            rankColor = "bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-lg shadow-slate-500/20";
                        } else if (index === 2) {
                            rowStyle = "bg-gradient-to-r from-orange-500/20 to-orange-700/10 border-orange-500/50";
                            rankColor = "bg-gradient-to-br from-orange-300 to-orange-600 text-white shadow-lg shadow-orange-500/20";
                        }

                        return (
                            <div key={user.id} className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 group ${rowStyle}`}>
                                <div className="flex items-center gap-3">
                                    {/* Rank Icon */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${rankColor}`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className={`font-bold text-sm truncate transition-colors ${index < 3 ? 'text-white' : 'text-slate-200 group-hover:text-indigo-400'}`}>
                                            {user.name}
                                        </span>
                                        <span className="text-xs text-slate-500">{maskID(user.id)}</span>
                                    </div>
                                </div>
                                <span className={`font-bold text-xs sm:text-sm whitespace-nowrap ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-orange-400' : 'text-slate-400'}`}>
                                    {formatCurrency(user.total_amount)}
                                </span>
                            </div>
                        );
                    }) : (
                        <div className="text-center text-gray-500 py-4 text-sm">Chưa có dữ liệu</div>
                    )}
                </div>
            </div>

            {/* Best Sellers */}
            <div className="bg-[#1E293B] rounded-3xl p-6 border border-white/5 shadow-xl">
                <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2 box-border border-l-4 border-purple-500 pl-3">
                    GÓI BÁN CHẠY
                </h3>
                <div className="space-y-3">
                    {bestSellers.length > 0 ? bestSellers.map((pack, idx) => (
                        <div key={idx} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/5 rounded-xl px-2 -mx-2 transition-all cursor-pointer group">
                            <div className="flex items-center gap-4">
                                {/* Package Image */}
                                <div className="w-10 h-10 rounded-lg bg-[#0F172A] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-purple-500/50 transition-colors">
                                    {(pack.thumbnail || pack.game_image) ? (
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL}${pack.thumbnail || pack.game_image}`}
                                            alt={pack.package_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xl">💎</span>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-sm group-hover:text-purple-400 transition-colors line-clamp-1">{pack.package_name}</span>
                                    <span className="text-xs text-gray-500 font-medium">{pack.game_name || "Game"}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end pl-2">
                                <span className="font-bold text-white text-sm whitespace-nowrap">{formatCurrency(pack.price)}</span>
                                <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full mt-1">Đã bán: {pack.sold_count}</span>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center text-gray-500 py-4 text-sm">Chưa có dữ liệu</div>
                    )}
                </div>
            </div>

            {/* Support CTA (Static) */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-center shadow-lg shadow-indigo-500/20">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl backdrop-blur-sm">
                    🎧
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Cần hỗ trợ?</h3>
                <p className="text-indigo-100 text-xs mb-6 px-4">Đội ngũ hỗ trợ trực tuyến 24/7 sẵn sàng giúp đỡ bạn.</p>
                <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-full hover:bg-gray-100 transition-colors text-sm">
                    Liên hệ hỗ trợ
                </button>
            </div>

        </aside>
    );
}
