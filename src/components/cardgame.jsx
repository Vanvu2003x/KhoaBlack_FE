import { useRouter } from "next/navigation";
import { FaCartArrowDown, FaShoppingCart } from "react-icons/fa";

export default function CardGame({ game, type }) {
    const urlBaseAPI = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    const handlerClick = (game) => {
        if (type === "ACC") {
            router.push(`/acc/${game.gamecode}`);
        } else {
            router.push(`/danh-muc/${game.gamecode}`);
        }
    };

    return (
        <div
            onClick={() => handlerClick(game)}
            className="bg-white w-full md:w-[300px] h-[100px] flex items-center pl-[10px] border-2 border-gray-500 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group cursor-pointer"
        >
            <div className="h-[80px] w-[80px] rounded-xl overflow-hidden shrink-0">
                <img
                    src={urlBaseAPI + game.thumbnail}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 rounded-xl"
                />
            </div>
            <div className="p-4">
                <div className="font-bold text-black">{game.name}</div>
                <div className="text-green-500 my-1 text-xs font-medium flex items-center gap-2">
                    <FaCartArrowDown></FaCartArrowDown>
                    {type === "ACC" ? "Mua ngay" : "Nạp ngay"}
                </div>
            </div>

        </div>
    );
}
