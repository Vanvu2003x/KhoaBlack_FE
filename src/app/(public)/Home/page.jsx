import HomeClient from "./components/HomeClient";
import { getGames } from "@/services/games.service";

// Metadata SEO
export const metadata = {
    title: "KhoaBlackTopUp - Nạp Game Tốc Độ, Uy Tín, Chất Lượng",
    description: "KhoaBlackTopUp - Dịch vụ nạp game hàng đầu Việt Nam với tốc độ nhanh chóng, giao dịch tự động 24/7. Mua bán nick game uy tín, bảo mật tuyệt đối, chiết khấu cao nhất thị trường. Shop acc game giá rẻ, cày thuê chuyên nghiệp.",
    keywords: [
        "nạp game",
        "mua nick game",
        "shop acc game",
        "khoablack",
        "topup game",
        "nạp game uy tín",
        "khoa black top up",
        "khoablacktopup",
        "nạp game tự động",
        "mua acc game giá rẻ",
        "cày thuê game",
        "bán acc game"
    ],
    authors: [{ name: "KhoaBlack" }],
    creator: "KhoaBlack",
    publisher: "KhoaBlackTopUp",
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://khoablacktopup.vn"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "KhoaBlackTopUp - Nạp Game Tốc Độ, Uy Tín, Chất Lượng",
        description: "Dịch vụ nạp game hàng đầu Việt Nam với tốc độ nhanh chóng, giao dịch tự động 24/7. Mua bán nick game uy tín, bảo mật tuyệt đối, chiết khấu cao nhất thị trường.",
        url: "/",
        siteName: "KhoaBlackTopUp",
        images: [
            {
                url: "/imgs/image.png",
                secureUrl: "https://khoablacktopup.vn/imgs/image.png",
                width: 1200,
                height: 630,
                alt: "KhoaBlackTopUp - Nạp Game Uy Tín",
                type: "image/png",
            },
        ],
        locale: "vi_VN",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "KhoaBlackTopUp - Nạp Game Tốc Độ, Uy Tín, Chất Lượng",
        description: "Dịch vụ nạp game hàng đầu Việt Nam. Giao dịch tự động 24/7, bảo mật tuyệt đối.",
        images: ["/imgs/image.png"],
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
    "name": "KhoaBlackTopUp",
    "alternateName": ["Khoa Black Top Up", "KhoaBlack", "khoablacktopup"],
    "url": process.env.NEXT_PUBLIC_APP_URL || "https://khoablacktopup.vn",
    "description": "Dịch vụ nạp game hàng đầu Việt Nam với tốc độ nhanh chóng, giao dịch tự động 24/7. Mua bán nick game uy tín, bảo mật tuyệt đối.",
    "potentialAction": {
        "@type": "SearchAction",
        "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${process.env.NEXT_PUBLIC_APP_URL || "https://khoablacktopup.vn"}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
    }
};

const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "KhoaBlackTopUp",
    "alternateName": ["Khoa Black Top Up", "KhoaBlack"],
    "url": process.env.NEXT_PUBLIC_APP_URL || "https://khoablacktopup.vn",
    "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_APP_URL || "https://khoablacktopup.vn"}/imgs/image.png`,
        "width": 512,
        "height": 512
    },
    "description": "KhoaBlackTopUp - Nạp Game Tốc Độ, Uy Tín, Chất Lượng",
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

