import HomeClient from "./components/HomeClient";
import { getGames } from "@/services/games.service";

// Metadata SEO
export const metadata = {
    title: "KhoaBlack - Shop Acc Game Uy Tín, Giá Rẻ, Tự Động 24/7",
    description: "KhoaBlack - Hệ thống bán nick game uy tín, nạp game giá rẻ, cày thuê chuyên nghiệp. Giao dịch tự động, bảo mật tuyệt đối, hỗ trợ 24/7.",
    keywords: ["bán acc game", "shop acc uy tín", "nạp game giá rẻ", "cày thuê game", "khoablack", "shop nick game"],
    authors: [{ name: "KhoaBlack" }],
    creator: "KhoaBlack",
    publisher: "KhoaBlack",
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://khoablack.com"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "KhoaBlack - Shop Acc Game Uy Tín Hàng Đầu Việt Nam",
        description: "KhoaBlack cung cấp tài khoản game giá rẻ, nạp game chiết khấu cao. Hệ thống tự động 24/7, an toàn, tin cậy.",
        url: "/",
        siteName: "KhoaBlack",
        images: [
            {
                url: "/imgs/logo.png",
                width: 800,
                height: 600,
                alt: "KhoaBlack Logo",
            },
        ],
        locale: "vi_VN",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "KhoaBlack - Shop Acc Game Uy Tín",
        description: "Mua bán acc game, nạp game giá rẻ tại KhoaBlack.",
        images: ["/imgs/logo.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

// JSON-LD Structured Data
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "KhoaBlack",
    "url": process.env.NEXT_PUBLIC_APP_URL || "https://khoablack.com",
    "potentialAction": {
        "@type": "SearchAction",
        "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${process.env.NEXT_PUBLIC_APP_URL || "https://khoablack.com"}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
    }
};

const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "KhoaBlack",
    "url": process.env.NEXT_PUBLIC_APP_URL || "https://khoablack.com",
    "logo": `${process.env.NEXT_PUBLIC_APP_URL || "https://khoablack.com"}/imgs/logo.png`,
    "sameAs": []
};

// Server Component (Default in Next.js 13+)
export default async function HomePage() {
    let initialGames = [];

    try {
        initialGames = await getGames();
        if (!Array.isArray(initialGames)) initialGames = [];
    } catch (error) {
        console.error("SSR Error fetching games:", error);
        initialGames = [];
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
            />
            <HomeClient initialGames={initialGames} />
        </>
    );
}

