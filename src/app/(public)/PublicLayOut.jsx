"use client"

import { BsMessenger } from "react-icons/bs"
import { SiZalo } from "react-icons/si"
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useEffect, useState } from "react";

export default function PublicLayout({ children }) {
    const [showNotice, setShowNotice] = useState(false);

    useEffect(() => {
        const lastVisit = localStorage.getItem("lastVisit");
        const now = Date.now();

        if (!lastVisit || now - Number(lastVisit) > 24 * 60 * 60 * 1000) {
            setShowNotice(true);
            localStorage.setItem("lastVisit", now.toString());
        }
    }, []);

    return (
        <>
            <Header />
            {children}
            <Footer />

            {/* Box thông báo */}
            {showNotice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
                        <h3 className="text-lg font-bold mb-3">Chào mừng bạn!</h3>
                        <p className="text-gray-700 mb-4">
                            Chào mừng anh em tới web nạp của Khoa Black
                        </p>
                        <p>Nếu gặp anh em gặp bất cứ gì trong quá trình sử dụng dịch vụ của shop thì không bao giờ phải lo vìm ọi vấn đề sẽ được giải quyết nhanh chóng. Vui lòng liên hệ tới Khoa Black qua số Zalo: 0963575203. Cảm ơn anh em đã quan tâm.
                        </p>
                        <button
                            onClick={() => setShowNotice(false)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Đã hiểu
                        </button>
                    </div>
                </div>
            )}

            {/* Nút liên hệ */}
            <div className="fixed bottom-5 right-5 flex flex-col gap-4 z-40 animate-pulse-slow">
                <a
                    href="https://zalo.me/0963575203"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-125"
                    title="Liên hệ Zalo"
                >
                    <SiZalo className="text-white w-10 h-10" />
                </a>

                <a
                    href="https://www.facebook.com/messages/e2ee/t/9577925265640295"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-125"
                    title="Liên hệ Messenger"
                >
                    <BsMessenger className="text-white w-10 h-10" />
                </a>
            </div>

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .animate-pulse-slow > a {
                    animation: pulse-slow 2.5s ease-in-out infinite;
                }
            `}</style>
        </>
    )
}
