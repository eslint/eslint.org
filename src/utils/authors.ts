import allAuthors from "../data/all_authors.json";

export type Author = {
  username?: string | null;
  name?: string | null;
  title?: string | null;
  website?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  twitter_username?: string | null;
  github_username?: string | null;
  bluesky_url?: string | null;
  mastodon_url?: string | null;
};

const authorMap = allAuthors as Record<string, Author>;

export const getAuthor = (key: string): Author =>
  authorMap[key] ?? { username: key, name: key };

export const getAuthorEntries = (keys: string[]) =>
  keys.map((key) => ({ key, data: getAuthor(key) }));
