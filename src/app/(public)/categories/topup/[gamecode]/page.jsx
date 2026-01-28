import { getAllPackageByGameCode } from "@/services/toup_package.service";
import { getGameByGameCode } from "@/services/games.service";
import TopUpClient from "./components/TopUpClient";

export async function generateMetadata(props) {
    const params = await props.params;
    const gamecode = params.gamecode;
    const apiUrl = process.env.INTERNAL_API_URL || process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    try {
        const game = await getGameByGameCode(gamecode);
        if (game) {
            return {
                title: `Nạp game ${game.name} - Giá rẻ, Uy tín, Nhanh chóng`,
                description: `Dịch vụ nạp game ${game.name} siêu tốc, chiết khấu cao, bảo mật 100%. Nạp ngay tại đây!`,
                openGraph: {
                    title: `Nạp game ${game.name}`,
                    description: `Dịch vụ nạp game ${game.name} uy tín nhất.`,
                    images: [process.env.NEXT_PUBLIC_API_URL + game.thumbnail],
                },
            };
        }
    } catch (error) {
        console.error("Error generating metadata:", error);
    }
    return {
        title: "Nạp Game Online - Uy Tín, Giá Rẻ",
        description: "Trung tâm nạp game online giá rẻ, uy tín, chiết khấu cao.",
    };
}

export default async function GameTopUpPage(props) {
    const params = await props.params;
    const gamecode = params.gamecode;
    let game = null;
    let listPkg = [];

    try {
        const [packagesData, gameData] = await Promise.all([
            getAllPackageByGameCode(gamecode),
            getGameByGameCode(gamecode),
        ]);
        listPkg = packagesData || [];
        game = gameData || null;
    } catch (error) {
        console.error("Error fetching data:", error);
        // We can handle error/not found state here or pass nulls
    }

    return <TopUpClient game={game} listPkg={listPkg} />;
}
