import { type NextRequest, NextResponse } from "next/server";
import { AtUri } from "@atproto/syntax";
import { parseLocalFeed } from "@/lib/data/feed-resolver";
import { getLocalFeedSkeleton } from "@/lib/data/db/feed-skeleton";

const DEFAULT_SKELETON_LIMIT = 50;
const MIN_SKELETON_LIMIT = 1;
const MAX_SKELETON_LIMIT = 100;
const SKELETON_CACHE_MAX_AGE_SECONDS = 30;
const SKELETON_SWR_SECONDS = 60;

function xrpcError(name: string, message: string, status: number) {
  return NextResponse.json({ error: name, message }, { status });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const feedParam = searchParams.get("feed");
  if (!feedParam) {
    return xrpcError("InvalidRequest", "Missing required parameter: feed", 400);
  }
  let feed;
  try {
    feed = new AtUri(feedParam);
  } catch (error) {
    if (error instanceof Error) {
      return xrpcError("InvalidRequest", error.message, 400);
    } else {
      throw error;
    }
  }

  const limitParam = searchParams.get("limit");
  const cursor = searchParams.get("cursor") ?? undefined;

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

  const localFeed = parseLocalFeed(feed);

  if (!localFeed) {
    return xrpcError("UnknownFeed", "Feed not found", 404);
  }

  const skeleton = await getLocalFeedSkeleton(localFeed.slug, limit, cursor);

  return NextResponse.json(skeleton, {
    headers: {
      "Cache-Control": `public, max-age=${SKELETON_CACHE_MAX_AGE_SECONDS}, stale-while-revalidate=${SKELETON_SWR_SECONDS}`,
    },
  });
}
