/**
 * @fileoverview Shared utility functions for the ESLint website.
 */

/**
 * Slugify a string for URL-safe use.
 * @param {string} str The string to slugify.
 * @returns {string} The slugified string.
 */
export function slugify(str) {
	if (!str) return "";
	return str
		.toLowerCase()
		.replace(/[^\w]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/**
 * Extract date from a blog post ID (format: YYYY-MM-DD-slug.md).
 * @param {object} post The post object from content collection.
 * @returns {Date} The post date.
 */
export function getPostDate(post) {
	const match = post.id.match(/^(\d{4})-(\d{2})-(\d{2})/);
	if (match)
		return new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00Z`);
	return new Date(0);
}

/**
 * Get the URL path for a blog post based on its ID.
 * @param {object} post The post object from content collection.
 * @returns {string} The URL path.
 */
export function getPostUrl(post) {
	const match = post.id.match(/^(\d{4})-(\d{2})-\d{2}-(.+?)(?:\.md)?$/);
	if (match) return `/blog/${match[1]}/${match[2]}/${match[3]}/`;
	return `/blog/${post.id.replace(/\.md$/, "")}/`;
}

/**
 * Estimate reading time from post body.
 * @param {string} body The post body text.
 * @returns {string} Reading time estimate.
 */
export function readingTimeEstimate(body) {
	if (!body) return "1 min";
	const words = body.split(/\s+/).length;
	const minutes = Math.max(1, Math.round(words / 250));
	return `${minutes} min`;
}

/**
 * Format a date as "dd MMM, yyyy" (e.g., "01 Jan, 2024").
 * @param {string|Date} dateObj The date to format.
 * @returns {string} The formatted date string.
 */
export function readableDate(dateObj) {
	if (!dateObj) return "";
	const d = new Date(dateObj);
	const months = [
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
	return `${String(d.getUTCDate()).padStart(2, "0")} ${months[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
}

/**
 * Format a value as USD currency.
 * @param {number} value The value to format.
 * @returns {string} The formatted currency string.
 */
export function dollars(value) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(value);
}
