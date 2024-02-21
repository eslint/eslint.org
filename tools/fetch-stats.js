/**
 * @fileoverview Script to fetch stats for the homepage
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const semver = require("semver");
const cheerio = require("cheerio");
const { request } = require("undici");
const { graphql } = require("@octokit/graphql");
const fs = require("fs/promises");
const { DateTime } = require("luxon");
const util = require("util");
const downloadStats = require("download-stats");
const { upcomingVersionPrereleaseType } = require("./release-data");

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const statsFilePath = "./src/_data/stats.json";

const { ESLINT_GITHUB_TOKEN } = process.env;

if (!ESLINT_GITHUB_TOKEN) {
    throw new Error("Missing ESLINT_GITHUB_TOKEN.");
}

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const fetchWeeklyNpmDownloads = util.promisify(downloadStats.get.lastWeek);

async function fetchStatsFromGitHubAPI() {
    const { repository } = await graphql(`query {
        repository(owner:"eslint", name:"eslint") {
            releases(first: 20, orderBy: { field: CREATED_AT, direction: DESC } ) {
                nodes {
                    publishedAt
                    isPrerelease
                    tagName
                }
            }
            stargazerCount
            pushedAt
        }
        }`, {
        headers: {
            authorization: `token ${ESLINT_GITHUB_TOKEN}`,
            Accept: "application/vnd.github.hawkgirl-preview+json"
        }
    });

    /*
     * We want to find:
     *
     *     1. `latestRelease` - This is the release tagged `latest` on the npm.
     *         For example, 8.56.0 or 9.0.0.
     *         In the terms of semver, this is the highest non-prerelease version.
     *     2. `currentRelease` - This is the release with the newest features.
     *         This is normally the same as `latestRelease` (for example, 8.56.0 or 9.0.0),
     *         but if we are in the process of publishing prereleases of the upcoming
     *         major version, this is the most recent prerelease (for example, 9.0.0-alpha.2),
     *         the one tagged `next` on the npm.
     *         In the terms of semver, this is the highest version.
     *
     * So, we need to find the highest version and the highest non-prerelease version.
     * We're fetching releases from GitHub, which returns them ordered by creation date.
     * This order typically already matches the semver order. However, if we've recently released
     * some backport versions (e.g., v8.57.0 after 9.0.0-alpha.2), the order in the fetched
     * list will not follow semver:
     *
     *     8.57.0
     *     9.0.0-alpha.2
     *     9.0.0-alpha.1
     *     9.0.0-alpha.0
     *     8.56.0
     *     ...
     *
     * To account for this case, we'll first sort versions by semver, in descending order:
     *
     *     9.0.0-alpha.2
     *     9.0.0-alpha.1
     *     9.0.0-alpha.0
     *     8.57.0
     *     8.56.0
     *     ...
     *
     */
    const releases = repository.releases.nodes.toSorted(
        (first, second) => semver.rcompare(first.tagName, second.tagName)
    );

    /*
     * Now we know that the first version in the list is the highest version, and that
     * the first non-prerelease version in the list is the highest non-prerelease version.
     */
    const [currentRelease] = releases;
    const latestRelease = releases.find(({ isPrerelease }) => !isPrerelease);

    return {
        latestVersion: latestRelease.tagName,
        latestVersionDate: latestRelease.publishedAt,
        currentVersion: currentRelease.tagName,
        currentVersionDate: currentRelease.publishedAt,
        currentVersionIsPrerelease: currentRelease.isPrerelease,
        stars: repository.stargazerCount,
        lastCommitDate: repository.pushedAt
    };
}

async function fetchGitHubNetworkStats() {

    const response = await request("https://github.com/eslint/eslint/network/dependents");
    const html = await response.body.text();
    const $ = cheerio.load(html);
    const projectDependents = $("[href~='/eslint/eslint/network/dependents?dependent_type=REPOSITORY']").text();

    return {
        projectDependents: Number(projectDependents.trim().replace(/[^\d]/gu, ""))
    };
}

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

(async () => {

    const [
        repoStats,
        dependencyStats,
        { downloads: weeklyDownloads }
    ] = await Promise.all([
        fetchStatsFromGitHubAPI(),
        fetchGitHubNetworkStats(),
        fetchWeeklyNpmDownloads("eslint")
    ]);

    const stats = {
        ...repoStats,
        ...dependencyStats,
        weeklyDownloads
    };

    const { currentVersion } = stats;
    let nextVersion;

    if (stats.currentVersionIsPrerelease) {
        if (upcomingVersionPrereleaseType) {

            /*
             * prerelease -> prerelease
             * Increments prerelease number or updates prerelease type.
             * Examples:
             *    9.0.0-alpha.0 -> 9.0.0-alpha.1
             *    9.0.0-alpha.1 -> 9.0.0-beta.0
             */
            nextVersion = semver.inc(currentVersion, "prerelease", upcomingVersionPrereleaseType);
        } else {

            /*
           * prerelease -> major
           * Example:
           *     9.0.0-rc.1 -> 9.0.0
           */
            nextVersion = semver.inc(currentVersion, "major");
        }
    } else {
        if (upcomingVersionPrereleaseType) {

            /*
             * regular -> prerelease
             * Example:
             *    8.56.0 -> 9.0.0-alpha.0
             */
            nextVersion = semver.inc(currentVersion, "premajor", upcomingVersionPrereleaseType);
        } else {

            /*
           * regular -> regular
           * Example:
           *     8.56.0 -> 8.57.0
           */
            nextVersion = semver.inc(currentVersion, "minor");
        }
    }

    stats.nextVersion = `v${nextVersion}`;

    // approximate next release date
    stats.nextVersionDate = DateTime.fromISO(stats.currentVersionDate)
        .plus({ weeks: 2 }).endOf("week").minus({ days: 2 }).toISODate();

    await fs.writeFile(statsFilePath, JSON.stringify(stats, null, 4), { encoding: "utf8" });

    console.log("Fetch Homepage Stats: Success");

})();
