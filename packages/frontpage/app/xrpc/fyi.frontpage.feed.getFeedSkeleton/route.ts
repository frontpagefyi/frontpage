import { type NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@atproto/xrpc-server";
import { after } from "next/server";
import { getDidDoc, parseDid } from "@/lib/data/atproto/did";
import { invariant } from "@/lib/utils";
import { nsids } from "@/lib/data/atproto/repo";
import { FEED_SERVICE_DID } from "@/lib/data/feed-constants";
import { getFeedSkeleton } from "@/lib/data/feed-resolver";

const DEFAULT_SKELETON_LIMIT = 50;
const MIN_SKELETON_LIMIT = 1;
const MAX_SKELETON_LIMIT = 100;
const SKELETON_CACHE_MAX_AGE_SECONDS = 30;
const SKELETON_SWR_SECONDS = 60;

const BEARER_PREFIX = "Bearer ";

function xrpcError(name: string, message: string, status: number) {
  return NextResponse.json({ error: name, message }, { status });
}

async function getSigningKey(
  iss: string,
  _forceRefresh: boolean,
): Promise<string> {
  const issuerDid = parseDid(iss);
  invariant(issuerDid, `Invalid DID in JWT issuer: ${iss}`);

  // verifyJwt compares the cached vs fresh key to detect rotation.
  // React.cache dedupes within a request, so we must bypass it on retry.
  const didDoc = await getDidDoc(issuerDid);
  const verificationMethod = didDoc.verificationMethod?.find(
    (method) => method.id === `${iss}#atproto`,
  );
  invariant(verificationMethod, `No atproto verification method for ${iss}`);
  invariant(
    verificationMethod.publicKeyMultibase,
    `Verification method for ${iss} does not contain publicKeyMultibase`,
  );
  return verificationMethod.publicKeyMultibase;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const feed = searchParams.get("feed");
  const limitParam = searchParams.get("limit");
  const cursor = searchParams.get("cursor") ?? undefined;

  if (!feed) {
    return xrpcError("InvalidRequest", "Missing required parameter: feed", 400);
  }

  // Parse limit (default 50, clamp 1..100)
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
        nsids.FyiFrontpageFeedGetFeedSkeleton,
        getSigningKey,
      );
      requesterDid = payload.iss;
    } catch (err) {
      if (
        err instanceof Error &&
        (err.message.includes("fetch") ||
          err.message.includes("resolve") ||
          err.message.includes("timeout"))
      ) {
        console.error("JWT key resolution failed:", err);
        return xrpcError(
          "InternalServerError",
          "Unable to verify authentication",
          500,
        );
      }
      return NextResponse.json(
        { error: "AuthRequired", message: "Invalid or expired token" },
        {
          status: 401,
          headers: { "WWW-Authenticate": 'Bearer realm="frontpage.fyi"' },
        },
      );
    }
  }

  const result = await getFeedSkeleton(feed, cursor, limit);
  if (!result.ok) {
    const { error } = result;
    switch (error.code) {
      case "InvalidUri":
        return xrpcError("InvalidRequest", error.message, 400);
      case "InvalidCollection":
      case "UnknownFeed":
        return xrpcError("UnknownFeed", error.message, 400);
      case "ExternalError":
      case "InvalidResponse":
        return xrpcError("InternalServerError", error.message, 500);
      default: {
        const _exhaustive: never = error;
        return xrpcError("InternalServerError", "Unexpected error", 500);
      }
    }
  }

  // Non-blocking logging
  after(() => {
    console.log(
      `getFeedSkeleton: feed=${feed} limit=${limit} cursor=${cursor ?? "none"} results=${result.data.feed.length} requester=${requesterDid ?? "anonymous"}`,
    );
  });

  return NextResponse.json(result.data, {
    headers: {
      "Cache-Control": `public, max-age=${SKELETON_CACHE_MAX_AGE_SECONDS}, stale-while-revalidate=${SKELETON_SWR_SECONDS}`,
      Vary: "Authorization",
    },
  });
}
