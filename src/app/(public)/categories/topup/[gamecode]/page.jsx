import { getAllPackageByGameCode } from "@/services/toup_package.service";
import { getGameByGameCode } from "@/services/games.service";
import TopUpClient from "./components/TopUpClient";

export async function generateMetadata(props) {
    const params = await props.params;
    const gamecode = params.gamecode;
    const apiUrl = process.env.INTERNAL_API_URL || process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://khoablacktopup.vn";

    try {
        const game = await getGameByGameCode(gamecode);
        if (game) {
            return {
                title: `Nạp game ${game.name} - Giá rẻ, Uy tín, Nhanh chóng`,
                description: `Dịch vụ nạp game ${game.name} siêu tốc, chiết khấu cao, bảo mật 100%. Nạp ngay tại KhoaBlackTopup!`,
                keywords: [`nạp game ${game.name}`, `nạp ${game.name}`, `topup ${game.name}`, "nạp game giá rẻ", "khoablack"],
                openGraph: {
                    title: `Nạp game ${game.name} - KhoaBlackTopup`,
                    description: `Dịch vụ nạp game ${game.name} uy tín nhất. Chiết khấu cao, giao dịch tự động 24/7.`,
                    images: [game.thumbnail?.startsWith('http') ? game.thumbnail : process.env.NEXT_PUBLIC_API_URL + game.thumbnail],
                    type: "website",
                    locale: "vi_VN",
                },
                twitter: {
                    card: "summary_large_image",
                    title: `Nạp game ${game.name}`,
                    description: `Dịch vụ nạp game ${game.name} uy tín, giá rẻ.`,
                    images: [game.thumbnail?.startsWith('http') ? game.thumbnail : process.env.NEXT_PUBLIC_API_URL + game.thumbnail],
                },
                icons: {
                    icon: game.thumbnail?.startsWith('http') ? game.thumbnail : process.env.NEXT_PUBLIC_API_URL + game.thumbnail,
                    shortcut: game.thumbnail?.startsWith('http') ? game.thumbnail : process.env.NEXT_PUBLIC_API_URL + game.thumbnail,
                    apple: game.thumbnail?.startsWith('http') ? game.thumbnail : process.env.NEXT_PUBLIC_API_URL + game.thumbnail,
                },
                alternates: {
                    canonical: `${baseUrl}/categories/topup/${gamecode}`,
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
    }

    // JSON-LD Structured Data for this game
    const jsonLd = game ? {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `Nạp game ${game.name}`,
        "description": `Dịch vụ nạp game ${game.name} uy tín, giá rẻ, tự động 24/7`,
        "provider": {
            "@type": "Organization",
            "name": "KhoaBlackTopup",
            "url": process.env.NEXT_PUBLIC_APP_URL || "https://khoablacktopup.vn"
        },
        "areaServed": "VN",
        "image": game.thumbnail?.startsWith('http') ? game.thumbnail : process.env.NEXT_PUBLIC_API_URL + game.thumbnail
    } : null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <TopUpClient game={game} listPkg={listPkg} />
        </>
    );
}

