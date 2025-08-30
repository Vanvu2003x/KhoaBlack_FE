"use client";
import Image from "next/image";
import Navigation from "./navigation";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { LuUserCheck, LuUserPlus } from "react-icons/lu";
import LoginForm from "./loginform";
import RegisterForm from "./registerform";
import { CiLogout } from "react-icons/ci";
import { connectSocket } from "@/services/websocket.sever";
import PaymentWallet from "./formNapVi";

export default function Header() {
    const [openForm, setOpenForm] = useState(false);
    const [openFormLogin, setOpenFormLogin] = useState(false);
    const [openFormRegister, setOpenFormRegister] = useState(false);
    const dropdownRef = useRef(null);
    const [username, setUsername] = useState("");
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const name = localStorage.getItem("name");
            const savedBalance = localStorage.getItem("balance");
            setUsername(name);
            setBalance(savedBalance);
            const token = localStorage.getItem("token");
            if (token) {
                connectSocket(token, (newBalance) => {
                    setBalance(newBalance);
                });
            }
        }
    }, []);

    const [openFormTopup, setOpenFormTopup] = useState(false);

    const logoutHandler = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("balance");
        window.location.reload();
    };

    return (
        <>
            {/* Login Form */}
            <div
                onDoubleClick={() => setOpenFormLogin(false)}
                className={`${openFormLogin ? "" : "hidden"} fixed inset-0 z-50 w-full h-screen bg-black/30 backdrop-blur-sm flex items-center justify-center`}
            >
                <div
                    className="w-[90%] sm:w-[70%] md:w-[40%] lg:w-[30%]"
                    onDoubleClick={(e) => e.stopPropagation()}
                >
                    <LoginForm onClose={() => setOpenFormLogin(false)} />
                </div>
            </div>

            {/* Register Form */}
            <div
                onDoubleClick={() => setOpenFormRegister(false)}
                className={`${openFormRegister ? "" : "hidden"} fixed inset-0 z-50 w-full h-screen bg-black/30 backdrop-blur-sm flex items-center justify-center`}
            >
                <div
                    className="w-[90%] sm:w-[70%] md:w-[40%] lg:w-[30%]"
                    onDoubleClick={(e) => e.stopPropagation()}
                >
                    <RegisterForm onClose={() => setOpenFormRegister(false)} />
                </div>
            </div>

            {/* Header */}
            <div>
                <div className="bg-white gap-3 text-black h-[70px] md:h-[90px] border-b-2 border-gray-300 px-4 sm:px-10 md:px-20 flex items-center">
                    {/* Logo */}
                    <div className="w-[60px] sm:w-[100px] md:w-[150px] h-[60px] sm:h-[80px] md:h-[120px] relative transition-transform duration-300 hover:scale-105 cursor-pointer">
                        <Link href="/">
                            <Image
                                src="/imgs/logo.png"
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="sm:flex sm:w-[40%] md:w-[25%]">
                        <Navigation />
                    </div>

                    {/* User Menu */}
                    <div ref={dropdownRef} className="relative ml-auto">
                        <button
                            onClick={() => setOpenForm((prev) => !prev)}
                            className="px-2 sm:px-3 py-2 border-2 cursor-pointer flex items-center gap-2 rounded-xl hover:border-amber-400 transition-colors duration-200"
                        >
                            <FaRegUserCircle className="text-lg sm:text-xl" />
                            <span className="hidden sm:inline text-sm sm:text-base">
                                {username ? <div>{balance} VND</div> : <div>Khách</div>}
                            </span>
                            {openForm ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                        </button>

                        {openForm && (
                            <div className="absolute z-20 right-0 top-14 bg-white border rounded-lg shadow-lg p-3 min-w-[220px] sm:min-w-[250px] text-sm">
                                <div>
                                    {username ? (
                                        <>
                                            <div className="text-blue-600 px-4 py-2 border-b-2 mb-2 font-bold text-base sm:text-lg">
                                                Chào {username}
                                            </div>
                                            <div
                                                onClick={() => {
                                                    setOpenFormTopup(true);
                                                    setOpenForm(false);
                                                }}
                                                className="py-2 px-4 flex items-center gap-2 hover:bg-green-100 hover:text-green-600 cursor-pointer mb-2"
                                            >
                                                Nạp tiền
                                            </div>
                                            <button
                                                onClick={logoutHandler}
                                                className="font-semibold flex items-center justify-between py-2 px-4 hover:bg-red-400 cursor-pointer hover:text-white w-full"
                                            >
                                                Đăng xuất <CiLogout />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-4 border-b-2 mb-2">
                                                Chưa có tài khoản đăng nhập
                                            </div>
                                            <div
                                                onClick={() => {
                                                    setOpenFormLogin(true);
                                                    setOpenForm(false);
                                                }}
                                                className="py-2 px-4 flex items-center gap-2 hover:bg-blue-200 hover:text-blue-600 cursor-pointer mb-2"
                                            >
                                                <LuUserCheck />
                                                Đăng nhập
                                            </div>
                                            <div
                                                onClick={() => {
                                                    setOpenFormRegister(true);
                                                    setOpenForm(false);
                                                }}
                                                className="py-2 px-4 flex items-center gap-2 hover:bg-blue-200 hover:text-blue-600 cursor-pointer"
                                            >
                                                <LuUserPlus /> Đăng ký
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Topup Form */}
            {openFormTopup && (
                <div
                    onDoubleClick={() => setOpenFormTopup(false)}
                    className="fixed top-0 right-0 w-full h-screen z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center"
                >
                    <div className="w-[90%] sm:w-[70%] md:w-[40%] lg:w-[30%]">
                        <PaymentWallet onClose={() => setOpenFormTopup(false)} />
                    </div>
                </div>
            )}
        </>
    );
}
