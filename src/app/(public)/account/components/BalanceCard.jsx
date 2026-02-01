"use client";

import { useRouter } from "next/navigation";
import { FaWallet, FaPlusCircle, FaChevronDown } from "react-icons/fa";
import { useState } from "react";

export default function BalanceCard({ balance, userLevel, onDeposit }) {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);

    // Helper function to get member level label and color
    const getMemberLabel = (level) => {
        switch (level) {
            case 1:
                return { label: "Basic Member", color: "text-slate-200" };
            case 2:
                return { label: "Pro Member", color: "text-blue-200" };
            case 3:
                return { label: "VIP Member", color: "text-amber-200" };
            default:
                return { label: "Member", color: "text-indigo-200" };
        }
    };

    const memberInfo = getMemberLabel(userLevel);

    return (
        <div className="h-full bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl text-white relative overflow-hidden shadow-2xl">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 blur-[40px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>

            {/* Mobile: Compact Version - Click to Expand */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full p-4 text-left relative z-10"
                >
                    <div className="flex items-center gap-3">
                        {/* Wallet Icon */}
                        <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm flex-shrink-0">
                            <FaWallet className="text-xl text-white" />
                        </div>

                        {/* Balance */}
                        <div className="flex-1 min-w-0">
                            <p className="text-indigo-200 text-[10px] font-semibold uppercase tracking-wider mb-0.5">Số dư</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold font-mono tracking-tight truncate">
                                    {balance?.toLocaleString() || 0}
                                </span>
                                <span className="text-xs text-indigo-200 font-medium">VNĐ</span>
                            </div>
                        </div>

                        {/* Expand Icon */}
                        <FaChevronDown className={`text-white/70 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                </button>

                {/* Expanded Actions (Mobile) */}
                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-40' : 'max-h-0'}`}>
                    <div className="px-4 pb-4 relative z-10">
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={onDeposit}
                                className="bg-white text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all text-sm"
                            >
                                <FaPlusCircle className="text-xs" />
                                <span>Nạp Ngay</span>
                            </button>
                            <button
                                onClick={() => router.push("/account/lich-su")}
                                className="bg-indigo-800/50 hover:bg-indigo-800/70 border border-white/20 text-indigo-100 py-2 rounded-lg font-medium flex items-center justify-center transition-all backdrop-blur-md text-xs"
                            >
                                <span>Lịch sử</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop: Full Version (Always Visible) */}
            <div className="hidden md:block p-6 relative z-10">
                <div className="flex flex-col justify-between h-full">
                    {/* Card Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-indigo-200 text-sm font-semibold uppercase tracking-wider mb-1">Số dư khả dụng</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold font-mono tracking-tight">
                                    {balance?.toLocaleString() || 0}
                                </span>
                                <span className="text-lg text-indigo-200 font-medium">VNĐ</span>
                            </div>
                        </div>
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                            <FaWallet className="text-2xl text-white" />
                        </div>
                    </div>

                    {/* Middle Chip/Pattern (Optional Bank Card look) */}
                    <div className="my-6 flex items-center gap-4 opacity-80">
                        <div className="w-10 h-8 rounded border border-white/30 bg-gradient-to-br from-yellow-200/50 to-yellow-600/50 backdrop-blur-md flex items-center justify-center">
                            <div className="w-full h-[1px] bg-white/40"></div>
                        </div>
                        <div className={`text-xs ${memberInfo.color} tracking-[0.2em] uppercase`}>{memberInfo.label}</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onDeposit}
                            className="bg-white text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <FaPlusCircle />
                            <span>Nạp Ngay</span>
                        </button>
                        <button
                            onClick={() => router.push("/account/lich-su")}
                            className="bg-indigo-800/50 hover:bg-indigo-800/70 border border-white/20 text-indigo-100 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all backdrop-blur-md"
                        >
                            <span className="text-sm">Biến động số dư</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
