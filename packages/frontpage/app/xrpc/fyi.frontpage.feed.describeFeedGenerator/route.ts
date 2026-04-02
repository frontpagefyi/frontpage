import { NextResponse } from "next/server";
import { FEED_REGISTRY } from "@/lib/feed-constants";
import { feedUri } from "@/lib/constants";
import {
  FEED_SERVICE_DID,
  STATIC_CACHE_MAX_AGE_SECONDS,
} from "@/lib/feed-constants";

const RESPONSE_BODY = {
  did: FEED_SERVICE_DID,
  feeds: FEED_REGISTRY.map((f) => ({ uri: feedUri(f.slug) })),
};

export function GET() {
  return NextResponse.json(RESPONSE_BODY, {
    headers: {
      "Cache-Control": `public, max-age=${STATIC_CACHE_MAX_AGE_SECONDS}`,
    },
  });
}
