/**
 * @fileoverview Helper utilities
 * @author ESLint
 */

/**
 * Returns attributes based on whether the link is active or a parent of an active item
 * @param itemUrl The link in question
 * @param pageUrl The current page URL
 * @returns The attributes string
 */
export function getLinkActiveState(itemUrl: string, pageUrl: string): string {
	let response = "";

	if (itemUrl === pageUrl) {
		response = ' aria-current="page" ';
	}

	if (itemUrl.length > 1 && pageUrl.indexOf(itemUrl) === 0) {
		response += ' data-current="true" ';
	}

	return response;
}

/**
 * Check if a blog link is active
 * @param itemUrl The link in question
 * @param pageUrl The current page URL
 * @returns The attributes string
 */
export function setBlogActiveState(itemUrl: string, pageUrl: string): string {
	let response = "";

	if (itemUrl === pageUrl || pageUrl.indexOf("/blog/page/") >= 0) {
		response = ' aria-current="page" ';
	}

	return response;
}

/**
 * Check if a category link is active
 * @param itemUrl The link in question
 * @param pageUrl The current page URL
 * @returns The attributes string
 */
export function setActiveCategory(itemUrl: string, pageUrl: string): string {
	let response = "";

	if (itemUrl === pageUrl) {
		response = ' aria-current="page" ';
	}

	if (itemUrl.length > 1 && pageUrl.indexOf(itemUrl) === 0) {
		response += ' aria-current="page" ';
	}

	return response;
}

/**
 * Exclude an item from an array based on URL
 * @param arr The array of items
 * @param pageUrl The URL to exclude
 * @returns Filtered array
 */
export function excludeThis<T extends { url: string }>(
	arr: T[],
	pageUrl: string,
): T[] {
	return arr.filter(item => item.url !== pageUrl);
}
