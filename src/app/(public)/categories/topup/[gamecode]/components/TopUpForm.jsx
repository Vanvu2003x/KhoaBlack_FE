import React from "react";
import {
    FiUser,
    FiLock,
    FiServer,
    FiMessageSquare,
} from "react-icons/fi";

export default function TopUpForm({
    rechargeMethod,
    setRechargeMethod,
    uid,
    setUid,
    username,
    setUsername,
    password,
    setPassword,
    server,
    setServer,
    idServer,
    setIdServer,
    zaloNumber,
    setZaloNumber,
    note,
    setNote,
    game,
    selectedPkg,
}) {
    return (
        <div className="bg-[#0f172a]/80 backdrop-blur-md rounded-2xl border border-cyan-500/20 overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.05)]">
            {/* Tabs */}
            <div className="flex border-b border-cyan-500/20 bg-[#0b1120]/50">
                <button
                    onClick={() => setRechargeMethod("uid")}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer relative hover:bg-cyan-500/5
                        ${rechargeMethod === "uid"
                            ? "text-cyan-400 bg-gradient-to-t from-cyan-900/20 to-transparent"
                            : "text-slate-500 hover:text-cyan-200"
                        }
                    `}
                >
                    <FiUser
                        size={18}
                        className={rechargeMethod === "uid" ? "text-cyan-400" : ""}
                    />{" "}
                    Nạp qua UID
                    {rechargeMethod === "uid" && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_#22d3ee]"></div>
                    )}
                </button>
                <button
                    onClick={() => setRechargeMethod("login")}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer relative hover:bg-cyan-500/5
                        ${rechargeMethod === "login"
                            ? "text-cyan-400 bg-gradient-to-t from-cyan-900/20 to-transparent"
                            : "text-slate-500 hover:text-cyan-200"
                        }
                    `}
                >
                    <FiLock
                        size={18}
                        className={rechargeMethod === "login" ? "text-cyan-400" : ""}
                    />{" "}
                    Nạp qua Login
                    {rechargeMethod === "login" && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_#22d3ee]"></div>
                    )}
                </button>
            </div>

            {/* Input Fields Content */}
            <div className="p-6 space-y-5">
                {rechargeMethod === "uid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 ml-1">
                                UID Nhân Vật <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={uid}
                                    onChange={(e) => setUid(e.target.value)}
                                    className="w-full bg-[#090514] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all font-mono placeholder:text-slate-600"
                                    placeholder="Nhập UID..."
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="space-y-1.5">
                                {/* Server Logic: Prioritize Package Requirement for Zone ID */}
                                {selectedPkg?.id_server ? (
                                    <>
                                        <label className="text-xs font-bold text-slate-400 ml-1">
                                            ID Server / Zone ID <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={idServer}
                                                onChange={(e) => setIdServer(e.target.value)}
                                                className="w-full bg-[#090514] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:outline-none placeholder:text-slate-600"
                                                placeholder="Nhập ID Server / Zone ID"
                                            />
                                            <FiServer className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        </div>
                                    </>
                                ) : (
                                    // Default Game Server Logic
                                    game?.server?.length === 1 ? (
                                        // Single Server - Show Read-only
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 ml-1">
                                                Server
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={game.server[0]}
                                                    readOnly
                                                    className="w-full bg-[#090514] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-400 focus:outline-none cursor-not-allowed"
                                                />
                                                <FiServer className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <label className="text-xs font-bold text-slate-400 ml-1">
                                                Server
                                            </label>
                                            <div className="relative">
                                                {game?.server?.length > 1 ? (
                                                    <select
                                                        value={server}
                                                        onChange={(e) => setServer(e.target.value)}
                                                        className="w-full bg-[#090514] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:outline-none text-slate-300 appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Chọn Server</option>
                                                        {game.server.map((sv, idx) => (
                                                            <option key={idx} value={sv}>
                                                                {sv}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={idServer}
                                                        onChange={(e) => setIdServer(e.target.value)}
                                                        className="w-full bg-[#090514] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:outline-none placeholder:text-slate-600"
                                                        placeholder="Nhập Server/Zone ID"
                                                    />
                                                )}
                                                <FiServer className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                            </div>
                                        </>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5">
                        <div className="space-y-3">
                            <div className="relative group">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-[#090514] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                                    placeholder="Tài khoản đăng nhập / Email"
                                />
                            </div>
                            <div className="relative group">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#090514] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                                    placeholder="Mật khẩu game"
                                />
                            </div>

                            {/* Server Selection Logic for Login Method */}
                            <div className="space-y-1.5 pt-2">
                                <label className="text-xs font-bold text-slate-400 ml-1">
                                    Server
                                </label>
                                <div className="relative">
                                    {game?.server?.length === 1 ? (
                                        <input
                                            type="text"
                                            value={game.server[0]}
                                            readOnly
                                            className="w-full bg-[#090514] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-400 focus:outline-none cursor-not-allowed"
                                        />
                                    ) : game?.server?.length > 1 ? (
                                        <select
                                            value={server}
                                            onChange={(e) => setServer(e.target.value)}
                                            className="w-full bg-[#090514] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:outline-none text-slate-300 appearance-none cursor-pointer"
                                        >
                                            <option value="">Chọn Server</option>
                                            {game.server.map((sv, idx) => (
                                                <option key={idx} value={sv}>
                                                    {sv}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={idServer}
                                            onChange={(e) => setIdServer(e.target.value)}
                                            className="w-full bg-[#090514] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:outline-none placeholder:text-slate-600"
                                            placeholder="Nhập Server..."
                                        />
                                    )}
                                    <FiServer className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Common Inputs for both methods */}
                <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 ml-1">
                            Số Zalo (Để hỗ trợ khi cần)
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={zaloNumber}
                                onChange={(e) => setZaloNumber(e.target.value)}
                                className="w-full bg-[#090514] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                                placeholder="Nhập số Zalo (Tùy chọn)..."
                            />
                            <FiMessageSquare className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 ml-1">
                            Ghi chú (Tùy chọn)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full bg-[#090514] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600 resize-none h-20"
                            placeholder="Lời nhắn cho admin..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
