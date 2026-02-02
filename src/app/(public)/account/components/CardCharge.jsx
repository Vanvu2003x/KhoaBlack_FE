export default function CardPackage({ name_package, urlthumbnail, price, onSelect, isSelected, sale }) {
    return (
        <div
            onClick={onSelect}
            className={`cursor-pointer rounded-2xl border 
                        w-full h-[550px] md:w-[160px] md:h-[250px] flex flex-col overflow-hidden
                        shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out
                        ${isSelected ? "border-blue-600 ring-2 ring-blue-300 bg-blue-50" : "border-gray-200 bg-white"}`}
        >
            <div className="w-full h-[65%] relative overflow-hidden">
                <img
                    src={urlthumbnail}
                    alt={name_package}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-t-2xl"
                />

                {/* Hiện chữ SALE nếu sale = true */}
                {sale && (
                    <div className="absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded">
                        SALE
                    </div>
                )}
            </div>

            <div className="flex flex-col justify-between p-3 h-[35%]">
                <h3 className="text-base md:text-sm font-semibold text-gray-800 text-center line-clamp-2">
                    {name_package}
                </h3>
                <p className="text-center text-blue-700 font-bold mt-2 md:text-sm">
                    {price.toLocaleString()} VND
                </p>
            </div>
        </div>
    )
}
