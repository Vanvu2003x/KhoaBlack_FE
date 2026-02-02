"use client";

import React, { useEffect, useState } from "react";
import {
    getGames,
    createGame,
    updateGame,
    deleteGame
} from "@/services/games.service";
import {
    FiPlus,
    FiSearch,
    FiEdit2,
    FiTrash2,
    FiX,
    FiImage,
    FiSave,
    FiMoreVertical,
    FiGlobe,
    FiHash,
    FiServer,
    FiRefreshCw
} from "react-icons/fi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import api from "@/utils/axios"; // Import api instance

export default function GameManagerPage() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncLoading, setSyncLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null); // Track which game is being deleted
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentGame, setCurrentGame] = useState(null); // null for add, object for edit

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        gamecode: "",
        publisher: "",
        server: [], // Array of server names
        profit_percent_basic: 0,
        profit_percent_pro: 0,
        profit_percent_basic: 0,
        profit_percent_pro: 0,
        profit_percent_plus: 0,
        origin_markup_percent: 0
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);

    const fetchGames = async () => {
        try {
            setLoading(true);
            const data = await getGames();
            setGames(data || []);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách game");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSyncNapGame = async () => {
        try {
            setSyncLoading(true);
            await api.post('/api/tools/sync-napgame');
            toast.success("Đã đồng bộ dữ liệu từ NapGame247");
            fetchGames(); // Refresh list to see new items
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi đồng bộ dữ liệu");
        } finally {
            setSyncLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    const resetForm = () => {
        setFormData({
            name: "",
            gamecode: "",
            publisher: "",
            server: [],
            profit_percent_basic: 0,
            profit_percent_pro: 0,
            profit_percent_basic: 0,
            profit_percent_pro: 0,
            profit_percent_plus: 0,
            origin_markup_percent: 0
        });
        setThumbnailFile(null);
        setPreviewImg(null);
        setCurrentGame(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (game) => {
        setCurrentGame(game);
        setFormData({
            name: game.name,
            gamecode: game.gamecode,
            publisher: game.publisher || "",
            server: Array.isArray(game.server) ? game.server : [],
            profit_percent_basic: game.profit_percent_basic || 0,
            profit_percent_pro: game.profit_percent_pro || 0,
            profit_percent_pro: game.profit_percent_pro || 0,
            profit_percent_plus: game.profit_percent_plus || 0,
            origin_markup_percent: game.origin_markup_percent || 0,
        });
        setPreviewImg(game.thumbnail?.startsWith('http') ? game.thumbnail : process.env.NEXT_PUBLIC_API_URL + game.thumbnail);
        setThumbnailFile(null);
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
        if (submitLoading) return;

        if (!formData.name || !formData.gamecode) {
            toast.warning("Vui lòng điền đầy đủ tên và mã game");
            return;
        }

        setSubmitLoading(true);
        try {
            const data = new FormData();

            // Construct info object including profit fields
            const infoObj = {
                ...formData,
                profit_percent_basic: Number(formData.profit_percent_basic),
                profit_percent_pro: Number(formData.profit_percent_pro),
                profit_percent_plus: Number(formData.profit_percent_plus),
                origin_markup_percent: Number(String(formData.origin_markup_percent).replace(',', '.'))
            };

            data.append("info", JSON.stringify(infoObj));
            if (thumbnailFile) {
                data.append("thumbnail", thumbnailFile);
            }

            if (currentGame) {
                // Edit
                await updateGame(currentGame.id, data);
                if (currentGame.profit_percent_basic !== infoObj.profit_percent_basic ||
                    currentGame.profit_percent_pro !== infoObj.profit_percent_pro ||
                    currentGame.profit_percent_plus !== infoObj.profit_percent_plus ||
                    currentGame.origin_markup_percent !== infoObj.origin_markup_percent) {
                    toast.info("Đang cập nhật giá các gói nạp...");
                }
                toast.success("Cập nhật game thành công");
            } else {
                // Add
                if (!thumbnailFile) {
                    toast.warning("Vui lòng chọn ảnh thumbnail");
                    setSubmitLoading(false);
                    return;
                }
                await createGame(data);
                toast.success("Thêm game mới thành công");
            }

            handleCloseModal();
            fetchGames();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (deleteLoading) return;

        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Hành động này không thể hoàn tác!",
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
            setDeleteLoading(id);
            try {
                await deleteGame(id);
                toast.success("Đã xóa game");
                fetchGames();
            } catch (error) {
                toast.error("Lỗi khi xóa game");
            } finally {
                setDeleteLoading(null);
            }
        }
    };

    const filteredGames = games.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.gamecode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1E293B]/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-xl">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                        Quản lý Game
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Quản lý danh sách các tựa game hiển thị trên hệ thống
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm game..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[#0F172A] border border-white/10 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 w-full md:w-64 transition-all"
                        />
                    </div>
                    <button
                        onClick={handleSyncNapGame}
                        disabled={syncLoading}
                        className="flex items-center gap-2 bg-slate-800 text-teal-400 border border-teal-500/30 px-5 py-2.5 rounded-xl font-bold hover:bg-teal-500/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        <FiRefreshCw size={20} className={syncLoading ? "animate-spin" : ""} />
                        <span className="hidden md:inline">{syncLoading ? "Đang đồng bộ..." : "Sync"}</span>
                    </button>
                    <button
                        onClick={handleOpenAdd}
                        className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:scale-105 active:scale-95 transition-all"
                    >
                        <FiPlus size={20} />
                        <span className="hidden md:inline">Thêm Game</span>
                    </button>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"></div>
                </div>
            ) : filteredGames.length === 0 ? (
                <div className="text-center py-20 bg-[#1E293B]/30 rounded-2xl border border-dashed border-slate-700">
                    <p className="text-slate-500">Chưa có game nào hoặc không tìm thấy kết quả.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredGames.map((game) => (
                        <div
                            key={game.id}
                            className="group bg-[#1E293B]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-teal-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative"
                        >
                            <div className="relative aspect-[16/9] overflow-hidden">
                                <img
                                    src={game.thumbnail?.startsWith('http') ? game.thumbnail : process.env.NEXT_PUBLIC_API_URL + game.thumbnail}
                                    alt={game.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent opacity-80"></div>

                                {/* Absolute Actions */}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <button
                                        onClick={() => handleOpenEdit(game)}
                                        className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-teal-500 hover:text-white transition-colors shadow-lg"
                                        title="Chỉnh sửa"
                                    >
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(game.id)}
                                        disabled={deleteLoading === game.id}
                                        className={`p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-red-500 hover:text-white transition-colors shadow-lg ${deleteLoading === game.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        title="Xóa"
                                    >
                                        {deleteLoading === game.id ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <FiTrash2 size={16} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="mb-3">
                                    <h3 className="text-lg font-bold text-slate-100 truncate mb-1" title={game.name}>
                                        {game.name}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-sm text-slate-400">
                                        <FiGlobe className="shrink-0 text-teal-500" size={14} />
                                        <span className="truncate">{game.publisher || "Chưa cập nhật"}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-white/5">
                                        <FiHash className="text-slate-500" size={12} />
                                        <span>{game.gamecode}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-white/5" title="Số lượng server">
                                        <FiServer className="text-indigo-400" size={12} />
                                        <span>{Array.isArray(game.server) ? game.server.length : 0} Server</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0  flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                        onClick={handleCloseModal}
                    ></div>
                    <div className="relative bg-[#1E293B] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl animate-[scaleIn_0.2s_ease-out] overflow-hidden flex flex-col max-h-[60vh] translate-y-5">
                        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-slate-900/50 shrink-0">
                            <h3 className="text-xl font-bold text-white">
                                {currentGame ? "Chỉnh sửa Game" : "Thêm Game Mới"}
                            </h3>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-white transition-colors">
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1 h-[60vh]">

                            {/* General Info Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="col-span-1 sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên Game</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                                        placeholder="Ví dụ: Liên Quân Mobile"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mã Game (Code)</label>
                                    <input
                                        type="text"
                                        value={formData.gamecode}
                                        onChange={(e) => setFormData({ ...formData, gamecode: e.target.value })}
                                        className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-teal-500 transition-colors font-mono"
                                        placeholder="lienquan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nhà Phát Hành</label>
                                    <input
                                        type="text"
                                        value={formData.publisher}
                                        onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                                        className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                                        placeholder="Ví dụ: Garena"
                                    />
                                </div>
                            </div>

                            {/* Profit Configuration */}
                            <div className="bg-slate-800/50 p-3 rounded-lg border border-white/5 space-y-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase">Cấu hình giá</label>
                                <div className="grid grid-cols-4 gap-3">
                                    <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-700">
                                        <label className="block text-[10px] uppercase text-slate-400 mb-1">Hệ số Nguồn (x)</label>
                                        <input
                                            type="text"
                                            value={formData.origin_markup_percent}
                                            onChange={(e) => setFormData({ ...formData, origin_markup_percent: e.target.value })}
                                            className="w-full bg-[#0F172A] border border-slate-600 rounded-lg px-2 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-red-500 transition-colors text-center font-bold"
                                            placeholder="1.0"
                                            title="Hệ số nhân với giá API gốc để ra giá gốc của shop (Ví dụ: 1.1 = tăng 10%)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase text-blue-400 mb-1">Lãi Basic (%)</label>
                                        <input
                                            type="number"
                                            value={formData.profit_percent_basic}
                                            onChange={(e) => setFormData({ ...formData, profit_percent_basic: e.target.value })}
                                            className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors text-center font-bold"
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase text-purple-400 mb-1">Lãi Pro (%)</label>
                                        <input
                                            type="number"
                                            value={formData.profit_percent_pro}
                                            onChange={(e) => setFormData({ ...formData, profit_percent_pro: e.target.value })}
                                            className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition-colors text-center font-bold"
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase text-amber-400 mb-1">Lãi VIP (%)</label>
                                        <input
                                            type="number"
                                            value={formData.profit_percent_plus}
                                            onChange={(e) => setFormData({ ...formData, profit_percent_plus: e.target.value })}
                                            className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-amber-500 transition-colors text-center font-bold"
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Server Management */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Danh sách Server</label>
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            id="serverInput"
                                            className="flex-1 bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                                            placeholder="Tên server..."
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = e.target.value.trim();
                                                    if (val) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            server: [...(prev.server || []), val]
                                                        }));
                                                        e.target.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const input = document.getElementById('serverInput');
                                                const val = input.value.trim();
                                                if (val) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        server: [...(prev.server || []), val]
                                                    }));
                                                    input.value = '';
                                                }
                                            }}
                                            className="px-3 py-1.5 bg-slate-800 text-teal-400 rounded-lg border border-teal-500/30 text-xs font-bold hover:bg-teal-500/10 transition-colors"
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                                        {(formData.server || []).map((srv, idx) => (
                                            <span key={idx} className="bg-slate-800 border border-slate-600 text-slate-300 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                                                {srv}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newServers = [...formData.server];
                                                        newServers.splice(idx, 1);
                                                        setFormData({ ...formData, server: newServers });
                                                    }}
                                                    className="hover:text-red-400 transition-colors"
                                                >
                                                    <FiX size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>


                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hình ảnh</label>
                                <div className="flex gap-3 items-center">
                                    <div
                                        className="w-16 h-16 bg-slate-900 rounded-lg border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-teal-500 transition-colors shrink-0"
                                        onClick={() => document.getElementById('thumbnail-upload').click()}
                                    >
                                        {previewImg ? (
                                            <img src={previewImg} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <FiImage className="text-slate-600 group-hover:text-teal-500 transition-colors" size={20} />
                                        )}
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FiEdit2 className="text-white" size={12} />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            id="thumbnail-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('thumbnail-upload').click()}
                                            className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs hover:bg-slate-700 transition-colors border border-white/5"
                                        >
                                            Chọn ảnh
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="p-4 border-t border-white/10 bg-slate-900/50 flex justify-end gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                disabled={submitLoading}
                                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={submitLoading}
                                className={`px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 text-sm ${submitLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {submitLoading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <FiSave size={16} />
                                )}
                                {submitLoading ? "Đang lưu..." : (currentGame ? "Lưu" : "Thêm")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function FiCheck({ className }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    );
}
