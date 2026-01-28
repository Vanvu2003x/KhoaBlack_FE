"use client"
import { useState, useEffect } from "react"
import api from "@/utils/axios"
import RichTextEditor from "@/components/common/richtexteditor"
import { FiPlus, FiEdit, FiX, FiUpload, FiImage } from "react-icons/fi"
import { useToast } from "@/components/ui/Toast"

export default function AccForm({ gameList, selectedGame, onSuccess, onClose, editMode = false, accData = null }) {
    const toast = useToast()
    const [formData, setFormData] = useState({
        info: "",
        price: "",
        price_basic: "",
        price_pro: "",
        price_plus: "",
        game_id: selectedGame?.id || "",
        status: "selling"
    })
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)

    // Initialize form with edit data
    useEffect(() => {
        if (editMode && accData) {
            setFormData({
                info: accData.info || "",
                price: accData.price || "",
                price_basic: accData.price_basic || "",
                price_pro: accData.price_pro || "",
                price_plus: accData.price_plus || "",
                game_id: accData.game_id || selectedGame?.id || "",
                status: accData.status || "selling"
            })
            // Set preview to existing image
            if (accData.image) {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
                setPreview(`${apiBaseUrl}/uploads/${accData.image}`)
            }
        } else if (selectedGame) {
            setFormData(prev => ({ ...prev, game_id: selectedGame.id }))
        }
    }, [editMode, accData, selectedGame])

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        setFile(selectedFile)
        if (selectedFile) {
            const reader = new FileReader()
            reader.onloadend = () => setPreview(reader.result)
            reader.readAsDataURL(selectedFile)
        } else {
            // If editing and no new file, keep existing preview
            if (editMode && accData?.image) {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
                setPreview(`${apiBaseUrl}/uploads/${accData.image}`)
            } else {
                setPreview(null)
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.info || formData.info.trim() === "") {
            toast.error("Vui lòng nhập thông tin tài khoản")
            return
        }
        if (!formData.price || formData.price <= 0) {
            toast.error("Vui lòng nhập giá hợp lệ")
            return
        }
        if (!editMode && !file) {
            toast.error("Vui lòng chọn ảnh mô tả")
            return
        }

        setLoading(true)
        try {
            const formDataToSend = new FormData()
            formDataToSend.append("info", formData.info)
            formDataToSend.append("price", formData.price)
            formDataToSend.append("price_basic", formData.price_basic)
            formDataToSend.append("price_pro", formData.price_pro)
            formDataToSend.append("price_plus", formData.price_plus)
            formDataToSend.append("status", formData.status)
            formDataToSend.append("game_id", formData.game_id)

            // Only append image if a new file was selected
            if (file) {
                formDataToSend.append("image", file)
            }

            const token = localStorage.getItem("token")
            let res

            if (editMode) {
                // Update existing account
                res = await api.put(`/api/acc/${accData.id}`, formDataToSend, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`
                    }
                })
                toast.success("Cập nhật tài khoản thành công!")
            } else {
                // Create new account
                res = await api.post("/api/acc", formDataToSend, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`
                    }
                })
                toast.success("Thêm tài khoản mới thành công!")
            }

            // Call success callback with new/updated data
            if (onSuccess) onSuccess(res.data.data)

            // Reset form
            if (!editMode) {
                setFormData({
                    info: "",
                    price: "",
                    price_basic: "",
                    price_pro: "",
                    price_plus: "",
                    game_id: selectedGame?.id || "",
                    status: "selling"
                })
                setFile(null)
                setPreview(null)
            }

            // Close modal if in edit mode
            if (editMode && onClose) {
                onClose()
            }
        } catch (error) {
            console.error("Error submitting form:", error)
            const errorMsg = error.response?.data?.message || error.message || "Đã xảy ra lỗi"
            toast.error(editMode ? `Lỗi cập nhật: ${errorMsg}` : `Lỗi thêm mới: ${errorMsg}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-[#1E293B] border border-white/10 p-3 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {editMode ? (
                        <>
                            <FiEdit className="bg-blue-500/20 text-blue-400 p-1 rounded-md box-content" />
                            Chỉnh sửa tài khoản #{accData?.id}
                        </>
                    ) : (
                        <>
                            <FiPlus className="bg-blue-500/20 text-blue-400 p-1 rounded-md box-content" />
                            Thêm tài khoản mới
                        </>
                    )}
                </h3>
                {editMode && onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                <div className="md:col-span-2">
                    <label className="block font-bold text-slate-300 mb-2">Thông tin tài khoản <span className="text-red-500">*</span></label>
                    <textarea
                        className="w-full bg-[#0F172A] border border-white/10 px-3 py-2 rounded-xl text-white focus:border-purple-500/50 outline-none transition-colors resize-none text-sm"
                        value={formData.info}
                        onChange={e => setFormData(prev => ({ ...prev, info: e.target.value }))}
                        placeholder="Nhập thông tin chi tiết về tài khoản..."
                        rows={2}
                        required
                    />
                </div>

                <div className="md:col-span-2 grid grid-cols-2 lg:grid-cols-3 gap-2">
                    <div>
                        <label className="block font-bold text-slate-300 mb-1 text-xs">Giá Basic (Mặc định) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input
                                type="number"
                                className="w-full bg-[#0F172A] border border-white/10 px-3 py-2 rounded-xl text-white focus:border-purple-500/50 outline-none transition-colors pl-6 text-sm"
                                value={formData.price}
                                onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                placeholder="0"
                                min="1"
                            />
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">₫</span>
                        </div>
                    </div>
                    <div>
                        <label className="block font-bold text-slate-300 mb-1 text-xs">Giá Pro (Opt)</label>
                        <div className="relative">
                            <input
                                type="number"
                                className="w-full bg-[#0F172A] border border-white/10 px-3 py-2 rounded-xl text-white focus:border-purple-500/50 outline-none transition-colors pl-6 text-sm"
                                value={formData.price_pro}
                                onChange={e => setFormData(prev => ({ ...prev, price_pro: e.target.value }))}
                                placeholder="Auto"
                            />
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">₫</span>
                        </div>
                    </div>
                    <div>
                        <label className="block font-bold text-slate-300 mb-1 text-xs">Giá VIP (Opt)</label>
                        <div className="relative">
                            <input
                                type="number"
                                className="w-full bg-[#0F172A] border border-white/10 px-3 py-2 rounded-xl text-white focus:border-purple-500/50 outline-none transition-colors pl-6 text-sm"
                                value={formData.price_plus}
                                onChange={e => setFormData(prev => ({ ...prev, price_plus: e.target.value }))}
                                placeholder="Auto"
                            />
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">₫</span>
                        </div>
                    </div>
                </div>

                {editMode && (
                    <div>
                        <label className="block font-bold text-slate-300 mb-1 text-sm">Trạng thái</label>
                        <select
                            className="w-full bg-[#0F172A] border border-white/10 px-3 py-2 rounded-xl text-white focus:border-purple-500/50 outline-none transition-colors text-sm"
                            value={formData.status}
                            onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        >
                            <option value="selling">Chưa bán (Selling)</option>
                            <option value="sold">Đã bán (Sold)</option>
                        </select>
                    </div>
                )}

                <div className="md:col-span-2">
                    <label className="block font-bold text-slate-300 mb-1 text-sm">
                        Hình ảnh mô tả {!editMode && <span className="text-red-500">*</span>}
                    </label>
                    <div className="border-2 border-dashed border-slate-700 hover:border-purple-500/50 rounded-xl p-3 transition-colors text-center cursor-pointer relative group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        {!preview ? (
                            <div className="text-slate-400">
                                <FiImage className="text-4xl mb-2 mx-auto" />
                                <span className="text-sm font-medium">Click để tải ảnh lên</span>
                                <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        ) : (
                            <div className="relative">
                                <img src={preview} alt="Preview" className="h-24 mx-auto rounded-lg object-contain shadow-lg" />
                                <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
                                    <FiUpload />
                                    <span>Click để thay đổi</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                {editMode && onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
                        disabled={loading}
                    >
                        Hủy
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Đang xử lý...
                        </span>
                    ) : editMode ? "Cập nhật" : "Đăng bán ngay"}
                </button>
            </div>
        </form>
    )
}
