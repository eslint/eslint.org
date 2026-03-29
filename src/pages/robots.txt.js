import { site } from "../data/index.js";

export async function GET() {
    const sitemapUrl = `https://${site.hostname}/sitemap-index.xml`;
    const isNew = site.hostname && site.hostname.includes("new.");
    const disallow = isNew ? "Disallow: /" : "";

    const body = `Sitemap: ${sitemapUrl}

User-agent: *
${disallow}`;

    return new Response(body.trim(), {
        headers: { "Content-Type": "text/plain" },
    });
}
