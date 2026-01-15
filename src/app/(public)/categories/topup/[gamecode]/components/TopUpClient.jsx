"use client";

import { useEffect, useMemo, useState } from "react";
import ConfirmForm from "@/components/auth/ConfirmForm";
import { useToast } from "@/components/ui/Toast";
import { FiZap } from "react-icons/fi";
import { FaGamepad } from "react-icons/fa";

import TopUpForm from "./TopUpForm";
import PackageGrid from "./PackageGrid";
import OrderSummary from "./OrderSummary";
import ImportantNotes from "./ImportantNotes";

export default function TopUpClient({ game, listPkg: initialListPkg }) {
    const toast = useToast();
    const [listPkg, setListPkg] = useState(initialListPkg || []);
    const [loading, setLoading] = useState(!initialListPkg);
    const [selectedPkg, setSelectedPkg] = useState(null);
    const [rechargeMethod, setRechargeMethod] = useState("uid"); // "uid" or "login"

    // Form States
    const [idServer, setIdServer] = useState("");
    const [server, setServer] = useState("");
    const [uid, setUid] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [zaloNumber, setZaloNumber] = useState("");
    const [note, setNote] = useState("");

    const [confirmForm, setConfirmForm] = useState(false);

    // Auto-select first server if available
    useEffect(() => {
        if (game?.server?.length > 0) {
            setServer(game.server[0]);
        }
    }, [game]);

    // Handle initial loading if data not passed from server
    useEffect(() => {
        if (initialListPkg) {
            setLoading(false);
            setListPkg(initialListPkg);
        }
    }, [initialListPkg]);

    // Filter packages based on selected method
    const displayPackages = useMemo(() => {
        if (!listPkg || listPkg.length === 0) return [];

        const method = rechargeMethod.toLowerCase(); // 'uid' or 'login'

        return listPkg.filter((pkg) => {
            if (pkg.status !== "active") return false;

            const pType = pkg.package_type?.toLowerCase();

            if (method === "uid") {
                return (
                    pType === "uid" ||
                    pType === "server" ||
                    !["log", "login"].includes(pType)
                );
            } else {
                return pType === "log" || pType === "login";
            }
        });
    }, [listPkg, rechargeMethod]);

    const handleBuyNow = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Vui lòng đăng nhập để tiếp tục.");
            return;
        }
        if (!selectedPkg) {
            toast.warn("Chưa chọn gói nạp nào.");
            return;
        }

        // Validation logic
        if (rechargeMethod === "uid") {
            if (game?.sever?.length > 1 && !server) {
                toast.warn("Vui lòng chọn Server.");
                return;
            }
            if (
                game?.sever?.length === 0 &&
                selectedPkg.id_server &&
                !idServer
            ) {
                toast.warn("Vui lòng nhập ID Server / Zone ID.");
                return;
            }
            if (!uid) {
                toast.warn("Vui lòng nhập UID nhân vật.");
                return;
            }
        } else {
            if (!username || !password) {
                toast.warn("Vui lòng nhập Tài khoản và Mật khẩu game.");
                return;
            }
            if (game?.server?.length > 1 && !server) {
                toast.warn("Vui lòng chọn Server.");
                return;
            }
            if (game?.server?.length === 0 && !idServer) {
                toast.warn("Vui lòng nhập Server.");
                return;
            }
        }

        setConfirmForm(true);
    };

    return (
        <div className="min-h-screen bg-[#090514] text-white font-sans">
            {/* Main container */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="text-sm text-slate-400 mb-8 flex items-center gap-2 font-medium">
                    <a href="/" className="hover:text-white transition-colors">
                        Trang chủ
                    </a>
                    <span className="text-slate-600">/</span>
                    <a
                        href="/categories"
                        className="hover:text-white transition-colors"
                    >
                        Danh mục
                    </a>
                    <span className="text-slate-600">/</span>
                    <span className="text-purple-400 font-bold">Nạp Game</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-white font-bold">
                        {game?.name || "Game"}
                    </span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT COLUMN */}
                    <div className="flex-1 min-w-0 space-y-6">
                        {/* 1. Method Selection & Inputs */}
                        <TopUpForm
                            rechargeMethod={rechargeMethod}
                            setRechargeMethod={setRechargeMethod}
                            uid={uid}
                            setUid={setUid}
                            username={username}
                            setUsername={setUsername}
                            password={password}
                            setPassword={setPassword}
                            server={server}
                            setServer={setServer}
                            idServer={idServer}
                            setIdServer={setIdServer}
                            zaloNumber={zaloNumber}
                            setZaloNumber={setZaloNumber}
                            note={note}
                            setNote={setNote}
                            game={game}
                            selectedPkg={selectedPkg}
                        />

                        {/* 2. Package Title */}
                        <h2 className="text-xl font-bold flex items-center gap-2 text-white/90">
                            <FiZap className="text-blue-400" /> Chọn gói nạp
                        </h2>

                        {/* 3. Package Grid */}
                        <PackageGrid
                            loading={loading}
                            displayPackages={displayPackages}
                            selectedPkg={selectedPkg}
                            setSelectedPkg={setSelectedPkg}
                        />

                        {/* Empty State */}
                        {!loading && displayPackages.length === 0 && (
                            <div className="text-center py-12 bg-[#151021] rounded-2xl border border-dashed border-white/10 text-slate-500">
                                Không có gói nạp phù hợp
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN - Summary */}
                    <div className="w-full lg:w-[380px] shrink-0 space-y-6">
                        <OrderSummary
                            game={game}
                            handleBuyNow={handleBuyNow}
                            rechargeMethod={rechargeMethod}
                            selectedPkg={selectedPkg}
                            server={server}
                            uid={uid}
                            username={username}
                        />

                        {/* Warning Box */}
                        <ImportantNotes rechargeMethod={rechargeMethod} />
                    </div>
                </div>

                {/* Footer simple (Optional) */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-white font-bold">
                        <FaGamepad className="text-purple-500" size={24} /> Gaming
                        Shop
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-1 rounded h-6 w-10"></div>
                        <div className="bg-white p-1 rounded h-6 w-10"></div>
                        <div className="bg-white p-1 rounded h-6 w-10"></div>
                    </div>
                </div>
            </main>

            {/* Confirm Modal */}
            {confirmForm && (
                <ConfirmForm
                    data={{
                        package: selectedPkg,
                        server: server || idServer,
                        uid,
                        username,
                        password,
                        idServer: idServer || "",
                        zaloNumber: zaloNumber || "N/A",
                        note: note || "",
                    }}
                    onClick={() => setConfirmForm(false)}
                />
            )}
        </div>
    );
}

