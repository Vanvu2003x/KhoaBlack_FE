'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    FiHome,
    FiGrid,
    FiPackage,
    FiUser,
    FiDollarSign,
    FiChevronDown,
    FiChevronRight,
    FiMonitor,
    FiFolder,
    FiArchive,
    FiCreditCard,
    FiClipboard,
    FiLogOut,
} from 'react-icons/fi';

export default function Nav() {
    const [openMenus, setOpenMenus] = useState({});
    const router = useRouter();

    const toggleMenu = (menu) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    const handleLogout = () => {
        // Xóa token
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("balance");

        // Redirect ngay
        window.location.replace("/");
    };

    return (
        <nav className="w-80 bg-[#2E2D38] text-white p-6 shadow-md border-r border-gray-700">
            <ul className="space-y-2 text-base font-semibold">

                {/* Tổng quan */}
                <li>
                    <Link
                        href="/admin"
                        className="group flex items-center gap-4 p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-blue-600/20"
                    >
                        <FiHome size={20} className="group-hover:text-blue-300" />
                        <span className="group-hover:text-blue-200">Tổng quan</span>
                    </Link>
                </li>

                {/* Danh mục */}
                <li>
                    <button
                        onClick={() => toggleMenu('category')}
                        className="group flex items-center gap-4 w-full p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-blue-600/20"
                    >
                        <FiGrid size={20} className="group-hover:text-blue-300" />
                        <span className="group-hover:text-blue-200">Danh mục</span>
                        {openMenus['category'] ? (
                            <FiChevronDown className="ml-auto" size={20} />
                        ) : (
                            <FiChevronRight className="ml-auto" size={20} />
                        )}
                    </button>
                    {openMenus['category'] && (
                        <ul className="ml-6 mt-2 space-y-1 text-sm font-semibold text-gray-300">
                            <li>
                                <Link href="/admin/danhmuc/GameManagerPage" className="group flex items-center gap-3 p-2 rounded-md hover:bg-blue-600/20 transition-all">
                                    <FiFolder size={20} className="group-hover:text-blue-300" />
                                    <span className="group-hover:text-blue-200">Quản lí game</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/danhmuc/ToUpPackageManagerPage" className="group flex items-center gap-3 p-2 rounded-md hover:bg-blue-600/20 transition-all">
                                    <FiPackage size={20} className="group-hover:text-blue-300" />
                                    <span className="group-hover:text-blue-200">Quản lí gói nạp</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/danhmuc/AccManagerPage" className="group flex items-center gap-3 p-2 rounded-md hover:bg-blue-600/20 transition-all">
                                    <FiMonitor size={20} className="group-hover:text-blue-300" />
                                    <span className="group-hover:text-blue-200">Quản lí acc game</span>
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>

                {/* Giao dịch */}
                <li>
                    <button
                        onClick={() => toggleMenu('orders')}
                        className="group flex items-center gap-4 w-full p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-blue-600/20"
                    >
                        <FiArchive size={20} className="group-hover:text-blue-300" />
                        <span className="group-hover:text-blue-200">Giao dịch</span>
                        {openMenus['orders'] ? (
                            <FiChevronDown className="ml-auto" size={20} />
                        ) : (
                            <FiChevronRight className="ml-auto" size={20} />
                        )}
                    </button>
                    {openMenus['orders'] && (
                        <ul className="ml-6 mt-2 space-y-1 text-sm font-semibold text-gray-300">
                            <li>
                                <Link
                                    href="/admin/danhmuc/WalletManagerPage"
                                    className="group flex items-center gap-3 p-2 rounded-md hover:bg-blue-600/20 transition-all"
                                >
                                    <FiCreditCard size={20} className="group-hover:text-blue-300" />
                                    <span className="group-hover:text-blue-200">Nạp ví</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/danhmuc/ToUpManagerPage"
                                    className="group flex items-center gap-3 p-2 rounded-md hover:bg-blue-600/20 transition-all"
                                >
                                    <FiClipboard size={20} className="group-hover:text-blue-300" />
                                    <span className="group-hover:text-blue-200">Nạp game</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/danhmuc/AccSellingPage"
                                    className="group flex items-center gap-3 p-2 rounded-md hover:bg-blue-600/20 transition-all"
                                >
                                    <FiUser size={20} className="group-hover:text-blue-300" />
                                    <span className="group-hover:text-blue-200">Bán acc</span>
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>

                {/* Khách hàng */}
                <li>
                    <Link href="/admin/danhmuc/UserManagerPage" className="group flex items-center gap-4 p-2 rounded-lg hover:bg-blue-600/20 transition-all">
                        <FiUser size={20} className="group-hover:text-blue-300" />
                        <span className="group-hover:text-blue-200">Khách hàng</span>
                    </Link>
                </li>

                {/* Doanh thu */}
                <li>
                    <Link href="/admin/danhmuc/RevenueManagerPage" className="group flex items-center gap-4 p-2 rounded-lg hover:bg-blue-600/20 transition-all">
                        <FiDollarSign size={20} className="group-hover:text-blue-300" />
                        <span className="group-hover:text-blue-200">Doanh thu</span>
                    </Link>
                </li>

                {/* Đăng xuất */}
                <li>
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-4 w-full p-2 rounded-lg hover:bg-red-600/20 transition-all"
                    >
                        <FiLogOut size={20} className="group-hover:text-red-400" />
                        <span className="group-hover:text-red-300">Đăng xuất</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
}
