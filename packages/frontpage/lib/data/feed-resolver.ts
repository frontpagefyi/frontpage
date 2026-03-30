import "server-only";

import { AtUri } from "@atproto/syntax";
import { getDidDoc, type DID } from "@/lib/data/atproto/did";
import {
  isKnownFeed,
  getSkeletonByAlgorithm,
  type SkeletonResult,
} from "@/lib/data/db/feed-skeleton";
import { hydratePosts, type HydratedPost } from "@/lib/data/db/hydrate-posts";

const SERVICE_DID = "did:web:frontpage.fyi";
const GENERATOR_COLLECTION = "fyi.frontpage.feed.generator";
const SKELETON_NSID = "fyi.frontpage.feed.getFeedSkeleton";

export async function resolveFeed(
  feedUri: string,
  cursor?: string,
  limit = 50,
): Promise<{ posts: HydratedPost[]; cursor?: string }> {
  const atUri = new AtUri(feedUri);

  const skeleton = await getSkeleton(atUri, cursor, limit);
  const posts = await hydratePosts(skeleton.feed.map((s) => s.post));

  return { posts, cursor: skeleton.cursor };
}

async function getSkeleton(
  feedUri: AtUri,
  cursor: string | undefined,
  limit: number,
): Promise<SkeletonResult> {
  if (isLocalFeed(feedUri)) {
    return getSkeletonByAlgorithm(feedUri.rkey, limit, cursor);
  }

  return getExternalSkeleton(feedUri, cursor, limit);
}

function isLocalFeed(feedUri: AtUri): boolean {
  return (
    feedUri.collection === GENERATOR_COLLECTION && isKnownFeed(feedUri.rkey)
  );
}

async function getExternalSkeleton(
  feedUri: AtUri,
  cursor: string | undefined,
  limit: number,
): Promise<SkeletonResult> {
  const generatorRecord = await fetchGeneratorRecord(feedUri);
  const serviceDid = generatorRecord.did;

  const serviceEndpoint = await resolveServiceEndpoint(serviceDid);

  const url = new URL(`/xrpc/${SKELETON_NSID}`, serviceEndpoint);
  url.searchParams.set("feed", feedUri.toString());
  url.searchParams.set("limit", String(limit));
  if (cursor) url.searchParams.set("cursor", cursor);

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(
      `External feed generator returned ${response.status}: ${await response.text()}`,
    );
  }

  return response.json() as Promise<SkeletonResult>;
}

async function fetchGeneratorRecord(
  feedUri: AtUri,
): Promise<{ did: string }> {
  const { getAtprotoClient } = await import("@/lib/data/atproto/repo");
  const client = await getAtprotoClient();

  const result = await client.com.atproto.repo.getRecord({
    repo: feedUri.host,
    collection: feedUri.collection,
    rkey: feedUri.rkey,
  });

  const record = result.data.value as Record<string, unknown>;
  if (!record.did || typeof record.did !== "string") {
    throw new Error("Generator record missing did field");
  }

  return { did: record.did };
}

async function resolveServiceEndpoint(did: string): Promise<string> {
  const didDoc = await getDidDoc(did as DID);
  const service = didDoc.service?.find(
    (s) =>
      s.type === "FrontpageFeedGenerator" ||
      s.type === "BskyFeedGenerator",
  );

  if (!service || typeof service.serviceEndpoint !== "string") {
    throw new Error(
      `No feed generator service found in DID document for ${did}`,
    );
  }

  const url = new URL(service.serviceEndpoint);
  if (url.protocol !== "https:") {
    throw new Error("Feed generator endpoint must use HTTPS");
  }

  return service.serviceEndpoint;
}
