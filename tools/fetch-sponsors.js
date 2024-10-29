/**
 * @fileoverview Script to fetch sponsor data from Open Collective and GitHub.
 * Call using:
 *     node _tools/fetch-sponsors.js
 *
 * To output debug data, set the DEBUG environment variable to a truthy value:
 *    DEBUG=1 node _tools/fetch-sponsors.js
 *
 * @author Nicholas C. Zakas
 */

/* eslint camelcase: [error, { properties: never }] -- API response */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const fs = require("node:fs/promises");
const { request } = require("undici");
const { graphql: githubGraphQL } = require("@octokit/graphql");

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

// sponsors to block
const blockedSponsorsFilename = "./src/_data/blocked-sponsors.json";

// filename to output sponsors to
const sponsorsFilename = "./src/_data/sponsors.json";
const donationsFilename = "./src/_data/donations.json";

// Contributions from other services that are not actually donations
const knownOneTimers = new Set([
	"GitHub Sponsors",
	"Read the Docs",
	"BuySellAds",
	"EthicalAds",
	"Threadless",
]);

// we must have a token for this to work
const { ESLINT_GITHUB_TOKEN } = process.env;

if (!ESLINT_GITHUB_TOKEN) {
	throw new Error("Missing ESLINT_GITHUB_TOKEN.");
}

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Ensures a URL has a valid protocol.
 * @param {string} url The string to check.
 * @returns {string} The URL with a valid protocol.
 */
function fixUrl(url) {
	if (!url) {
		return null;
	}

	if (!url.startsWith("http://") && !url.startsWith("https://")) {
		return `https://${url}`;
	}

	return url;
}

/**
 * Returns the tier ID for a given donation amount.
 * @param {int} monthlyDonation The monthly donation in dollars.
 * @returns {string} The ID of the tier the donation belongs to.
 */
function getTierSlug(monthlyDonation) {
	if (monthlyDonation >= 5000) {
		return "diamond-sponsor";
	}

	if (monthlyDonation >= 2000) {
		return "platinum-sponsor";
	}

	if (monthlyDonation >= 1000) {
		return "gold-sponsor";
	}

	if (monthlyDonation >= 500) {
		return "silver-sponsor";
	}

	if (monthlyDonation >= 200) {
		return "bronze-sponsor";
	}

	return "backer";
}

/**
 * Fetch order data from Open Collective using the GraphQL API.
 * @returns {Promise<{sponsors: Array, donations: Array}>} An promise that resolves to an object with two properties:
 *  - `sponsors` (Array): List of sponsors
 * - `donations` (Array): List of donations
 */
async function fetchOpenCollectiveData() {
	const endpoint = "https://api.opencollective.com/graphql/v2";

	const query = `{
        account(slug: "eslint") {
          orders(status: ACTIVE, filter: INCOMING) {
            totalCount
            nodes {
              fromAccount {
                name
                website
                imageUrl
              }
              amount {
                value
              }
              tier {
                slug
              }
              frequency
              totalDonations {
                value
              }
            }
          }
        }
        donations: orders(
            account: { slug: "eslint" }
            frequency: ONETIME
            status: PAID
            limit: 50
            filter: INCOMING
          ) {
            totalCount
            nodes {
              id
              updatedAt
              frequency
              status
              amount {
                value
                currency
              }
              fromAccount {
                name
                website
                imageUrl
              }
            }
          }
      }`;

	const { body: result } = await request(endpoint, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ query }),
	});

	const payload = await result.json();

	if (process.env.DEBUG) {
		await fs.writeFile(
			"./debug-opencollective-raw-response.json",
			JSON.stringify(payload, null, 4),
			{ encoding: "utf8" },
		);
	}

	const sponsors = payload.data.account.orders.nodes.map(order => ({
		name: order.fromAccount.name,
		url: fixUrl(order.fromAccount.website),
		image: order.fromAccount.imageUrl,
		monthlyDonation:
			order.frequency === "YEARLY"
				? Math.round(order.amount.value / 12)
				: order.amount.value,
		totalDonations: order.totalDonations.value,
		source: "opencollective",
		tier: order.tier ? order.tier.slug : null,
	}));

	const donations = payload.data.donations.nodes
		.filter(
			transaction => !knownOneTimers.has(transaction.fromAccount.name),
		)
		.map(transaction => ({
			id: transaction.id,
			name: transaction.fromAccount.name,
			url: fixUrl(transaction.fromAccount.website),
			image: transaction.fromAccount.imageUrl,
			amount: transaction.amount.value,
			date: transaction.updatedAt,
			source: "opencollective",
		}));

	return {
		sponsors,
		donations,
	};
}

/**
 * Fetches GitHub Sponsors data using the GraphQL API.
 * @returns {Promise<{sponsors: Array, donations: Array}>} An promise that resolves to an object with two properties:
 *   - `sponsors` (Array): List of sponsors
 *  - `donations` (Array): List of donations
 */
async function fetchGitHubSponsors() {
	function sponsorshipsQuery(cursor = null) {
		return `
            query {
                organization(login: "eslint") {
                    sponsorshipsAsMaintainer (first: 100, includePrivate: false, after: "${cursor}") {
                        nodes {
                            sponsor: sponsorEntity {
                                ...on User {
                                    name,
                                    login,
                                    avatarUrl,
                                    url,
                                    websiteUrl
                                }
                                ...on Organization {
                                    name,
                                    login,
                                    avatarUrl,
                                    url,
                                    websiteUrl
                                }
                            },
                            tier {
                                monthlyPriceInDollars
                                isOneTime
                            }
                        }
                        pageInfo {
                            endCursor
                            startCursor
                            hasNextPage
                            hasPreviousPage
                        }
                    }
                }
            }
        `;
	}

	const donationsQuery = `
        query {
            organization(login: "eslint") {
                sponsorsActivities (first: 100, includePrivate: false) {
                    nodes {
                        id
                        sponsor {
                            ...on User {
                                name,
                                login,
                                avatarUrl,
                                url,
                                websiteUrl
                            }
                            ...on Organization {
                                name,
                                login,
                                avatarUrl,
                                url,
                                websiteUrl
                            }
                        },
                        timestamp
                        tier: sponsorsTier {
                            monthlyPriceInDollars,
                            isOneTime
                        }
                    }
                }
            }
        }
    `;

	const [sponsorshipsResponse, donationsResponse] = await Promise.all([
		githubGraphQL(sponsorshipsQuery(), {
			headers: {
				authorization: `token ${ESLINT_GITHUB_TOKEN}`,
			},
		}),
		githubGraphQL(donationsQuery, {
			headers: {
				authorization: `token ${ESLINT_GITHUB_TOKEN}`,
			},
		}),
	]);

	if (process.env.DEBUG) {
		await fs.writeFile(
			"./debug-github-raw-response-1.json",
			JSON.stringify(
				{
					sponsorshipsResponse,
					donationsResponse,
				},
				null,
				4,
			),
			{ encoding: "utf8" },
		);
	}

	let pageInfo =
		sponsorshipsResponse.organization.sponsorshipsAsMaintainer.pageInfo;
	const sponsorships =
		sponsorshipsResponse.organization.sponsorshipsAsMaintainer.nodes;
	let pageNumber = 1;

	while (pageInfo.hasNextPage) {
		const cursor = pageInfo.endCursor;

		const pagedResponse = await githubGraphQL(sponsorshipsQuery(cursor), {
			headers: {
				authorization: `token ${ESLINT_GITHUB_TOKEN}`,
			},
		});

		pageNumber++;

		if (process.env.DEBUG) {
			await fs.writeFile(
				`./debug-github-raw-response-${pageNumber}.json`,
				JSON.stringify(pagedResponse, null, 4),
				{ encoding: "utf8" },
			);
		}

		pageInfo = pagedResponse.organization.sponsorshipsAsMaintainer.pageInfo;
		sponsorships.push(
			...pagedResponse.organization.sponsorshipsAsMaintainer.nodes,
		);
	}

	// process sponsorships
	const sponsors = sponsorships

		// filter out one-time sponsorships -- these are displayed in the donations list
		.filter(({ tier }) => !tier.isOneTime)

		// return an array in the same format as Open Collective
		.map(({ sponsor, tier }) => ({
			name: sponsor.name || sponsor.login,
			image: sponsor.avatarUrl,
			url: fixUrl(sponsor.websiteUrl || sponsor.url),
			monthlyDonation: tier.monthlyPriceInDollars,
			source: "github",
			tier: getTierSlug(tier.monthlyPriceInDollars),
		}));

	// process one-time donations
	const donations = donationsResponse.organization.sponsorsActivities.nodes
		.filter(transaction => transaction.tier && transaction.tier.isOneTime)
		.map(({ sponsor, timestamp, tier, id }) => ({
			id,
			name: sponsor.name || sponsor.login,
			image: sponsor.avatarUrl,
			url: fixUrl(sponsor.websiteUrl || sponsor.url),
			amount: tier.monthlyPriceInDollars,
			date: timestamp,
			source: "github",
		}))
		.filter(donation => {
			// invoiced recurring donations are incorrectly marked as one-time
			const foundSponsor = sponsors.find(
				sponsor => sponsor.name === donation.name,
			);

			// only include if the amount is different than the monthly amount
			return foundSponsor
				? foundSponsor.monthlyDonation !== donation.amount
				: true;
		});

	// TODO: Double check that donations don't include recurring

	return {
		sponsors,
		donations,
	};
}

/**
 * Fetches thanks.dev data using the REST API.
 * @returns {Promise<{sponsors: Array}>} An promise that resolves to an object with one property:
 *  - `sponsors` (Array): List of sponsors
 */
async function fetchThanksDevData() {
	const endpoint = "https://api.thanks.dev/v1/entity/gh/eslint/donors";

	const { body: result } = await request(endpoint, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	const payload = await result.json();

	if (process.env.DEBUG) {
		await fs.writeFile(
			"./debug-thanksdev-raw-response.json",
			JSON.stringify(payload, null, 4),
			{ encoding: "utf8" },
		);
	}

	const sponsors = Object.values(payload.donors)
		.filter(({ payments }) => {
			const lastPayment = payments.at(-1);

			const now = new Date();
			const isCurrentYear =
				now.getFullYear().toString() === lastPayment.month.slice(0, 4);
			const isCurrentMonth =
				(now.getMonth() + 1).toString().padStart(2, "0") ===
				lastPayment.month.slice(5, 7);

			return isCurrentMonth && isCurrentYear;
		})
		.map(({ name, login, avatar, url, payments }) => {
			const { amount } = payments.at(-1);
			return {
				name: name ?? login,
				url: fixUrl(url),
				image: avatar,
				monthlyDonation: Number(amount),
				totalDonations: payments.reduce(
					(total, payment) => total + payment.amount,
					0,
				),
				source: "thanks.dev",
				tier: getTierSlug(amount),
			};
		});

	return {
		sponsors,
	};
}

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

(async () => {
	const [
		{
			sponsors: openCollectiveSponsors,
			donations: openCollectiveDonations,
		},
		{ sponsors: githubSponsors, donations: githubDonations },
		{ sponsors: thanksDevSponsors },
		blockedSponsors,
	] = await Promise.all([
		fetchOpenCollectiveData(),
		fetchGitHubSponsors(),
		fetchThanksDevData(),
		fs
			.readFile(blockedSponsorsFilename, { encoding: "utf8" })
			.then(data => JSON.parse(data)),
	]);

	const sponsors = openCollectiveSponsors
		.concat(githubSponsors)
		.concat(thanksDevSponsors)
		.filter(
			sponsor =>
				!blockedSponsors.some(
					blockedSponsor =>
						sponsor.name === blockedSponsor.name &&
						sponsor.source === blockedSponsor.source,
				),
		);
	const donations = openCollectiveDonations.concat(githubDonations);

	// sort donations so most recent is first
	donations.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

	// simplified data structure
	const tierSponsors = {
		diamond: [],
		platinum: [],
		gold: [],
		silver: [],
		bronze: [],
		backers: [],
	};

	// sponsorship totals
	let annualDonations = 0;
	let monthlyDonations = 0;
	let sponsorCount = 0;

	// process into a useful format
	for (const sponsor of sponsors) {
		// calculate totals
		sponsorCount++;
		annualDonations += sponsor.monthlyDonation * 12;
		monthlyDonations += sponsor.monthlyDonation;

		switch (sponsor.tier) {
			case "diamond-sponsor":
				tierSponsors.diamond.push(sponsor);
				break;

			case "platinum-sponsor":
				tierSponsors.platinum.push(sponsor);
				break;

			case "gold-sponsor":
				tierSponsors.gold.push(sponsor);
				break;

			case "silver-sponsor":
				tierSponsors.silver.push(sponsor);
				break;

			case "bronze-sponsor":
				tierSponsors.bronze.push(sponsor);
				break;

			default:
				tierSponsors.backers.push(sponsor);
		}
	}

	// sort order based on total donations
	for (const key of Object.keys(tierSponsors)) {
		tierSponsors[key].sort((a, b) => b.monthlyDonation - a.monthlyDonation);
	}

	await fs.writeFile(
		sponsorsFilename,
		JSON.stringify(
			{
				totals: {
					annualDonations,
					monthlyDonations,
					sponsorCount,
				},
				...tierSponsors,
			},
			null,
			4,
		),
		{ encoding: "utf8" },
	);

	await fs.writeFile(donationsFilename, JSON.stringify(donations, null, 4), {
		encoding: "utf8",
	});
})();
