"use client";

import React, { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import AddGameForm from "@/components/admin/gameManager/AddGameForm";
import GameItem from "@/components/admin/gameManager/GameItem";
import { getGames } from "@/services/games.service";

export default function GameManagerPage() {
    const [change, setChange] = useState(false)
    const [addingGame, setAddingGame] = useState(false);
    const [games, setGames] = useState([])
    useEffect(() => {
        const dataFetch = async () => {
            const data = await getGames();
            setGames(data)
            console.log(data)
        }
        dataFetch()
    }, [change])
    return (
        <div className="p-10 font-sans bg-[#F4F6FA] min-h-screen">
            <div className="bg-white border-black border-2 rounded">
                <div className="flex justify-between items-center border-b-2 p-5">
                    <h2 className="text-xl font-semibold">Danh sách game</h2>
                    <button
                        onClick={() => setAddingGame(true)}
                        className="flex items-center gap-2 px-3 py-1 rounded border border-gray-300 bg-teal-200 hover:bg-teal-400 transition"
                    >
                        Thêm mới
                        <IoMdAddCircleOutline className="scale-125" />
                    </button>
                </div>

                {addingGame && (
                    <AddGameForm setChange={setChange} onCancel={() => setAddingGame(false)} />
                )}
                <ul>
                    {games.map((value) => {
                        return (
                            <li key={value.id}> <GameItem game={value} setChange={setChange}></GameItem></li>
                        )
                    })}
                </ul>
            </div>
        </div>
    );
}
