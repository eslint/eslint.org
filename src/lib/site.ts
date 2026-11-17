/**
 * @fileoverview Access to the translated text and settings for the site.
 *
 * All text shown on the site lives in `src/i18n/<locale>.yml`. Components
 * retrieve the text for the locale of the page being rendered:
 *
 *     const site = await getSite(Astro.currentLocale);
 *
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { getCollection, getEntry } from "astro:content";
import links from "../data/links.json";

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * Site-wide URLs, referenced by name from the translations.
 */
export { links };

/**
 * Retrieves the translated text and settings for a locale.
 * @param locale The locale to retrieve, typically `Astro.currentLocale`.
 * @returns The contents of `src/i18n/<locale>.yml`.
 */
export async function getSite(locale: string | undefined): Promise<any> {
	const entry = locale && (await getEntry("sites", locale));

	if (!entry) {
		throw new Error(`No translations found for locale "${locale}".`);
	}

	return entry.data;
}

/**
 * Retrieves the language and hostname of every translation of the site.
 * @returns The sites, ordered by language code.
 */
export async function getAllSites() {
	const entries = await getCollection("sites");

	return entries
		.sort((a, b) => a.id.localeCompare(b.id))
		.map(({ data }) => ({ language: data.language, hostname: data.hostname }));
}

/**
 * Replaces placeholders in translated text, such as replacing
 * `PAGE_NUMBER` in "Page PAGE_NUMBER of TOTAL_PAGE_COUNT".
 * @param text The translated text.
 * @param values The values to insert, keyed by placeholder.
 * @returns The text with all placeholders replaced.
 */
export function fill(
	text: string,
	values: Record<string, string | number>,
): string {
	return Object.entries(values).reduce(
		(result, [placeholder, value]) =>
			result.replaceAll(placeholder, String(value)),
		text,
	);
}
