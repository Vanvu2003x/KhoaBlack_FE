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
    FiServer
} from "react-icons/fi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function GameManagerPage() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        fetchGames();
    }, []);

    const resetForm = () => {
        setFormData({
            name: "",
            gamecode: "",
            publisher: "",
            server: [],
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
        });
        setPreviewImg(process.env.NEXT_PUBLIC_API_URL + game.thumbnail);
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

        if (!formData.name || !formData.gamecode) {
            toast.warning("Vui lòng điền đầy đủ tên và mã game");
            return;
        }

        try {
            const data = new FormData();
            data.append("info", JSON.stringify(formData));
            if (thumbnailFile) {
                data.append("thumbnail", thumbnailFile);
            }

            if (currentGame) {
                // Edit
                await updateGame(currentGame.id, data);
                toast.success("Cập nhật game thành công");
            } else {
                // Add
                if (!thumbnailFile) {
                    toast.warning("Vui lòng chọn ảnh thumbnail");
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
        }
    };

    const handleDelete = async (id) => {
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
            try {
                await deleteGame(id);
                toast.success("Đã xóa game");
                fetchGames();
            } catch (error) {
                toast.error("Lỗi khi xóa game");
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
                                    src={process.env.NEXT_PUBLIC_API_URL + game.thumbnail}
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
                                        className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                                        title="Xóa"
                                    >
                                        <FiTrash2 size={16} />
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                        onClick={handleCloseModal}
                    ></div>
                    <div className="relative bg-[#1E293B] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl animate-[scaleIn_0.2s_ease-out] overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                            <h3 className="text-xl font-bold text-white">
                                {currentGame ? "Chỉnh sửa Game" : "Thêm Game Mới"}
                            </h3>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-white transition-colors">
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Tên Game</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
                                    placeholder="Ví dụ: Liên Quân Mobile"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Mã Game (Code)</label>
                                    <input
                                        type="text"
                                        value={formData.gamecode}
                                        onChange={(e) => setFormData({ ...formData, gamecode: e.target.value })}
                                        className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-teal-500 transition-colors font-mono"
                                        placeholder="lienquan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Nhà Phát Hành (Publisher)</label>
                                    <input
                                        type="text"
                                        value={formData.publisher}
                                        onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                                        className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
                                        placeholder="Ví dụ: Garena"
                                    />
                                </div>
                            </div>

                            {/* Server Management */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Danh sách Server</label>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            id="serverInput"
                                            className="flex-1 bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
                                            placeholder="Nhập tên server và nhấn Thêm"
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
                                            className="px-4 py-2 bg-slate-800 text-teal-400 rounded-xl border border-teal-500/30 hover:bg-teal-500/10 transition-colors"
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.server || []).map((srv, idx) => (
                                            <span key={idx} className="bg-slate-800 border border-slate-600 text-slate-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
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
                                                    <FiX size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Hình ảnh (Thumbnail)</label>
                                <div className="flex gap-4 items-start">
                                    <div
                                        className="w-24 h-24 bg-slate-900 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-teal-500 transition-colors"
                                        onClick={() => document.getElementById('thumbnail-upload').click()}
                                    >
                                        {previewImg ? (
                                            <img src={previewImg} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <FiImage className="text-slate-600 group-hover:text-teal-500 transition-colors" size={24} />
                                        )}
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FiEdit2 className="text-white" />
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
                                            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors border border-white/5"
                                        >
                                            Chọn ảnh
                                        </button>
                                        <p className="text-xs text-slate-500 mt-2">
                                            Khuyến nghị: Tỉ lệ 16:9, dung lượng dưới 2MB.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                                >
                                    <FiSave />
                                    {currentGame ? "Lưu thay đổi" : "Thêm mới"}
                                </button>
                            </div>
                        </form>
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
