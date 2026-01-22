"use client"
import { getInfo } from "@/services/auth.service"
import { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { getGameByGameCode } from "@/services/games.service"
import { getAllAcc } from "@/services/acc.service"
import AccCardItem from "./accCard"
import { FiSearch, FiFilter, FiDollarSign, FiShoppingBag } from "react-icons/fi"

export default function AccClient({ gamecode }) {
    const baseURLAPI = process.env.NEXT_PUBLIC_API_URL

    const [game, setGame] = useState(null)
    const [allAccList, setAllAccList] = useState([]) // dữ liệu gốc
    const [accList, setAccList] = useState([]) // dữ liệu hiển thị
    const [loading, setLoading] = useState(true)
    const [userLevel, setUserLevel] = useState(1);

    // bộ lọc
    const [keyword, setKeyword] = useState("")
    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")

    // phân trang
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 12

    // fetch dữ liệu 1 lần khi load page
    useEffect(() => {
        if (!gamecode) return

        const fetchData = async () => {
            try {
                // Fetch User Level
                try {
                    const userData = await getInfo();
                    if (userData?.user?.level) setUserLevel(userData.user.level);
                } catch (e) {
                    // Not logged in
                }

                const gameData = await getGameByGameCode(gamecode)
                setGame(gameData)

                const accData = await getAllAcc(gameData.id)
                // chỉ lấy acc đang selling
                const sellingAcc = accData.data.data.filter(acc => acc.status === "selling")
                setAllAccList(sellingAcc)
                setAccList(sellingAcc)
            } catch (error) {
                console.error("Lỗi khi fetch dữ liệu:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [gamecode])

    // filter ở FE khi gõ keyword hoặc thay đổi giá
    const handleFilter = () => {
        const filtered = allAccList.filter(acc => {
            const k = keyword.toLowerCase()

            // check id
            const matchId = acc.id?.toString().includes(k)

            // check info (loại bỏ thẻ HTML để search text)
            const infoText = acc.info?.replace(/<[^>]+>/g, "").toLowerCase() || ""
            const matchInfo = infoText.includes(k)

            const matchMin = minPrice ? acc.price >= parseInt(minPrice) : true
            const matchMax = maxPrice ? acc.price <= parseInt(maxPrice) : true

            return (matchId || matchInfo) && matchMin && matchMax
        })

        setAccList(filtered)
        setCurrentPage(1)
    }


    // gọi filter mỗi khi keyword hoặc giá thay đổi
    useEffect(() => {
        handleFilter()
    }, [keyword, minPrice, maxPrice, allAccList])

    // phân trang
    const totalPages = Math.ceil(accList.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedAcc = accList.slice(startIndex, startIndex + itemsPerPage)

    return (
        <div className="min-h-screen bg-[#0F172A] bg-[url('/bg-grid.svg')] bg-fixed">
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Header Game */}
                {loading ? (
                    <div className="bg-[#1E293B]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 shadow-xl">
                        <div className="flex gap-4 items-center">
                            <Skeleton width={80} height={80} className="rounded-xl" />
                            <div className="flex-1 space-y-3">
                                <Skeleton width="50%" height={24} />
                                <Skeleton width="30%" height={16} />
                            </div>
                        </div>
                    </div>
                ) : (
                    game && (
                        <div className="bg-gradient-to-br from-[#1E293B]/90 to-[#0F172A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl shadow-purple-500/10">
                            <div className="flex gap-6 items-center">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                                    <img
                                        src={baseURLAPI + game.thumbnail}
                                        alt={`Ảnh game ${game.name}`}
                                        className="relative w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl border-2 border-white/10 shadow-lg"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                                        {game.name}
                                    </h1>
                                    <p className="text-slate-400 text-sm md:text-base flex items-center gap-2">
                                        <FiShoppingBag className="text-cyan-400" />
                                        {game.publisher} • {allAccList.length} tài khoản đang bán
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                )}

                {/* Bộ lọc */}
                <div className="bg-[#1E293B]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 shadow-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <FiFilter className="text-purple-400 text-xl" />
                        <h3 className="text-lg font-bold text-white">Bộ lọc tìm kiếm</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="md:col-span-1">
                            <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                <FiSearch />
                                Tìm kiếm
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập ID hoặc thông tin acc..."
                                value={keyword}
                                onChange={e => setKeyword(e.target.value)}
                                className="w-full bg-[#0F172A] border border-white/10 px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                            />
                        </div>

                        {/* Min Price */}
                        <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                <FiDollarSign />
                                Giá tối thiểu
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                value={minPrice}
                                onChange={e => setMinPrice(e.target.value)}
                                className="w-full bg-[#0F172A] border border-white/10 px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                            />
                        </div>

                        {/* Max Price */}
                        <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                <FiDollarSign />
                                Giá tối đa
                            </label>
                            <input
                                type="number"
                                placeholder="Không giới hạn"
                                value={maxPrice}
                                onChange={e => setMaxPrice(e.target.value)}
                                className="w-full bg-[#0F172A] border border-white/10 px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Filter Info */}
                    <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="text-slate-400">
                            Tìm thấy <span className="text-cyan-400 font-bold">{accList.length}</span> tài khoản
                        </span>
                        {(keyword || minPrice || maxPrice) && (
                            <button
                                onClick={() => {
                                    setKeyword("")
                                    setMinPrice("")
                                    setMaxPrice("")
                                }}
                                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                            >
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                </div>

                {/* Danh sách tài khoản */}
                <div className="bg-[#1E293B]/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full"></div>
                        Danh sách tài khoản
                    </h2>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-[#1E293B]/50 border border-white/10 rounded-xl p-4">
                                    <Skeleton height={200} className="rounded-lg mb-4" />
                                    <Skeleton count={3} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {paginatedAcc.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {paginatedAcc.map(acc => (
                                        <AccCardItem
                                            key={acc.id}
                                            acc={acc}
                                            userLevel={userLevel}
                                            onBuySuccess={() => {
                                                const newAll = allAccList.filter(item => item.id !== acc.id);
                                                setAllAccList(newAll);
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-xl font-bold text-slate-300 mb-2">Không tìm thấy tài khoản</h3>
                                    <p className="text-slate-500">Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm từ khóa khác</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8 gap-2 flex-wrap">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-[#0F172A] border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ← Trước
                                    </button>

                                    {Array.from({ length: totalPages }).map((_, idx) => {
                                        const page = idx + 1
                                        // Show first, last, current, and adjacent pages
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            Math.abs(page - currentPage) <= 1
                                        ) {
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === page
                                                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/20"
                                                        : "bg-[#0F172A] border border-white/10 text-slate-300 hover:bg-white/5"
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        } else if (Math.abs(page - currentPage) === 2) {
                                            return <span key={idx} className="px-2 text-slate-500">...</span>
                                        }
                                        return null
                                    })}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-[#0F172A] border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Sau →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
