/**
 * @fileoverview Helpers for marking the current page in navigation.
 * Each helper returns attributes to spread onto a link.
 */

type Attributes = Record<string, string>;

/**
 * Determines if a link points to the current page or one of its ancestors.
 * @param itemUrl The URL of the link in question.
 * @param pageUrl The URL of the page being rendered.
 */
export function getLinkActiveState(
	itemUrl: string,
	pageUrl: string,
): Attributes {
	const attributes: Attributes = {};

	if (itemUrl === pageUrl) {
		attributes["aria-current"] = "page";
	}

	if (itemUrl.length > 1 && pageUrl.indexOf(itemUrl) === 0) {
		attributes["data-current"] = "true";
	}

	return attributes;
}

/**
 * Determines if the "everything" blog link is for the current page.
 */
export function setBlogActiveState(
	itemUrl: string,
	pageUrl: string,
): Attributes {
	return itemUrl === pageUrl || pageUrl.indexOf("/blog/page/") >= 0
		? { "aria-current": "page" }
		: {};
}

/**
 * Determines if a blog category link is for the current page.
 */
export function setActiveCategory(
	itemUrl: string,
	pageUrl: string,
): Attributes {
	return itemUrl === pageUrl ||
		(itemUrl.length > 1 && pageUrl.indexOf(itemUrl) === 0)
		? { "aria-current": "page" }
		: {};
}
