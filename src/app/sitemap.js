export const dynamic = 'force-dynamic';

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://khoablacktopup.vn";
    // Ưu tiên sử dụng API_URL (internal) nếu có để tránh lỗi loopback trên VPS
    const apiUrl = process.env.INTERNAL_API_URL || process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/account`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/payment`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3,
        },
    ];

    // Dynamic game pages - fetch from API using native fetch for server-side rendering
    let gamePages = [];
    try {
        // Fetch topup games
        const topupResponse = await fetch(`${apiUrl}/api/games/by-type?type=TOPUP`, {
            cache: 'no-store' // Always get fresh data for sitemap
        });
        const topupGames = await topupResponse.json();

        // Fetch acc games  
        const accResponse = await fetch(`${apiUrl}/api/games/by-type?type=ACC`, {
            cache: 'no-store'
        });
        const accGames = await accResponse.json();

        // Create topup pages
        const topupPages = Array.isArray(topupGames)
            ? topupGames
                .filter((game) => game.gamecode)
                .map((game) => ({
                    url: `${baseUrl}/categories/topup/${game.gamecode}`,
                    lastModified: new Date(game.updated_at || Date.now()),
                    changeFrequency: "weekly",
                    priority: 0.8,
                }))
            : [];

        // Create acc pages
        const accPages = Array.isArray(accGames)
            ? accGames
                .filter((game) => game.gamecode)
                .map((game) => ({
                    url: `${baseUrl}/acc/${game.gamecode}`,
                    lastModified: new Date(game.updated_at || Date.now()),
                    changeFrequency: "daily",
                    priority: 0.8,
                }))
            : [];

        gamePages = [...topupPages, ...accPages];
    } catch (error) {
        console.error("Error generating sitemap:", error);
    }

    return [...staticPages, ...gamePages];
}
