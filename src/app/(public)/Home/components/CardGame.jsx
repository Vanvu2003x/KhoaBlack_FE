"use client";
import { useRouter } from "next/navigation";
import { FaShoppingCart, FaStar, FaGlobe } from "react-icons/fa";

export default function CardGame({ game, type, onClick }) {
    const urlBaseAPI = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    const handlerClick = (game) => {
        if (onClick) {
            onClick(game);
        } else {
            if (type === "ACC") {
                router.push(`/acc/${game.gamecode}`);
            } else {
                router.push(`/categories/topup/${game.gamecode}`);
            }
        }
        // Wait, I need to update the props first.
    };

    // Calculate a mock discount or tag based on ID for demo visuals
    const discount = game.id % 2 === 0 ? "-15%" : null;
    const isNew = game.id % 3 === 0;

    return (
        <div
            onClick={() => handlerClick(game)}
            className="group relative w-full aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-lg shadow-black/50 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-2 border border-white/5 bg-[#1E293B]"
        >
            {/* Background Image */}
            <img
                src={game.thumbnail?.startsWith('http') ? game.thumbnail : urlBaseAPI + game.thumbnail}
                alt={game.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
                {discount && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                        {discount}
                    </span>
                )}
                {isNew && (
                    <span className="bg-cyan-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                        MỚI
                    </span>
                )}
            </div>

            {/* Content (Bottom) */}
            <div className="absolute bottom-0 w-full p-4 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-bold text-lg leading-tight mb-1 drop-shadow-md">
                    {game.name}
                </h3>
                <div className="flex items-center gap-1 text-gray-400 text-xs mb-3 truncate">
                    <FaGlobe className="text-indigo-400" />
                    <span>
                        {type === "ACC" ? "Riot Games" : type === "all" ? (game.publisher || "Nhà phát hành") : "Nạp thẻ chính hãng"}
                    </span>
                </div>

                {/* Action Button (Hidden by default, shows on hover or always visible in mobile?) -> Let's make it subtle */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <button className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-xs font-bold py-2 rounded-lg transition-colors border border-white/10 flex items-center justify-center gap-2">
                        <FaShoppingCart />
                        {type === "ACC" ? "Mua Ngay" : type === "all" ? "Xem Ngay" : "Nạp Ngay"}
                    </button>
                </div>
            </div>

            {/* Hover Glow Effect Border */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/50 rounded-2xl transition-colors pointer-events-none"></div>
        </div>
    );
}
