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
const upcomingVersionPrereleaseType = "alpha";

module.exports = {
    upcomingVersionPrereleaseType
};
