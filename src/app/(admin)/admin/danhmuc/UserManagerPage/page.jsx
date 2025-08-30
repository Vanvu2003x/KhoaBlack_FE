"use client";
import { sendAdminOTP, verifyAdminOTP } from "@/services/auth.service";
import { changeBalance, changeRole, getAllUserByKeyword } from "@/services/user.service";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // role mặc định là user
    const [role, setRole] = useState("user");

    const [keyword, setKeyword] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedIds, setExpandedIds] = useState([]);
    const [amounts, setAmounts] = useState({});

    // OTP
    const [isProcessing, setIsProcessing] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState("");
    const [pendingAction, setPendingAction] = useState(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                setLoading(true);
                setError(null);
                const res = await getAllUserByKeyword(role, searchTerm);
                if (res.success) {
                    const usersWithLock = res.users.map((u) => ({
                        ...u,
                        locked: u.locked ?? false,
                    }));
                    setUsers(usersWithLock);

                    const initialAmounts = {};
                    usersWithLock.forEach((u) => {
                        initialAmounts[u.id] = "";
                    });
                    setAmounts(initialAmounts);
                } else {
                    setError("Không lấy được dữ liệu người dùng");
                }
            } catch (err) {
                setError("Lỗi khi gọi API");
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, [role, searchTerm]);

    async function handleSearch() {
        setSearchTerm(keyword.trim());
    }

    function toggleExpand(id) {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }

    function handleAmountChange(id, value) {
        if (!/^\d*$/.test(value)) return;
        setAmounts((prev) => ({
            ...prev,
            [id]: value === "" ? "" : Number(value),
        }));
    }

    async function handleOpenOtpModal(id, type) {
        try {
            setIsProcessing(true);
            await sendAdminOTP();
            toast.info("OTP đã được gửi tới email admin. Vui lòng kiểm tra!");

            setPendingAction({ id, type });
            setOtp("");
            setShowOtpModal(true);
        } catch (error) {
            toast.error("Không thể gửi OTP. Vui lòng thử lại");
        } finally {
            setIsProcessing(false);
        }
    }

    async function handleConfirmOtp() {
        if (!otp.trim()) {
            toast.error("Vui lòng nhập OTP");
            return;
        }
        const { id, type } = pendingAction;
        const amount = amounts[id];
        if (!amount || amount <= 0) {
            toast.error("Số tiền không hợp lệ");
            return;
        }

        try {
            setIsProcessing(true);

            const res = await verifyAdminOTP(otp);
            if (res.status !== "ok") {
                toast.error("OTP không hợp lệ hoặc đã hết hạn");
                return;
            }

            await changeBalance(id, amount, type);

            setUsers((prevUsers) =>
                prevUsers.map((u) =>
                    u.id === id
                        ? {
                            ...u,
                            balance:
                                type === "credit"
                                    ? u.balance + amount
                                    : Math.max(0, u.balance - amount),
                        }
                        : u
                )
            );

            toast.success(type === "credit" ? "Cộng tiền thành công" : "Trừ tiền thành công");
            setShowOtpModal(false);
            setPendingAction(null);
        } catch (error) {
            toast.error("OTP không hợp lệ");
        } finally {
            setIsProcessing(false);
        }
    }

    async function handleChangeRole(id) {
        const user = users.find((u) => u.id === id);
        if (!user || user.locked) return;

        const newRole = user.role === "user" ? "agent" : "user";
        try {
            await changeRole(user.id, newRole);
            toast.success("Cấp quyền thành công");

            setUsers((prevUsers) =>
                prevUsers.map((u) =>
                    u.id === id ? { ...u, role: newRole } : u
                )
            );
        } catch (error) {
            toast.error("Cấp quyền thất bại");
        }
    }

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-10 bg-[#F4F6FA] min-h-screen">
            <h2 className="text-xl font-semibold mb-4">
                Danh sách tài khoản ({users.length})
            </h2>

            {/* Radio chọn role */}
            <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-1">
                    <input
                        type="radio"
                        value="user"
                        checked={role === "user"}
                        onChange={(e) => setRole(e.target.value)}
                    />
                    User
                </label>
                <label className="flex items-center gap-1">
                    <input
                        type="radio"
                        value="agent"
                        checked={role === "agent"}
                        onChange={(e) => setRole(e.target.value)}
                    />
                    QTV/Agent
                </label>
                <label className="flex items-center gap-1">
                    <input
                        type="radio"
                        value="admin"
                        checked={role === "admin"}
                        onChange={(e) => setRole(e.target.value)}
                    />
                    Admin
                </label>
            </div>

            {/* Ô tìm kiếm */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
                <input
                    type="text"
                    placeholder="Tìm theo tên hoặc email"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="border rounded px-3 py-2 flex-grow focus:outline-blue-500"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Tìm kiếm
                </button>
            </div>

            {/* Danh sách user */}
            <div className="overflow-x-auto m-2">
                <ul className="min-w-[700px] space-y-4">
                    {users.map((user) => (
                        <li
                            key={user.id}
                            className={`p-3 border bg-white rounded-md transition flex flex-col gap-2 ${user.locked ? "opacity-60" : ""
                                }`}
                        >
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">
                                        {user.name} ({user.email})
                                    </p>
                                    <p className="text-sm text-gray-600 truncate">
                                        Role:{" "}
                                        <span className="font-medium">{user.role}</span> | Balance:{" "}
                                        <span className="font-medium">
                                            {user.balance.toLocaleString()} VND
                                        </span>
                                    </p>
                                    {user.locked && (
                                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-200 rounded select-none">
                                            Đã khóa
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-shrink-0 space-x-2 whitespace-nowrap">
                                    {(user.role === "user" || user.role === "agent") && (
                                        <button
                                            onClick={() => handleChangeRole(user.id)}
                                            disabled={user.locked}
                                            className={`px-3 py-1 rounded text-sm font-medium ${user.locked
                                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                                    : user.role === "user"
                                                        ? "bg-green-600 text-white hover:bg-green-700 transition"
                                                        : "bg-red-600 text-white hover:bg-red-700 transition"
                                                }`}
                                        >
                                            {user.role === "user"
                                                ? "Cấp quyền CTV"
                                                : "Thu hồi quyền CTV"}
                                        </button>
                                    )}

                                    <button
                                        onClick={() => toggleExpand(user.id)}
                                        className="text-blue-600 hover:underline text-sm font-medium whitespace-nowrap"
                                    >
                                        {expandedIds.includes(user.id)
                                            ? "Ẩn bớt"
                                            : "Xem thêm"}
                                    </button>
                                </div>
                            </div>

                            {expandedIds.includes(user.id) && (
                                <div className="mt-4 border-t pt-4">
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-700">
                                        <div>
                                            <span className="font-medium">Email:</span> {user.email}
                                        </div>
                                        <div>
                                            <span className="font-medium">Ngày tạo:</span>{" "}
                                            {new Date(user.create_at).toLocaleString()}
                                        </div>
                                        <div>
                                            <span className="font-medium">Trạng thái:</span>{" "}
                                            <span
                                                className={`px-2 py-0.5 rounded text-xs ${user.status === "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {user.status}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium">Số đơn Order:</span>{" "}
                                            {user.so_don_order}
                                        </div>
                                        <div>
                                            <span className="font-medium">
                                                Số đơn đã nạp cho khách (CTV):
                                            </span>{" "}
                                            {user.so_don_da_nap}
                                        </div>
                                        <div>
                                            <span className="font-medium">Tổng đã nạp:</span>{" "}
                                            <span className="font-semibold text-blue-600">
                                                {Number(user.tong_amount).toLocaleString()} VND
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium">Số đơn đã nạp:</span>{" "}
                                            {user.so_don_da_mua}
                                        </div>
                                        <div>
                                            <span className="font-medium">Số acc đã mua:</span>{" "}
                                            {user.so_acc_da_mua}
                                        </div>
                                    </div>

                                    {/* Form cộng/trừ tiền (chỉ cho user/agent) */}
                                    {(user.role === "user" || user.role === "agent") && (
                                        <div className="mt-4 flex items-center gap-2 flex-wrap bg-gray-50 py-3 px-3 ">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                value={amounts[user.id] ?? ""}
                                                onChange={(e) =>
                                                    handleAmountChange(user.id, e.target.value)
                                                }
                                                className="w-32 border px-3 py-2 text-right focus:ring focus:ring-blue-200 outline-none"
                                                disabled={user.locked}
                                                placeholder="Nhập số tiền"
                                            />
                                            <button
                                                onClick={() =>
                                                    handleOpenOtpModal(user.id, "credit")
                                                }
                                                disabled={user.locked || isProcessing}
                                                className="bg-blue-600 text-white px-3 py-2 hover:bg-blue-700 transition disabled:opacity-50"
                                            >
                                                + Tiền
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleOpenOtpModal(user.id, "debit")
                                                }
                                                disabled={user.locked || isProcessing}
                                                className="bg-gray-200 text-gray-700 px-3 py-2 hover:bg-gray-300 transition disabled:opacity-50"
                                            >
                                                - Tiền
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal OTP */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-80">
                        <h3 className="text-lg font-semibold mb-4">Xác nhận OTP</h3>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full border px-3 py-2 mb-4"
                            placeholder="Nhập OTP"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowOtpModal(false);
                                    setPendingAction(null);
                                }}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmOtp}
                                disabled={isProcessing}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isProcessing ? "Đang xử lý..." : "Xác nhận"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
