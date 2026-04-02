import { z } from "zod";
import { ids as nsids } from "@repo/frontpage-atproto-client/lexicons";
import type { DID } from "@/lib/data/atproto/did";
import type { FeedSlug } from "@/lib/feed-constants";

export const FRONTPAGE_DID = z
  .string()
  .min(1)
  .parse(process.env.FRONTPAGE_DID) as DID;

export const FRONTPAGE_ATPROTO_HANDLE = "frontpage.fyi";
export const FRONTPAGE_APPVIEW_USER_AGENT =
  "appview/@frontpage.fyi (@frontpage.fyi, @tom.sherman.is)";

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
