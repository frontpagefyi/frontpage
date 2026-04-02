import "server-only";

import { AtUri } from "@atproto/syntax";
import { getDidDoc, parseDid, type DID } from "@/lib/data/atproto/did";
import {
  getSkeletonByAlgorithm,
  type SkeletonResult,
} from "@/lib/data/db/feed-skeleton";
import { hydratePosts, type HydratedPost } from "@/lib/data/db/post";
import { assertPublicHostname } from "@/lib/data/ssrf";
import { invariant } from "@/lib/utils";
import {
  FyiFrontpageFeedGenerator,
  type FyiFrontpageFeedGetFeedSkeleton,
} from "@repo/frontpage-atproto-client";
import { lexicons } from "@repo/frontpage-atproto-client/lexicons";
import { isFeedSlug } from "@/lib/feed-constants";
import { FRONTPAGE_DID } from "@/lib/constants";
import { nsids } from "@/lib/data/atproto/repo";

export type FeedError =
  | { code: "InvalidUri"; message: string }
  | { code: "InvalidCollection"; message: string }
  | { code: "UnknownFeed"; message: string }
  | { code: "ExternalError"; message: string }
  | { code: "InvalidResponse"; message: string };

export type FeedSkeletonResult =
  | { ok: true; data: SkeletonResult }
  | { ok: false; error: FeedError };

export type FeedResult =
  | { ok: true; posts: HydratedPost[]; cursor?: string }
  | { ok: false; error: FeedError };

export async function getFeed(
  feedUri: string,
  cursor?: string,
  limit = 20,
): Promise<FeedResult> {
  const skeletonResult = await getFeedSkeleton(feedUri, cursor, limit);
  if (!skeletonResult.ok) return skeletonResult;

  const posts = await hydratePosts(skeletonResult.data.feed.map((s) => s.post));

  return { ok: true, posts, cursor: skeletonResult.data.cursor };
}

export async function getFeedSkeleton(
  feedUri: string,
  cursor?: string,
  limit = 20,
): Promise<FeedSkeletonResult> {
  let atUri: AtUri;
  try {
    atUri = new AtUri(feedUri);
  } catch {
    return {
      ok: false,
      error: { code: "InvalidUri", message: `Invalid feed URI: ${feedUri}` },
    };
  }

  if (atUri.collection !== nsids.FyiFrontpageFeedGenerator) {
    return {
      ok: false,
      error: {
        code: "InvalidCollection",
        message: `Expected collection ${nsids.FyiFrontpageFeedGenerator}, got ${atUri.collection}`,
      },
    };
  }

  if (!isFeedSlug(atUri.rkey)) {
    if (isLocalFeed(atUri)) {
      return {
        ok: false,
        error: { code: "UnknownFeed", message: `Unknown feed: ${atUri.rkey}` },
      };
    }
  }

  if (isLocalFeed(atUri) && isFeedSlug(atUri.rkey)) {
    const skeleton = await getSkeletonByAlgorithm(atUri.rkey, limit, cursor);
    return { ok: true, data: skeleton };
  }

  return getExternalSkeleton(atUri, cursor, limit);
}

function isLocalFeed(feedUri: AtUri): boolean {
  return (
    feedUri.host === FRONTPAGE_DID &&
    feedUri.collection === nsids.FyiFrontpageFeedGenerator
  );
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
    `/xrpc/${nsids.FyiFrontpageFeedGetFeedSkeleton}`,
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

async function fetchGeneratorRecord(feedUri: AtUri): Promise<{ did: string }> {
  const { getAtprotoClient } = await import("@/lib/data/atproto/repo");
  const client = getAtprotoClient();

  const result = await client.com.atproto.repo.getRecord({
    repo: feedUri.host,
    collection: feedUri.collection,
    rkey: feedUri.rkey,
  });

  const validated = FyiFrontpageFeedGenerator.validateRecord(result.data.value);
  invariant(validated.success, "Invalid generator record");

  return { did: validated.value.did };
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
