/**
 * @fileoverview Access to the images in `src/assets/images` by filename, for
 * images that are chosen by data (such as blog post covers) and need to be
 * optimized with `astro:assets`.
 */

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

import type { ImageMetadata } from "astro";

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
