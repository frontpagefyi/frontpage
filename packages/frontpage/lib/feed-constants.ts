import { z } from "zod";

/** DID of the feed generator service */
export const FEED_SERVICE_DID = z
  .string()
  .min(1)
  .parse(process.env.FEED_SERVICE_DID);

/** Cache duration for static XRPC endpoints (1 day in seconds) */
export const STATIC_CACHE_MAX_AGE_SECONDS = 86400;

/** Central feed registry — single source of truth for all feed definitions */
export const FEED_REGISTRY = [
  {
    slug: "hot",
    label: "Hot",
    description: "Trending posts on Frontpage, ranked by votes and recency",
  },
  {
    slug: "new",
    label: "New",
    description: "Latest posts on Frontpage, newest first",
  },
  { slug: "top", label: "Top", description: "Most upvoted posts on Frontpage" },
] as const;

export type FeedSlug = (typeof FEED_REGISTRY)[number]["slug"];

export const DEFAULT_FEED_SLUG: FeedSlug = "hot";

export function isFeedSlug(s: string): s is FeedSlug {
  return FEED_REGISTRY.some((f) => f.slug === s);
}
