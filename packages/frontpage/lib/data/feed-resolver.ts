import "server-only";

import type { AtUri } from "@atproto/syntax";
import {
  getDidDoc,
  getPdsUrl,
  parseDid,
  type DID,
} from "@/lib/data/atproto/did";
import { getLocalFeedSkeleton } from "@/lib/data/db/feed-skeleton";
import { hydratePosts, type HydratedPost } from "@/lib/data/db/post";
import { assertPublicHostname } from "@/lib/data/ssrf";
import {
  FyiFrontpageFeedGenerator,
  type FyiFrontpageFeedGetFeedSkeleton,
} from "@repo/frontpage-atproto-client";
import { lexicons } from "@repo/frontpage-atproto-client/lexicons";
import { FEED_REGISTRY, type FeedSlug } from "@/lib/feed-constants";
import { getAtprotoClient, nsids } from "@/lib/data/atproto/repo";
import { publicConfig } from "../config/public-config";
import { FRONTPAGE_ATPROTO_HANDLE } from "../constants";
import { getDidFromHandleOrDid } from "./atproto/identity";

export type FeedError =
  | { code: "InvalidCollection"; message: string }
  | { code: "UnknownFeed"; message: string }
  | { code: "ExternalError"; message: string }
  | { code: "InvalidResponse"; message: string };

type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

export type FeedSkeletonResult = Result<
  FyiFrontpageFeedGetFeedSkeleton.OutputSchema,
  FeedError
>;

export type FeedResult = Result<
  { posts: HydratedPost[]; cursor?: string },
  FeedError
>;

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

  return { ok: true, data: { posts, cursor: skeletonResult.data.cursor } };
}

async function getFeedSkeleton(
  feedUri: AtUri,
  cursor?: string,
  limit = 20,
): Promise<FeedSkeletonResult> {
  if (feedUri.collection !== nsids.FyiFrontpageFeedGenerator) {
    return {
      ok: false,
      error: {
        code: "InvalidCollection",
        message: `Expected collection ${nsids.FyiFrontpageFeedGenerator}, got ${feedUri.collection}`,
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

  if (feedUri.collection !== nsids.FyiFrontpageFeedGenerator) {
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
  const generatorResult = await resolveFeed(feedUri);
  if (!generatorResult.ok) {
    return {
      ok: false,
      error: generatorResult.error,
    };
  }

  const url = new URL(
    `/xrpc/${nsids.FyiFrontpageFeedGetFeedSkeleton}`,
    generatorResult.data.service,
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
    lexicons.assertValidXrpcOutput(nsids.FyiFrontpageFeedGetFeedSkeleton, json);
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
    data: json as FyiFrontpageFeedGetFeedSkeleton.OutputSchema,
  };
}

async function resolveFeed(
  feedUri: AtUri,
): Promise<Result<{ serviceDid: DID; service: string }, FeedError>> {
  const generatorDid = await getDidFromHandleOrDid(feedUri.host);
  if (!generatorDid) {
    return {
      ok: false,
      error: {
        code: "UnknownFeed",
        message: `Could not resolve DID for feed generator ${feedUri.host}`,
      },
    };
  }
  const generatorPdsUrl = await getPdsUrl(generatorDid);
  if (!generatorPdsUrl) {
    return {
      ok: false,
      error: {
        code: "UnknownFeed",
        message: `Could not find PDS for feed generator DID ${generatorDid}`,
      },
    };
  }
  const client = getAtprotoClient(generatorPdsUrl);

  const result = await client.com.atproto.repo.getRecord({
    repo: feedUri.host,
    collection: feedUri.collection,
    rkey: feedUri.rkey,
  });

  const validated = FyiFrontpageFeedGenerator.validateRecord(result.data.value);
  if (!validated.success) {
    return {
      ok: false,
      error: {
        code: "InvalidResponse",
        message: `Feed generator record failed validation: ${validated.error.message}`,
      },
    };
  }

  const serviceDid = parseDid(validated.value.did);
  if (!serviceDid) {
    return {
      ok: false,
      error: {
        code: "InvalidResponse",
        message: `Feed generator record contains invalid DID: ${validated.value.did}`,
      },
    };
  }
  const serviceDidDoc = await getDidDoc(serviceDid);
  const service = serviceDidDoc.service?.find(
    (s) => s.type === "FrontpageFeedGenerator",
  );
  if (!service || typeof service.serviceEndpoint !== "string") {
    return {
      ok: false,
      error: {
        code: "InvalidResponse",
        message: `No FrontpageFeedGenerator service found in DID document for ${validated.value.did}`,
      },
    };
  }

  const serviceUrl = safeParseUrl(service.serviceEndpoint);
  if (!serviceUrl) {
    return {
      ok: false,
      error: {
        code: "InvalidResponse",
        message: `Invalid serviceEndpoint URL in DID document for ${validated.value.did}: ${service.serviceEndpoint}`,
      },
    };
  }

  if (serviceUrl.protocol !== "https:") {
    return {
      ok: false,
      error: {
        code: "InvalidResponse",
        message: `Service endpoint must use HTTPS in DID document for ${validated.value.did}: ${service.serviceEndpoint}`,
      },
    };
  }

  try {
    assertPublicHostname(serviceUrl.hostname);
  } catch (_) {
    return {
      ok: false,
      error: {
        code: "InvalidResponse",
        message: `Service endpoint hostname is not allowed in DID document for ${validated.value.did}: ${serviceUrl.hostname}`,
      },
    };
  }

  return {
    ok: true,
    data: {
      serviceDid,
      service: service.serviceEndpoint,
    },
  };
}

function safeParseUrl(input: string): URL | null {
  try {
    return new URL(input);
  } catch {
    return null;
  }
}
