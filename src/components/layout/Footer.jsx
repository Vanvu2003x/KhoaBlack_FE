import Image from "next/image";
import Link from "next/link";
import { FaClock, FaDiscord, FaFacebook, FaGithub, FaTelegram } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { SiZalo } from "react-icons/si";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-[#1a1a1a] to-black text-gray-400 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <div className="relative w-24 h-24 transition-transform hover:scale-105 duration-300">
                        <Image
                            src="/imgs/image.png"
                            alt="KhoaBlack Topup"
                            fill
                            className="object-contain drop-shadow-lg"
                        />
                    </div>
                    <p className="text-sm text-gray-400 text-center md:text-left leading-relaxed">
                        Nền tảng nạp game hàng đầu Việt Nam. <br />
                        Uy tín - Tốc độ - Bảo mật tuyệt đối.
                    </p>
                </div>

                <div>
                    <h3 className="text-white text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">LIÊN HỆ HỖ TRỢ</h3>
                    <ul className="space-y-4">
                        <li>
                            <Link href="https://www.facebook.com/Napgameuytin2111/" className="flex items-center gap-3 hover:text-blue-500 transition-all duration-200 group">
                                <span className="p-2 bg-gray-800 rounded-full group-hover:bg-blue-900/30 transition-colors"><FaFacebook className="text-lg" /></span>
                                <span className="font-medium">Facebook Fanpage</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">LIÊN HỆ ĐỐI TÁC</h3>
                    <ul className="space-y-4">
                        <li>
                            <Link href="https://t.me/YuuKayTopUp" className="flex items-center gap-3 hover:text-cyan-400 transition-all duration-200 group">
                                <span className="p-2 bg-gray-800 rounded-full group-hover:bg-cyan-900/30 transition-colors"><FaTelegram className="text-lg" /></span>
                                <span className="font-medium">Telegram Support</span>
                            </Link>
                        </li>
                        <li className="flex items-center gap-3 hover:text-blue-400 transition-all duration-200 group cursor-pointer" onClick={() => window.open('https://zalo.me/0866996056', '_blank')}>
                            <span className="p-2 bg-gray-800 rounded-full group-hover:bg-blue-900/30 transition-colors"><SiZalo className="text-lg" /></span>
                            <span className="font-medium">Zalo: 0866996056</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-[#0a0a0a] border-t border-gray-800 py-6 px-6 md:px-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium">
                    <div className="text-gray-500">
                        © 2026 KhoaBlackTopup. All rights reserved. <span className="hidden md:inline">|</span> Phát triển bởi <span className="text-amber-500 font-bold hover:text-amber-400 duration-200 cursor-pointer">Van Vu</span>
                    </div>
                    <div className="flex gap-5 text-xl">
                        <Link href="https://github.com/Vanvu2003x" className="text-gray-500 hover:text-white hover:scale-110 transition-all duration-200"><FaGithub /></Link>
                        <Link href="https://www.facebook.com/van.vu.488317" className="text-gray-500 hover:text-blue-500 hover:scale-110 transition-all duration-200"><FaFacebook /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
