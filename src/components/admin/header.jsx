'use client';

export default function Header({ onToggleNav }) {
    return (
        <header className="w-full h-16 bg-white shadow px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
            {/* Tiêu đề */}
            <div className="text-xl font-semibold text-gray-800">
                Trang quản trị
            </div>

            {/* Nút menu cho mobile */}
            <button
                onClick={onToggleNav}
                className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none text-2xl"
                aria-label="Mở menu"
            >
                &#x2026;
            </button>
        </header>
    );
}
