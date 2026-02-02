"use client";
import React from "react";

const banners = [
    "/banner/Avt.png",
    "/banner/IMG_9414.JPG",
];

export default function HeroSection() {
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-auto rounded-2xl md:rounded-3xl overflow-hidden group shadow-2xl shadow-indigo-500/10 border border-white/5">
            {/* Background Image - Carousel */}
            {banners.map((src, idx) => (
                <div
                    key={idx}
                    className={`transition-opacity duration-1000 ${idx === current ? "relative block opacity-100 z-10" : "absolute inset-0 opacity-0 z-0"
                        }`}
                >
                    <img
                        src={src}
                        alt={`KhoaBlack Topup Banner ${idx + 1}`}
                        className="w-full h-auto block"
                    />
                </div>
            ))}

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/10 to-transparent pointer-events-none"></div>

            {/* Dots */}
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-8 flex gap-2 z-10">
                {banners.map((_, idx) => (
                    <div
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all cursor-pointer hover:scale-125 shadow-glow ${idx === current ? "bg-white scale-125" : "bg-white/30 hover:bg-white/50"
                            }`}
                    ></div>
                ))}
            </div>
        </div>
    );
}
