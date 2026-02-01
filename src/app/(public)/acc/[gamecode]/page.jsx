import AccClient from "./Components/AccClient";

// Dynamic metadata for SEO
export async function generateMetadata({ params }) {
    const { gamecode } = params;
    // Ưu tiên sử dụng API_URL (internal) nếu có để tránh lỗi loopback trên VPS
    const apiUrl = process.env.INTERNAL_API_URL || process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

    try {
        // Fetch game data for SEO
        const response = await fetch(`${apiUrl}/api/games/game/${gamecode}`);
        if (!response.ok) {
            // If the response is not OK, throw an error or return default metadata
            console.error(`Failed to fetch game data: ${response.status} ${response.statusText}`);
            return {
                title: "Mua Nick Game - KhoaBlack",
                description: "Shop bán acc game uy tín, giá rẻ, bảo hành trọn đời.",
            };
        }
        const game = await response.json();

        if (game) {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://khoablacktopup.vn";
            return {
                title: `Mua Nick ${game.name} - Giá Rẻ, Uy Tín, Bảo Hành | KhoaBlack`,
                description: `Shop bán acc ${game.name} giá rẻ, uy tín. Tài khoản chất lượng, bảo hành trọn đời, giao dịch tự động 24/7.`,
                keywords: [`mua nick ${game.name}`, `acc ${game.name}`, `shop acc ${game.name}`, "bán acc game", "khoablack"],
                openGraph: {
                    title: `Mua Nick ${game.name} Giá Rẻ | KhoaBlack`,
                    description: `Shop bán acc ${game.name} uy tín nhất. Giá rẻ, bảo hành, giao dịch tự động.`,
                    images: [
                        {
                            url: game.thumbnail?.startsWith('http') ? game.thumbnail : process.env.NEXT_PUBLIC_API_URL + game.thumbnail,
                            width: 800,
                            height: 600,
                            alt: `Acc ${game.name}`,
                        },
                    ],
                    type: "website",
                    locale: "vi_VN",
                },
                twitter: {
                    card: "summary_large_image",
                    title: `Mua Nick ${game.name}`,
                    description: `Shop acc ${game.name} uy tín, giá rẻ.`,
                    images: [game.thumbnail?.startsWith('http') ? game.thumbnail : process.env.NEXT_PUBLIC_API_URL + game.thumbnail],
                },
                alternates: {
                    canonical: `${baseUrl}/acc/${gamecode}`,
                },
            };
        }
    } catch (error) {
        console.error("Error generating acc metadata:", error);
    }

    return {
        title: "Mua Nick Game - KhoaBlack",
        description: "Shop bán acc game uy tín, giá rẻ, bảo hành trọn đời.",
    };
}

// Server Component wrapper
export default async function AccPage(props) {
    const params = await props.params;
    return <AccClient gamecode={params?.gamecode} />;
}
