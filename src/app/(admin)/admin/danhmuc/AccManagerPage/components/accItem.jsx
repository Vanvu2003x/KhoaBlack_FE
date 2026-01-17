"use client"
import ReactMarkdown from "react-markdown"
import { useState } from "react"
import api from "@/utils/axios"
import { FiTrash2, FiMaximize2, FiDollarSign, FiTag } from "react-icons/fi"

export default function AccItem({ acc, onDelete }) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const [status, setStatus] = useState(acc.status)
    const [showModal, setShowModal] = useState(false)

    const handleDelete = async () => {
        if (!confirm("Bạn có chắc muốn xóa account này không?")) return
        try {
            const token = localStorage.getItem("token")
            await api.delete(`/api/acc/${acc.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (onDelete) onDelete(acc.id)
        } catch (error) {
            console.error("Lỗi khi xóa account:", error)
        }
    }

    const statusClasses = {
        selling: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
        sold: "bg-slate-700/50 text-slate-400 border border-slate-600/30"
    }

    return (
        <>
            <div className="w-full bg-[#1E293B]/50 backdrop-blur-md border border-white/5 rounded-2xl p-4 transition-all hover:border-cyan-500/30 hover:bg-[#1E293B]/80 flex flex-col h-full shadow-lg">
                {/* ID Header */}
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono text-slate-500 bg-[#0F172A] px-2 py-1 rounded-md">ID: {acc.id}</span>
                    <div className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${statusClasses[status] || 'text-slate-500'}`}>
                        {status}
                    </div>
                </div>

                {/* Image */}
                {acc.image && (
                    <div className="relative group mb-4 rounded-xl overflow-hidden border border-white/10 bg-[#0F172A] aspect-video">
                        <img
                            src={`${apiBaseUrl}/uploads/${acc.image}`}
                            alt="acc"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onClick={() => setShowModal(true)}
                        />
                        <div
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                            onClick={() => setShowModal(true)}
                        >
                            <FiMaximize2 className="text-white drop-shadow-lg" size={24} />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 mb-4 relative">
                    <div className="h-32 overflow-y-auto pr-2 custom-scrollbar text-sm text-slate-300 prose prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: acc.info }} />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#1E293B] to-transparent pointer-events-none"></div>
                </div>

                {/* Footer */}
                <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-emerald-400 font-bold font-mono text-lg">
                        <FiDollarSign size={16} /> {Number(acc.price).toLocaleString('vi-VN')}
                    </div>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-3 py-1.5 rounded-lg hover:bg-rose-500/20 text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                        <FiTrash2 size={14} /> Xóa
                    </button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]"
                    onClick={() => setShowModal(false)}
                >
                    <img
                        src={`${apiBaseUrl}/uploads/${acc.image}`}
                        alt="acc full"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-[scaleIn_0.2s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        className="absolute top-4 right-4 text-white/50 hover:text-white"
                        onClick={() => setShowModal(false)}
                    >
                        ✕ Close
                    </button>
                </div>
            )}
        </>
    )
}
