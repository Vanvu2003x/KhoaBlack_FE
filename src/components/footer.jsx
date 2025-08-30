import Image from "next/image";
import Link from "next/link";
import { FaClock, FaDiscord, FaFacebook, FaGithub, FaTelegram } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { SiZalo } from "react-icons/si";

export default function Footer() {
    return (
        <footer className="bg-[#121212] text-gray-400">
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-row md:flex-col items-center md:items-start gap-4">
                    <Image
                        src="/imgs/logo.png"
                        alt="Logo"
                        width={80}
                        height={80}
                    />
                    <p className="text-sm  text-gray-400">
                        Nền tảng nạp game uy tín, tốc độ và bảo mật.
                    </p>
                </div>

                <div>
                    <h3 className="text-white text-lg font-semibold mb-4 border-b border-gray-600 pb-2">LIÊN HỆ</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link href="https://www.facebook.com/Napgameuytin2111/" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                                <FaFacebook /> Facebook
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white text-lg font-semibold mb-4 border-b border-gray-600 pb-2">LIÊN HỆ ĐỐI TÁC</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link href="https://t.me/YuuKayTopUp" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                                <FaTelegram /> Telegram
                            </Link>
                        </li>
                        <li href="https://zalo.me/0866996056" className="flex items-center gap-2">
                            <SiZalo /> Zalo: 0866996056
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-black py-4 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
                <div>
                    © 2025 - Phát triển bởi <span className="text-amber-500">Van Vu</span>
                </div>
                <div className="flex gap-4 text-lg">
                    <Link href="https://github.com/Vanvu2003x" className="hover:text-amber-500"><FaGithub /></Link>
                    <Link href="https://www.facebook.com/van.vu.488317" className="hover:text-amber-500"><FaFacebook /></Link>
                    <Link href="https://zalo.me/063575203" className="hover:text-amber-500"><SiZalo /></Link>
                </div>
            </div>
        </footer>
    );
}
