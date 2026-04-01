import { ids as nsids } from "@repo/frontpage-atproto-client/lexicons";

export const FRONTPAGE_ATPROTO_HANDLE = "frontpage.fyi";
export const FRONTPAGE_APPVIEW_USER_AGENT =
  "appview/@frontpage.fyi (@frontpage.fyi, @tom.sherman.is)";

/** DID for the frontpage.fyi AT Protocol repo */
export const FRONTPAGE_DID = "did:plc:klmr76mpewpv7rtm3xgpzd7x";

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

export function feedUri(slug: FeedSlug): string {
  return `at://${FRONTPAGE_DID}/${nsids.FyiFrontpageFeedGenerator}/${slug}`;
}

/** Feed URIs derived from the registry */
export const FEED_URIS: Record<FeedSlug, string> = {
  hot: feedUri("hot"),
  new: feedUri("new"),
  top: feedUri("top"),
};

export const HOT_FEED_URI = FEED_URIS.hot;
