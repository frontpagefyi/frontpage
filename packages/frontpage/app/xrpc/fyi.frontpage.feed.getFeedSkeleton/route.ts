import { type NextRequest, NextResponse } from "next/server";
import { AtUri } from "@atproto/syntax";
import { verifyJwt } from "@atproto/xrpc-server";
import { after } from "next/server";
import {
  isKnownFeed,
  getSkeletonByAlgorithm,
} from "@/lib/data/db/feed-skeleton";
import { getDidDoc, getDidDocFresh, parseDid } from "@/lib/data/atproto/did";
import {
  FEED_SERVICE_DID,
  FEED_GENERATOR_COLLECTION,
  GET_FEED_SKELETON_NSID,
  DEFAULT_SKELETON_LIMIT,
  MIN_SKELETON_LIMIT,
  MAX_SKELETON_LIMIT,
  SKELETON_CACHE_MAX_AGE_SECONDS,
  SKELETON_SWR_SECONDS,
} from "@/lib/data/feed-constants";

const BEARER_PREFIX = "Bearer ";

function xrpcError(name: string, message: string, status: number) {
  return NextResponse.json({ error: name, message }, { status });
}

async function getSigningKey(
  iss: string,
  forceRefresh: boolean,
): Promise<string> {
  const issuerDid = parseDid(iss);
  if (!issuerDid) {
    throw new Error(`Invalid DID in JWT issuer: ${iss}`);
  }
  // verifyJwt calls with forceRefresh=true after initial key lookup fails,
  // to handle DID key rotation. Bypass the React.cache() wrapper in that case.
  const didDoc = forceRefresh
    ? await getDidDocFresh(issuerDid)
    : await getDidDoc(issuerDid);
  const verificationMethod = didDoc.verificationMethod?.find(
    (method) => method.id === `${iss}#atproto`,
  );
  if (!verificationMethod) {
    throw new Error(`No atproto verification method for ${iss}`);
  }
  return (verificationMethod as unknown as { publicKeyMultibase: string })
    .publicKeyMultibase;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const feed = searchParams.get("feed");
  const limitParam = searchParams.get("limit");
  const cursor = searchParams.get("cursor") ?? undefined;

  // Validate feed param exists
  if (!feed) {
    return xrpcError("InvalidRequest", "Missing required parameter: feed", 400);
  }

  // Parse and validate the feed URI
  let feedUri: AtUri;
  try {
    feedUri = new AtUri(feed);
  } catch {
    return xrpcError("InvalidRequest", "Invalid feed URI", 400);
  }

  // Validate collection
  if (feedUri.collection !== FEED_GENERATOR_COLLECTION) {
    return xrpcError(
      "UnknownFeed",
      `Unknown collection: ${feedUri.collection}`,
      400,
    );
  }

  // Validate algorithm
  if (!isKnownFeed(feedUri.rkey)) {
    return xrpcError("UnknownFeed", `Unknown feed: ${feedUri.rkey}`, 400);
  }

  // Parse limit (default DEFAULT_SKELETON_LIMIT, clamp MIN..MAX)
  let limit = DEFAULT_SKELETON_LIMIT;
  if (limitParam) {
    limit = Math.max(
      MIN_SKELETON_LIMIT,
      Math.min(
        MAX_SKELETON_LIMIT,
        parseInt(limitParam, 10) || DEFAULT_SKELETON_LIMIT,
      ),
    );
  }

  // Optional JWT verification — auth not required for public feeds
  let requesterDid: string | undefined;
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith(BEARER_PREFIX)) {
    try {
      const jwt = authHeader.slice(BEARER_PREFIX.length);
      const payload = await verifyJwt(
        jwt,
        FEED_SERVICE_DID,
        GET_FEED_SKELETON_NSID,
        getSigningKey,
      );
      requesterDid = payload.iss;
    } catch {
      return NextResponse.json(
        { error: "AuthRequired", message: "Invalid or expired token" },
        {
          status: 401,
          headers: { "WWW-Authenticate": 'Bearer realm="frontpage.fyi"' },
        },
      );
    }
  }

  // Get the skeleton
  let result;
  try {
    result = await getSkeletonByAlgorithm(feedUri.rkey, limit, cursor);
  } catch (err) {
    console.error("getFeedSkeleton db error:", err);
    return xrpcError("InternalServerError", "Failed to fetch feed", 500);
  }

  // Non-blocking logging
  after(() => {
    console.log(
      `getFeedSkeleton: algorithm=${feedUri.rkey} limit=${limit} cursor=${cursor ?? "none"} results=${result.feed.length} requester=${requesterDid ?? "anonymous"}`,
    );
  });

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": `public, max-age=${SKELETON_CACHE_MAX_AGE_SECONDS}, stale-while-revalidate=${SKELETON_SWR_SECONDS}`,
    },
  });
}
