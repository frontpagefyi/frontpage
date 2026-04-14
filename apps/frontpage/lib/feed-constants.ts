import { publicConfig } from "./config/public-config";
import { nsids } from "./data/atproto/nsids";
import { invariant } from "./utils";
import { AtUri } from "@atproto/syntax";

/** Cache duration for static XRPC endpoints (1 day in seconds) */
export const STATIC_CACHE_MAX_AGE_SECONDS = 86400;

export const HOT_FEED_URI = feedUri("hot");

/** Central feed registry — single source of truth for all feed definitions */
export const FEED_REGISTRY = [
  {
    slug: "hot",
    label: "Hot",
    description: "Trending posts on Frontpage, ranked by votes and recency",
    uri: HOT_FEED_URI,
  },
  {
    slug: "new",
    label: "New",
    description: "Latest posts on Frontpage, newest first",
    uri: feedUri("new"),
  },
  {
    slug: "top",
    label: "Top",
    description: "Most upvoted posts on Frontpage",
    uri: feedUri("top"),
  },
] as const;

export const FEED_URIS = Object.fromEntries(
  FEED_REGISTRY.map((feed) => [feed.slug, feed.uri]),
) as { [K in FeedSlug]: AtUri };

export type FeedSlug = (typeof FEED_REGISTRY)[number]["slug"];

export const DEFAULT_FEED_SLUG: FeedSlug = "hot";

function feedUri(slug: string) {
  return new AtUri(
    `at://${publicConfig.NEXT_PUBLIC_FRONTPAGE_DID}/${nsids.FyiFrontpageFeedGenerator}/${slug}`,
  );
}

export function getFeedDefinitionFromSlug(slug: FeedSlug) {
  const feed = FEED_REGISTRY.find((f) => f.slug === slug);
  invariant(feed, `Unknown feed slug: ${slug}`);
  return feed;
}
