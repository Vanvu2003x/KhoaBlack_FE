"use client";
import Image from "next/image";
import Navigation from "./Navigation";
import { FaRegUserCircle, FaWallet, FaHistory } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { LuUserCheck, LuUserPlus } from "react-icons/lu";
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";
import { CiLogout } from "react-icons/ci";
import { connectSocket } from "@/services/websocket.sever";
import { Logout, getInfo } from "@/services/auth.service"; // Import Logout and getInfo
import PaymentWallet from "@/app/(public)/account/components/PaymentWallet";

export default function Header() {
    const [openForm, setOpenForm] = useState(false);
    const [openFormLogin, setOpenFormLogin] = useState(false);
    const [openFormRegister, setOpenFormRegister] = useState(false);
    const dropdownRef = useRef(null);
    const [username, setUsername] = useState("");
    const [balance, setBalance] = useState(0);
    const [openFormTopup, setOpenFormTopup] = useState(false);
    const [openMobileMenu, setOpenMobileMenu] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getInfo();
                console.log("UserInfo:", data);
                if (data) {
                    const user = data.user || data;
                    if (user) {
                        setUsername(user.name);
                        setBalance(user.balance || 0);
                        localStorage.setItem("name", user.name);

                        connectSocket(null, (newBalance) => {
                            setBalance(newBalance);
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to fetch user info", err);
                setUsername("");
                setBalance(0);
                localStorage.removeItem("name");
            }
        };

        fetchUserData();
    }, []);

    // I need to see what API returns. 
    // I'll update the replace content below to import getInfo and use it.

    const logoutHandler = async () => {
        try {
            await Logout();
        } catch (error) {
            console.error("Logout failed", error);
        }
        localStorage.removeItem("name");
        localStorage.removeItem("balance");
        window.location.reload();
    };

    return (
        <>
            {/* Login Form */}
            <div
                onDoubleClick={() => setOpenFormLogin(false)}
                className={`${openFormLogin ? "" : "hidden"} fixed inset-0 z-50 w-full h-screen bg-black/60 backdrop-blur-md flex items-center justify-center`}
            >
                <div
                    className="w-[90%] sm:w-[70%] md:w-[40%] lg:w-[30%]"
                    onDoubleClick={(e) => e.stopPropagation()}
                >
                    <LoginForm
                        onClose={() => setOpenFormLogin(false)}
                        onSwitch={() => {
                            setOpenFormLogin(false);
                            setOpenFormRegister(true);
                        }}
                    />
                </div>
            </div>

            {/* Register Form */}
            <div
                onDoubleClick={() => setOpenFormRegister(false)}
                className={`${openFormRegister ? "" : "hidden"} fixed inset-0 z-50 w-full h-screen bg-black/60 backdrop-blur-md flex items-center justify-center`}
            >
                <div
                    className="w-[90%] sm:w-[70%] md:w-[40%] lg:w-[30%]"
                    onDoubleClick={(e) => e.stopPropagation()}
                >
                    <RegisterForm
                        onClose={() => setOpenFormRegister(false)}
                        onSwitch={() => {
                            setOpenFormRegister(false);
                            setOpenFormLogin(true);
                        }}
                    />
                </div>
            </div>

            {/* Main Header */}
            <header className="sticky top-0 z-40 w-full transition-all duration-300">
                <div className="bg-[#0F172A]/90 backdrop-blur-xl border-b border-white/5 h-[60px] md:h-[80px] px-3 md:px-8 flex items-center justify-between shadow-2xl shadow-indigo-500/10 transition-all">

                    {/* Left: Logo + Hamburger */}
                    <div className="flex items-center gap-3 md:gap-10">
                        {/* Hamburger Button (Mobile) */}
                        <button
                            onClick={() => setOpenMobileMenu(true)}
                            className="md:hidden p-2 -ml-2 text-2xl text-white hover:text-indigo-400 transition-colors rounded-lg active:bg-white/10"
                        >
                            <FiMenu />
                        </button>

                        <Link href="/" className="relative group">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-white font-bold text-lg md:text-xl">N</span>
                                </div>
                                <span className="text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 block">
                                    NEXUS<span className="text-indigo-400">PAY</span>
                                </span>
                            </div>
                        </Link>

                        {/* Navigation - Desktop */}
                        <div className="hidden md:block">
                            <Navigation />
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 md:gap-4" ref={dropdownRef}>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setOpenForm((prev) => !prev)}
                                className="flex items-center gap-2 sm:gap-3 p-1 sm:pr-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                            >
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    <FaRegUserCircle className="text-lg md:text-2xl text-gray-400 group-hover:text-white transition-colors" />
                                </div>

                                {/* Username - Hidden on mobile */}
                                <div className="hidden lg:flex flex-col items-start">
                                    <span className="text-xs text-gray-400 font-medium group-hover:text-gray-300">
                                        {username ? "Xin chào," : "Tài khoản"}
                                    </span>
                                    <span className="text-sm font-bold text-white max-w-[100px] truncate leading-none">
                                        {username || "Khách"}
                                    </span>
                                </div>

                                {/* Balance - Optimized for Mobile */}
                                {username && (
                                    <div className="flex flex-col items-end ml-1 md:ml-2 border-l border-white/10 pl-2 md:pl-3 mr-1 md:mr-0">
                                        <span className="hidden md:block text-[10px] text-gray-400">Số dư</span>
                                        <span className="text-indigo-400 font-bold text-xs md:text-sm tracking-wide">
                                            {parseInt(balance).toLocaleString()} <span className="hidden sm:inline">đ</span>
                                        </span>
                                    </div>
                                )}

                                {/* Dropdown Icon */}
                                <div className="hidden sm:block ml-1">
                                    {openForm ? <IoMdArrowDropup className="text-gray-500" /> : <IoMdArrowDropdown className="text-gray-500" />}
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {openForm && (
                                <div className="absolute z-50 right-0 top-12 md:top-14 w-[280px] max-w-[90vw] bg-[#1E293B] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-[fadeIn_0.2s_ease-out] origin-top-right">
                                    <div className="p-4 border-b border-white/5 bg-white/5">
                                        {username ? (
                                            <div className="text-center">
                                                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Số dư khả dụng</p>
                                                <p className="text-2xl font-bold text-white text-shadow-glow">{parseInt(balance).toLocaleString()} <span className="text-sm text-gray-500">VNĐ</span></p>
                                            </div>
                                        ) : (
                                            <p className="text-center text-gray-300 font-medium">Vui lòng đăng nhập</p>
                                        )}
                                    </div>

                                    <div className="p-2 space-y-1">
                                        {username ? (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setOpenFormTopup(true);
                                                        setOpenForm(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-all group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                                        <FaWallet />
                                                    </div>
                                                    <span className="font-semibold text-sm">Nạp tiền vào ví</span>
                                                </button>

                                                <Link
                                                    href="/account/lich-su"
                                                    onClick={() => setOpenForm(false)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-all group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                                                        <FaHistory />
                                                    </div>
                                                    <span className="font-semibold text-sm">Biến động số dư</span>
                                                </Link>

                                                <div className="h-px bg-white/5 my-1 mx-2"></div>

                                                <button
                                                    onClick={logoutHandler}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-gray-300 hover:text-red-400 transition-all group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                                                        <CiLogout />
                                                    </div>
                                                    <span className="font-semibold text-sm">Đăng xuất</span>
                                                </button>
                                            </>
                                        ) : (
                                            <div className="grid gap-2">
                                                <button
                                                    onClick={() => {
                                                        setOpenFormLogin(true);
                                                        setOpenForm(false);
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all text-sm"
                                                >
                                                    <LuUserCheck className="text-lg" />
                                                    Đăng nhập
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setOpenFormRegister(true);
                                                        setOpenForm(false);
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-bold transition-all text-sm"
                                                >
                                                    <LuUserPlus className="text-lg" />
                                                    Đăng ký
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Topup Form Overlay */}
            {/* Same logic but styled better? PaymentWallet might need its own styles but modal container is here */}
            {openFormTopup && (
                <div
                    onDoubleClick={() => setOpenFormTopup(false)}
                    className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
                >
                    <div className="w-full max-w-lg bg-[#1E293B] rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden animate-[scaleIn_0.3s_ease-out]">
                        <PaymentWallet onClose={() => setOpenFormTopup(false)} />
                    </div>
                </div>
            )}
            {/* Mobile Menu Drawer */}
            <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${openMobileMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    onClick={() => setOpenMobileMenu(false)}
                ></div>

                {/* Drawer Content */}
                <div className={`absolute top-0 left-0 h-full w-[280px] bg-[#0F172A] border-r border-white/10 shadow-2xl transform transition-transform duration-300 ease-out ${openMobileMenu ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="p-5 flex flex-col h-full">
                        {/* Header Drawer */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                    <span className="text-white font-bold text-xl">N</span>
                                </div>
                                <span className="font-bold text-white text-lg">NEXUS<span className="text-indigo-400">PAY</span></span>
                            </div>
                            <button
                                onClick={() => setOpenMobileMenu(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Mobile Navigation */}
                        <div className="flex-1 overflow-y-auto space-y-2">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2">Menu</p>
                            <Navigation
                                className="flex-col !items-start w-full space-y-1 !text-base !ml-0"
                                onLinkClick={() => setOpenMobileMenu(false)}
                            />
                        </div>

                        {/* Footer Info */}
                        <div className="pt-4 border-t border-white/5">
                            <p className="text-xs text-slate-500 text-center">© 2024 NexusPay</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
