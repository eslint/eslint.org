/**
 * @fileoverview Formatting helpers used throughout the site.
 * @author Nicholas C. Zakas
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import slugifyString from "slugify";

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

//-----------------------------------------------------------------------------
// Dates (always formatted in UTC so builds are the same everywhere)
//-----------------------------------------------------------------------------

/**
 * Formats a date like "05 Jan, 2026".
 */
export function readableDate(value: Date | string): string {
	const date = new Date(value);
	const day = String(date.getUTCDate()).padStart(2, "0");

	return `${day} ${MONTHS[date.getUTCMonth()]}, ${date.getUTCFullYear()}`;
}

/**
 * Formats a date like "2026/01" for use in blog post URLs.
 */
export function blogPermalinkDate(value: Date | string): string {
	const date = new Date(value);
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");

	return `${date.getUTCFullYear()}/${month}`;
}

/**
 * Formats an ISO date string like "5 Jan".
 */
export function shortDateFromISO(isoDate: string): string {
	const date = new Date(isoDate);

	return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;
}

/**
 * Formats an ISO date string like "January 5, 2026".
 */
export function readableDateFromISO(isoDate: string, locale = "en-US"): string {
	return new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC",
	}).format(new Date(isoDate));
}

//-----------------------------------------------------------------------------
// Numbers
//-----------------------------------------------------------------------------

/**
 * Formats a large number in compact notation, such as "27.6M" (short) and
 * "27.6 million" (full).
 */
export function formatStatsNumber(
	number: number,
	locale = "en",
): { short: string; full: string } {
	const formatOptions: Intl.NumberFormatOptions = {
		notation: "compact",
		maximumFractionDigits: 1,
		// @ts-ignore -- `roundingMode` isn't in older TypeScript lib definitions
		roundingMode: "trunc",
	};

	return {
		short: new Intl.NumberFormat(locale, formatOptions).format(number),
		full: new Intl.NumberFormat(locale, {
			...formatOptions,
			compactDisplay: "long",
		}).format(number),
	};
}

/**
 * Formats a number as US dollars.
 */
export function dollars(value: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(value);
}

//-----------------------------------------------------------------------------
// Strings
//-----------------------------------------------------------------------------

/**
 * Creates a URL-friendly version of a string.
 */
export function slugify(text: string | undefined): string {
	if (!text) {
		return "";
	}

	return slugifyString(text, {
		lower: true,
		strict: true,
		remove: /"/gu,
	});
}

/**
 * Creates the slug used in the URL of a blog category.
 */
export function categorySlug(category: string): string {
	return slugifyString(category, {
		replacement: "-",
		remove: /[&,+()$~%.'":*?<>{}]/gu,
		lower: true,
	});
}

/**
 * Uppercases the first letter of a string and lowercases the rest.
 */
export function capitalize(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Estimates how long it takes to read some HTML content.
 */
export function readingTime(html: string, speed = 300): string {
	if (!html) {
		return "0 minutes";
	}

	const content = html.replace(/(<([^>]+)>)/giu, "");
	const matches = content.match(/[Ѐ-ӿ]+|\S+\s*/gu);
	const count = matches !== null ? matches.length : 0;

	return `${Math.ceil(count / speed)} min`;
}
