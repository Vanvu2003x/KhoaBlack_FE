"use client"

import { BsMessenger } from "react-icons/bs"
import { SiZalo } from "react-icons/si"
import { FaFacebook } from "react-icons/fa"
import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import { useEffect, useState } from "react"

export default function PublicLayout({ children }) {
    const [showNotice, setShowNotice] = useState(false)

    useEffect(() => {
        const lastVisit = localStorage.getItem("lastVisit")
        const now = Date.now()

        if (!lastVisit || now - Number(lastVisit) > 24 * 60 * 60 * 1000) {
            setShowNotice(true)
            localStorage.setItem("lastVisit", now.toString())
        }
    }, [])

    return (
        <>
            <Header />
            {children}
            <Footer />

            {/* Box thông báo - Dark Theme Modal */}
            {showNotice && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
                    <div
                        className="relative bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8 rounded-2xl max-w-md text-center 
                        border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.3)]
                        animate-[scaleIn_0.3s_ease]"
                    >
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-xl -z-10"></div>

                        {/* Icon */}
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
                            <span className="text-3xl animate-pulse">🔥</span>
                        </div>

                        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Chào mừng bạn!
                        </h3>
                        <p className="text-slate-300 mb-4 text-sm">
                            Chào mừng anh em tới web nạp của <span className="text-indigo-400 font-semibold">Khoa Black</span>
                        </p>
                        <div className="bg-slate-800/50 rounded-xl p-4 mb-5 border border-slate-700/50">
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Nếu gặp bất cứ vấn đề gì trong quá trình sử dụng dịch vụ,
                                anh em yên tâm, mọi vấn đề sẽ được hỗ trợ <span className="text-emerald-400 font-medium">nhanh chóng</span>.
                            </p>
                            <div className="mt-3 flex items-center justify-center gap-2">
                                <SiZalo className="text-green-400 w-5 h-5" />
                                <span className="text-slate-400 text-sm">Liên hệ Zalo:</span>
                                <a
                                    target="_blank"
                                    href="https://zalo.me/0866996056"
                                    className="text-green-400 font-semibold hover:text-green-300 transition-colors"
                                >
                                    0866996056
                                </a>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowNotice(false)}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl 
                            hover:from-indigo-500 hover:to-purple-500 transition-all duration-300
                            shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50
                            active:scale-[0.98]"
                        >
                            ✨ Đã hiểu
                        </button>
                    </div>
                </div>
            )}

            {/* Nút liên hệ */}
            <div className="fixed bottom-5 right-5 flex flex-col gap-4 z-40">


                <a
                    href="https://www.facebook.com/profile.php?id=61586972106424"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-125 animate-[pulse_2.5s_ease-in-out_infinite]"
                    title="Facebook Fanpage"
                >
                    <FaFacebook className="text-white w-10 h-10" />
                </a>

                <a
                    href="https://m.me/939588092574339"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-125 animate-[pulse_2.5s_ease-in-out_infinite]"
                    title="Liên hệ Messenger"
                >
                    <BsMessenger className="text-white w-10 h-10" />
                </a>
            </div>
        </>
    )
}
