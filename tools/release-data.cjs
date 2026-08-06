/**
 * @fileoverview Release-related data that needs to be hard-coded
 * @author Milos Djermanovic
 */

"use strict";

/**
 * - Set to `null` if the upcoming version is _not_ a prerelease,
 *   regardless of the current version. The upcoming version can be
 *   a regular minor release or a major release after prereleases.
 * - Set to "alpha", "beta", or "rc" if the upcoming version is
 *   an alpha/beta/rc prerelease, regardless of the current version.
 * @type {null|string}
 */
const upcomingVersionPrereleaseType = null;

/**
 * - Set to `null` if the next release date is per the regular schedule.
 * - Set to the ISO 8601 string format of the next release date
 *   if the next release date is not per the regular schedule.
 *     Example: "2025-01-10"
 *   This is typically used to skip a regularly scheduled release.
 *   Note: Dates that are less than the date of the next regular release
 *     are automatically ignored so that we don't need to update the stats manually.
 * @type {null|string}
 */
const nextVersionDateOverride = "2026-01-09";

module.exports = {
	upcomingVersionPrereleaseType,
	nextVersionDateOverride,
};
