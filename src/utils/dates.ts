/**
 * @fileoverview Date formatting utilities
 * @author ESLint
 */

/**
 * Format a date for display
 * @param dateObj The date to format
 * @returns Formatted date string (e.g., "01 Jan, 2024")
 */
export function readableDate(dateObj: Date | string): string {
	const date = new Date(dateObj);
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

/**
 * Format a date for blog permalinks
 * @param dateObj The date to format
 * @returns Formatted date string (e.g., "2024/01")
 */
export function blogPermalinkDate(dateObj: Date | string): string {
	const date = new Date(dateObj);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	return `${year}/${month}`;
}

/**
 * Format an ISO date string to short format
 * @param isoDate The ISO date string
 * @returns Short formatted date (e.g., "1 Jan")
 */
export function shortDateFromISO(isoDate: string): string {
	const date = new Date(isoDate);
	return date.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
	});
}

/**
 * Format an ISO date string to full readable format
 * @param isoDate The ISO date string
 * @returns Full formatted date
 */
export function readableDateFromISO(isoDate: string): string {
	const date = new Date(isoDate);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC",
	});
}
