import { type NextRequest, NextResponse } from "next/server";
import { AtUri } from "@atproto/syntax";
import { verifyJwt } from "@atproto/xrpc-server";
import { after } from "next/server";
import {
  isKnownFeed,
  getSkeletonByAlgorithm,
} from "@/lib/data/db/feed-skeleton";
import { getDidDoc, type DID } from "@/lib/data/atproto/did";

const SERVICE_DID = "did:web:frontpage.fyi";
const GENERATOR_COLLECTION = "fyi.frontpage.feed.generator";
const SKELETON_NSID = "fyi.frontpage.feed.getFeedSkeleton";

function xrpcError(name: string, message: string, status: number) {
  return NextResponse.json({ error: name, message }, { status });
}

async function getSigningKey(
  iss: string,
  _forceRefresh: boolean,
): Promise<string> {
  const didDoc = await getDidDoc(iss as DID);
  const vm = didDoc.verificationMethod?.find(
    (m) => m.id === `${iss}#atproto`,
  );
  if (!vm) {
    throw new Error(`No atproto verification method for ${iss}`);
  }
  return (vm as unknown as { publicKeyMultibase: string }).publicKeyMultibase;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const feed = searchParams.get("feed");
  const limitParam = searchParams.get("limit");
  const cursor = searchParams.get("cursor") ?? undefined;

  // Validate feed param exists
  if (!feed) {
    return xrpcError(
      "InvalidRequest",
      "Missing required parameter: feed",
      400,
    );
  }

  // Parse and validate the feed URI
  let feedUri: AtUri;
  try {
    feedUri = new AtUri(feed);
  } catch {
    return xrpcError("InvalidRequest", "Invalid feed URI", 400);
  }

  // Validate collection
  if (feedUri.collection !== GENERATOR_COLLECTION) {
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

  // Parse limit (default 50, clamp 1-100)
  let limit = 50;
  if (limitParam) {
    limit = Math.max(1, Math.min(100, parseInt(limitParam, 10) || 50));
  }

  // Optional JWT verification — auth not required for public feeds
  let requesterDid: string | undefined;
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const jwt = authHeader.slice(7);
      const payload = await verifyJwt(
        jwt,
        SERVICE_DID,
        SKELETON_NSID,
        getSigningKey,
      );
      requesterDid = payload.iss;
    } catch {
      return xrpcError("AuthRequired", "Invalid or expired token", 401);
    }
  }

  // Get the skeleton
  const result = await getSkeletonByAlgorithm(feedUri.rkey, limit, cursor);

  // Non-blocking logging
  after(() => {
    console.log(
      `getFeedSkeleton: algorithm=${feedUri.rkey} limit=${limit} cursor=${cursor ?? "none"} results=${result.feed.length} requester=${requesterDid ?? "anonymous"}`,
    );
  });

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "max-age=30, stale-while-revalidate=60",
      Vary: "Authorization",
    },
  });
}
