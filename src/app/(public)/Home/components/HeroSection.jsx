"use client";
import React from "react";

export default function HeroSection() {
    return (
        <div className="relative w-full h-auto rounded-2xl md:rounded-3xl overflow-hidden group shadow-2xl shadow-indigo-500/10 border border-white/5">
            {/* Background Image - Natural Height */}
            <img
                src="/banner/Avt.png"
                alt="KhoaBlack Topup Banner"
                className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
            />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/10 to-transparent pointer-events-none"></div>

            {/* Dots */}
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-8 flex gap-2 z-10">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white transition-all cursor-pointer hover:scale-125 shadow-glow"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white/30 transition-all cursor-pointer hover:bg-white/50 hover:scale-125"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white/30 transition-all cursor-pointer hover:bg-white/50 hover:scale-125"></div>
            </div>
        </div>
    );

}
