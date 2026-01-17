"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
};

const ToastItem = ({ id, message, type, onClose }) => {
    const icons = {
        success: <FiCheckCircle className="w-5 h-5" />,
        error: <FiXCircle className="w-5 h-5" />,
        warning: <FiAlertCircle className="w-5 h-5" />,
        info: <FiInfo className="w-5 h-5" />
    };

    const styles = {
        success: "from-emerald-500/20 to-green-600/20 border-emerald-500/40 text-emerald-300",
        error: "from-red-500/20 to-rose-600/20 border-red-500/40 text-red-300",
        warning: "from-orange-500/20 to-amber-600/20 border-orange-500/40 text-orange-300",
        info: "from-cyan-500/20 to-blue-600/20 border-cyan-500/40 text-cyan-300"
    };

    const iconBg = {
        success: "bg-emerald-500/20 text-emerald-400",
        error: "bg-red-500/20 text-red-400",
        warning: "bg-orange-500/20 text-orange-400",
        info: "bg-cyan-500/20 text-cyan-400"
    };

    return (
        <div
            className={`
                relative flex items-center gap-3 min-w-[320px] max-w-md p-4 pr-12
                bg-gradient-to-br ${styles[type]} backdrop-blur-xl
                border rounded-2xl shadow-2xl
                animate-slideIn
            `}
            style={{
                animation: "slideIn 0.3s ease-out forwards"
            }}
        >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

            {/* Icon */}
            <div className={`flex-shrink-0 p-2 rounded-xl ${iconBg[type]}`}>
                {icons[type]}
            </div>

            {/* Message */}
            <p className="flex-1 text-sm font-medium text-white">
                {message}
            </p>

            {/* Close button */}
            <button
                onClick={() => onClose(id)}
                className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
                <FiX className="w-4 h-4" />
            </button>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-2xl overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-white/40 to-white/60"
                    style={{
                        animation: "progress 3s linear forwards"
                    }}
                ></div>
            </div>
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = "info") => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const toast = {
        success: (message) => showToast(message, "success"),
        error: (message) => showToast(message, "error"),
        warning: (message) => showToast(message, "warning"),
        warn: (message) => showToast(message, "warning"), // Alias
        info: (message) => showToast(message, "info")
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map(toast => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem
                            id={toast.id}
                            message={toast.message}
                            type={toast.type}
                            onClose={removeToast}
                        />
                    </div>
                ))}
            </div>

            <style jsx global>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes progress {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }
            `}</style>
        </ToastContext.Provider>
    );
};
