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
import { FiPlus, FiFilter, FiSearch, FiMonitor, FiX, FiCheck, FiChevronDown, FiDatabase } from "react-icons/fi"

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
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1E293B]/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-xl">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                        <FiDatabase className="text-purple-400" /> Quản lý Account
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Danh sách tài khoản game đang bán
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Stat info={listAcc.length} title="Tổng Account" className="!w-auto !h-auto !bg-transparent !border-0 !p-0 !shadow-none !m-0 [&>div:first-child]:text-xs [&>div:last-child]:text-xl" />
                    <button
                        onClick={() => setShowForm(prev => !prev)}
                        className={`
                            bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2
                            ${showForm ? "bg-rose-600 hover:bg-rose-500" : ""}
                        `}
                    >
                        {showForm ? <><FiX /> Đóng Form</> : <><FiPlus /> Thêm Account</>}
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#1E293B]/50 backdrop-blur-md w-full p-4 rounded-2xl border border-white/5 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                {/* Game chọn */}
                <div>
                    <label className="font-bold text-slate-300 block mb-2 text-sm flex items-center gap-2"><FiMonitor /> Chọn Game</label>
                    {gameList.length > 0 ? (
                        <Listbox value={selectedGame} onChange={setSelectedGame}>
                            <div className="relative">
                                <Listbox.Button className="w-full bg-[#0F172A] border border-white/10 px-4 py-2.5 rounded-xl text-left text-white flex items-center justify-between hover:border-purple-500/50 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={`${apiBaseUrl}${selectedGame?.thumbnail}`}
                                            className="w-6 h-6 rounded-md object-cover"
                                            alt={selectedGame?.name}
                                        />
                                        <span className="font-medium">{selectedGame?.name}</span>
                                    </div>
                                    <FiChevronDown className="text-slate-400" />
                                </Listbox.Button>
                                <Listbox.Options className="absolute w-full mt-2 bg-[#1E293B] border border-white/10 rounded-xl max-h-60 overflow-auto shadow-2xl z-20 custom-scrollbar">
                                    {gameList.map(game => (
                                        <Listbox.Option key={game.id} value={game}>
                                            {({ selected }) => (
                                                <div
                                                    className={`flex items-center gap-2 px-4 py-3 cursor-pointer transition-colors ${selected ? "bg-purple-500/20 text-purple-300" : "text-slate-300 hover:bg-white/5"
                                                        }`}
                                                >
                                                    <img
                                                        src={`${apiBaseUrl}${game.thumbnail}`}
                                                        className="w-6 h-6 rounded-md object-cover"
                                                        alt={game.name}
                                                    />
                                                    <span>{game.name}</span>
                                                    {selected && <FiCheck className="ml-auto" />}
                                                </div>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Listbox>
                    ) : (
                        <p className="text-slate-500 text-sm">Đang tải danh sách game...</p>
                    )}
                </div>

                {/* Status filter */}
                <div>
                    <label className="font-bold text-slate-300 block mb-2 text-sm flex items-center gap-2"><FiFilter /> Trạng thái</label>
                    <div className="relative">
                        <select
                            className="w-full bg-[#0F172A] border border-white/10 px-4 py-2.5 rounded-xl text-white appearance-none cursor-pointer hover:border-purple-500/50 transition-colors"
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
                        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Keyword search */}
                <div>
                    <label className="font-bold text-slate-300 block mb-2 text-sm flex items-center gap-2"><FiSearch /> Tìm kiếm</label>
                    <input
                        type="text"
                        className="w-full bg-[#0F172A] border border-white/10 px-4 py-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                        placeholder="Nhập ID hoặc thông tin..."
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
                <form onSubmit={handleSubmit} className="bg-[#1E293B] border border-white/10 p-6 rounded-2xl shadow-xl animate-[slideDown_0.3s_ease-out]">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FiPlus className="bg-blue-500/20 text-blue-400 p-1 rounded-md box-content" /> Thêm tài khoản mới
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="md:col-span-2">
                            <label className="block font-bold text-slate-300 mb-2">Thông tin tài khoản (Info)</label>
                            <div className="rounded-xl overflow-hidden border border-white/10">
                                <RichTextEditor
                                    value={newAcc.info}
                                    onChange={content => setNewAcc(prev => ({ ...prev, info: content }))}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-bold text-slate-300 mb-2">Giá bán (VNĐ)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className="w-full bg-[#0F172A] border border-white/10 px-4 py-3 rounded-xl text-white focus:border-purple-500/50 outline-none transition-colors pl-10"
                                    value={newAcc.price}
                                    onChange={e => setNewAcc(prev => ({ ...prev, price: e.target.value }))}
                                    placeholder="0"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₫</span>
                            </div>
                        </div>

                        <div>
                            <label className="block font-bold text-slate-300 mb-2">Hình ảnh mô tả</label>
                            <div className="border-2 border-dashed border-slate-700 hover:border-purple-500/50 rounded-xl p-4 transition-colors text-center cursor-pointer relative group">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {!preview ? (
                                    <div className="text-slate-400">
                                        <div className="text-2xl mb-2">🖼️</div>
                                        <span className="text-sm font-medium">Click để tải ảnh lên</span>
                                    </div>
                                ) : (
                                    <div className="relative z-10">
                                        <img src={preview} alt="Preview" className="h-32 mx-auto rounded-lg object-contain shadow-lg" />
                                        <span className="text-xs text-slate-400 mt-2 block">Click để thay đổi</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
                        >
                            Đăng bán ngay
                        </button>
                    </div>
                </form>
            )}

            {/* List acc */}
            {currentListAcc.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentListAcc.map(acc => <AccItem key={acc.id} acc={acc} onDelete={(id) => setListAcc(prev => prev.filter(x => x.id !== id))} />)}
                    </div>

                    <div className="flex justify-center pt-8 pb-12">
                        <div className="bg-[#1E293B] p-2 rounded-xl border border-white/5 shadow-lg">
                            <Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={setCurrentPage} />
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-20 bg-[#1E293B]/30 rounded-3xl border border-dashed border-slate-700">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-xl font-bold text-slate-300">Chưa có account nào</h3>
                    <p className="text-slate-500 mt-2">Hãy thử chọn game khác hoặc thay đổi bộ lọc</p>
                </div>
            )}
        </div>
    )
}
