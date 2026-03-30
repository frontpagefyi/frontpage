import { FRONTPAGE_DID } from "@/app/blog/blog-data";

/** DID of the feed generator service (did:web identity) */
export const FEED_SERVICE_DID = "did:web:frontpage.fyi";

/** Collection NSID for feed generator records */
export const FEED_GENERATOR_COLLECTION = "fyi.frontpage.feed.generator";

/** NSID for the getFeedSkeleton XRPC method */
export const GET_FEED_SKELETON_NSID = "fyi.frontpage.feed.getFeedSkeleton";

/** AT URI for the default hot feed */
export const HOT_FEED_URI = `at://${FRONTPAGE_DID}/fyi.frontpage.feed.generator/hot`;

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

export { FRONTPAGE_DID };
