/**
 * @fileoverview Data loading utilities for the ESLint website
 * @author ESLint
 */

import fs from "node:fs";
import path from "node:path";

// Get the data directory path
function getDataDir(): string {
	return path.resolve(process.cwd(), "src", "_data");
}

// Cache for loaded JSON data
const dataCache: Map<string, unknown> = new Map();

/**
 * Load a JSON data file
 * @param filename The filename without extension
 * @returns The parsed JSON data
 */
function loadJsonData<T>(filename: string): T {
	const cacheKey = filename;

	if (dataCache.has(cacheKey)) {
		return dataCache.get(cacheKey) as T;
	}

	const dataDir = getDataDir();
	const filePath = path.join(dataDir, `${filename}.json`);
	const content = fs.readFileSync(filePath, "utf-8");
	const data = JSON.parse(content) as T;
	dataCache.set(cacheKey, data);
	return data;
}

// Type definitions
export interface Sponsor {
	name: string;
	url?: string;
	image: string;
	monthlyDonation: number;
	totalDonations?: number;
	source: string;
	tier: string;
}

export interface SponsorsData {
	totals: {
		annualDonations: number;
		monthlyDonations: number;
		sponsorCount: number;
	};
	diamond: Sponsor[];
	platinum: Sponsor[];
	gold: Sponsor[];
	silver: Sponsor[];
	bronze: Sponsor[];
	backers: Sponsor[];
}

export interface TeamMember {
	username: string;
	name: string;
	title?: string;
	website?: string;
	avatar_url: string;
	bio?: string | null;
	twitter_username?: string | null;
	github_username?: string;
	mastodon_url?: string;
	bluesky_url?: string;
	location?: string | null;
}

export interface TeamData {
	tsc: TeamMember[];
	reviewers: TeamMember[];
	committers: TeamMember[];
	website: TeamMember[];
	support: TeamMember[];
	alumni: TeamMember[];
}

export interface StatsData {
	latestVersion: string;
	latestVersionDate: string;
	currentVersion: string;
	currentVersionDate: string;
	currentVersionIsPrerelease: boolean;
	stars: number;
	lastCommitDate: string;
	projectDependents: number;
	weeklyDownloads: number;
	nextVersion: string;
	nextVersionDate: string;
}

export interface Donation {
	name: string;
	image: string;
	amount: number;
	date: string;
	type: string;
}

export interface TechSponsor {
	name: string;
	url: string;
	image: string;
	donation: string;
}

export interface Links {
	[key: string]: string;
}

export interface Author {
	name: string;
	avatar_url: string;
	twitter_username?: string;
	github_username?: string;
	mastodon_url?: string;
	website?: string;
}

export interface AllAuthors {
	[key: string]: Author;
}

export interface BudgetData {
	hourlyRateTSC: number;
	hourlyRateCommitters: number;
	maxHours: number;
	contributorPoolPercentage: number;
	dependenciesPercentage: number;
	communityPercentage: number;
}

// Data loader functions
export function getSponsors(): SponsorsData {
	return loadJsonData<SponsorsData>("sponsors");
}

export function getTeam(): TeamData {
	return loadJsonData<TeamData>("team");
}

export function getStats(): StatsData {
	return loadJsonData<StatsData>("stats");
}

export function getDonations(): Donation[] {
	return loadJsonData<Donation[]>("donations");
}

export function getTechSponsors(): TechSponsor[] {
	return loadJsonData<TechSponsor[]>("techsponsors");
}

export function getLinks(): Links {
	return loadJsonData<Links>("links");
}

export function getAllAuthors(): AllAuthors {
	return loadJsonData<AllAuthors>("all_authors");
}

export function getBlogDates(): Record<string, string> {
	return loadJsonData<Record<string, string>>("blog-dates");
}

export function getBudget(): BudgetData {
	return loadJsonData<BudgetData>("budget");
}

/**
 * Format a number using compact notation
 * @param number The number to format
 * @param locale The locale for formatting
 * @returns Object with short and full formatted strings
 */
export function formatStatsNumber(
	number: number,
	locale: string = "en",
): { short: string; full: string } {
	const formatOptions: Intl.NumberFormatOptions = {
		notation: "compact",
		maximumFractionDigits: 1,
	};

	const formatter = new Intl.NumberFormat(locale, formatOptions);
	const formatterFull = new Intl.NumberFormat(locale, {
		...formatOptions,
		compactDisplay: "long",
	});

	return {
		short: formatter.format(number),
		full: formatterFull.format(number),
	};
}

/**
 * Format a number as US dollars
 * @param value The value to format
 * @returns The formatted dollar string
 */
export function formatDollars(value: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(value);
}
