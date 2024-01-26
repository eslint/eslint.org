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

/* eslint camelcase: [error, { properties: never }] */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const fs = require("fs/promises");
const { request } = require("undici");
const { graphql: githubGraphQL } = require("@octokit/graphql");

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

// filename to output sponsors to
const sponsorsFilename = "./src/_data/sponsors.json";
const donationsFilename = "./src/_data/donations.json";

// Contributions from other services that are not actually donations
const knownOneTimers = new Set(["GitHub Sponsors", "Read the Docs", "BuySellAds"]);

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
 * @returns {Array} An array of sponsors.
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
        body: JSON.stringify({ query })
    });

    let payload = await result.json();

    if (process.env.DEBUG) {
        await fs.writeFile("./debug-opencollective-raw-response.json", JSON.stringify(payload, null, 4), { encoding: "utf8" });
    }

    const sponsors = payload.data.account.orders.nodes.map(order => ({
        name: order.fromAccount.name,
        url: fixUrl(order.fromAccount.website),
        image: order.fromAccount.imageUrl,
        monthlyDonation: order.frequency === "YEARLY" ? Math.round(order.amount.value / 12) : order.amount.value,
        totalDonations: order.totalDonations.value,
        source: "opencollective",
        tier: order.tier ? order.tier.slug : null
    }));

    const donations = payload.data.donations.nodes
        .filter(transaction => !knownOneTimers.has(transaction.fromAccount.name))
        .map(transaction => ({
            id: transaction.id,
            name: transaction.fromAccount.name,
            url: fixUrl(transaction.fromAccount.website),
            image: transaction.fromAccount.imageUrl,
            amount: transaction.amount.value,
            date: transaction.updatedAt,
            source: "opencollective"
        }));

    return {
        sponsors,
        donations
    };

}

/**
 * Fetches GitHub Sponsors data using the GraphQL API.
 * @returns {Array} An array of sponsors.
 */
async function fetchGitHubSponsors() {

    const sponsorshipsQuery = (cursor = null) => (`
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
    `);

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

    const [
        sponsorshipsResponse,
        donationsResponse
    ] = await Promise.all([
        githubGraphQL(sponsorshipsQuery(), {
            headers: {
                authorization: `token ${ESLINT_GITHUB_TOKEN}`
            }
        }),
        githubGraphQL(donationsQuery, {
            headers: {
                authorization: `token ${ESLINT_GITHUB_TOKEN}`
            }
        })
    ]);

    if (process.env.DEBUG) {
        await fs.writeFile("./debug-github-raw-response-1.json", JSON.stringify({
            sponsorshipsResponse,
            donationsResponse
        }, null, 4), { encoding: "utf8" });
    }

    let pageInfo = sponsorshipsResponse.organization.sponsorshipsAsMaintainer.pageInfo;
    let sponsorships = sponsorshipsResponse.organization.sponsorshipsAsMaintainer.nodes;
    let pageNumber = 1;

    while (pageInfo.hasNextPage) {

        const cursor = pageInfo.endCursor;

        const pagedResponse = await githubGraphQL(sponsorshipsQuery(cursor), {
            headers: {
                authorization: `token ${ESLINT_GITHUB_TOKEN}`
            }
        });

        pageNumber++;

        if (process.env.DEBUG) {
            await fs.writeFile(`./debug-github-raw-response-${pageNumber}.json`, JSON.stringify(pagedResponse, null, 4), { encoding: "utf8" });
        }

        pageInfo = pagedResponse.organization.sponsorshipsAsMaintainer.pageInfo;
        sponsorships.push(...pagedResponse.organization.sponsorshipsAsMaintainer.nodes);
    }

    // return an array in the same format as Open Collective
    const sponsors = sponsorships
        .map(({ sponsor, tier }) => ({
            name: sponsor.name || sponsor.login,
            image: sponsor.avatarUrl,
            url: fixUrl(sponsor.websiteUrl || sponsor.url),
            monthlyDonation: tier.monthlyPriceInDollars,
            source: "github",
            tier: getTierSlug(tier.monthlyPriceInDollars)
        }));

    const donations = donationsResponse.organization.sponsorsActivities.nodes
        .filter(transaction => transaction.tier && transaction.tier.isOneTime)
        .map(({ sponsor, timestamp, tier, id }) => ({
            id,
            name: sponsor.name || sponsor.login,
            image: sponsor.avatarUrl,
            url: fixUrl(sponsor.websiteUrl || sponsor.url),
            amount: tier.monthlyPriceInDollars,
            date: timestamp,
            source: "github"
        }))
        .filter(donation => {
            // invoiced recurring donations are incorrectly marked as one-time
            const sponsor = sponsors.find(sponsor => sponsor.name === donation.name);

            // only include if the amount is different than the monthly amount
            return sponsor ? sponsor.monthlyDonation !== donation.amount : true;
        });

    // TODO: Double check that donations don't include recurring

    return {
        sponsors,
        donations
    };

}

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

(async () => {

    const [
        {
            sponsors: openCollectiveSponsors,
            donations: openCollectiveDonations
        },
        {
            sponsors: githubSponsors,
            donations: githubDonations
        },
    ] = await Promise.all([
        fetchOpenCollectiveData(),
        fetchGitHubSponsors()
    ]);

    const sponsors = openCollectiveSponsors.concat(githubSponsors);
    const donations = openCollectiveDonations.concat(githubDonations);


    // sort donations so most recent is first
    donations.sort((a, b) => new Date(a) - new Date(b));

    // simplified data structure
    const tierSponsors = {
        platinum: [],
        gold: [],
        silver: [],
        bronze: [],
        backers: []
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

    await fs.writeFile(sponsorsFilename, JSON.stringify({
        totals: {
            annualDonations,
            monthlyDonations,
            sponsorCount
        },
        ...tierSponsors
    }, null, 4), { encoding: "utf8" });

    await fs.writeFile(donationsFilename, JSON.stringify(donations, null, 4), { encoding: "utf8" });
})();
