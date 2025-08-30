"use client"
import Stat from "@/components/admin/stat"
import { useEffect, useState } from "react"
import { Listbox } from "@headlessui/react"
import { getGames } from "@/services/games.service"
import { getAllAcc } from "@/services/acc.service"
import AccItem from "./components/accItem"
import api from "@/utils/axios"
import RichTextEditor from "@/components/common/richtexteditor"
import Pagination from "@/components/common/Pagination"

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

export default function AccManagerPage() {
    const [listAcc, setListAcc] = useState([])
    const [gameList, setGameList] = useState([])
    const [selectedGame, setSelectedGame] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [statusFilter, setStatusFilter] = useState("all")
    const [keyword, setKeyword] = useState("")

    const [newAcc, setNewAcc] = useState({ info: "", price: "", game_id: "", status: "selling" })
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)

    // phân trang frontend
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 6

    // Lấy danh sách game
    useEffect(() => {
        const fetchGame = async () => {
            try {
                const data = await getGames()
                setGameList(data)
                if (data.length > 0) {
                    setSelectedGame(data[0])
                    setNewAcc(prev => ({ ...prev, game_id: data[0].id }))
                }
            } catch (error) {
                console.error("Lỗi khi lấy game:", error)
            }
        }
        fetchGame()
    }, [])

    // Lấy danh sách acc khi game thay đổi
    useEffect(() => {
        if (!selectedGame) return
        const fetchAcc = async () => {
            try {
                const data = await getAllAcc(selectedGame.id)
                setListAcc(data.data.data)
                setNewAcc(prev => ({ ...prev, game_id: selectedGame.id }))
                setCurrentPage(1)
            } catch (error) {
                console.error("Lỗi khi lấy acc:", error)
            }
        }
        fetchAcc()
    }, [selectedGame])

    // File preview
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        setFile(selectedFile)
        if (selectedFile) {
            const reader = new FileReader()
            reader.onloadend = () => setPreview(reader.result)
            reader.readAsDataURL(selectedFile)
        } else setPreview(null)
    }

    // Submit thêm account
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
            const token = localStorage.getItem("token")
            const res = await api.post("/api/acc", formData, {
                headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}` }
            })
            setListAcc(prev => [res.data.data, ...prev])
            setNewAcc({ info: "", price: "", game_id: selectedGame.id, status: "selling" })
            setFile(null)
            setPreview(null)
            setShowForm(false)
        } catch (error) {
            console.error("Lỗi khi thêm acc:", error)
        }
    }

    const filteredAcc = listAcc.filter(acc => {
        const matchStatus = statusFilter === "all" ? true : acc.status === statusFilter
        const matchKeyword =
            String(acc.id).includes(keyword) ||                // ✅ tìm theo ID
            acc.info.toLowerCase().includes(keyword.toLowerCase()) // ✅ tìm theo info

        return matchStatus && matchKeyword
    })



    const totalPage = Math.ceil(filteredAcc.length / pageSize)
    const currentListAcc = filteredAcc.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    return (
        <div className="p-10 h-full">
            <div className="flex justify-between items-center mb-4">
                <Stat info={listAcc.length} title={"Tổng số lượng acc"} />
                <button
                    onClick={() => setShowForm(prev => !prev)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    {showForm ? "Đóng form" : "Thêm mới"}
                </button>
            </div>

            <div className="bg-white w-full mb-4 p-4 rounded shadow grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                {/* Game chọn */}
                <div>
                    <label className="font-medium block mb-1">Chọn game</label>
                    {gameList.length > 0 ? (
                        <Listbox value={selectedGame} onChange={setSelectedGame}>
                            <Listbox.Button className="w-full border px-4 py-2 rounded text-left bg-white">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={`${apiBaseUrl}${selectedGame?.thumbnail}`}
                                        className="w-6 h-6 rounded"
                                        alt={selectedGame?.name}
                                    />
                                    <span>{selectedGame?.name}</span>
                                </div>
                            </Listbox.Button>
                            <Listbox.Options className="mt-1 bg-white border rounded max-h-60 overflow-auto shadow">
                                {gameList.map(game => (
                                    <Listbox.Option key={game.id} value={game}>
                                        {({ selected }) => (
                                            <div
                                                className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-100 ${selected ? "bg-gray-100" : ""
                                                    }`}
                                            >
                                                <img
                                                    src={`${apiBaseUrl}${game.thumbnail}`}
                                                    className="w-6 h-6 rounded"
                                                    alt={game.name}
                                                />
                                                <span>{game.name}</span>
                                            </div>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Listbox>
                    ) : (
                        <p>Đang tải danh sách game...</p>
                    )}
                </div>

                {/* Status filter */}
                <div>
                    <label className="font-medium block mb-1">Trạng thái</label>
                    <select
                        className="w-full border px-2 py-2 rounded"
                        value={statusFilter}
                        onChange={e => {
                            setStatusFilter(e.target.value)
                            setCurrentPage(1)
                        }}
                    >
                        <option value="all">Tất cả</option>
                        <option value="selling">Chưa bán</option>
                        <option value="sold">Đã bán</option>
                    </select>
                </div>

                {/* Keyword search */}
                <div>
                    <label className="font-medium block mb-1">Tìm kiếm</label>
                    <input
                        type="text"
                        className="w-full border px-2 py-2 rounded"
                        placeholder="ID hoặc Info"
                        value={keyword}
                        onChange={e => {
                            setKeyword(e.target.value)
                            setCurrentPage(1)
                        }}
                    />
                </div>
            </div>

            {/* Form thêm acc */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-4 mb-6 rounded shadow">
                    <div className="mb-2">
                        <label className="block font-medium mb-1">Info</label>
                        <RichTextEditor
                            value={newAcc.info}
                            onChange={content => setNewAcc(prev => ({ ...prev, info: content }))}
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block font-medium mb-1">Price</label>
                        <input type="number" className="w-full border px-2 py-1 rounded" value={newAcc.price} onChange={e => setNewAcc(prev => ({ ...prev, price: e.target.value }))} />
                    </div>
                    <div className="mb-2">
                        <label className="block font-medium mb-1">Ảnh</label>
                        <input type="file" onChange={handleFileChange} />
                        {preview && <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover border rounded" />}
                    </div>

                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Tạo account</button>
                </form>
            )}

            {/* List acc */}
            {currentListAcc.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentListAcc.map(acc => <AccItem key={acc.id} acc={acc} />)}
                    </div>

                    <Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={setCurrentPage} />
                </>
            ) : <p>Không có account nào.</p>}
        </div>
    )
}
