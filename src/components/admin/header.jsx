'use client';

export default function Header({ onToggleNav }) {
    return (
        <header className="w-full h-16 bg-[#0F172A]/80 backdrop-blur-md shadow-sm border-b border-white/5 px-6 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            {/* Tiêu đề */}
            <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
                Antigravity Admin
            </div>

            {/* Nút menu cho mobile */}
            <button
                onClick={onToggleNav}
                className="md:hidden text-slate-400 hover:text-white focus:outline-none transition-colors"
                aria-label="Mở menu"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </header>
    );
}
