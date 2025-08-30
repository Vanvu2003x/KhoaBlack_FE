"use client";

import { createOrder } from "@/services/order.service";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

export default function ConfirmForm({ data, onClick }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
            <div className="bg-white p-6 w-full max-w-md shadow-xl space-y-6 rounded">
                <h2 className="text-xl font-semibold text-gray-800 border-b-4 pb-2 border-amber-400">
                    Xác nhận thông tin
                </h2>

                <table className="w-full text-sm text-left border border-gray-300">
                    <tbody>
                        {/* Gói */}
                        <tr className="border-b">
                            <th className="px-3 py-2 font-semibold text-gray-700 w-1/3">Gói</th>
                            <td className="px-3 py-2 text-gray-900">
                                {data.package.package_name}{" "}
                                <span className="font-bold text-blue-600">
                                    ({data.package.package_type})
                                </span>
                            </td>
                        </tr>

                        {/* Giá */}
                        <tr className="border-b">
                            <th className="px-3 py-2 font-semibold text-gray-700">Giá</th>
                            <td className="px-3 py-2 text-green-700">
                                {data.package.price.toLocaleString()}đ
                            </td>
                        </tr>

                        {/* Server */}
                        {data.server && (
                            <tr className="border-b">
                                <th className="px-3 py-2 font-semibold text-gray-700">Server</th>
                                <td className="px-3 py-2 text-gray-800">{data.server}</td>
                            </tr>
                        )}

                        {/* Zone ID */}
                        {data.idServer && (
                            <tr className="border-b">
                                <th className="px-3 py-2 font-semibold text-gray-700">Zone ID</th>
                                <td className="px-3 py-2 text-gray-800">{data.idServer}</td>
                            </tr>
                        )}

                        {/* UID */}
                        <tr className="border-b">
                            <th className="px-3 py-2 font-semibold text-gray-700">UID</th>
                            <td className="px-3 py-2 text-gray-800">{data.uid}</td>
                        </tr>

                        {/* Username / Password nếu là LOG */}
                        {data.package.package_type === "LOG" && (
                            <>
                                <tr className="border-b">
                                    <th className="px-3 py-2 font-semibold text-gray-700">Username</th>
                                    <td className="px-3 py-2 text-gray-800">{data.username}</td>
                                </tr>
                                <tr className="border-b">
                                    <th className="px-3 py-2 font-semibold text-gray-700">Password</th>
                                    <td className="px-3 py-2 text-gray-800">{data.password}</td>
                                </tr>
                            </>
                        )}

                        {/* Zalo Number (bắt buộc) */}
                        <tr className="border-b">
                            <th className="px-3 py-2 font-semibold text-gray-700">Số Zalo</th>
                            <td className="px-3 py-2 text-gray-800">{data.zaloNumber}</td>
                        </tr>

                        {/* Note (không bắt buộc) */}
                        {data.note && (
                            <tr>
                                <th className="px-3 py-2 font-semibold text-gray-700">Ghi chú</th>
                                <td className="px-3 py-2 text-gray-800">{data.note}</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="mt-2 border-t-4 border-amber-400 py-2 text-red-600 text-xs italic">
                    Vui lòng kiểm tra kĩ thông tin trước khi thanh toán
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        onClick={onClick}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                    >
                        Hủy
                    </button>

                    <button
                        onClick={async () => {
                            // Gom dữ liệu account_info
                            const accountInfo = {
                                uid: data.uid,
                                server: data.server,
                                id_server: data.idServer,
                                zaloNumber: data.zaloNumber, // ✅ bắt buộc
                                note: data.note || "", // ✅ optional
                            };
                            if (data.username) accountInfo.username = data.username;
                            if (data.password) accountInfo.password = data.password;

                            const payload = {
                                package_id: data.package.id,
                                amount: data.package.price,
                                account_info: JSON.stringify(accountInfo),
                            };

                            try {
                                await createOrder(payload);
                                toast.success("Tạo đơn hàng thành công!");

                                const socket = io(process.env.NEXT_PUBLIC_API_URL, {
                                    withCredentials: true,
                                });

                                socket.on("balance_update", (newBalance) => {
                                    console.log("Số dư mới:", newBalance);
                                    localStorage.setItem("balance", newBalance);
                                });
                            } catch (error) {
                                const message =
                                    error?.response?.data?.message ||
                                    "Tạo đơn hàng thất bại!";
                                toast.error(message);
                            } finally {
                                setTimeout(() => {
                                    onClick();
                                }, 2000);
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                    >
                        Xác nhận nạp
                    </button>
                </div>
            </div>
        </div>
    );
}
