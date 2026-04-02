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
