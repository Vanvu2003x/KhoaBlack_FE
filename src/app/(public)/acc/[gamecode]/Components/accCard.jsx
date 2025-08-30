"use client"
import { BuyAcc } from "@/services/accOrder"
import { useState } from "react"
import { toast } from "react-toastify"

export default function AccCardItem({ acc }) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const [showImageModal, setShowImageModal] = useState(false)
    const [showBuyModal, setShowBuyModal] = useState(false)

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

        try {
            await BuyAcc(payload)
            setShowBuyModal(false)
            toast.success("Đặt hàng thành công")
            setContactInfo({ phone: "", email: "", zalo: "", note: "" })
        } catch (error) {
            toast.error(error.response?.data?.message || "Đặt hàng thất bại")
        }
    }

    return (
        <>
            {/* CARD */}
            <div className="group w-full border border-gray-200  p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300 bg-white">
                <p className="text-sm text-gray-700 p-2 text-center border border-gray-300 rounded mb-4 font-medium bg-gray-50">
                    Acc #{acc.id}
                </p>

                {acc.image && (
                    <img
                        src={`${apiBaseUrl}/uploads/${acc.image}`}
                        alt="acc"
                        className="w-full h-40 md:h-48 object-cover rounded-lg mb-4 cursor-pointer hover:scale-105 transition duration-300"
                        onClick={() => setShowImageModal(true)}
                    />
                )}

                <div className="mb-3 h-48 md:h-40 overflow-y-auto whitespace-pre-wrap bg-gray-100 text-gray-800 p-3 text-sm rounded-lg">
                    <div dangerouslySetInnerHTML={{ __html: acc.info.replace(/\r\n/g, "<br/>") }} />
                </div>

                <div className="flex items-center gap-3 font-semibold text-gray-800 mb-3">
                    <span>Giá:</span>
                    <span className="text-red-500">{acc.price} đ</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <a
                        href={`https://zalo.me/${acc.contact?.zalo || "0963575203"}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition font-medium"
                    >
                        Liên hệ ngay
                    </a>
                    <button
                        className="flex-1 text-center bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200 transition font-medium"
                        onClick={() => setShowBuyModal(true)}
                    >
                        Mua ngay
                    </button>
                </div>
            </div>

            {/* IMAGE MODAL */}
            {showImageModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={() => setShowImageModal(false)}
                >
                    <div
                        className="relative max-w-4xl max-h-[90vh] w-full flex justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={`${apiBaseUrl}/uploads/${acc.image}`}
                            alt="Full acc"
                            className="max-h-[90vh] object-contain  shadow-lg"
                        />
                    </div>
                </div>
            )}

            {/* BUY MODAL */}
            {showBuyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md  p-6 shadow-lg">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">Nhập thông tin liên hệ</h2>

                        <div className="mb-3">
                            <label className="block text-sm font-medium mb-1 text-gray-700">Số điện thoại *</label>
                            <input
                                type="text"
                                name="phone"
                                value={contactInfo.phone}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium mb-1 text-gray-700">Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={contactInfo.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium mb-1 text-gray-700">Zalo *</label>
                            <input
                                type="text"
                                name="zalo"
                                value={contactInfo.zalo}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium mb-1 text-gray-700">Ghi chú (không bắt buộc)</label>
                            <textarea
                                name="note"
                                value={contactInfo.note}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                                onClick={() => setShowBuyModal(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                onClick={handleSubmit}
                            >
                                Xác nhận mua
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
