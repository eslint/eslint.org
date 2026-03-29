/**
 * Returns attributes based on whether the link is active or a parent of an active item.
 * @param {string} itemUrl The link URL to check.
 * @param {string} pageUrl The current page URL.
 * @returns {string} HTML attributes string.
 */
export function getLinkActiveState(itemUrl, pageUrl) {
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
 * Returns attributes for blog navigation links.
 * @param {string} itemUrl The link URL to check.
 * @param {string} pageUrl The current page URL.
 * @returns {string} HTML attributes string.
 */
export function setBlogActiveState(itemUrl, pageUrl) {
	let response = "";

	if (itemUrl === pageUrl || pageUrl.indexOf("/blog/page/") >= 0) {
		response = ' aria-current="page" ';
	}

	return response;
}

/**
 * Returns attributes for category navigation links.
 * @param {string} itemUrl The link URL to check.
 * @param {string} pageUrl The current page URL.
 * @returns {string} HTML attributes string.
 */
export function setActiveCategory(itemUrl, pageUrl) {
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
 * Filters out a specific item from an array by URL.
 * @param {Array} items Array of items with `url` properties.
 * @param {string} itemToExclude URL of the item to exclude.
 * @returns {Array} Filtered array.
 */
export function excludeThis(items, itemToExclude) {
	return items.filter(item => item.url !== itemToExclude);
}

/**
 * Whether the site is running in development mode.
 */
export const isDev =
	(typeof import.meta.env !== "undefined" && import.meta.env.DEV) ||
	process.env.IS_DEV === "true";
