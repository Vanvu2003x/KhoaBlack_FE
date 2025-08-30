"use client";

import { FaUser, FaWallet } from "react-icons/fa";
import { useEffect, useState } from "react";
import PaymentWallet from "@/components/formNapVi";
import DetailLog from "./components/DetailLogs";
import WalletLog from "./components/WalletLogs";
import { getInfo } from "@/services/auth.service";
import AccSellingLog from "./components/AccSellingLog";
import { getFinancialSummary } from "@/services/user.service";

const baseURLAPI = process.env.NEXT_PUBLIC_API_URL;

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOpenNap, setOpenNap] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [summary, setSummary] = useState(null);

    const isLoggedIn = !!user;
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await getFinancialSummary();
                if (res && res.data) {
                    setSummary(res.data);
                } else {
                    console.warn("Không có dữ liệu summary", res);
                }
            } catch (error) {
                console.error("Lỗi khi fetch summary:", error);
            }
        };

        fetchSummary();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getInfo();
                if (data?.user) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const SkeletonBox = ({ width, height, className = "" }) => (
        <div className={`bg-gray-300 animate-pulse rounded ${className}`} style={{ width, height }} />
    );

    return (
        <>
            {/* Overlay nạp ví */}
            <div
                onDoubleClick={() => setOpenNap(false)}
                className={`${isOpenNap ? "fixed top-0 right-0 w-full h-screen z-50" : "hidden"}`}
            >
                <PaymentWallet />
            </div>

            <div className={`${isOpenNap ? "blur-sm" : ""}`}>
                <section className="bg-[#F3F4F6] flex md:flex-row flex-col gap-2 justify-between items-start">
                    {/* Nội dung chính bên trái */}
                    <div className="md:order-1 order-2 md:w-[70%] w-full p-4">
                        {/* Tab buttons */}
                        <div className="flex border-b mb-4 bg-white overflow-x-auto">
                            {["overview", "wallet-history", "order-history", "acc-history"].map(tab => (
                                <button
                                    key={tab}
                                    className={`px-4 py-2 font-semibold ${activeTab === tab
                                        ? "border-b-4 border-blue-500 text-blue-600"
                                        : "text-gray-500"
                                        }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {{
                                        "overview": "Tổng quan",
                                        "wallet-history": "Lịch sử nạp ví",
                                        "order-history": "Lịch sử nạp game",
                                        "acc-history": "Lịch sử mua acc"
                                    }[tab]}
                                </button>
                            ))}
                        </div>

                        {/* Nội dung tab */}
                        {activeTab === "overview" && (
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col md:flex-row items-center gap-6">
                                {/* Avatar + Tên người dùng */}
                                <div className="flex flex-col items-center w-52">
                                    <img
                                        className="w-full md:w-52 md:h-52 object-cover border-4 border-blue-400 rounded-full shadow"
                                        src="https://tse1.mm.bing.net/th/id/OIP.Fogk0Q6C7GEQEdVyrbV9MwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
                                        alt="Avatar"
                                    />
                                    <div className="mt-4 text-xl text-center md:text-2xl font-bold text-gray-800">
                                        {isLoggedIn ? user.name : "Chưa đăng nhập"}
                                    </div>
                                </div>

                                {/* Thông tin chi tiết */}
                                <div className="flex-1 w-full text-gray-800 bg-gray-50 p-10 rounded-lg shadow-inner">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-blue-600 mb-2">Thông tin chi tiết</h3>
                                        <div className="space-y-3 text-base">

                                            <div className="flex">
                                                <span className="w-36 font-medium">🆔 ID:</span>
                                                <span>{isLoggedIn ? user.id : "Chưa đăng nhập"}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-36 font-medium">📅 Ngày đăng ký:</span>
                                                <span>{isLoggedIn ? new Date(user.create_at).toLocaleDateString() : "Chưa đăng nhập"}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-36 font-medium">📧 Email:</span>
                                                <span>{isLoggedIn ? user.email : "Chưa đăng nhập"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-36 font-medium">🔒 Quyền hạn:</span>
                                                {isLoggedIn ? (
                                                    <>
                                                        <span className="text-red-500 font-semibold">{user.role}</span>
                                                        {user.role === "admin" && (
                                                            <a
                                                                href="/admin"
                                                                className="ml-2 text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                                            >
                                                                Vào trang quản trị
                                                            </a>
                                                        )}
                                                        {user.role === "agent" && (
                                                            <a
                                                                href="/agent"
                                                                className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                                            >
                                                                Vào trang agent
                                                            </a>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span>Chưa đăng nhập</span>
                                                )}
                                            </div>


                                            <div className="flex">
                                                <span className="w-36 font-medium">💰 Số dư:</span>
                                                <span className="text-green-600 font-semibold">
                                                    {isLoggedIn ? `${user.balance} VND` : "Chưa đăng nhập"}
                                                </span>
                                            </div>
                                            {summary && (
                                                <>
                                                    <div className="flex">
                                                        <span className="w-36 font-medium">📉 Tổng tiêu:</span>
                                                        <span className="text-red-500 font-semibold">
                                                            {summary.tong_tieu.toLocaleString()} VND
                                                        </span>
                                                    </div>
                                                    <div className="flex">
                                                        <span className="w-36 font-medium">📅 Tổng tiêu tháng:</span>
                                                        <span className="text-red-500 font-semibold">
                                                            {summary.tong_tieu_thang.toLocaleString()} VND
                                                        </span>
                                                    </div>
                                                    <div className="flex">
                                                        <span className="w-36 font-medium">💳 Tổng nạp:</span>
                                                        <span className="text-green-600 font-semibold">
                                                            {summary.tong_nap.toLocaleString()} VND
                                                        </span>
                                                    </div>
                                                    <div className="flex">
                                                        <span className="w-36 font-medium">📅 Tổng nạp tháng:</span>
                                                        <span className="text-green-600 font-semibold">
                                                            {summary.tong_nap_thang.toLocaleString()} VND
                                                        </span>
                                                    </div>
                                                </>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "wallet-history" && (
                            isLoggedIn ? (
                                <div className="bg-white p-4 rounded shadow">
                                    <WalletLog></WalletLog>
                                </div>
                            ) : (
                                <div className="text-red-500 font-semibold text-center py-8 bg-white rounded shadow">
                                    ❌ Chưa đăng nhập, không thể xem lịch sử nạp ví
                                </div>
                            )
                        )}

                        {activeTab === "order-history" && (
                            isLoggedIn ? (
                                <DetailLog></DetailLog>
                            ) : (
                                <div className="text-red-500 font-semibold text-center py-8 bg-white rounded shadow">
                                    ❌ Chưa đăng nhập, không thể xem lịch sử nạp game
                                </div>
                            )
                        )}

                        {activeTab === "acc-history" && (
                            isLoggedIn ? (
                                <AccSellingLog />
                            ) : (
                                <div className="text-red-500 font-semibold text-center py-8 bg-white rounded shadow">
                                    ❌ Chưa đăng nhập, không thể xem lịch sử mua acc
                                </div>
                            )
                        )}
                    </div>

                    {/* Cột phải - thông tin tài khoản */}
                    <div className="m-4 bg-white w-full md:w-[30%] p-4 min-h-[220px] rounded order-1 md:order-2">
                        {loading ? (
                            <div className="space-y-3">
                                <SkeletonBox width="60%" height="24px" />
                                <div className="flex items-center gap-2">
                                    <SkeletonBox width="24px" height="24px" className="rounded-full" />
                                    <SkeletonBox width="70%" height="20px" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <SkeletonBox width="24px" height="24px" className="rounded-full" />
                                    <SkeletonBox width="50%" height="20px" />
                                </div>
                                <SkeletonBox width="100%" height="40px" />
                            </div>
                        ) : !isLoggedIn ? (
                            <div className="text-center text-gray-600">Tài khoản chưa được đăng nhập</div>
                        ) : (
                            <div className="space-y-3">
                                <div className="text-xl border-b-4 p-2 border-blue-300 font-bold text-blue-600 mb-2">
                                    Thông tin tài khoản
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 font-bold">
                                    <FaUser />
                                    <span>
                                        Tên người dùng:{" "}
                                        <span className="text-green-500">{user.name}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 font-bold">
                                    <FaWallet />
                                    <span>
                                        Số dư:{" "}
                                        <span className="text-red-400">{user.balance} VND</span>
                                    </span>
                                </div>
                                <button
                                    onClick={() => setOpenNap(true)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full"
                                >
                                    Nạp tiền vào ví
                                </button>
                                <div className="text-sm text-red-500 italic">
                                    Tài khoản có thể dùng trực tiếp để mua các gói nạp trong game
                                </div>
                            </div>
                        )}
                    </div>
                </section >
            </div >
        </>
    );
}
