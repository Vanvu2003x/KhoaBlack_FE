"use client"
export default function Pagination({ currentPage, totalPage, onPageChange }) {
    const pages = [];

    for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 rounded border text-sm font-medium 
                        ${page === currentPage
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-800 border-gray-300 hover:bg-blue-50"
                        }`}
                >
                    {page}
                </button>
            ))}
        </div>
    );
}
