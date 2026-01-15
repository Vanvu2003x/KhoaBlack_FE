"use client";

import { useEffect, useState } from "react";
import HeroSection from "./HeroSection";
import Sidebar from "./Sidebar";
import CardGame from "./CardGame";
import GameFilter, { FILTERS } from "./GameFilter";
import GameListSkeleton from "./GameListSkeleton";
import { getGames, getGamesByType } from "@/services/games.service";
import { FaFire } from "react-icons/fa";

import GameSelectionModal from "./GameSelectionModal";

export default function HomeClient({ initialGames }) {
    // Nếu có initialGames (SSR) thì dùng luôn, nếu không thì rỗng
    const [allGames, setAllGames] = useState(initialGames || []);
    const [listGames, setListGames] = useState(initialGames || []);
    const [loading, setLoading] = useState(!initialGames); // Loading if no initial data
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGame, setSelectedGame] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch data when filter changes (client-side navigation)
    const fetchData = async (filter) => {
        setLoading(true);
        try {
            let data;
            if (filter !== "all") {
                data = await getGamesByType(filter);
            } else {
                data = await getGames();
            }
            const validData = Array.isArray(data) ? data : [];
            setAllGames(validData);
            setListGames(validData);
        } catch (error) {
            console.error("Lỗi lấy danh sách game:", error);
            setAllGames([]);
            setListGames([]);
        } finally {
            setLoading(false);
        }
    };

    // Effect for filtering change
    useEffect(() => {
        // Nếu là lần đầu load và đã có initialGames thì skip fetch
        // Logic này có thể cải thiện sau, tạm thời fetch lại khi đổi tab
        if (activeFilter !== "all" || !initialGames) {
            fetchData(activeFilter);
        } else if (activeFilter === "all" && initialGames) {
            // Reset về initial nếu quay lại tab All (optional optimization)
            fetchData("all");
        }
    }, [activeFilter]);

    // Effect for Client-side Search
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setListGames(allGames);
        } else {
            const filtered = allGames.filter((game) =>
                game.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setListGames(filtered);
        }
    }, [searchTerm, allGames]);

    const handleGameClick = (game) => {
        if (activeFilter === "all") {
            setSelectedGame(game);
            setIsModalOpen(true);
        } else {
            // If strictly filtered, we can let default router work OR explicit routing
            // But since CardGame now prioritizes onClick, we need to handle it or pass null
            // Actually, if we pass onClick={activeFilter === 'all' ? handleGameClick : undefined}, 
            // then CardGame will fallback to default logic when filter is NOT 'all'.
        }
    };

    return (
        <section className="min-h-screen bg-[#0F172A] px-4 sm:px-6 md:px-8 lg:px-12 py-8 text-white bg-[url('/bg-grid.svg')] bg-fixed">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT COLUMN: Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Hero */}
                        <div className="mb-10">
                            <HeroSection />
                        </div>

                        {/* Filter & Search */}
                        <GameFilter
                            activeFilter={activeFilter}
                            setActiveFilter={setActiveFilter}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />

                        {/* Game Grid */}
                        <div className="mb-10 min-h-[400px]">
                            {/* ... Header ... */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-500 text-xl"><FaFire /></span>
                                    <h2 className="text-xl font-bold uppercase tracking-wider text-white">
                                        {activeFilter === 'all'
                                            ? "Game Hot"
                                            : FILTERS.find(f => f.value === activeFilter)?.label || activeFilter}
                                    </h2>
                                </div>
                                <a href="#" className="text-indigo-400 text-sm font-bold hover:text-white transition-colors">Xem tất cả →</a>
                            </div>

                            {loading ? (
                                <GameListSkeleton />
                            ) : listGames.length === 0 ? (
                                <div className="p-10 bg-[#1E293B] rounded-2xl text-center border border-white/5 text-gray-400 animate-fadeIn">
                                    Không tìm thấy game nào phù hợp.
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-fadeIn">
                                    {listGames.map((game) => (
                                        <CardGame
                                            key={game.id}
                                            game={game}
                                            type={activeFilter}
                                            onClick={activeFilter === 'all' ? handleGameClick : undefined}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* New Arrivals Banner */}
                        {/* ... */}

                    </div>

                    {/* RIGHT COLUMN: Sidebar */}
                    <div className="w-full lg:w-[320px] shrink-0">
                        <Sidebar />
                    </div>
                </div>
            </div>

            {/* Selection Modal */}
            <GameSelectionModal
                game={selectedGame}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </section>
    );
}
