"use client"
import { useState, useEffect } from "react"
import api from "@/utils/axios"

export default function AddAccForm({ gameList, selectedGame, onAdd }) {
    const [newAcc, setNewAcc] = useState({ info: "", price: "", status: "selling", game_id: "" })
    const [file, setFile] = useState(null)

    useEffect(() => {
        if (selectedGame) {
            setNewAcc(prev => ({ ...prev, game_id: selectedGame.id }))
        }
    }, [selectedGame])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newAcc.info || !newAcc.price || !file) {
            alert("Vui lòng nhập đầy đủ thông tin và chọn ảnh")
            return
        }

        try {
            const formData = new FormData()
            formData.append("info", newAcc.info)
            formData.append("price", newAcc.price)
            formData.append("status", newAcc.status)
            formData.append("game_id", newAcc.game_id)
            formData.append("image", file)

            const res = await api.post("/api/acc", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            if (onAdd) onAdd(res.data.data) // callback parent thêm account
            setNewAcc({ info: "", price: "", status: "selling", game_id: selectedGame.id })
            setFile(null)
        } catch (error) {
            console.error("Lỗi khi thêm acc:", error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 mb-6 rounded shadow">
            <div className="mb-2">
                <label className="block font-medium mb-1">Info</label>
                <textarea
                    className="w-full border px-2 py-1 rounded"
                    value={newAcc.info}
                    onChange={e => setNewAcc(prev => ({ ...prev, info: e.target.value }))}
                />
            </div>
            <div className="mb-2">
                <label className="block font-medium mb-1">Price</label>
                <input
                    type="number"
                    className="w-full border px-2 py-1 rounded"
                    value={newAcc.price}
                    onChange={e => setNewAcc(prev => ({ ...prev, price: e.target.value }))}
                />
            </div>
            <div className="mb-2">
                <label className="block font-medium mb-1">Status</label>
                <select
                    className="w-full border px-2 py-1 rounded"
                    value={newAcc.status}
                    onChange={e => setNewAcc(prev => ({ ...prev, status: e.target.value }))}
                >
                    <option value="selling">selling</option>
                    <option value="available">available</option>
                    <option value="sold">sold</option>
                </select>
            </div>
            <div className="mb-2">
                <label className="block font-medium mb-1">Ảnh</label>
                <input type="file" onChange={e => setFile(e.target.files[0])} />
            </div>
            <div className="mb-2">
                <label className="block font-medium mb-1">Chọn game</label>
                <select
                    className="w-full border px-2 py-1 rounded"
                    value={newAcc.game_id}
                    onChange={e => setNewAcc(prev => ({ ...prev, game_id: e.target.value }))}
                >
                    {gameList.map(game => (
                        <option key={game.id} value={game.id}>{game.name}</option>
                    ))}
                </select>
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                Tạo account
            </button>
        </form>
    )
}
