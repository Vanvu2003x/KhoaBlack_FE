import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FiZap } from "react-icons/fi";

const baseURLAPI = process.env.NEXT_PUBLIC_API_URL;

export default function PackageGrid({
    loading,
    displayPackages,
    selectedPkg,
    setSelectedPkg,
    userLevel = 1
}) {
    const calculatePrice = (pkg, level) => {
        if (!level || level === 1) return pkg.price;
        if (level === 2) return pkg.price_pro || pkg.price; // Pro
        if (level === 3) return pkg.price_plus || pkg.price; // Plus/VIP
        return pkg.price;
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {loading
                ? [...Array(6)].map((_, i) => (
                    <Skeleton
                        key={i}
                        height={180}
                        className="rounded-2xl"
                        baseColor="#1E293B"
                        highlightColor="#334155"
                    />
                ))
                : displayPackages.map((pkg) => {
                    const isSelected = selectedPkg?.id === pkg.id;
                    const isHot = pkg.sale; // Determine if it's a HOT package

                    const finalPrice = calculatePrice(pkg, userLevel);
                    const originalPrice = pkg.price; // For reference if needed

                    return (
                        <div
                            key={pkg.id}
                            onClick={() => setSelectedPkg({ ...pkg, price: finalPrice })}
                            className={`
                                relative cursor-pointer group transition-all duration-300 drop-shadow-xl
                                ${isSelected ? "scale-[1.05] z-10" : "hover:-translate-y-1"}
                            `}
                        >
                            {/* HEXAGON CLIP-PATH CONTAINER */}
                            <div
                                className={`
                                    relative w-full h-full p-[2px] transition-all duration-300 min-h-[230px]
                                    ${isSelected
                                        ? "bg-gradient-to-b from-cyan-400 via-blue-500 to-cyan-400 z-20"
                                        : isHot
                                            ? "bg-gradient-to-b from-red-900/80 via-rose-900/40 to-red-900/80 group-hover:from-red-500 group-hover:via-rose-500 group-hover:to-red-500" // Reddish for HOT
                                            : "bg-gradient-to-b from-cyan-900 via-slate-800 to-cyan-900 group-hover:from-cyan-400 group-hover:via-cyan-300 group-hover:to-cyan-400"
                                    }
                                    ${isHot && !isSelected
                                        ? "shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                                        : ""
                                    } 
                                `}
                                style={{
                                    clipPath:
                                        "polygon(50% 0, 100% 15%, 100% 85%, 50% 100%, 0 85%, 0 15%)",
                                }}
                            >
                                {/* Inner Content Container */}
                                <div
                                    className={`
                                        w-full h-full flex flex-col items-center justify-between relative z-10 p-3 py-6 overflow-hidden
                                        ${isSelected
                                            ? "bg-[#05111a]"
                                            : isHot
                                                ? "bg-[#1a0505] group-hover:bg-[#2a0a0a]" // Dark red/brown internal bg for HOT
                                                : "bg-[#0b1120] group-hover:bg-[#08101f]"
                                        }
                                    `}
                                    style={{
                                        clipPath:
                                            "polygon(50% 0, 100% 15%, 100% 85%, 50% 100%, 0 85%, 0 15%)",
                                    }}
                                >
                                    {/* Background Effects */}
                                    <div
                                        className={`absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b ${isHot
                                            ? "from-red-500/10"
                                            : "from-cyan-400/10"
                                            } to-transparent pointer-events-none`}
                                    ></div>
                                    <div
                                        className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t ${isHot
                                            ? "from-rose-600/10"
                                            : "from-blue-600/10"
                                            } to-transparent pointer-events-none`}
                                    ></div>

                                    {/* Harmonious HOT Tag (Artistic Tilt) */}
                                    {pkg.sale && (
                                        <div className="absolute top-8 left-[60%] -translate-x-1/2 z-30 rotate-12 group-hover:rotate-0 transition-transform duration-300">
                                            <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-[9px] font-black px-2 py-0.5 rounded-sm shadow-[2px_2px_5px_rgba(0,0,0,0.5)] border border-white/20 flex items-center gap-0.5">
                                                HOT{" "}
                                                <FiZap
                                                    size={8}
                                                    className="text-yellow-300 fill-yellow-300"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* ID Server Indicator */}
                                    {pkg.id_server && (
                                        <div className="absolute top-2 right-2 z-40">
                                            <div
                                                className={`
                                            text-[8px] font-bold px-1.5 py-0.5 rounded border 
                                            ${isHot
                                                        ? "bg-red-900/50 border-red-500/30 text-red-200"
                                                        : "bg-cyan-900/50 border-cyan-500/30 text-cyan-200"
                                                    }
                                        `}
                                            >
                                                ID
                                            </div>
                                        </div>
                                    )}

                                    {/* 1. Image Area (Upper Mid) */}
                                    <div className="w-full relative flex justify-center py-2 z-10">
                                        <div
                                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 blur-xl rounded-full ${isHot
                                                ? "bg-red-500/10"
                                                : "bg-cyan-400/20"
                                                }`}
                                        ></div>
                                        <div className="w-16 h-16 relative drop-shadow-[0_0_10px_rgba(34,211,238,0.6)] transition-transform duration-300 group-hover:scale-110">
                                            <img
                                                src={baseURLAPI + pkg.thumbnail}
                                                alt={pkg.package_name}
                                                className="w-full h-full object-contain"
                                                onError={(e) =>
                                                    (e.target.src = "/placeholder.png")
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* 2. Text Content (Lower Mid) */}
                                    <div className="w-full text-center relative z-10 mt-auto space-y-2">
                                        <h3
                                            className={`text-xs font-bold uppercase tracking-wider drop-shadow-md line-clamp-2 min-h-[2.5em] flex items-center justify-center leading-tight px-1 ${isHot
                                                ? "text-rose-100"
                                                : "text-cyan-100"
                                                }`}
                                        >
                                            {pkg.package_name}
                                        </h3>

                                        <div
                                            className={`w-1/2 mx-auto h-[1px] bg-gradient-to-r from-transparent ${isHot
                                                ? "via-red-500/50"
                                                : "via-cyan-500/50"
                                                } to-transparent my-1`}
                                        ></div>

                                        <div className="relative pb-1">
                                            {/* Original Price (Strikethrough) if discounted */}
                                            {pkg.sale && pkg.origin_price > finalPrice && (
                                                <span className="text-[10px] text-slate-400 line-through absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pkg.origin_price)}
                                                </span>
                                            )}
                                            <p className={`text-sm md:text-base font-bold ${isHot ? "text-yellow-400" : "text-cyan-400"} drop-shadow-md`}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalPrice)}
                                            </p>



                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Selection Check (Center Overlay) */}
                            {isSelected && (
                                <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                                    <div
                                        className="w-full h-full absolute border-2 border-cyan-400/50 animate-pulse"
                                        style={{
                                            clipPath:
                                                "polygon(50% 0, 100% 15%, 100% 85%, 50% 100%, 0 85%, 0 15%)",
                                        }}
                                    ></div>
                                </div>
                            )}

                            {/* Background Glow Effect */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-b from-transparent ${isHot ? "to-red-500/5" : "to-purple-500/5"
                                    } opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-0`}
                            ></div>
                        </div>
                    );
                })}
        </div>
    );
}
