/**
 * @fileoverview Internationalization utilities for the ESLint website
 * @author ESLint
 */

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

// Available locales
export const locales = [
	"en",
	"es",
	"de",
	"fr",
	"hi",
	"ja",
	"pt-br",
	"zh-hans",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Cache for loaded site data
const siteDataCache: Map<string, Record<string, unknown>> = new Map();

// Get the data directory path
function getDataDir(): string {
	// In development, use the src/_data path relative to project root
	// In production build, this should still work as the file is resolved at build time
	return path.resolve(process.cwd(), "src", "_data");
}

/**
 * Load site-specific translations from YAML files
 * @param locale The locale code
 * @returns The site data for the locale
 */
export function getSiteData(locale: Locale): Record<string, unknown> {
	if (siteDataCache.has(locale)) {
		return siteDataCache.get(locale)!;
	}

	const dataDir = getDataDir();
	const siteDataFile = path.join(dataDir, "sites", `${locale}.yml`);

	try {
		const content = fs.readFileSync(siteDataFile, "utf-8");
		const data = yaml.load(content) as Record<string, unknown>;
		siteDataCache.set(locale, data);
		return data;
	} catch (error) {
		console.error(`Failed to load site data for locale "${locale}":`, error);
		// Fall back to English if available
		if (locale !== "en") {
			return getSiteData("en");
		}
		throw error;
	}
}

/**
 * Get the URL for a page in a specific locale
 * @param path The path without locale prefix
 * @param locale The target locale
 * @returns The full URL path with locale prefix
 */
export function getLocalizedUrl(urlPath: string, locale: Locale): string {
	// Ensure path starts with /
	const normalizedPath = urlPath.startsWith("/") ? urlPath : `/${urlPath}`;
	return `/${locale}${normalizedPath}`;
}

/**
 * Get all available languages with their metadata
 * @returns Array of language objects with code, name, and flag
 */
export function getLanguages(): Array<{
	code: Locale;
	name: string;
	flag: string;
}> {
	return locales.map(locale => {
		const siteData = getSiteData(locale);
		const language = siteData.language as {
			code: string;
			name: string;
			flag: string;
		};
		return {
			code: locale,
			name: language?.name || locale,
			flag: language?.flag || "",
		};
	});
}

/**
 * Extract locale from URL path
 * @param url The URL path
 * @returns The locale code or default locale
 */
export function getLocaleFromUrl(url: string): Locale {
	const segments = url.split("/").filter(Boolean);
	const firstSegment = segments[0] as Locale;

	if (locales.includes(firstSegment)) {
		return firstSegment;
	}

	return defaultLocale;
}
