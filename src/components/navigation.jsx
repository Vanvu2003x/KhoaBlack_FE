import Link from "next/link";
import { RiHome2Line, RiUser2Line } from "react-icons/ri";

export default function Navigation() {
    return (
        <ul className="flex flex-row gap-4 items-center font-bold text-sm md:text-base text-black whitespace-nowrap">
            <li className="flex items-center gap-2">
                <Link
                    href="/"
                    className="flex items-center md:gap-2 hover:text-amber-600 transition-colors"
                >
                    <RiHome2Line className="text-lg" />
                    <span>Trang chủ</span>
                </Link>
            </li>
            <li className="flex items-center gap-2">
                <Link
                    href="/taikhoan"
                    className="flex items-center md:gap-2 hover:text-amber-600 transition-colors"
                >
                    <RiUser2Line className="text-lg" />
                    <span>Tài khoản</span>
                </Link>
            </li>
        </ul>
    );
}
