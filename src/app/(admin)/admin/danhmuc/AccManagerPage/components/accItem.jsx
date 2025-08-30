"use client"
import ReactMarkdown from "react-markdown"
import { useState } from "react"
import api from "@/utils/axios"

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
        selling: "bg-yellow-100 text-yellow-700",
        sold: "bg-gray-100 text-gray-700"
    }

    return (
        <>
            <div className="w-full border rounded bg-white p-4 hover:shadow-sm">
                {/* ID */}
                <p className="text-sm text-gray-500 mb-1">ID: {acc.id}</p>

                {acc.image && (
                    <img
                        src={`${apiBaseUrl}/uploads/${acc.image}`}
                        alt="acc"
                        className="w-full h-48 object-cover rounded mb-4 cursor-pointer"
                        onClick={() => setShowModal(true)}
                    />
                )}
                <div className="mb-2 h-32 overflow-y-auto whitespace-pre-wrap">
                    <div dangerouslySetInnerHTML={{ __html: acc.info }} />
                </div>

                <div className="flex items-center justify-between mb-2">
                    <div className="text-gray-600">
                        Giá: <span className="font-medium">{acc.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            className={`inline-block px-2 py-1 text-sm font-medium rounded ${statusClasses[status]}`}
                        >
                            {status}
                        </div>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>


            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <img
                        src={`${apiBaseUrl}/uploads/${acc.image}`}
                        alt="acc full"
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    )
}
