"use client"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FiArrowLeft, FiHeart, FiShoppingCart, FiZap, FiCheck, FiStar, FiTrendingUp, FiPhone, FiMail, FiMessageSquare, FiX } from "react-icons/fi"
import { BuyAcc } from "@/services/accOrder"
import { toast } from "react-toastify"
import ReactMarkdown from "react-markdown"
import { getInfo } from "@/services/auth.service"

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

export default function AccDetailPage() {
    const params = useParams()
    const router = useRouter()
    const accId = params?.id

    const [acc, setAcc] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [showBuyModal, setShowBuyModal] = useState(false)
    const [buying, setBuying] = useState(false)
    const [userLevel, setUserLevel] = useState(1)

    const [contactInfo, setContactInfo] = useState({
        phone: "",
        email: "",
        zalo: "",
        note: ""
    })

    // Fetch User Info
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getInfo()
                if (data && data.user) {
                    setUserLevel(Number(data.user.level) || 1)
                }
            } catch (err) {
                console.error("Fetch user error:", err)
            }
        }
        fetchUser()
    }, [])

    useEffect(() => {
        if (!accId) return

        const fetchAcc = async () => {
            try {
                const token = localStorage.getItem("token")
                const res = await fetch(`${apiBaseUrl}/api/acc/${accId}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                })
                const data = await res.json()
                if (data.success) {
                    setAcc(data.data)
                }
            } catch (error) {
                console.error("Error fetching account:", error)
                toast.error("Không thể tải thông tin tài khoản")
            } finally {
                setLoading(false)
            }
        }

        fetchAcc()
    }, [accId])

    const handleBuySubmit = async () => {
        if (!contactInfo.phone || !contactInfo.email || !contactInfo.zalo) {
            toast.error("Vui lòng nhập đầy đủ thông tin liên hệ")
            return
        }

        setBuying(true)
        try {
            await BuyAcc({
                acc_id: acc.id,
                contact_info: contactInfo
            })
            setShowBuyModal(false)
            toast.success("Đặt hàng thành công! Chúng tôi sẽ liên hệ bạn sớm")
            setContactInfo({ phone: "", email: "", zalo: "", note: "" })
        } catch (error) {
            toast.error(error.response?.data?.message || "Đặt hàng thất bại")
        } finally {
            setBuying(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
                <div className="text-white text-xl">Đang tải...</div>
            </div>
        )
    }

    if (!acc) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
                <div className="text-white text-xl">Không tìm thấy tài khoản</div>
            </div>
        )
    }

    // Pricing Logic
    const basePrice = Number(acc.price);
    let finalPrice = basePrice;

    // Logic must match Backend `accOrder.service.js`
    if (userLevel === 2 && acc.price_pro) finalPrice = Number(acc.price_pro);
    if (userLevel === 3 && acc.price_plus) finalPrice = Number(acc.price_plus);
    if (userLevel === 1 && acc.price_basic) finalPrice = Number(acc.price_basic);

    // Parse images array or fallback to single image
    const images = acc.images ? JSON.parse(acc.images) : (acc.image ? [acc.image] : [])

    return (
        <div className="min-h-screen bg-[#0F172A]">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                    <FiArrowLeft /> Quay lại
                </button>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Image Gallery */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#1E293B]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                            {/* Badge */}
                            <div className="mb-4">
                                <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-bold rounded-full">
                                    ⚡ TÀI KHOẢN SIÊU ĐẸP
                                </span>
                            </div>

                            {/* Main Image */}
                            <div className="relative mb-4 rounded-xl overflow-hidden group">
                                <img
                                    src={`${apiBaseUrl}/uploads/${images[selectedImage]}`}
                                    alt="Account"
                                    className="w-full h-[400px] object-cover"
                                />
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                                                ? "border-purple-500 scale-105"
                                                : "border-white/10 hover:border-purple-500/50"
                                                }`}
                                        >
                                            <img
                                                src={`${apiBaseUrl}/uploads/${img}`}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-20 object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="bg-[#1E293B]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl mt-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full"></div>
                                Mô Tả Chi Tiết & Skin Hiếm
                            </h3>
                            <div className="prose prose-invert max-w-none">
                                <div className="text-slate-300 leading-relaxed">
                                    <ReactMarkdown>
                                        {acc.info}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            {/* Highlights */}
                            {acc.highlights && (
                                <div className="mt-6 space-y-2">
                                    {JSON.parse(acc.highlights).map((highlight, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 text-emerald-400"
                                        >
                                            <FiCheck className="text-emerald-500" />
                                            <span>{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Commitment Section */}
                        <div className="bg-[#1E293B]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl mt-6">
                            <h3 className="text-xl font-bold text-white mb-4">✨ Cam Kết Của Chúng Tôi</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <FiCheck className="text-emerald-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <div className="text-white font-medium">Bảo hành 100%</div>
                                        <div className="text-slate-400 text-sm">
                                            Đảm bảo tài khoản đúng như mô tả, hoàn tiền nếu không đúng
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FiCheck className="text-emerald-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <div className="text-white font-medium">Hỗ trợ tận tâm dài lâu</div>
                                        <div className="text-slate-400 text-sm">
                                            Team hỗ trợ 24/7, giải đáp mọi thắc mắc
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FiCheck className="text-emerald-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <div className="text-white font-medium">Hệ thống đảm bảo</div>
                                        <div className="text-slate-400 text-sm">
                                            Giao dịch an toàn qua trung gian uy tín
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Purchase Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#1E293B]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl sticky top-8">
                            <div className="mb-4">
                                <div className="text-slate-400 text-sm mb-1">MÃ HÀNG TRÚ</div>
                                <div className="text-white font-bold text-lg">Acc #LOL-{acc.id}</div>
                            </div>

                            <div className="border-t border-white/10 pt-4 mb-6">
                                <div className="text-slate-400 text-sm mb-2">GIÁ BÁN</div>
                                <div className="flex flex-col items-start">
                                    {finalPrice < basePrice && (
                                        <span className="text-slate-500 text-sm line-through decoration-slate-500 mb-1">
                                            {basePrice.toLocaleString('vi-VN')} ₫
                                        </span>
                                    )}
                                    <div className="flex items-end gap-2">
                                        <span className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                            {finalPrice.toLocaleString('vi-VN')}
                                        </span>
                                        <span className="text-emerald-400 text-xl mb-1">₫</span>
                                    </div>
                                </div>
                                <div className="text-slate-500 text-sm mt-1">VÀO TAY GIÁ TOANG</div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowBuyModal(true)}
                                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
                                >
                                    <FiShoppingCart className="text-xl" />
                                    MUA NGAY
                                </button>

                                <a
                                    href={`https://zalo.me/0963575203`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-blue-500/10 text-blue-400 border border-blue-500/20 py-3 rounded-xl font-medium hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <FiZap />
                                    Liên Hệ Zalo
                                </a>
                            </div>

                            {/* Features */}
                            <div className="mt-6 space-y-3 text-sm">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <FiCheck className="text-emerald-500" />
                                    Bảo hành khi dùng không đúng mô tả
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <FiCheck className="text-emerald-500" />
                                    Hỗ trợ trực tiếp trong quá trình sử dụng
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <FiCheck className="text-emerald-500" />
                                    100% tài khoản sạch/đầu tư thật
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Buy Modal */}
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
                                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                    <FiPhone className="text-cyan-400" />
                                    Số điện thoại <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={contactInfo.phone}
                                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                    placeholder="Nhập số điện thoại của bạn"
                                    className="w-full bg-[#0F172A] border border-white/10 px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                    <FiMail className="text-cyan-400" />
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={contactInfo.email}
                                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                    placeholder="example@email.com"
                                    className="w-full bg-[#0F172A] border border-white/10 px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                    <FiZap className="text-cyan-400" />
                                    Zalo <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={contactInfo.zalo}
                                    onChange={(e) => setContactInfo({ ...contactInfo, zalo: e.target.value })}
                                    placeholder="Số Zalo của bạn"
                                    className="w-full bg-[#0F172A] border border-white/10 px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                    <FiMessageSquare className="text-cyan-400" />
                                    Ghi chú (tùy chọn)
                                </label>
                                <textarea
                                    value={contactInfo.note}
                                    onChange={(e) => setContactInfo({ ...contactInfo, note: e.target.value })}
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
                                onClick={handleBuySubmit}
                                disabled={buying}
                            >
                                {buying ? "Đang xử lý..." : "Xác nhận mua"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
