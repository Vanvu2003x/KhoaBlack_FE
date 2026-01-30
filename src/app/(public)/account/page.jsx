"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getInfo } from "@/services/auth.service";
import { getFinancialSummary } from "@/services/user.service";
import { connectSocket } from "@/services/websocket.service";
import PaymentWallet from "./components/PaymentWallet";
import AccountSidebar from "./components/AccountSidebar";
import UserProfileCard from "./components/UserProfileCard";
import BalanceCard from "./components/BalanceCard";
import WalletLog from "./components/WalletLogs";
import DetailLog from "./components/DetailLogs";
import AccSellingLog from "./components/AccSellingLog";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function AccountPage() {
    const searchParams = useSearchParams();
    const [user, setUser] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOpenNap, setOpenNap] = useState(false);
    const [isOpenLogin, setOpenLogin] = useState(false);
    const [isOpenRegister, setOpenRegister] = useState(false); // New state for Register Modal
    const [activeTab, setActiveTab] = useState("overview");

    const isLoggedIn = !!user;

    // Set active tab from URL params
    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchAllData = async () => {
            if (!localStorage.getItem("name")) {
                setLoading(false);
                return;
            }
            try {
                // 1. Fetch User Info
                const data = await getInfo();
                if (data?.user) {
                    setUser(data.user);

                    // 2. Subscribe to socket for real-time balance updates
                    connectSocket(null, (newBalance) => {
                        setUser(prev => prev ? { ...prev, balance: newBalance } : prev);
                    });

                    // 3. Only fetch summary if user exists
                    try {
                        const res = await getFinancialSummary();
                        if (res && res.data) {
                            setSummary(res.data);
                        }
                    } catch (summError) {
                        // Silent fail for summary if it fails
                    }
                }
            } catch (error) {
                console.error("Lỗi khi gọi API user info:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);


    // Hiển thị nội dung dựa trên tab active
    const renderContent = () => {
        if (loading) {
            return (
                <SkeletonTheme baseColor="#1E293B" highlightColor="#334155">
                    <div className="space-y-6">
                        {/* Top Section: Profile + Balance Skeleton */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
                            <div className="xl:col-span-2 p-6 rounded-3xl bg-[#1E293B]/50 border border-white/5">
                                <div className="flex items-center gap-6">
                                    <Skeleton circle width={100} height={100} />
                                    <div className="flex-1">
                                        <Skeleton width={200} height={30} className="mb-2" />
                                        <Skeleton width={150} height={20} />
                                    </div>
                                </div>
                                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Skeleton height={80} borderRadius={16} />
                                    <Skeleton height={80} borderRadius={16} />
                                    <Skeleton height={80} borderRadius={16} />
                                    <Skeleton height={80} borderRadius={16} />
                                </div>
                            </div>
                            <div className="xl:col-span-1 p-6 rounded-3xl bg-[#1E293B]/50 border border-white/5">
                                <Skeleton width={100} height={20} className="mb-4" />
                                <Skeleton height={60} className="mb-4" />
                                <div className="flex gap-4">
                                    <Skeleton height={40} className="flex-1" borderRadius={12} />
                                    <Skeleton height={40} className="flex-1" borderRadius={12} />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section Skeleton */}
                        <div className="h-32 rounded-3xl border border-white/5 bg-[#1E293B]/30 p-4">
                            <Skeleton height="100%" borderRadius={16} />
                        </div>
                    </div>
                </SkeletonTheme>
            );
        }

        if (!isLoggedIn) {
            return (
                <>
                    <div className="flex flex-col items-center justify-center p-12 bg-[#1E293B]/50 backdrop-blur-xl border border-white/5 rounded-3xl text-center space-y-4">
                        <div className="text-6xl mb-4">🔐</div>
                        <h2 className="text-2xl font-bold text-white">Chưa đăng nhập</h2>
                        <p className="text-slate-400 max-w-md">Vui lòng đăng nhập để truy cập thông tin tài khoản và lịch sử giao dịch.</p>
                        <button
                            onClick={() => setOpenLogin(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all"
                        >
                            Đăng nhập ngay
                        </button>
                    </div>

                    {/* Login Modal Overlay */}
                    {isOpenLogin && (
                        <div
                            onDoubleClick={() => setOpenLogin(false)}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
                        >
                            <div
                                className="w-[90%] sm:w-[70%] md:w-[40%] lg:w-[30%] relative"
                                onDoubleClick={(e) => e.stopPropagation()}
                            >
                                <LoginForm
                                    onClose={() => setOpenLogin(false)}
                                    onSwitch={() => {
                                        setOpenLogin(false);
                                        setOpenRegister(true);
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Register Modal Overlay */}
                    {isOpenRegister && (
                        <div
                            onDoubleClick={() => setOpenRegister(false)}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
                        >
                            <div
                                className="w-[90%] sm:w-[70%] md:w-[40%] lg:w-[30%] relative"
                                onDoubleClick={(e) => e.stopPropagation()}
                            >
                                <RegisterForm
                                    onClose={() => setOpenRegister(false)}
                                    onSwitch={() => {
                                        setOpenRegister(false);
                                        setOpenLogin(true);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </>
            );
        }

        switch (activeTab) {
            case "overview":
                return (
                    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                        {/* Top Section: Profile + Balance */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
                            <div className="xl:col-span-2">
                                <UserProfileCard user={user} />
                            </div>
                            <div className="xl:col-span-1">
                                <BalanceCard
                                    balance={user.balance}
                                    onDeposit={() => setOpenNap(true)}
                                />
                            </div>
                        </div>

                        {/* Empty Bottom Section as requested */}
                        <div className="h-32 rounded-3xl border-2 border-dashed border-slate-800/50 flex items-center justify-center text-slate-700 font-mono text-sm">
                            {/* Khu vực Biểu đồ & Bảo mật (Đang phát triển) */}
                            . . .
                        </div>
                    </div>
                );
            case "wallet-history":
                return <WalletLog />;
            case "order-history":
                return <DetailLog />;
            case "acc-history":
                return <AccSellingLog />;
            default:
                return null;
        }
    };

    return (
        <section className="min-h-screen bg-[#0F172A] py-8 px-4 md:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Sidebar Navigation */}
                    <div className="w-full lg:w-64 flex-shrink-0 sticky top-4 z-10">
                        <AccountSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0 w-full">
                        {renderContent()}
                    </div>
                </div>
            </div>

            {/* Modal Nạp Tiền */}
            {isOpenNap && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                    <div className="relative w-full max-w-4xl bg-[#0F172A] rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_0.3s_ease-out]">
                        <button
                            onClick={() => setOpenNap(false)}
                            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all"
                        >
                            ✕
                        </button>
                        <div className="max-h-[90vh] overflow-y-auto">
                            <PaymentWallet />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

// Helper Component for Stats
function StatCard({ label, value, color, icon }) {
    const styles = {
        green: {
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            text: "text-emerald-400",
            iconBg: "bg-emerald-500/20",
            glow: "group-hover:shadow-emerald-500/10"
        },
        red: {
            bg: "bg-rose-500/10",
            border: "border-rose-500/20",
            text: "text-rose-400",
            iconBg: "bg-rose-500/20",
            glow: "group-hover:shadow-rose-500/10"
        },
        blue: {
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            text: "text-blue-400",
            iconBg: "bg-blue-500/20",
            glow: "group-hover:shadow-blue-500/10"
        },
        purple: {
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            text: "text-purple-400",
            iconBg: "bg-purple-500/20",
            glow: "group-hover:shadow-purple-500/10"
        },
    };

    const style = styles[color] || styles.blue;

    return (
        <div className={`group relative p-5 rounded-2xl border ${style.border} ${style.bg} backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${style.glow} overflow-hidden`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-white/10 transition-colors"></div>

            <div className="relative flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${style.iconBg} ${style.text} shadow-inner`}>
                    {icon}
                </div>
                <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">{label}</p>
                    <p className={`text-xl font-bold font-mono ${style.text}`}>
                        {value?.toLocaleString()} <span className="text-xs opacity-70">đ</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
