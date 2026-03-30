import {
  FRONTPAGE_DID,
  FEED_GENERATOR_COLLECTION,
  HOT_FEED_URI,
} from "@/lib/constants";

/** DID of the feed generator service (did:web identity) */
export const FEED_SERVICE_DID = "did:web:frontpage.fyi";

/** NSID for the getFeedSkeleton XRPC method */
export const GET_FEED_SKELETON_NSID = "fyi.frontpage.feed.getFeedSkeleton";

/** Timeout for external feed generator requests in milliseconds */
export const EXTERNAL_REQUEST_TIMEOUT_MS = 5_000;

/** Cache duration for static XRPC endpoints (1 day in seconds) */
export const STATIC_CACHE_MAX_AGE_SECONDS = 86400;

/** Cache duration for skeleton responses (seconds) */
export const SKELETON_CACHE_MAX_AGE_SECONDS = 30;

/** Skeleton stale-while-revalidate (seconds) */
export const SKELETON_SWR_SECONDS = 60;

/** Default skeleton page size */
export const DEFAULT_SKELETON_LIMIT = 50;

/** Minimum skeleton page size */
export const MIN_SKELETON_LIMIT = 1;

/** Maximum skeleton page size */
export const MAX_SKELETON_LIMIT = 100;

export { FRONTPAGE_DID, FEED_GENERATOR_COLLECTION, HOT_FEED_URI };
