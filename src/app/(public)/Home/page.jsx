"use client";

import CardGame from "@/components/cardgame";
import { getGames, getGamesByType } from "@/services/games.service";
import { useEffect, useState } from "react";

const FILTERS = [
    { label: "Tất cả", value: "all" },
    { label: "Nạp qua UID", value: "UID" },
    { label: "Nạp Login", value: "LOG" },
    { label: "Mua acc", value: "ACC" },
];

export default function HomePage() {
    const [allGames, setAllGames] = useState([]);
    const [listGames, setListGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async (filter) => {
        setLoading(true);
        try {
            let data;
            if (filter !== "all") {
                data = await getGamesByType(filter);
            } else {
                data = await getGames();
            }
            setAllGames(data);
            setListGames(data);
        } catch (error) {
            console.error("Lỗi lấy danh sách game:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(activeFilter);
    }, [activeFilter]);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setListGames(allGames);
        } else {
            setActiveFilter("all");
            const filtered = allGames.filter((game) =>
                game.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setListGames(filtered);
        }
    }, [searchTerm]);

    return (
        <section className="bg-[#F3F4F6] px-4 sm:px-6 md:px-8 lg:px-10 py-6">
            {/* Banner */}
            <div className="w-full h-[180px] sm:h-[240px] md:h-[300px] lg:h-[400px] bg-white mb-6 rounded shadow-md flex items-center overflow-hidden justify-center text-xl font-semibold">
                <img
                    src="https://img.freepik.com/free-vector/gradient-gaming-youtube-channel-art_23-2148878727.jpg?w=2000"
                    alt=""
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    className="w-full p-3 rounded border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên game để tìm kiếm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Filter Buttons */}
            <ul className="flex flex-wrap gap-3 mb-6 font-medium">
                {FILTERS.map((filter) => (
                    <li
                        key={filter.value}
                        onClick={() => {
                            setActiveFilter(filter.value);
                            setSearchTerm("");
                        }}
                        className={`px-4 py-2 cursor-pointer rounded border transition-all duration-200 ${activeFilter === filter.value
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        {filter.label}
                    </li>
                ))}
            </ul>

            {/* Game List */}
            <div>
                {loading ? (
                    <p className="text-center text-gray-500">Đang tải game...</p>
                ) : listGames.length === 0 ? (
                    <p className="p-4 bg-white text-center rounded shadow">
                        Không có game nào.
                    </p>
                ) : (
                    <ul
                        className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              xl:grid-cols-4 
              gap-4"
                    >
                        {listGames.map((game) => (
                            <li key={game.id}>
                                <CardGame game={game} type={activeFilter} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
