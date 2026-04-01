import { z } from "zod";

const feedEnv = z
  .object({
    FEED_SERVICE_DID: z.string().min(1).default("did:web:frontpage.fyi"),
  })
  .parse(process.env);

/** DID of the feed generator service */
export const FEED_SERVICE_DID = feedEnv.FEED_SERVICE_DID;

/** Cache duration for static XRPC endpoints (1 day in seconds) */
export const STATIC_CACHE_MAX_AGE_SECONDS = 86400;
