import "server-only";

import type { AtUri } from "@atproto/syntax";
import { getDidDoc, parseDid, type DID } from "@/lib/data/atproto/did";
import { getLocalFeedSkeleton } from "@/lib/data/db/feed-skeleton";
import { hydratePosts, type HydratedPost } from "@/lib/data/db/post";
import { assertPublicHostname } from "@/lib/data/ssrf";
import { invariant } from "@/lib/utils";
import * as fyi from "@repo/frontpage-atproto-client/fyi";
import { FEED_REGISTRY, type FeedSlug } from "@/lib/feed-constants";
import { publicConfig } from "../config/public-config";
import { FRONTPAGE_ATPROTO_HANDLE } from "../constants";
import { getAtprotoClient } from "@/lib/data/atproto/repo";

type FeedSkeletonOutput = fyi.frontpage.feed.getFeedSkeleton.$OutputBody;

export type FeedError =
  | { code: "InvalidCollection"; message: string }
  | { code: "UnknownFeed"; message: string }
  | { code: "ExternalError"; message: string }
  | { code: "InvalidResponse"; message: string };

export type FeedSkeletonResult =
  | { ok: true; data: FeedSkeletonOutput }
  | { ok: false; error: FeedError };

export type FeedResult =
  | { ok: true; posts: HydratedPost[]; cursor?: string }
  | { ok: false; error: FeedError };

// Internal page size for server action callers. The XRPC route uses its own
// DEFAULT_SKELETON_LIMIT and always passes an explicit limit, so this default
// only affects getFeed/getFeedSkeleton when called without a limit argument.
export async function getFeed(
  feedUri: AtUri,
  cursor?: string,
  limit = 20,
): Promise<FeedResult> {
  const skeletonResult = await getFeedSkeleton(feedUri, cursor, limit);
  if (!skeletonResult.ok) return skeletonResult;

  const posts = await hydratePosts(skeletonResult.data.feed.map((s) => s.post));

  return { ok: true, posts, cursor: skeletonResult.data.cursor };
}

async function getFeedSkeleton(
  feedUri: AtUri,
  cursor?: string,
  limit = 20,
): Promise<FeedSkeletonResult> {
  if (feedUri.collection !== fyi.frontpage.feed.generator.$type) {
    return {
      ok: false,
      error: {
        code: "InvalidCollection",
        message: `Expected collection ${fyi.frontpage.feed.generator.$type}, got ${feedUri.collection}`,
      },
    };
  }

  const localFeed = parseLocalFeed(feedUri);

  if (localFeed) {
    const skeleton = await getLocalFeedSkeleton(localFeed.slug, limit, cursor);
    return { ok: true, data: skeleton };
  }

  return getExternalSkeleton(feedUri, cursor, limit);
}

export function parseLocalFeed(feedUri: AtUri): null | {
  host: DID | string;
  slug: FeedSlug;
} {
  if (
    feedUri.host !== publicConfig.NEXT_PUBLIC_FRONTPAGE_DID &&
    feedUri.host !== FRONTPAGE_ATPROTO_HANDLE
  ) {
    return null;
  }

  if (feedUri.collection !== fyi.frontpage.feed.generator.$type) {
    return null;
  }

  if (!isFeedSlug(feedUri.rkey)) {
    return null;
  }

  return {
    host: feedUri.host,
    slug: feedUri.rkey,
  };
}

export function isFeedSlug(s: string): s is FeedSlug {
  return FEED_REGISTRY.some((f) => f.slug === s);
}

async function getExternalSkeleton(
  feedUri: AtUri,
  cursor: string | undefined,
  limit: number,
): Promise<FeedSkeletonResult> {
  const generatorRecord = await fetchGeneratorRecord(feedUri);
  const serviceDid = parseDid(generatorRecord.did);
  invariant(
    serviceDid,
    `Generator record contains invalid DID: ${generatorRecord.did}`,
  );

  const serviceEndpoint = await resolveServiceEndpoint(serviceDid);

  const url = new URL(
    `/xrpc/${fyi.frontpage.feed.getFeedSkeleton.$nsid}`,
    serviceEndpoint,
  );
  url.searchParams.set("feed", feedUri.toString());
  url.searchParams.set("limit", String(limit));
  if (cursor) url.searchParams.set("cursor", cursor);

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(5_000),
    redirect: "error",
  });

  if (!response.ok) {
    const body = await response.text();
    const truncated = body.length > 200 ? body.slice(0, 200) + "..." : body;
    console.error(`External feed generator error (${response.status}):`, body);
    return {
      ok: false,
      error: {
        code: "ExternalError",
        message: `External feed generator returned ${response.status}: ${truncated}`,
      },
    };
  }

  const json: unknown = await response.json();
  try {
    fyi.frontpage.feed.getFeedSkeleton.$output.schema.assert(json);
  } catch (err) {
    return {
      ok: false,
      error: {
        code: "InvalidResponse",
        message: `External feed generator returned invalid response: ${err instanceof Error ? err.message : String(err)}`,
      },
    };
  }

  return {
    ok: true,
    data: json as FeedSkeletonOutput,
  };
}

async function fetchGeneratorRecord(feedUri: AtUri): Promise<{ did: string }> {
  const client = getAtprotoClient();

  const result = await client.get(fyi.frontpage.feed.generator, {
    repo: feedUri.host,
    rkey: feedUri.rkey,
  });

  const validated = fyi.frontpage.feed.generator.$validate(result.value);

  return { did: validated.did };
}

async function resolveServiceEndpoint(did: DID): Promise<string> {
  const didDoc = await getDidDoc(did);
  const service = didDoc.service?.find(
    (serviceEntry) =>
      serviceEntry.type === "FrontpageFeedGenerator" ||
      serviceEntry.type === "BskyFeedGenerator",
  );

  invariant(
    service && typeof service.serviceEndpoint === "string",
    `No feed generator service found in DID document for ${did}`,
  );

  const url = new URL(service.serviceEndpoint);
  invariant(
    url.protocol === "https:",
    "Feed generator endpoint must use HTTPS",
  );

  assertPublicHostname(url.hostname);

  return service.serviceEndpoint;
}
