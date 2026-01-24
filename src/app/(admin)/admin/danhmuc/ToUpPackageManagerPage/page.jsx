"use client";

import React, { useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
    getAllPackageByGameCode,
    searchPkg,
    addPkg,
    updatePkg,
    delPkg,
    changeStatus
} from "@/services/toup_package.service";
import { getGames } from "@/services/games.service";
import {
    FiPlus,
    FiSearch,
    FiEdit2,
    FiTrash2,
    FiX,
    FiImage,
    FiSave,
    FiCheck,
    FiChevronDown,
    FiFilter,
    FiDollarSign,
    FiLayers,
    FiActivity
} from "react-icons/fi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TopUpPackageManagerPage() {
    // --- State Management ---
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPackage, setCurrentPackage] = useState(null); // null for add, object for edit

    // Form State
    const [formData, setFormData] = useState({
        package_name: "",
        origin_price: "",
        profit_percent_basic: "",
        profit_percent_pro: "",
        profit_percent_plus: "",
        package_type: "default",
        status: "active",
        id_server: false,
        sale: false,
        fileAPI: "",
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);

    // --- Data Fetching ---

    // 1. Fetch Games first
    useEffect(() => {
        const fetchGamesData = async () => {
            try {
                const data = await getGames();
                setGames(data || []);
                if (data && data.length > 0) {
                    setSelectedGame(data[0]);
                }
            } catch (error) {
                console.error("Error fetching games:", error);
                toast.error("Không thể tải danh sách game");
            }
        };
        fetchGamesData();
    }, []);

    // 2. Fetch Packages when selectedGame changes
    useEffect(() => {
        if (!selectedGame) return;
        fetchPackages();
    }, [selectedGame]);

    const fetchPackages = async () => {
        if (!selectedGame) return;
        try {
            setLoading(true);
            const data = await getAllPackageByGameCode(selectedGame.gamecode);
            setPackages(data || []);
        } catch (error) {
            console.error("Error fetching packages:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers ---

    const handleSearch = async (e) => {
        const val = e.target.value;
        setSearchTerm(val);

        if (!selectedGame) return;

        if (!val.trim()) {
            fetchPackages();
            return;
        }

        try {
            const data = await searchPkg(selectedGame.id, val);
            setPackages(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa?',
            text: "Gói nạp này sẽ bị xóa vĩnh viễn!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa ngay',
            cancelButtonText: 'Hủy',
            background: '#1e293b',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                await delPkg(id);
                toast.success("Đã xóa gói nạp");
                fetchPackages();
            } catch (error) {
                toast.error("Lỗi khi xóa gói nạp");
                console.error(error);
            }
        }
    };

    const handleDetail = (pkg) => {
        const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

        Swal.fire({
            title: `Chi tiết: ${pkg.package_name}`,
            html: `
                <div class="text-left space-y-3 bg-[#1E293B] p-4 rounded-xl border border-white/10 text-slate-300">
                    <div class="flex justify-between border-b border-white/5 pb-2">
                        <span class="text-slate-500">Giá Nhập (Gốc):</span>
                        <span class="font-bold text-white">${formatMoney(pkg.origin_price || 0)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-blue-400">Giá Basic:</span>
                        <span class="font-bold text-blue-400">${formatMoney(pkg.price_basic || 0)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-purple-400">Giá Pro:</span>
                        <span class="font-bold text-purple-400">${formatMoney(pkg.price_pro || 0)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-amber-400">Giá Plus:</span>
                        <span class="font-bold text-amber-400">${formatMoney(pkg.price_plus || 0)}</span>
                    </div>
                    <div class="pt-2 border-t border-white/5 text-xs text-center italic text-slate-500">
                        *Giá được tính tự động theo cấu hình Game
                    </div>
                </div>
            `,
            background: '#0F172A',
            color: '#fff',
            showConfirmButton: false,
            showCloseButton: true,
        });
    };

    // --- Modal & Form Handlers ---

    const resetForm = () => {
        setFormData({
            package_name: "",
            origin_price: "",
            package_type: "default",
            status: "active",
            id_server: false,
            sale: false,
            fileAPI: "",
        });
        setThumbnailFile(null);
        setPreviewImg(null);
        setCurrentPackage(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (pkg) => {
        setCurrentPackage(pkg);
        setFormData({
            package_name: pkg.package_name,
            origin_price: pkg.origin_price || "",
            package_type: pkg.package_type || "default",
            status: pkg.status || "active",
            id_server: pkg.id_server ? true : false,
            sale: pkg.sale ? true : false,
            fileAPI: pkg.fileAPI ? JSON.stringify(pkg.fileAPI, null, 2) : "",
        });
        // Assuming 'thumbnail' field is a path string
        setPreviewImg(pkg.thumbnail ? `${API_URL}${pkg.thumbnail}` : null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailFile(file);
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedGame) {
            toast.error("Vui lòng chọn game trước");
            return;
        }
        if (!formData.package_name) {
            toast.warning("Vui lòng nhập tên gói");
            return;
        }

        try {
            const data = new FormData();

            // Backend expects 'info' as JSON string and 'image'/'thumbnail' file
            // Based on toup_package.service.js, it sends FormData directly.
            // Let's verify backend expectation. usually with multer:
            // The service sends `formData` object directly. 
            // We need to construct it carefully to match backend schema.

            // Constructing the payload
            // Note: The previous implementation used `data.append("info", JSON.stringify(formData))` for Games,
            // but for Packages, let's look at the old code or assume standard FormData if service takes formData.
            // Looking at `addPkg` in service: `api.post(apiURL, formData, ...)`
            // So we append fields directly.

            data.append("package_name", formData.package_name);
            data.append("game_id", selectedGame.id); // Important
            data.append("origin_price", formData.origin_price || 0);
            data.append("profit_percent_basic", formData.profit_percent_basic || 0);
            data.append("profit_percent_pro", formData.profit_percent_pro || 0);
            data.append("profit_percent_plus", formData.profit_percent_plus || 0);
            data.append("package_type", formData.package_type);
            data.append("status", formData.status);
            data.append("id_server", formData.id_server ? 1 : 0); // Boolean to int often safer for FormData
            data.append("sale", formData.sale ? 1 : 0);
            if (formData.fileAPI) {
                data.append("fileAPI", formData.fileAPI);
            }

            if (thumbnailFile) {
                // Backend expects 'thumbnail' per route config (upload.single("thumbnail"))
                data.append("thumbnail", thumbnailFile);
            }

            if (currentPackage) {
                // Update
                // Service: `updatePkg(id, formData)`
                await updatePkg(currentPackage.id, data);
                toast.success("Cập nhật thành công");
            } else {
                // Add
                if (!thumbnailFile) {
                    toast.warning("Vui lòng chọn ảnh minh họa");
                    return;
                }
                await addPkg(data);
                toast.success("Thêm gói mới thành công");
            }

            handleCloseModal();
            fetchPackages();

        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    // --- Render ---

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">

            {/* Header & Controls */}
            <div className="relative z-50 flex flex-col md:flex-col lg:flex-row gap-6 bg-[#1E293B]/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-xl">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Quản lý Gói Nạp
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Thiết lập các gói nạp cho từng game
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Game Selector */}
                    <div className="w-full sm:w-64 z-30">
                        <Listbox value={selectedGame} onChange={setSelectedGame}>
                            <div className="relative mt-1">
                                <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-[#0F172A] py-2.5 pl-3 pr-10 text-left border border-white/10 focus:outline-none focus:border-blue-500 sm:text-sm text-white shadow-lg transition-colors hover:border-blue-500/50">
                                    {selectedGame ? (
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={`${API_URL}${selectedGame.thumbnail}`}
                                                alt=""
                                                className="w-5 h-5 rounded object-cover"
                                            />
                                            <span className="block truncate">{selectedGame.name}</span>
                                        </div>
                                    ) : (
                                        <span className="block truncate text-slate-400">Chọn Game...</span>
                                    )}
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <FiChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </span>
                                </Listbox.Button>
                                <Transition
                                    as={React.Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-[#1E293B] py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm border border-white/10 z-[100]">
                                        {games.map((game, gameIdx) => (
                                            <Listbox.Option
                                                key={gameIdx}
                                                className={({ active }) =>
                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-600/20 text-blue-300' : 'text-slate-300'
                                                    }`
                                                }
                                                value={game}
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span className={`flex items-center gap-2 truncate ${selected ? 'font-medium text-blue-400' : 'font-normal'}`}>
                                                            <img
                                                                src={`${API_URL}${game.thumbnail}`}
                                                                alt=""
                                                                className="w-5 h-5 rounded object-cover"
                                                            />
                                                            {game.name}
                                                        </span>
                                                        {selected ? (
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
                                                                <FiCheck className="h-5 w-5" aria-hidden="true" />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>
                    </div>

                    {/* Search */}
                    <div className="relative group w-full sm:w-64">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm gói nạp..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full bg-[#0F172A] border border-white/10 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                        />
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={handleOpenAdd}
                        disabled={!selectedGame}
                        className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all
                            ${!selectedGame
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-105 active:scale-95'
                            }
                        `}
                    >
                        <FiPlus size={20} />
                        <span className="whitespace-nowrap">Thêm Gói</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : !selectedGame ? (
                <div className="text-center py-28 bg-[#1E293B]/30 rounded-2xl border border-dashed border-slate-700">
                    <FiLayers size={48} className="mx-auto text-slate-600 mb-4" />
                    <p className="text-slate-400 text-lg">Vui lòng chọn một game để xem danh sách gói nạp</p>
                </div>
            ) : packages.length === 0 ? (
                <div className="text-center py-20 bg-[#1E293B]/30 rounded-2xl border border-dashed border-slate-700">
                    <p className="text-slate-500">Chưa có gói nạp nào cho game này.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="group bg-[#1E293B]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative flex flex-col"
                        >
                            {/* Tags/Badges */}
                            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                                {pkg.status === 'active' ? (
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/20 backdrop-blur-md">
                                        Active
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 rounded-md bg-slate-500/20 text-slate-400 text-xs font-bold border border-slate-500/20 backdrop-blur-md">
                                        Inactive
                                    </span>
                                )}
                                {pkg.sale && (
                                    <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/20 backdrop-blur-md">
                                        Sale
                                    </span>
                                )}
                            </div>

                            {/* Image Area with Actions */}
                            <div className="relative aspect-[16/9] overflow-hidden bg-slate-900/50">
                                <img
                                    src={`${API_URL}${pkg.thumbnail}`}
                                    alt={pkg.package_name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => { e.target.src = '/placeholder.png'; }} // Fallback
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent opacity-80"></div>

                                {/* Hover Actions */}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <button
                                        onClick={() => handleDetail(pkg)}
                                        className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-emerald-500 hover:text-white transition-colors shadow-lg"
                                        title="Chi tiết giá"
                                    >
                                        <FiLayers size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleOpenEdit(pkg)}
                                        className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-blue-500 hover:text-white transition-colors shadow-lg"
                                        title="Chỉnh sửa"
                                    >
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(pkg.id)}
                                        className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-rose-500 hover:text-white transition-colors shadow-lg"
                                        title="Xóa"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-slate-100 mb-1 line-clamp-1" title={pkg.package_name}>
                                    {pkg.package_name}
                                </h3>

                                <div className="mt-auto pt-3 border-t border-white/5 flex items-end justify-between">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-0.5">Giá gốc</p>
                                        <p className="text-lg font-bold text-emerald-400">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pkg.origin_price || 0)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        {pkg.id_server && (
                                            <div className="flex items-center gap-1 text-[10px] text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/20" title="Yêu cầu nhập ID Server">
                                                <FiActivity size={10} /> ID Server
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- Modals --- */}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                        onClick={handleCloseModal}
                    ></div>
                    <div className="relative bg-[#1E293B] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl animate-[scaleIn_0.2s_ease-out] overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                {currentPackage ? <FiEdit2 className="text-blue-500" /> : <FiPlus className="text-blue-500" />}
                                {currentPackage ? "Cập nhật Gói Nạp" : "Thêm Gói Nạp Mới"}
                            </h3>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-white transition-colors">
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">

                            {/* Warning if no game selected (shouldn't happen due to valid check, but safely) */}
                            {!selectedGame && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                                    Lỗi: Chưa chọn game context. Vui lòng đóng và chọn game.
                                </div>
                            )}

                            {/* Name & Price Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Tên Gói</label>
                                    <input
                                        type="text"
                                        value={formData.package_name}
                                        onChange={(e) => setFormData({ ...formData, package_name: e.target.value })}
                                        className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="Ví dụ: Gói 1000 Kim Cương"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Loại Gói</label>
                                    <select
                                        value={formData.package_type}
                                        onChange={(e) => setFormData({ ...formData, package_type: e.target.value })}
                                        className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <option value="default">Mặc định</option>
                                        <option value="uid">Nạp UID</option>
                                        <option value="log">Nạp Log</option>
                                    </select>
                                </div>
                            </div>

                            {/* Pricing Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Giá Gốc (Giá nhập)</label>
                                    <div className="relative">
                                        <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="number"
                                            value={formData.origin_price}
                                            onChange={(e) => setFormData({ ...formData, origin_price: e.target.value })}
                                            className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                                            placeholder="100000"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="hidden md:block"></div> {/* Spacer */}
                            </div>

                            {/* Auto Pricing Note */}
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-200 text-sm flex gap-3">
                                <FiActivity className="mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-bold mb-1">Cơ chế tính giá tự động</p>
                                    <p className="opacity-80">
                                        Giá bán sẽ được tự động tính toán dựa trên <strong>Giá gốc</strong> và <strong>% Lợi nhuận</strong> được cấu hình tại cài đặt của Game.
                                    </p>

                                    {selectedGame && (
                                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div className="bg-slate-900/50 p-2 rounded border border-white/5">
                                                <span className="text-xs text-slate-400 block">% Basic: {selectedGame.profit_percent_basic || 0}%</span>
                                                <span className="text-sm font-bold text-blue-400">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.ceil((parseInt(formData.origin_price || 0)) * (1 + (parseInt(selectedGame.profit_percent_basic || 0) / 100))))}
                                                </span>
                                            </div>
                                            <div className="bg-slate-900/50 p-2 rounded border border-white/5">
                                                <span className="text-xs text-slate-400 block">% Pro: {selectedGame.profit_percent_pro || 0}%</span>
                                                <span className="text-sm font-bold text-purple-400">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.ceil((parseInt(formData.origin_price || 0)) * (1 + (parseInt(selectedGame.profit_percent_pro || 0) / 100))))}
                                                </span>
                                            </div>
                                            <div className="bg-slate-900/50 p-2 rounded border border-white/5">
                                                <span className="text-xs text-slate-400 block">% Plus: {selectedGame.profit_percent_plus || 0}%</span>
                                                <span className="text-sm font-bold text-amber-400">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.ceil((parseInt(formData.origin_price || 0)) * (1 + (parseInt(selectedGame.profit_percent_plus || 0) / 100))))}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Configuration Toggles */}
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 space-y-4">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Cấu hình nâng cao</label>

                                <div className="flex flex-wrap gap-6">
                                    {/* Status */}
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.status === 'active' ? 'bg-blue-600' : 'bg-slate-700'}`}
                                            onClick={() => setFormData({ ...formData, status: formData.status === 'active' ? 'inactive' : 'active' })}
                                        >
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.status === 'active' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-slate-300 group-hover:text-white transition-colors">Đang hoạt động</span>
                                    </label>

                                    {/* Sale */}
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.sale ? 'bg-rose-600' : 'bg-slate-700'}`}
                                            onClick={() => setFormData({ ...formData, sale: !formData.sale })}
                                        >
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.sale ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-slate-300 group-hover:text-white transition-colors">Đang Sale</span>
                                    </label>

                                    {/* ID Server */}
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.id_server ? 'bg-orange-600' : 'bg-slate-700'}`}
                                            onClick={() => setFormData({ ...formData, id_server: !formData.id_server })}
                                        >
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.id_server ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-slate-300 group-hover:text-white transition-colors">Yêu cầu ID Server</span>
                                    </label>
                                </div>
                            </div>

                            {/* fileAPI (JSON) */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">File API (JSON)</label>
                                <textarea
                                    value={formData.fileAPI}
                                    onChange={(e) => setFormData({ ...formData, fileAPI: e.target.value })}
                                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm h-24"
                                    placeholder='{"key": "value"}'
                                />
                                <p className="text-xs text-slate-500 mt-1">Nhập định dạng JSON hoặc để trống.</p>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Ảnh Minh Họa</label>
                                <div className="flex gap-4 items-start">
                                    <div
                                        className="w-32 h-32 bg-slate-900 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-blue-500 transition-colors"
                                        onClick={() => document.getElementById('pkg-thumbnail-upload').click()}
                                    >
                                        {previewImg ? (
                                            <img src={previewImg} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <div className="text-center p-2">
                                                <FiImage className="mx-auto text-slate-600 mb-1 group-hover:text-blue-500 transition-colors" size={24} />
                                                <span className="text-[10px] text-slate-600">Upload</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FiEdit2 className="text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            id="pkg-thumbnail-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <div className="text-sm text-slate-400 space-y-2">
                                            <p>· Dung lượng tối đa: 2MB</p>
                                            <p>· Định dạng: JPG, PNG, WEBP</p>
                                            <p>· Tỉ lệ khuyến nghị: 16:9 hoặc hình vuông</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </form>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/10 bg-slate-900/50 flex justify-end gap-3">
                            <button
                                onClick={handleCloseModal}
                                className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                            >
                                <FiSave />
                                {currentPackage ? "Lưu Thay Đổi" : "Thêm Gói Mới"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
