/**
 * @fileoverview The robots.txt file.
 */

import type { APIRoute } from "astro";
import { getSite } from "../lib/site";

export const GET: APIRoute = async ({ currentLocale }) => {
	const site = await getSite(currentLocale);

	// sites that haven't launched yet are hosted at new.<domain>
	const rules = site.hostname.includes("new.") ? "Disallow: /" : "";

	return new Response(
		`Sitemap: https://${site.hostname}/sitemap-index.xml\n\nUser-agent: *\n${rules}\n`,
	);
};
