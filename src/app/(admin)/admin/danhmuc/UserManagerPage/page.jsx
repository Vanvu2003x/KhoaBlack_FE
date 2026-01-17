"use client";
import { sendAdminOTP, verifyAdminOTP } from "@/services/auth.service";
import { changeBalance, changeRole, getAllUserByKeyword, toggleUserLock } from "@/services/user.service";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { FiUsers, FiSearch, FiShield, FiMoreVertical, FiCreditCard, FiLock, FiUnlock, FiMail, FiCalendar, FiDollarSign } from 'react-icons/fi';


export default function UserList() {
    const toast = useToast();
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
                        locked: u.status === 'banned', // Map status to locked
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
        const amountStr = amounts[id];
        const amount = Number(amountStr);

        if (!amountStr || amount <= 0 || isNaN(amount)) {
            toast.error("Số tiền không hợp lệ");
            return;
        }

        // Check balance for debit
        const user = users.find(u => u.id === id);
        if (type === "debit" && user && user.balance < amount) {
            toast.error(`Số dư không đủ! Số dư hiện tại: ${user.balance.toLocaleString('vi-VN')} VND`);
            return;
        }

        try {
            setIsProcessing(true);

            const res = await verifyAdminOTP(otp);
            if (res.status !== "ok") {
                toast.error("OTP không hợp lệ hoặc đã hết hạn");
                setIsProcessing(false);
                return;
            }

            // Call balance update API
            await changeBalance(id, amount, type);

            // Update UI
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

            // Clear input and close modal
            setAmounts((prev) => ({
                ...prev,
                [id]: ""
            }));

            toast.success(type === "credit" ? `Đã cộng ${amount.toLocaleString('vi-VN')} VND` : `Đã trừ ${amount.toLocaleString('vi-VN')} VND`);
            setShowOtpModal(false);
            setPendingAction(null);
            setOtp("");
        } catch (error) {
            console.error("Balance update error:", error);
            const errorMsg = error.response?.data?.message;

            if (errorMsg?.includes("OTP")) {
                toast.error("OTP không hợp lệ hoặc đã hết hạn");
            } else if (errorMsg?.includes("số dư") || errorMsg?.includes("balance")) {
                toast.error("Số dư không đủ để thực hiện giao dịch");
            } else if (error.response?.status >= 500) {
                toast.error("Lỗi server, vui lòng thử lại sau");
            } else {
                toast.error(errorMsg || "Lỗi khi cập nhật số dư");
            }
        } finally {
            setIsProcessing(false);
        }
    }

    async function handleChangeRole(id) {
        const user = users.find((u) => u.id === id);
        if (!user || user.locked) return;

        // Toggle between user and agent
        const newRole = user.role === "user" ? "agent" : "user";
        try {
            await changeRole(user.id, newRole);
            toast.success(`Đã ${newRole === 'agent' ? 'thăng cấp lên Agent' : 'hạ cấp xuống User'}`);

            setUsers((prevUsers) =>
                prevUsers.map((u) =>
                    u.id === id ? { ...u, role: newRole } : u
                )
            );
        } catch (error) {
            toast.error("Thay đổi quyền thất bại");
        }
    }

    async function handleUpgradeToAdmin(id) {
        const user = users.find((u) => u.id === id);
        try {
            await changeRole(user.id, "admin");
            toast.success("Thăng cấp Admin thành công");

            setUsers((prevUsers) =>
                prevUsers.map((u) =>
                    u.id === id ? { ...u, role: "admin" } : u
                )
            );
        } catch (error) {
            toast.error("Thăng cấp Admin thất bại");
        }
    }

    async function handleToggleLock(id) {
        const user = users.find((u) => u.id === id);
        if (!user) return;

        try {
            const result = await toggleUserLock(id);
            if (result.success) {
                const newLockedState = result.locked;
                setUsers((prevUsers) =>
                    prevUsers.map((u) =>
                        u.id === id ? { ...u, locked: newLockedState, status: newLockedState ? 'banned' : 'active' } : u
                    )
                );
                toast.success(newLockedState ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản");
            } else {
                toast.error(result.message || "Không thể thay đổi trạng thái khóa");
            }
        } catch (error) {
            toast.error("Lỗi khi thay đổi trạng thái khóa");
        }
    }


    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
    );
    if (error) return <div className="text-red-400 p-4 bg-red-500/10 rounded-xl border border-red-500/20 text-center">{error}</div>;

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            {/* Header with Glass Effect */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1E293B]/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-xl">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
                        <FiUsers className="text-cyan-400" /> Quản lý Khách hàng
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Danh sách ({users.length}) tài khoản trên hệ thống
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-[#0F172A] p-1 rounded-xl border border-white/10 flex">
                        {['user', 'agent', 'admin'].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`
                                    px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                                    ${role === r
                                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"}
                                `}
                            >
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="relative group">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm tên / email..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="bg-[#0F172A] border border-white/10 text-slate-200 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 w-full sm:w-64 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* User List - Grid/Cards for better mobile support */}
            <div className="grid grid-cols-1 gap-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className={`
                            bg-[#1E293B]/50 backdrop-blur-md rounded-2xl p-5 border border-white/5 shadow-sm hover:border-cyan-500/30 transition-all duration-300
                            ${user.locked ? "opacity-60 grayscale" : ""}
                        `}
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0
                                    ${user.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400' : user.role === 'agent' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700/50 text-slate-400'}
                                `}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-white font-bold flex items-center gap-2">
                                        {user.name}
                                        {user.locked && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 uppercase border border-red-500/30">LOCKED</span>}
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                            user.role === 'agent' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                'bg-slate-700/30 text-slate-400 border-slate-600/30'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </h3>
                                    <div className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                                        <FiMail size={14} /> {user.email}
                                    </div>
                                    <div className="text-cyan-400 font-mono font-bold mt-1 text-sm flex items-center gap-1">
                                        <FiDollarSign size={14} /> {Number(user.balance).toLocaleString('vi-VN')} VND
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
                                {/* Role Management Buttons */}
                                {user.role === 'user' && (
                                    <button
                                        onClick={() => handleChangeRole(user.id)}
                                        disabled={user.locked}
                                        className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors text-xs font-bold disabled:opacity-50"
                                    >
                                        Thăng cấp Agent
                                    </button>
                                )}
                                {user.role === 'agent' && (
                                    <>
                                        <button
                                            onClick={() => handleChangeRole(user.id)}
                                            disabled={user.locked}
                                            className="px-3 py-1.5 rounded-lg bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20 transition-colors text-xs font-bold disabled:opacity-50"
                                        >
                                            Hạ cấp User
                                        </button>
                                        <button
                                            onClick={() => handleUpgradeToAdmin(user.id)}
                                            disabled={user.locked}
                                            className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors text-xs font-bold disabled:opacity-50"
                                        >
                                            Thăng cấp Admin
                                        </button>
                                    </>
                                )}

                                {/* Chi tiết button for ALL users */}
                                <button
                                    onClick={() => toggleExpand(user.id)}
                                    className="px-3 py-1.5 rounded-lg bg-slate-700/30 text-slate-300 border border-slate-600/30 hover:bg-slate-700/50 transition-colors text-xs font-bold flex items-center gap-1"
                                >
                                    <FiMoreVertical /> {expandedIds.includes(user.id) ? "Thu gọn" : "Chi tiết"}
                                </button>

                                {/* Lock button only for user/agent */}
                                {(user.role === "user" || user.role === "agent") && (
                                    <button
                                        onClick={() => handleToggleLock(user.id)}
                                        disabled={isProcessing}
                                        className={`px-3 py-1.5 rounded-lg transition-colors text-xs font-bold flex items-center gap-1 ${user.locked
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                                            }`}
                                    >
                                        {user.locked ? <><FiUnlock /> Mở khóa</> : <><FiLock /> Khóa TK</>}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Expandable Details */}
                        {expandedIds.includes(user.id) && (
                            <div className="mt-4 pt-4 border-t border-white/5 animate-[fadeIn_0.3s_ease-out]">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-6">
                                    <div className="bg-[#0F172A] p-3 rounded-xl border border-white/5">
                                        <span className="text-slate-500 text-xs block mb-1">Ngày tham gia</span>
                                        <span className="text-slate-200 flex items-center gap-2">
                                            <FiCalendar className="text-slate-500" />
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'Chưa có dữ liệu'}
                                        </span>
                                    </div>
                                    <div className="bg-[#0F172A] p-3 rounded-xl border border-white/5">
                                        <span className="text-slate-500 text-xs block mb-1">Tổng nạp</span>
                                        <span className="text-emerald-400 font-bold">{(Number(user.tong_amount) || 0).toLocaleString('vi-VN')} đ</span>
                                    </div>
                                    <div className="bg-[#0F172A] p-3 rounded-xl border border-white/5">
                                        <span className="text-slate-500 text-xs block mb-1">Thống kê đơn</span>
                                        <div className="flex gap-3 text-xs">
                                            <span className="text-blue-400">Mua: {user.so_don_order || 0}</span>
                                            <span className="text-purple-400">Nạp: {user.so_don_da_nap || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Money Actions - available for all roles */}
                                <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-dashed border-slate-700">
                                    <h4 className="text-slate-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                                        <FiCreditCard /> Điều chỉnh số dư
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        <div className="relative flex-1 min-w-[150px]">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">VND</span>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={amounts[user.id] ?? ""}
                                                onChange={(e) => handleAmountChange(user.id, e.target.value)}
                                                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                                                placeholder="Nhập số tiền..."
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleOpenOtpModal(user.id, "credit")}
                                            disabled={isProcessing}
                                            className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 font-bold transition-colors disabled:opacity-50"
                                        >
                                            + Cộng
                                        </button>
                                        <button
                                            onClick={() => handleOpenOtpModal(user.id, "debit")}
                                            disabled={isProcessing}
                                            className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 font-bold transition-colors disabled:opacity-50"
                                        >
                                            - Trừ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal OTP */}
            {showOtpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowOtpModal(false)}></div>
                    <div className="relative bg-[#1E293B] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6 animate-[scaleIn_0.2s_ease-out]">
                        <div className="mb-4 text-center">
                            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FiShield size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Xác thực Admin</h3>
                            <p className="text-slate-400 text-sm mt-1">Nhập mã OTP đã gửi về email của bạn</p>
                        </div>

                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-center text-xl tracking-widest text-white mb-6 focus:border-blue-500 focus:outline-none transition-colors font-mono"
                            placeholder="000000"
                            maxLength={6}
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => { setShowOtpModal(false); setPendingAction(null); }}
                                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleConfirmOtp}
                                disabled={isProcessing}
                                className="px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 font-bold transition-colors shadow-lg shadow-blue-500/20"
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
