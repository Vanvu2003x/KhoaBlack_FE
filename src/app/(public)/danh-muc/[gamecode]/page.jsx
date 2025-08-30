"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { getAllPackageByGameCode } from "@/services/toup_package.service"
import { getGameByGameCode } from "@/services/games.service"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import ConfirmForm from "@/components/confirmForm"
import { toast } from "react-toastify"

const baseURLAPI = process.env.NEXT_PUBLIC_API_URL

function PackageList({ title, note, packages, loading, onSelect, selectedPkg }) {
    return (
        <div className="p-5 bg-white shadow space-y-4">
            <h1 className="text-xl font-semibold">
                {loading ? <Skeleton width={200} /> : title}
            </h1>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} height={100} />
                    ))}
                </div>
            ) : packages.length === 0 ? (
                <p className="text-gray-500 italic">Không có {title.toLowerCase()}.</p>
            ) : (
                <>
                    <div className="text-sm text-gray-600">{note}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {packages.map(pkg => (
                            <div
                                key={pkg.id}
                                className={`cursor-pointer border p-3 transition hover:shadow ${selectedPkg?.id === pkg.id ? "border-blue-500 ring-1 ring-blue-300" : "border-gray-200"}`}
                                onClick={() => onSelect(pkg)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative w-14 h-14">
                                        <img
                                            src={baseURLAPI + pkg.thumbnail}
                                            alt={pkg.package_name}
                                            className="w-14 h-14 object-cover rounded"
                                        />
                                        {pkg.sale && (
                                            <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px]  font-bold px-1 py-0.5 rounded-br">
                                                SALE
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-semibold">{pkg.package_name}</p>
                                        <p className="text-sm text-gray-600">{pkg.price.toLocaleString()}đ</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default function Page() {
    const params = useParams()
    const gamecode = params?.gamecode

    const [listPkg, setListPkg] = useState([])
    const [game, setGame] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedPkg, setSelectedPkg] = useState(null)

    const [idServer, setIdServer] = useState("")
    const [server, setServer] = useState("")
    const [uid, setUid] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [zaloNumber, setZaloNumber] = useState("")
    const [note, setNote] = useState("")

    const [confirmForm, setConfirmForm] = useState(false)


    const infoRef = useRef()

    useEffect(() => {
        if (selectedPkg?.id_server && selectedPkg?.sever?.length > 0 && selectedPkg.game_code !== "mlbb") {
            setServer(selectedPkg.sever[0])
        }
    }, [selectedPkg])

    const handleSelectPackage = (pkg) => {
        setSelectedPkg(pkg)

        setTimeout(() => {
            if (window.innerWidth < 768 && infoRef.current) {
                infoRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
            }
        }, 100)
    }

    useEffect(() => {
        if (!gamecode) return

        const fetchData = async () => {
            try {
                const [packagesData, gameData] = await Promise.all([
                    getAllPackageByGameCode(gamecode),
                    getGameByGameCode(gamecode),
                ])
                setListPkg(packagesData)
                setGame(gameData)
                console.log(gameData)
            } catch (error) {
                console.error("Lỗi khi fetch dữ liệu:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [gamecode])

    const loginPackages = useMemo(
        () => listPkg.filter(pkg => pkg.status === "active" && pkg.package_type === "LOG"),
        [listPkg]
    )

    const uidPackages = useMemo(
        () => listPkg.filter(pkg => pkg.status === "active" && pkg.package_type === "UID"),
        [listPkg]
    )

    return (
        <div className="p-4 md:p-10 bg-gray-100 flex flex-col md:flex-row gap-5 w-full">
            {/* LEFT */}
            <section className="w-full md:flex-[2] space-y-5 max-w-full">
                {loading ? (
                    <div className="p-4 bg-white flex gap-4 items-center shadow">
                        <Skeleton width={72} height={72} />
                        <div className="flex-1 space-y-2">
                            <Skeleton width={`60%`} height={20} />
                            <Skeleton width={`40%`} height={16} />
                        </div>
                    </div>
                ) : game && (
                    <div className="p-4 bg-white flex gap-4 items-center shadow">
                        <img
                            src={baseURLAPI + game.thumbnail}
                            alt={`Ảnh game ${game.name}`}
                            className="w-18 h-18 object-cover aspect-square"
                        />
                        <div>
                            <h1 className="text-lg font-bold">{game.name}</h1>
                            <h2 className="text-sm text-gray-600">{game.publisher}</h2>
                        </div>
                    </div>
                )}

                {!loading && loginPackages.length + uidPackages.length === 0 ? (
                    <div className="p-5 bg-white shadow text-red-500 font-medium">
                        Không có gói nạp nào khả dụng cho game này.
                    </div>
                ) : (
                    <>
                        <PackageList
                            title="Gói nạp Login"
                            packages={loginPackages}
                            loading={loading}
                            onSelect={handleSelectPackage}
                            selectedPkg={selectedPkg}
                            note="Nạp bằng tài khoản đăng nhập, xử lý trong 5p - 24h"
                        />
                        <PackageList
                            title="Gói nạp qua UID"
                            packages={uidPackages}
                            loading={loading}
                            onSelect={handleSelectPackage}
                            selectedPkg={selectedPkg}
                            note="Nạp nhanh qua UID, nhận ngay sau thanh toán"
                        />
                    </>
                )}
            </section>

            {/* RIGHT */}
            <section className="w-full md:flex-1 space-y-5 max-w-full">
                <div className="p-5 bg-white shadow space-y-4" ref={infoRef}>
                    <h2 className="text-lg font-semibold">Thông tin tài khoản</h2>
                    <div className="text-sm text-gray-700">
                        Vui lòng nhập chính xác thông tin tài khoản để tránh sai sót. Nếu lần đầu nạp có thể được x2.
                    </div>

                    {!selectedPkg ? (
                        <p className="text-sm text-gray-500 italic">Vui lòng chọn gói nạp trước.</p>
                    ) : (
                        <>
                            {/* Server / Zone ID */}
                            {false ? (
                                null

                            ) : selectedPkg?.id_server ? (
                                <input
                                    className="border p-2 w-full mb-3"
                                    placeholder="Nhập Zone ID"
                                    value={idServer}
                                    onChange={e => setIdServer(e.target.value)}
                                />
                            ) :
                                (
                                    <div className="mb-3">
                                        <label className="block mb-1 font-medium">Chọn server</label>
                                        <select
                                            className="border p-2 w-full"
                                            value={server}
                                            onChange={e => setServer(e.target.value)}
                                        >
                                            {game.sever.map((sv, index) => (
                                                <option key={index} value={sv}>{sv}</option>
                                            ))}
                                        </select>
                                    </div>
                                )
                            }

                            {/* UID */}
                            <input
                                className="border p-2 w-full mb-3"
                                placeholder="Nhập UID"
                                value={uid}
                                onChange={e => setUid(e.target.value)}
                            />

                            {/* Login type */}
                            {selectedPkg.package_type === "LOG" && (
                                <>
                                    <input
                                        className="border p-2 w-full mb-3"
                                        placeholder="Nhập tên đăng nhập / Email liên kết"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                    <input
                                        className="border p-2 w-full"
                                        placeholder="Nhập mật khẩu"
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </>
                            )}
                        </>
                    )}
                </div>

                <div className="p-5 bg-white shadow">
                    <h2 className="text-lg font-semibold mb-2">Thông tin thanh toán</h2>
                    <p className="text-sm text-gray-700 mb-3">
                        Chỉ hỗ trợ thanh toán qua ví Shop. Vui lòng kiểm tra số dư trước khi thanh toán.
                    </p>
                    {selectedPkg ? (
                        <div className="space-y-2">
                            <table className="w-full border border-gray-300 text-sm table-fixed">
                                <tbody>
                                    <tr className="border-b border-gray-300">
                                        <td rowSpan={2} className="w-20 p-2 border-r border-gray-300 align-top">
                                            <img
                                                src={baseURLAPI + selectedPkg.thumbnail}
                                                alt="ảnh"
                                                className="w-16 h-16 object-cover"
                                            />
                                        </td>
                                        <td className="p-2 font-semibold">{selectedPkg.package_name}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2 text-blue-600">{selectedPkg.price.toLocaleString()}đ</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Số Zalo */}
                            <input
                                className="border p-2 w-full mb-2"
                                placeholder="Nhập số Zalo (Web sẽ liên hệ)"
                                value={zaloNumber}
                                onChange={e => setZaloNumber(e.target.value)}
                            />

                            {/* Ghi chú */}
                            <textarea
                                className="border p-2 w-full mb-2"
                                placeholder="Ghi chú cho web (Có thể bỏ qua)"
                                value={note}
                                onChange={e => setNote(e.target.value)}
                            />

                            <button
                                onClick={() => {
                                    const token = localStorage.getItem("token")
                                    if (!token) {
                                        toast.error("Bạn cần đăng nhập để thực hiện thao tác này.")
                                        return
                                    }
                                    if (!selectedPkg) {
                                        toast.error("Vui lòng chọn gói nạp.")
                                        return
                                    }
                                    if (selectedPkg.id_server && !idServer && (!selectedPkg.sever || selectedPkg.sever.length === 0)) {
                                        toast.error("Vui lòng nhập ID Server.")
                                        return
                                    }
                                    if (!uid) {
                                        toast.error("Vui lòng nhập UID.")
                                        return
                                    }
                                    if (selectedPkg.package_type === "LOG" && (!username || !password)) {
                                        toast.error("Vui lòng nhập tài khoản và mật khẩu.")
                                        return
                                    }
                                    if (!zaloNumber) {
                                        toast.error("Vui lòng nhập số Zalo để web liên hệ.")
                                        return
                                    }
                                    setConfirmForm(true)
                                }}
                                className="bg-blue-600 text-white w-full py-2 hover:bg-blue-700 mt-2">
                                Xác nhận mua
                            </button>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Vui lòng chọn gói nạp để hiển thị chi tiết.</p>
                    )}
                </div>
            </section >
            {/* CONFIRM FORM */}
            {
                confirmForm && (
                    <ConfirmForm
                        data={{
                            package: selectedPkg,
                            server,
                            uid,
                            username,
                            password,
                            idServer,
                            zaloNumber,
                            note
                        }}
                        onClick={() => setConfirmForm(false)}
                    />
                )
            }

        </div >
    )
}
