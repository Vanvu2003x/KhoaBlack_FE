"use client"

import { useEffect, useState } from "react"
import { Listbox } from "@headlessui/react"
import Stat from "@/components/admin/stat"
import { getGames } from "@/services/games.service"
import { getAllPackageByGameCode, searchPkg } from "@/services/toup_package.service"
import ItemsPkg from "./Components/Items"
import { FiPlus } from "react-icons/fi"
import AddItemUI from "./Components/AddItem"

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

export default function TopUpPackageManagerPage() {
    const [totalPackage, setTotalPackage] = useState(0)
    const [totalPackageActive, setTotalPackageActive] = useState(0)
    const [gameList, setGameList] = useState([])
    const [selectedGame, setSelectedGame] = useState(null)
    const [toupPackageList, setToupPackageList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenAddPkg, setIsOpenAddPkg] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState("")

    const handleSearchChange = async (e) => {
        const value = e.target.value
        setSearchKeyword(value)

        if (!value) {
            const data = await getAllPackageByGameCode(selectedGame.gamecode)
            setToupPackageList(data)
            return
        }

        try {
            const data = await searchPkg(selectedGame.id, value)
            setToupPackageList(data)
        } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error)
        }
    }

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
            }
        }
        fetchGame()
    }, [])

    useEffect(() => {
        if (!selectedGame) return

        const fetchData = async () => {
            try {
                setIsLoading(true)
                const data = await getAllPackageByGameCode(selectedGame.gamecode)
                setToupPackageList(data)
            } catch (error) {
                console.error("Lỗi khi lấy gói nạp:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [selectedGame])

    useEffect(() => {
        if (!toupPackageList || toupPackageList.length === 0) {
            setTotalPackage(0)
            setTotalPackageActive(0)
            return
        }

        setTotalPackage(toupPackageList.length)
        setTotalPackageActive(toupPackageList.filter(pkg => pkg.status === "active").length)
    }, [toupPackageList])

    return (
        <div className="bg-[#F4F6FA] p-10 min-h-screen">
            {/* Tổng quan */}
            <div className="md:flex gap-5 mb-6">
                <Stat title="Tổng các gói nạp" className="text-blue-600 border-blue-600" info={totalPackage} />
                <Stat title="Gói nạp đang hoạt động" className="text-green-500 border-green-500" info={totalPackageActive} />
            </div>

            {/* Dropdown chọn game */}
            <div className="bg-white p-4 w-full">
                <label className="font-medium block mb-2">Chọn tên game</label>
                {gameList.length > 0 ? (
                    <Listbox value={selectedGame} onChange={setSelectedGame}>
                        <Listbox.Button className="w-full border px-4 py-2 rounded text-left bg-white">
                            <div className="flex items-center gap-2">
                                <img src={`${apiBaseUrl}${selectedGame?.thumbnail}`} className="w-6 h-6 rounded" alt={selectedGame?.name} />
                                <span>{selectedGame?.name}</span>
                            </div>
                        </Listbox.Button>
                        <Listbox.Options className="mt-1 bg-white border rounded max-h-60 overflow-auto shadow">
                            {gameList.map((game) => (
                                <Listbox.Option key={game.id} value={game}>
                                    {({ selected }) => (
                                        <div className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-100 ${selected ? "bg-gray-100" : ""}`}>
                                            <img src={`${apiBaseUrl}${game.thumbnail}`} className="w-6 h-6 rounded" alt={game.name} />
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

            {/* Danh sách gói nạp */}
            <div className="mt-6 bg-white p-4 rounded shadow">
                {/* Header: Tên + tìm kiếm + thêm */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
                    <h2 className="text-lg font-semibold">Danh sách gói nạp</h2>
                    <div className="flex gap-2 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Nhập tên gói để tìm kiếm"
                            value={searchKeyword}
                            onChange={handleSearchChange}
                            className="border px-3 py-2 rounded w-full md:w-60"
                        />
                        <button
                            onClick={() => setIsOpenAddPkg(true)}
                            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                        >
                            <span>Thêm mới</span>
                            <FiPlus />
                        </button>
                    </div>
                </div>

                {/* Add Form */}
                {isOpenAddPkg && (
                    <AddItemUI
                        game_id={selectedGame.id}
                        onCancel={() => setIsOpenAddPkg(false)}
                    />
                )}

                {/* Danh sách gói */}
                {isLoading ? (
                    <p className="text-gray-500">Đang tải danh sách gói nạp...</p>
                ) : (
                    <>
                        {toupPackageList.length > 0 ? (
                            <ul className="space-y-2">
                                {toupPackageList.map((pkg) => (
                                    <li key={pkg.id} className="border flex justify-between items-center bg-gray-50">
                                        <ItemsPkg pkg={pkg} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Không có gói nạp nào cho game này.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
