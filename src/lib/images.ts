/**
 * @fileoverview Access to the images in `src/assets/images` by filename, for
 * images that are chosen by data (such as blog post covers) and need to be
 * optimized with `astro:assets`.
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import type { ImageMetadata } from "astro";
import { inferRemoteSize } from "astro:assets";

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const IMAGES_DIR = "../assets/images/";

// only the images that are optimized are listed here so that the others
// aren't duplicated in the build output
const images = import.meta.glob<ImageMetadata>(
	[
		"../assets/images/*.{png,jpg,jpeg}",
		"../assets/images/blog-covers/*.{png,jpg,jpeg}",
		"../assets/images/people/testimonials/large/*.{png,jpg,jpeg}",
	],
	{ import: "default", eager: true },
);

// remote images are measured once per build, however many pages show them
const remoteRatios = new Map<string, Promise<number | undefined>>();

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

/**
 * Retrieves an image for use with `<Picture>` or `<Image>`.
 * @param path The path of the image relative to `src/assets/images`, such as
 *      `blog-covers/announcements.png`.
 * @returns The image.
 * @throws {Error} If the image doesn't exist.
 */
export function getLocalImage(path: string): ImageMetadata {
	const image = images[IMAGES_DIR + path.replace(/^\//u, "")];

	if (!image) {
		throw new Error(`Image not found: src/assets/images/${path}`);
	}

	return image;
}

/**
 * Calculates the width a remote image has when it is shown at a given height,
 * so that lazy-loaded images can reserve their space before they load.
 * @param url The URL of the image.
 * @param height The height the image is shown at.
 * @returns The width, or `undefined` if the image is local or couldn't be
 *      measured (the image is then sized by the browser once it loads).
 */
export async function getRemoteImageWidth(
	url: string | null | undefined,
	height: number,
): Promise<number | undefined> {
	if (!url || !/^https?:/u.test(url)) {
		return undefined;
	}

	if (!remoteRatios.has(url)) {
		remoteRatios.set(
			url,
			inferRemoteSize(url).then(
				size => size.width / size.height,
				() => undefined,
			),
		);
	}

	const ratio = await remoteRatios.get(url);

	return ratio ? Math.round(ratio * height) : undefined;
}
