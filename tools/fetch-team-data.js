/**
 * @fileoverview Script to fetch team data from GitHub. Call using:
 *     node _tools/fetch-team-data.js
 * @author Nicholas C. Zakas
 */

/* eslint camelcase: [error, { properties: never }] -- API response */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const fs = require("node:fs/promises");
const matter = require("gray-matter");
const { Octokit } = require("@octokit/rest");
const path = require("node:path");

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

// filename to output to
const teamFilename = "./src/_data/team.json";
const authorsFilename = "./src/_data/all_authors.json";
const blogPostsDirectory = "./src/content/blog";

// retrieve token from environment
const { ESLINT_GITHUB_TOKEN } = process.env;

// exit early if no token is available
if (!ESLINT_GITHUB_TOKEN) {
	throw new Error("Missing ESLINT_GITHUB_TOKEN.");
}

// Github slugs for teams
const TSC_TEAM_SLUG = "eslint-tsc";
const REVIEWERS_TEAM_SLUG = "eslint-reviewers";
const COMMITTERS_TEAM_SLUG = "eslint-team";
const WEBSITE_TEAM_SLUG = "website-team";
const SUPPORT_TEAM_SLUG = "support-team";
const ALUMNI_TEAM_SLUG = "eslint-alumni";

// lookup table mapping Github team IDs to JSON keys
const teamIds = {
	[TSC_TEAM_SLUG]: "tsc",
	[COMMITTERS_TEAM_SLUG]: "committers",
	[WEBSITE_TEAM_SLUG]: "website",
	[SUPPORT_TEAM_SLUG]: "support",
	[REVIEWERS_TEAM_SLUG]: "reviewers",
	[ALUMNI_TEAM_SLUG]: "alumni",
};

// lookup table mapping Github team IDs to member titles
const teamMemberTitles = {
	tsc: "ESLint Technical Steering Committee",
	committers: "ESLint Committer",
	reviewers: "ESLint Reviewer",
	website: "ESLint Website Team",
	support: "ESLint Support Team",
	alumni: "ESLint Alumnus",
};

// blog post authors
const users = new Map();

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const octokit = new Octokit({
	userAgent: "ESLint Website",
	auth: ESLINT_GITHUB_TOKEN,
});

async function fetchUserProfile(username) {
	// check cache first
	if (users.has(username)) {
		return users.get(username);
	}

	const { data: profile } = await octokit.users.getByUsername({ username });
	const { data: social } = await octokit.request(
		"GET /users/{username}/social_accounts",
		{ username },
	);

	const result = {
		username: profile.login,
		name: profile.name,
		title: "Guest Author",
		// eslint-disable-next-line no-nested-ternary -- add https if missing
		website: profile.blog.match(/http(s)?:\/\//u)
			? profile.blog
			: profile.blog
				? `https://${profile.blog}`
				: profile.blog,
		avatar_url: profile.avatar_url,
		bio: profile.bio,
		twitter_username: profile.twitter_username,
		github_username: profile.login,
		mastodon_url: social.find(account => account.provider === "mastodon")
			?.url,
		location: profile.location,
	};

	// cache the result
	users.set(username, result);
	return result;
}

async function fetchTeamMembers() {
	// final data structure
	const team = {
		tsc: [],
		alumni: [],
		reviewers: [],
		committers: [],
		website: [],
		support: [],
	};

	for (const teamId of [
		TSC_TEAM_SLUG,
		ALUMNI_TEAM_SLUG,
		COMMITTERS_TEAM_SLUG,
		REVIEWERS_TEAM_SLUG,
		WEBSITE_TEAM_SLUG,
		SUPPORT_TEAM_SLUG,
	]) {
		const { data: result } = await octokit.teams.listMembersInOrg({
			org: "eslint",
			team_slug: teamId,
			per_page: 100,
		});

		// this user only has login, need to fetch the full profile for useful data
		for (const user of result) {
			const profile = await fetchUserProfile(user.login);

			team[teamIds[teamId]].push(profile);
		}
	}

	// filter out TSC members and reviewers from committers list
	team.committers = team.committers.filter(
		user =>
			!team.tsc.some(tscmember => tscmember.username === user.username) &&
			!team.reviewers.some(
				tscmember => tscmember.username === user.username,
			),
	);

	// add appropriate titles
	for (const [teamName, members] of Object.entries(team)) {
		members.forEach(member => {
			member.title = teamMemberTitles[teamName];
		});
	}

	return team;
}

async function fetchBlogAuthors() {
	const authors = {};
	const files = (await fs.readdir(blogPostsDirectory))
		.filter(filename => filename.endsWith(".md"))
		.map(filename => path.join(blogPostsDirectory, filename));

	for (const filename of files) {
		const contents = await fs.readFile(filename, "utf8");
		const { data: frontmatter } = matter(contents);

		if (Array.isArray(frontmatter.authors)) {
			for (const username of frontmatter.authors) {
				authors[username] = await fetchUserProfile(username);
			}
		}
	}

	return authors;
}

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

(async () => {
	const [team, authors] = await Promise.all([
		fetchTeamMembers(),
		fetchBlogAuthors(),
	]);

	const existingAuthors = JSON.parse(
		await fs.readFile(authorsFilename, "utf8"),
	);
	const allAuthors = {
		...existingAuthors,
		...authors,
	};

	await fs.writeFile(teamFilename, JSON.stringify(team, null, "    "), {
		encoding: "utf8",
	});
	await fs.writeFile(
		authorsFilename,
		JSON.stringify(allAuthors, null, "    "),
		{ encoding: "utf8" },
	);

	console.log("Fetch Team Data: Success");
})();
