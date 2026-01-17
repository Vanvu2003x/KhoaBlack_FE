"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiHome2Line, RiUser2Line } from "react-icons/ri";

export default function Navigation({ className = "flex-row", onLinkClick }) {
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    const getItemClass = (path) => {
        const active = isActive(path);
        return `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 w-full ${active
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 font-bold"
            : "text-gray-400 hover:text-white hover:bg-white/5 font-medium"
            }`;
    };

    return (
        <ul className={`flex gap-2 items-center text-sm md:text-base whitespace-nowrap ${className}`}>
            <li className="w-full md:w-auto">
                <Link
                    href="/"
                    className={getItemClass("/")}
                    onClick={onLinkClick}
                >
                    <RiHome2Line className={`text-xl mb-0.5 ${isActive("/") ? "animate-pulse" : ""}`} />
                    <span>Trang chủ</span>
                </Link>
            </li>
            <li className="w-full md:w-auto">
                <Link
                    href="/account"
                    className={getItemClass("/account")}
                    onClick={onLinkClick}
                >
                    <RiUser2Line className={`text-xl mb-0.5 ${isActive("/account") ? "animate-pulse" : ""}`} />
                    <span>Tài khoản</span>
                </Link>
            </li>
        </ul>
    );
}
