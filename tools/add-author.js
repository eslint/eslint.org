/**
 * @fileoverview Script to fetch team data from GitHub. Call using:
 *     node tools/add-author.js username
 * @author Nicholas C. Zakas
 */

/* eslint camelcase: [error, { properties: never }] -- API response */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const fs = require("fs/promises");
const { Octokit } = require("@octokit/rest");
const path = require("path");

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

// filename to output to
const authorsFilename = "./src/_data/all_authors.json";
const bioPath = "./src/_includes/partials/author_bios/";
const username = process.argv[2];

if (!username) {
    console.error("No username passed.");
    process.exit(1);
}

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const octokit = new Octokit({
    userAgent: "ESLint Website"
});

async function fetchUserProfile() {

    const { data: profile } = await octokit.users.getByUsername({ username });

    return {
        username: profile.login,
        name: profile.name,
        title: "Guest Author",
        website: profile.blog,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        twitter_username: profile.twitter_username,
        github_username: profile.login,
        location: profile.location
    };
}

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

(async () => {

    // fetch author info from GitHub
    const authors = JSON.parse(await fs.readFile(authorsFilename, "utf8"));
    const profile = await fetchUserProfile();

    authors[profile.username] = profile;

    await fs.writeFile(authorsFilename, JSON.stringify(authors, null, 4), "utf8");
    console.log(`Updated ${authorsFilename} with ${username}`);

    // create bio file if not already present
    const bioFilePath = path.join(bioPath, `${profile.username}.md`);

    try {
        await fs.stat(bioFilePath);
    } catch {
        await fs.writeFile(bioFilePath, profile.bio ?? "", "utf8");
    }

    console.log(`Please update ${bioFilePath} to include your information.`);
})();
