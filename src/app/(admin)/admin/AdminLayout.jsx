"use client";
import Header from "@/components/admin/header";
import Nav from "@/components/admin/navigation";
import { useState, useEffect } from "react";
import { getRole } from "@/services/auth.service";
import { toast } from "react-toastify";

export default function AdminLayout({ children }) {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkRole() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("Vui lòng đăng nhập");
                    window.location.href = "/";
                    return;
                }

                const res = await getRole(token);
                if (res.role !== "admin") {
                    toast.error("Bạn không có quyền truy cập");
                    window.location.href = "/";
                    return;
                }

                setLoading(false); // ✅ chỉ admin mới tới đây
            } catch (err) {
                toast.error("Không xác thực được quyền");
                window.location.href = "/";
            }
        }
        checkRole();
    }, []);

    if (loading) {
        return <p className="p-6">Đang kiểm tra quyền truy cập...</p>;
    }

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header onToggleNav={() => setIsNavOpen(!isNavOpen)} />
            </div>

            <div className="flex pt-16 h-screen">
                <aside
                    className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-[#2E2D38] z-40 transition-transform duration-300
                        ${isNavOpen ? "translate-x-0" : "-translate-x-full"}
                        md:translate-x-0 md:static md:block`}
                >
                    <Nav />
                </aside>

                <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto">
                    {children}
                </main>
            </div>
        </>
    );
}
