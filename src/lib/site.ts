/**
 * @fileoverview Access to the translated text and settings for the site.
 *
 * All text shown on the site lives in `src/i18n/<locale>.yml`. Components
 * retrieve the text for the locale of the page being rendered:
 *
 *     const site = await getSite(Astro.currentLocale);
 *
 * English pages are published at the root of the site (`/team/`) and the
 * translated pages are published under their language code (`/ja/team/`).
 *
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import { getCollection, getEntry } from "astro:content";
import links from "../data/links.json";

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

/**
 * The locale that is published at the root of the site. Its site file is
 * also where the settings for the whole site come from.
 * This must match `i18n.defaultLocale` in `astro.config.mjs`.
 */
export const DEFAULT_LOCALE = "en";

/**
 * Settings that apply to the whole site rather than to one language. These
 * always come from the site file of the default locale.
 */
const SITE_SETTINGS = [
	"hostname",
	"locals",
	"redirects",
	"google_analytics",
	"carbon_ads",
	"ethical_ads",
];

/**
 * The pages that are translated. Every other page, such as the blog, only
 * exists in English.
 */
const TRANSLATED_PAGES = new Set([
	"/",
	"/branding",
	"/donate",
	"/languages",
	"/sponsors",
	"/team",
]);

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Fills in any text that is missing from a translation with the text from
 * the default locale.
 */
function withFallback(translation: unknown, fallback: unknown): any {
	if (!isObject(translation) || !isObject(fallback)) {
		return translation ?? fallback;
	}

	const result: Record<string, unknown> = { ...fallback };

	for (const [key, value] of Object.entries(translation)) {
		result[key] = withFallback(value, fallback[key]);
	}

	return result;
}

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * Site-wide URLs, referenced by name from the translations.
 */
export { links };

/**
 * Retrieves the translated text and settings for a locale. Text that hasn't
 * been translated falls back to English.
 * @param locale The locale to retrieve, typically `Astro.currentLocale`.
 * @returns The contents of `src/i18n/<locale>.yml`.
 */
export async function getSite(
	locale: string | undefined = DEFAULT_LOCALE,
): Promise<any> {
	const defaultSite = (await getEntry("sites", DEFAULT_LOCALE))!.data;

	if (locale === DEFAULT_LOCALE) {
		return defaultSite;
	}

	const entry = await getEntry("sites", locale);

	if (!entry) {
		throw new Error(`No translations found for locale "${locale}".`);
	}

	const site = withFallback(entry.data, defaultSite);

	for (const setting of SITE_SETTINGS) {
		site[setting] = defaultSite[setting];
	}

	return site;
}

/**
 * Retrieves the language of every translation of the site.
 * @returns The languages, ordered by language code.
 */
export async function getLanguages() {
	const entries = await getCollection("sites");

	return entries
		.sort((a, b) => a.id.localeCompare(b.id))
		.map(({ id, data }) => ({ ...data.language, locale: id }));
}

/**
 * Creates the paths for a translated page, for use as `getStaticPaths()`
 * in the pages in `src/pages/[...locale]`. The page is generated once at
 * the root of the site for English and once under each other language code.
 */
export async function getLocalePaths() {
	const entries = await getCollection("sites");

	return entries.map(({ id }) => ({
		params: { locale: id === DEFAULT_LOCALE ? undefined : id },
	}));
}

/**
 * Determines the URL of a page in a locale. Only translated pages have
 * their own URL in each locale; all other URLs are returned as-is.
 * @param url A URL as it is in the default locale, such as `/team/`.
 * @param locale The locale to link to, typically `Astro.currentLocale`.
 * @returns The URL for the locale, such as `/ja/team/`.
 */
export function localizeUrl(
	url: string,
	locale: string | undefined = DEFAULT_LOCALE,
): string {
	if (locale === DEFAULT_LOCALE) {
		return url;
	}

	const [, path, suffix] = /^([^#?]*)(.*)$/u.exec(url)!;
	const page = path.length > 1 ? path.replace(/\/$/u, "") : path;

	if (!TRANSLATED_PAGES.has(page)) {
		return url;
	}

	return `/${locale}${path}${suffix}`;
}

/**
 * Removes the language code from the URL of a translated page.
 * @param url The URL of a page, such as `/ja/team/`.
 * @param locale The locale of the page, typically `Astro.currentLocale`.
 * @returns The URL in the default locale, such as `/team/`.
 */
export function unlocalizeUrl(
	url: string,
	locale: string | undefined = DEFAULT_LOCALE,
): string {
	const prefix = `/${locale}`;

	if (locale === DEFAULT_LOCALE || !url.startsWith(prefix)) {
		return url;
	}

	return url.slice(prefix.length) || "/";
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
