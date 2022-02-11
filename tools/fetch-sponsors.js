/**
 * @fileoverview Script to fetch sponsor data from Open Collective and GitHub.
 * Call using:
 *     node _tools/fetch-sponsors.js
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

// max one-time donations to pull
const MAX_DONATIONS = 20;

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

    let offset = 0;
    const endpoint = "https://api.opencollective.com/graphql/v2";
    const transactionsSubquery = offset => `
        transactions(type: CREDIT, limit: 100, offset: ${offset}) {
            totalCount
            nodes {
              id
              fromAccount {
                name
                website
                imageUrl
              }
              updatedAt
              amount {
                value
              }
              order {
                frequency
              }
            }
          }
    `;

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
          ${ transactionsSubquery(0) }
        }
      }`;

    const { body: result } = await request(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
    });

    let payload = await result.json();

    const sponsors = payload.data.account.orders.nodes.map(order => ({
        name: order.fromAccount.name,
        url: order.fromAccount.website,
        image: order.fromAccount.imageUrl,
        monthlyDonation: order.frequency === "YEARLY" ? Math.round(order.amount.value / 12) : order.amount.value,
        totalDonations: order.totalDonations.value,
        source: "opencollective",
        tier: order.tier ? order.tier.slug : null
    }));

    const donations = [];
    let i = 0;

    do {
        donations.push(...payload.data.account.transactions.nodes
            .filter(transaction => transaction.order.frequency === "ONETIME")
            .filter(transaction => !knownOneTimers.has(transaction.fromAccount.name))
            .map(transaction => ({
                id: transaction.id,
                name: transaction.fromAccount.name,
                url: transaction.fromAccount.website,
                image: transaction.fromAccount.imageUrl,
                amount: transaction.amount.value,
                date: transaction.updatedAt,
                source: "opencollective"
            })));

        if (donations.length >= MAX_DONATIONS) {
            break;
        }

        // if we reach here then we need more data
        const { body: result } = await request(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: `{ account(slug: "eslint") { ${transactionsSubquery(100 * i)} } }` })
        });

        payload = await result.json();

        i++;
    } while (i < 5)

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

    const { organization } = await githubGraphQL(`query {
        organization(login: "eslint") {
          sponsorshipsAsMaintainer (first: 100) {
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
          }
          sponsorsActivities (first: 100) {
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
      }`, {
        headers: {
            authorization: `token ${ESLINT_GITHUB_TOKEN}`
        }
    });

    // return an array in the same format as Open Collective
    const sponsors = organization.sponsorshipsAsMaintainer.nodes
        .map(({ sponsor, tier }) => ({
            name: sponsor.name,
            image: sponsor.avatarUrl,
            url: sponsor.websiteUrl || sponsor.url,
            monthlyDonation: tier.monthlyPriceInDollars,
            source: "github",
            tier: getTierSlug(tier.monthlyPriceInDollars)
        }));

    const donations = organization.sponsorsActivities.nodes
        .filter(transaction => transaction.tier && transaction.tier.isOneTime)
        .map(({ sponsor, timestamp, tier, id }) => ({
            id,
            name: sponsor.name,
            image: sponsor.avatarUrl,
            url: sponsor.websiteUrl || sponsor.url,
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
