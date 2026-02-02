"use client";

import { FaCopy, FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState } from "react";

export default function UserProfileCard({ user, onDeposit }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!user) return null;

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Đã sao chép ID!");
    };

    return (
        <div className="h-full bg-[#1E293B]/50 backdrop-blur-xl rounded-3xl border border-white/5 shadow-xl">
            {/* Mobile: Compact Version - Click to Expand */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full p-4 flex items-center gap-3 text-left"
                >
                    {/* Small Avatar */}
                    <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-b from-cyan-400 to-blue-600">
                            <div className="w-full h-full rounded-full bg-[#0F172A] p-0.5">
                                <img
                                    src="https://tse1.mm.bing.net/th/id/OIP.Fogk0Q6C7GEQEdVyrbV9MwHaHa?rs=1&pid=ImgDetMain"
                                    alt="Avatar"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Name + Role */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-white truncate">{user.name}</h2>
                        <span className="text-xs text-slate-400">{user.email}</span>
                    </div>

                    {/* Expand Icon */}
                    <FaChevronDown className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Expanded Details (Mobile) */}
                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-4">
                        {/* UID Row */}
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">UID</span>
                            <div
                                className="flex items-center justify-between bg-[#0F172A] border border-white/5 rounded-lg px-3 py-2 cursor-pointer hover:border-white/10 transition-colors"
                                onClick={() => copyToClipboard(user.id)}
                            >
                                <span className="font-mono text-slate-300 text-xs">{user.id}</span>
                                <FaCopy className="text-slate-600 hover:text-white transition-colors text-xs" />
                            </div>
                        </div>

                        {/* Role */}
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vai trò</span>
                            <span className="inline-block bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                                {user.role}
                            </span>
                        </div>

                        {/* Join Date */}
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tham gia</span>
                            <div className="flex items-center gap-2 text-slate-300 text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                <span>{new Date(user.created_at || Date.now()).toLocaleDateString('vi-VN')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop: Full Version (Always Visible) */}
            <div className="hidden md:flex items-center p-8">
                <div className="flex flex-col md:flex-row items-center gap-10 w-full">
                    {/* Avatar Section */}
                    <div className="relative flex-shrink-0">
                        <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-b from-cyan-400 to-blue-600">
                            <div className="w-full h-full rounded-full bg-[#0F172A] p-1">
                                <img
                                    src="https://tse1.mm.bing.net/th/id/OIP.Fogk0Q6C7GEQEdVyrbV9MwHaHa?rs=1&pid=ImgDetMain"
                                    alt="Avatar"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 w-full space-y-6">
                        <div className="flex items-center gap-4 justify-center md:justify-start">
                            <h2 className="text-4xl font-bold text-white tracking-tight">{user.name}</h2>
                            <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">
                                {user.role}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {/* UID Row */}
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest w-20">UID</span>
                                <div
                                    className="flex-1 flex items-center justify-between bg-[#0F172A] border border-white/5 rounded-lg px-4 py-3 cursor-pointer hover:border-white/10 transition-colors group/copy"
                                    onClick={() => copyToClipboard(user.id)}
                                >
                                    <span className="font-mono text-slate-300 text-sm">{user.id}</span>
                                    <FaCopy className="text-slate-600 group-hover/copy:text-white transition-colors" />
                                </div>
                            </div>

                            {/* Email Row */}
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest w-20">Email</span>
                                <span className="text-slate-300 font-medium">{user.email}</span>
                            </div>

                            {/* Join Date Row */}
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest w-20">Tham gia</span>
                                <div className="flex items-center gap-2 text-slate-300 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                    <span>{new Date(user.created_at || Date.now()).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
