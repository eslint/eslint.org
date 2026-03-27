import { site } from "../data/index.js";

export async function GET() {
    const hostname = site.hostname;
    const hasDocsLatest = site.locals?.docs_latest;

    let xml = `<?xml version="1.0" encoding="utf-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>https://${hostname}/sitemap-0.xml</loc>
    </sitemap>`;

    if (hasDocsLatest) {
        xml += `
    <sitemap>
        <loc>https://${hostname}/docs/latest/sitemap.xml</loc>
    </sitemap>`;
    }

    xml += `
</sitemapindex>`;

    return new Response(xml.trim(), {
        headers: { "Content-Type": "application/xml" },
    });
}
