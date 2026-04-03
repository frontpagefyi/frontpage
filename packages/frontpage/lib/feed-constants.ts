import { publicConfig } from "./config/public-config";
// TODO: we should import this from @/lib/data/atproto/repo but can't because it currently imports server stuff, and this module needs to be available on the client as well.
import { ids as nsids } from "@repo/frontpage-atproto-client/lexicons";
import { invariant } from "./utils";

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
) as { [K in FeedSlug]: string };

export type FeedSlug = (typeof FEED_REGISTRY)[number]["slug"];

export const DEFAULT_FEED_SLUG: FeedSlug = "hot";

export function isFeedSlug(s: string): s is FeedSlug {
  return FEED_REGISTRY.some((f) => f.slug === s);
}

function feedUri(slug: string) {
  return `at://${publicConfig.NEXT_PUBLIC_FRONTPAGE_DID}/${nsids.FyiFrontpageFeedGenerator}/${slug}`;
}

export function getFeedDefinitionFromSlug(slug: FeedSlug) {
  const feed = FEED_REGISTRY.find((f) => f.slug === slug);
  invariant(feed, `Unknown feed slug: ${slug}`);
  return feed;
}
