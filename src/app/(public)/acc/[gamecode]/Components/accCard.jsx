"use client"
import { BuyAcc } from "@/services/accOrder"
import { useState, useMemo } from "react"
import { useToast } from "@/components/ui/Toast"
import { FiZap, FiShoppingCart, FiX, FiMaximize2, FiPhone, FiMail, FiMessageSquare } from "react-icons/fi"
import Link from "next/link"
import DOMPurify from "dompurify"

export default function AccCardItem({ acc, userLevel, onBuySuccess }) {
    const toast = useToast()
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const [showImageModal, setShowImageModal] = useState(false)
    const [showBuyModal, setShowBuyModal] = useState(false)
    const [buying, setBuying] = useState(false)

    // Calculate Price Logic
    const getFinalPrice = () => {
        const level = Number(userLevel) || 1;
        let final = acc.price;
        if (level === 2 && acc.price_pro) final = acc.price_pro;
        if (level === 3 && acc.price_plus) final = acc.price_plus;
        // Basic override if exists (rare)
        if (level === 1 && acc.price_basic) final = acc.price_basic;
        return parseInt(final);
    }

    const finalPrice = getFinalPrice();
    const originalPrice = parseInt(acc.price);

    const [contactInfo, setContactInfo] = useState({
        phone: "",
        email: "",
        zalo: "",
        note: ""
    })

    const handleChange = (e) => {
        setContactInfo({ ...contactInfo, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        if (!contactInfo.phone || !contactInfo.email || !contactInfo.zalo) {
            toast.error("Vui lòng nhập đầy đủ số điện thoại, email và Zalo")
            return
        }

        const payload = {
            acc_id: acc.id,
            contact_info: {
                phone: contactInfo.phone,
                email: contactInfo.email,
                zalo: contactInfo.zalo,
                note: contactInfo.note || ""
            }
        }

        setBuying(true)
        try {
            await BuyAcc(payload)
            setShowBuyModal(false)
            toast.success("Đặt hàng thành công! Chúng tôi sẽ liên hệ bạn sớm")
            setContactInfo({ phone: "", email: "", zalo: "", note: "" })
            if (onBuySuccess) onBuySuccess()
        } catch (error) {
            toast.error(error.response?.data?.message || "Đặt hàng thất bại")
        } finally {
            setBuying(false)
        }
    }

    return (
        <>
            {/* CARD */}
            <div className="group relative h-full flex flex-col bg-[#1E293B]/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1">
                {/* Gradient Border Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                {/* ID Badge */}
                <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-mono font-bold rounded-lg shadow-lg">
                        #{acc.id}
                    </span>
                </div>

                {/* Image Area */}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                    {acc.image ? (
                        <Link href={`/acc/detail/${acc.id}`}>
                            <div className="w-full h-full cursor-pointer group/img">
                                <img
                                    src={acc.image?.startsWith('http') ? acc.image : `${apiBaseUrl}/uploads/${acc.image}`}
                                    alt="acc"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                                {/* Center Action */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-bold flex items-center gap-2 transform hover:scale-105 transition-transform">
                                        <FiMaximize2 /> Xem chi tiết
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-800">
                            <span className="text-4xl">🎮</span>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-5 flex flex-col">
                    {/* Price Tag */}
                    <div className="mb-4">
                        <div className="flex flex-col">
                            {finalPrice < originalPrice && (
                                <span className="text-xs font-medium text-slate-500 line-through decoration-slate-500 mb-0.5 ml-1">
                                    {originalPrice.toLocaleString('vi-VN')} đ
                                </span>
                            )}
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm">
                                    {finalPrice.toLocaleString('vi-VN')}
                                </span>
                                <span className="text-sm font-bold text-slate-500">VNĐ</span>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-white/5 mb-4"></div>

                    {/* Description */}
                    <div className="flex-1 relative mb-4 min-h-[4.5em]">
                        <div className="text-sm text-slate-300 font-medium leading-relaxed line-clamp-3">
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(acc.info || '') }} />
                        </div>
                    </div>

                    {/* Actions Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-auto pt-2">
                        <a
                            href={`https://zalo.me/${acc.contact?.zalo || "0963575203"}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-bold border border-white/5 hover:border-white/10"
                        >
                            <FiZap size={14} />
                            Tư vấn
                        </a>
                        <button
                            onClick={() => setShowBuyModal(true)}
                            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all text-xs font-bold"
                        >
                            <FiShoppingCart size={14} />
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>

            {/* IMAGE MODAL */}
            {showImageModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]"
                    onClick={() => setShowImageModal(false)}
                >
                    <button
                        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-colors"
                        onClick={() => setShowImageModal(false)}
                    >
                        <FiX size={24} />
                    </button>
                    <img
                        src={acc.image?.startsWith('http') ? acc.image : `${apiBaseUrl}/uploads/${acc.image}`}
                        alt="Full acc"
                        className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl animate-[scaleIn_0.3s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* BUY MODAL */}
            {showBuyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-[#1E293B] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl animate-[scaleIn_0.3s_ease-out]">
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FiShoppingCart className="text-purple-400" />
                                Đặt mua tài khoản #{acc.id}
                            </h2>
                            <button
                                onClick={() => setShowBuyModal(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-slate-300">
                                    <FiPhone className="text-cyan-400" />
                                    Số điện thoại <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={contactInfo.phone}
                                    onChange={handleChange}
                                    placeholder="Nhập số điện thoại của bạn"
                                    className="w-full bg-[#0F172A] border border-white/10 px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-slate-300">
                                    <FiMail className="text-cyan-400" />
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={contactInfo.email}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
                                    className="w-full bg-[#0F172A] border border-white/10 px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-slate-300">
                                    <FiZap className="text-cyan-400" />
                                    Zalo <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="zalo"
                                    value={contactInfo.zalo}
                                    onChange={handleChange}
                                    placeholder="Số Zalo của bạn"
                                    className="w-full bg-[#0F172A] border border-white/10 px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-slate-300">
                                    <FiMessageSquare className="text-cyan-400" />
                                    Ghi chú (tùy chọn)
                                </label>
                                <textarea
                                    name="note"
                                    value={contactInfo.note}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Thêm ghi chú cho đơn hàng..."
                                    className="w-full bg-[#0F172A] border border-white/10 px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 border-t border-white/10 flex gap-3">
                            <button
                                className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors font-medium"
                                onClick={() => setShowBuyModal(false)}
                                disabled={buying}
                            >
                                Hủy
                            </button>
                            <button
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSubmit}
                                disabled={buying}
                            >
                                {buying ? "Đang xử lý..." : "Xác nhận mua"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
