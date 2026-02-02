export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://khoablacktopup.vn";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/admin/",
                    "/agent/",
                    "/api/",
                    "/payment/",
                    "/account/",
                ],
            },
            {
                userAgent: "Googlebot",
                allow: "/",
                disallow: ["/admin/", "/agent/", "/api/"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
