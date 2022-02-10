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
            latestRelease {
                publishedAt
                isPrerelease
                tagName
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

    return {
        currentVersion: repository.latestRelease.tagName,
        currentVersionDate: repository.latestRelease.publishedAt,
        currentVersionIsPrerelease: repository.latestRelease.isPrerelease,
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
        projectDependents: Number(projectDependents.trim().replace(/[^\d]/g, ""))
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

    stats.nextVersion = `v${semver.inc(stats.currentVersion, "minor")}`;
    
    // approximate next release date
    stats.nextVersionDate = DateTime.fromISO(stats.currentVersionDate)
        .plus({ weeks: 2 }).endOf("week").minus({ days: 2 }).toISODate();

    await fs.writeFile(statsFilePath, JSON.stringify(stats, null, 4), { encoding: "utf8" });

    console.log("Fetch Homepage Stats: Success");

})();
