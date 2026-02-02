"use client"
import Stat from "@/components/admin/stat"
import { useEffect, useState } from "react"
import { Listbox, Transition } from "@headlessui/react"
import { getGames } from "@/services/games.service"
import { getAllAcc } from "@/services/acc.service"
import AccItem from "./components/accItem"
import AccForm from "./components/addAcc"
import Pagination from "@/components/common/Pagination"
import { FiPlus, FiFilter, FiSearch, FiMonitor, FiX, FiCheck, FiChevronDown, FiDatabase, FiLayers } from "react-icons/fi"
import { useToast } from "@/components/ui/Toast"
import { Fragment } from "react"

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

export default function AccManagerPage() {
    const toast = useToast()
    const [listAcc, setListAcc] = useState([])
    const [gameList, setGameList] = useState([])
    const [selectedGame, setSelectedGame] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [statusFilter, setStatusFilter] = useState("all")
    const [keyword, setKeyword] = useState("")

    // Edit state
    const [editMode, setEditMode] = useState(false)
    const [editingAcc, setEditingAcc] = useState(null)

    // phân trang frontend
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 8 // Increased page size for better grid view

    // Lấy danh sách game
    useEffect(() => {
        const fetchGame = async () => {
            try {
                const data = await getGames()
                setGameList(data)
                if (data.length > 0) {
                    setSelectedGame(data[0])
                }
            } catch (error) {
                console.error("Lỗi khi lấy game:", error)
                toast.error("Không thể tải danh sách game")
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
                setCurrentPage(1)
            } catch (error) {
                console.error("Lỗi khi lấy acc:", error)
                toast.error("Không thể tải danh sách tài khoản")
            }
        }
        fetchAcc()
    }, [selectedGame])

    const handleAddSuccess = (newAcc) => {
        setListAcc(prev => [newAcc, ...prev])
        setShowForm(false)
    }

    const handleEditClick = (acc) => {
        setEditingAcc(acc)
        setEditMode(true)
    }

    const handleEditSuccess = (updatedAcc) => {
        setListAcc(prev => prev.map(acc => acc.id === updatedAcc.id ? updatedAcc : acc))
        setEditMode(false)
        setEditingAcc(null)
    }

    const handleCloseEdit = () => {
        setEditMode(false)
        setEditingAcc(null)
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
        <div className="space-y-8 animate-[fadeIn_0.5s_ease-out] pb-20">
            {/* Modern Header Section */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Management
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                            Kho Game
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 ml-2">Premium</span>
                        </h1>
                        <p className="text-slate-400 max-w-lg text-lg">
                            Quản lý, theo dõi và cập nhật tất cả tài khoản game của bạn trong một giao diện duy nhất.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-800/50 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
                        <div className="px-4 py-2 border-r border-white/5 last:border-0">
                            <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Tổng Acc</span>
                            <span className="text-2xl font-black text-white">{listAcc.length}</span>
                        </div>
                        <div className="px-4 py-2 border-r border-white/5 last:border-0">
                            <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Đang bán</span>
                            <span className="text-2xl font-black text-emerald-400">{listAcc.filter(x => x.status === 'selling').length}</span>
                        </div>
                        <div className="px-4 py-2">
                            <button
                                onClick={() => setShowForm(prev => !prev)}
                                className={`
                                    h-12 w-12 flex items-center justify-center rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95
                                    ${showForm
                                        ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 ring-1 ring-rose-500/50"
                                        : "bg-gradient-to-br from-blue-600 to-cyan-600 text-white hover:shadow-cyan-500/25"}
                                `}
                                title={showForm ? "Đóng form" : "Thêm mới"}
                            >
                                {showForm ? <FiX size={24} /> : <FiPlus size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
                {/* Sidebar Controls */}
                <div className="xl:col-span-1 space-y-6">
                    {/* Filter Card */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 sticky top-24 backdrop-blur-sm">
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <FiFilter className="text-cyan-400" /> Bộ lọc tìm kiếm
                        </h3>

                        <div className="space-y-4">
                            {/* Game Selector */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Chọn Game</label>
                                <Listbox value={selectedGame} onChange={setSelectedGame}>
                                    <div className="relative">
                                        <Listbox.Button className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 px-4 py-3 rounded-xl text-left text-white flex items-center justify-between transition-all group">
                                            {selectedGame ? (
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={selectedGame?.thumbnail?.startsWith('http') ? selectedGame.thumbnail : `${apiBaseUrl}${selectedGame?.thumbnail}`}
                                                        className="w-6 h-6 rounded-md object-cover ring-2 ring-slate-700 group-hover:ring-slate-600"
                                                        alt={selectedGame?.name}
                                                    />
                                                    <span className="font-semibold">{selectedGame?.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-500">Chọn game...</span>
                                            )}
                                            <FiChevronDown className="text-slate-500" />
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl max-h-60 overflow-auto shadow-2xl z-30 custom-scrollbar focus:outline-none p-1">
                                                {gameList.map(game => (
                                                    <Listbox.Option
                                                        key={game.id}
                                                        value={game}
                                                        className={({ active }) =>
                                                            `cursor-pointer select-none rounded-lg relative py-3 pl-3 pr-9 transition-all ${active ? 'bg-slate-700 text-white' : 'text-slate-300'
                                                            }`
                                                        }
                                                    >
                                                        {({ selected }) => (
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={game.thumbnail?.startsWith('http') ? game.thumbnail : `${apiBaseUrl}${game.thumbnail}`}
                                                                    className={`w-8 h-8 rounded-lg object-cover ${selected ? 'ring-2 ring-purple-500' : ''}`}
                                                                    alt={game.name}
                                                                />
                                                                <span className={`block truncate ${selected ? 'font-bold text-white' : 'font-medium'}`}>
                                                                    {game.name}
                                                                </span>
                                                                {selected && (
                                                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-purple-400">
                                                                        <FiCheck className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>

                            {/* Status Selector */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Trạng thái</label>
                                <div className="grid grid-cols-2 gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
                                    {['all', 'selling', 'sold'].map((st) => (
                                        <button
                                            key={st}
                                            onClick={() => setStatusFilter(st)}
                                            className={`
                                                px-3 py-2 rounded-lg text-sm font-bold transition-all
                                                ${statusFilter === st
                                                    ? "bg-slate-700 text-white shadow-sm"
                                                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-700/50"}
                                                ${st === 'all' ? 'col-span-2' : ''}
                                            `}
                                        >
                                            {st === 'all' ? 'Tất cả trạng thái' : st === 'selling' ? 'Đang bán' : 'Đã bán'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Search */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Tìm kiếm</label>
                                <div className="relative group">
                                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                    <input
                                        type="text"
                                        className="w-full bg-slate-800 border border-slate-700 focus:border-purple-500/50 px-4 py-3 pl-11 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all"
                                        placeholder="ID hoặc nội dung..."
                                        value={keyword}
                                        onChange={e => {
                                            setKeyword(e.target.value)
                                            setCurrentPage(1)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid List */}
                <div className="xl:col-span-3">
                    {/* Add Form Area */}
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showForm ? 'max-h-[800px] opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}`}>
                        <AccForm
                            gameList={gameList}
                            selectedGame={selectedGame}
                            onSuccess={handleAddSuccess}
                            editMode={false}
                        />
                    </div>

                    {currentListAcc.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentListAcc.map((acc, index) => (
                                    <div key={acc.id} className="animate-[scaleIn_0.3s_ease-out]" style={{ animationDelay: `${index * 0.05}s` }}>
                                        <AccItem
                                            acc={acc}
                                            onDelete={(id) => setListAcc(prev => prev.filter(x => x.id !== id))}
                                            onEdit={handleEditClick}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 flex justify-center">
                                <Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={setCurrentPage} />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800 text-center">
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-4xl shadow-inner">
                                🔍
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy Account</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">
                                Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal Overlay */}
            <Transition show={editMode && !!editingAcc} as={Fragment}>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={handleCloseEdit} />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95 translate-y-10"
                        enterTo="opacity-100 scale-100 translate-y-0"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100 translate-y-0"
                        leaveTo="opacity-0 scale-95 translate-y-10"
                    >
                        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl shadow-2xl z-50" onClick={e => e.stopPropagation()}>
                            <AccForm
                                gameList={gameList}
                                selectedGame={selectedGame}
                                onSuccess={handleEditSuccess}
                                onClose={handleCloseEdit}
                                editMode={true}
                                accData={editingAcc}
                            />
                        </div>
                    </Transition.Child>
                </div>
            </Transition>
        </div>
    )
}
