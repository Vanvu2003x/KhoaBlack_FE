"use client";

import { useState } from "react";
import { GoDotFill } from "react-icons/go";
import EditGameForm from "./EditGameForm";
import { deleteGame } from "@/services/games.service";

export default function GameItem({ game, setChange }) {
    const [showServers, setShowServers] = useState(false);
    const [editStatus, setEditStatus] = useState(false)
    const getDotColor = (status) =>
        status === "Đang nạp" ? "text-green-500" : "text-red-500";

    return (
        <div className="">
            <>
                {editStatus ? (
                    <EditGameForm game={game} onCancel={() => { setEditStatus(false) }}></EditGameForm>
                ) : (
                    <div className="border p-4 bg-white shadow-sm -lg flex items-start gap-6">
                        <div className="w-20 h-20 flex-shrink-0 overflow-hidden border ">
                            <img
                                className="w-full h-full object-cover"
                                src={`http://localhost:5000${game.thumbnail}`}
                                alt="ảnh tạm"
                            />
                        </div>

                        <div className="flex flex-col flex-grow gap-2">
                            <div>
                                <div className="p-1 text-base font-semibold text-gray-800">{game.name}</div>
                                <div className="p-1 text-sm text-gray-500">{game.publisher}</div>
                            </div>

                            <div>
                                <button
                                    onClick={() => setShowServers(!showServers)}
                                    className="text-sm text-blue-600 underline hover:text-blue-800 transition"
                                >
                                    {showServers ? "Ẩn server" : "Xem server"}
                                </button>

                                {showServers && (
                                    <div className="mt-1 pl-4 text-sm text-gray-700 bg-gray-50  border border-blue-100 p-2">
                                        <ul className="list-disc list-inside">
                                            {(game.sever).map(
                                                (sv, idx) => (
                                                    <li key={idx}>{sv}</li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[100px]">
                            <button
                                onClick={() => { setEditStatus(true) }}
                                className="px-3 py-1 text-sm bg-blue-300 border hover:bg-blue-400 transition"
                            >
                                Sửa
                            </button>
                            <button
                                onClick={async () => {
                                    if (confirm("Bạn chắc chắn muốn xóa game?")) {
                                        const result = await deleteGame(game.id)
                                        alert(result.message)
                                        setChange((pre) => (!pre))
                                    }
                                }}
                                className="px-3 py-1 text-sm border bg-red-300  hover:bg-red-500 transition"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                )}
            </>

        </div>
    );
}
