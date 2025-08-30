"use client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { getGameByGameCode } from "@/services/games.service"
import { getAllAcc } from "@/services/acc.service"
import AccCardItem from "./Components/accCard"

export default function Acc() {
    const params = useParams()
    const gamecode = params?.gamecode
    const baseURLAPI = process.env.NEXT_PUBLIC_API_URL

    const [game, setGame] = useState(null)
    const [allAccList, setAllAccList] = useState([]) // dữ liệu gốc
    const [accList, setAccList] = useState([]) // dữ liệu hiển thị
    const [loading, setLoading] = useState(true)

    // bộ lọc
    const [keyword, setKeyword] = useState("")
    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")

    // phân trang
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    // fetch dữ liệu 1 lần khi load page
    useEffect(() => {
        if (!gamecode) return

        const fetchData = async () => {
            try {
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
        <div className="p-6 md:p-10 min-h-screen bg-gray-100">
            {/* header game */}
            {loading ? (
                <div className="p-4 bg-white rounded-lg shadow flex gap-4 items-center">
                    <Skeleton width={72} height={72} className="rounded-md" />
                    <div className="flex-1 space-y-2">
                        <Skeleton width="60%" height={20} />
                        <Skeleton width="40%" height={16} />
                    </div>
                </div>
            ) : (
                game && (
                    <div className="p-5 bg-white rounded-lg shadow flex gap-4 items-center mb-8">
                        <img
                            src={baseURLAPI + game.thumbnail}
                            alt={`Ảnh game ${game.name}`}
                            className="w-[72px] h-[72px] object-cover rounded-md border"
                        />
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">{game.name}</h1>
                            <h2 className="text-sm text-gray-500">{game.publisher}</h2>
                        </div>
                    </div>
                )
            )}

            {/* bộ lọc */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4 flex-wrap items-end">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo thông tin acc, id acc..."
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    className="border rounded p-2 flex-1"
                />
                <input
                    type="number"
                    placeholder="Giá tối thiểu"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    className="border rounded p-2 w-40"
                />
                <input
                    type="number"
                    placeholder="Giá tối đa"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="border rounded p-2 w-40"
                />
            </div>

            {/* Danh sách acc */}
            <div className="bg-white p-10">
                <h2 className="font-semibold text-gray-800 mb-4 text-xl">
                    Danh sách tài khoản
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {paginatedAcc.length > 0 ? (
                        paginatedAcc.map(acc => <AccCardItem key={acc.id} acc={acc} />)
                    ) : (
                        <p className="text-gray-500 col-span-full text-center py-8">
                            Không tìm thấy tài khoản nào
                        </p>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-6 gap-2">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentPage(idx + 1)}
                                className={`px-3 py-1 border rounded ${currentPage === idx + 1 ? "bg-blue-500 text-white" : "bg-white"
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
