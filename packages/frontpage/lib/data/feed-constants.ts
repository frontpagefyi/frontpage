import { z } from "zod";

/** DID of the feed generator service */
export const FEED_SERVICE_DID = z.string().min(1).parse(process.env.FEED_SERVICE_DID);

/** Cache duration for static XRPC endpoints (1 day in seconds) */
export const STATIC_CACHE_MAX_AGE_SECONDS = 86400;
