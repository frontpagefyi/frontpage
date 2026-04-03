import { ids as nsids } from "@repo/frontpage-atproto-client/lexicons";
import type { FeedSlug } from "@/lib/feed-constants";
import { serverConfig } from "./config/server-config";

export const FRONTPAGE_ATPROTO_HANDLE = "frontpage.fyi";
export const FRONTPAGE_APPVIEW_USER_AGENT =
  "appview/@frontpage.fyi (@frontpage.fyi, @tom.sherman.is)";

export function feedUri(slug: FeedSlug): string {
  return `at://${serverConfig.FRONTPAGE_DID}/${nsids.FyiFrontpageFeedGenerator}/${slug}`;
}

/** Feed URIs derived from the registry */
export const FEED_URIS: Record<FeedSlug, string> = {
  hot: feedUri("hot"),
  new: feedUri("new"),
  top: feedUri("top"),
};

export const HOT_FEED_URI = FEED_URIS.hot;
