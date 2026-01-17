"use client";

import Link from "next/link";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            <div className="flex flex-col items-center text-center space-y-8 z-10 animate-[fadeIn_0.5s_ease-out]">
                {/* 404 Number */}
                <div className="relative">
                    <h1 className="text-[150px] sm:text-[200px] font-black leading-none bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent opacity-90 select-none drop-shadow-2xl">
                        404
                    </h1>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent blur-2xl opacity-50 -z-10">
                        404
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-4 max-w-lg mx-auto">
                    <div className="flex items-center justify-center gap-3 text-yellow-400 text-2xl font-bold uppercase tracking-wider">
                        <FaExclamationTriangle className="animate-pulse" />
                        <span>Trang không tồn tại</span>
                    </div>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Oops! Có vẻ như bạn đang lạc vào một vùng không gian chưa được khai phá. Đường dẫn này không tồn tại hoặc đã bị xóa.
                    </p>
                </div>

                {/* Action Button */}
                <Link
                    href="/"
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-indigo-500/20"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <FaHome className="text-indigo-400 text-xl group-hover:text-white transition-colors" />
                    <span className="text-white font-bold tracking-wide group-hover:text-white/90">
                        Trở về trang chủ
                    </span>
                </Link>
            </div>

            {/* Footer decoration */}
            <div className="absolute bottom-8 text-slate-600 text-sm font-mono tracking-widest opacity-50">
                ERROR CODE: 404_NOT_FOUND
            </div>
        </div>
    );
}
