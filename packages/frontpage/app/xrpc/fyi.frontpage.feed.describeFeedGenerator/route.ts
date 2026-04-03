import { NextResponse } from "next/server";
import { FEED_REGISTRY } from "@/lib/feed-constants";
import { STATIC_CACHE_MAX_AGE_SECONDS } from "@/lib/feed-constants";
import { publicConfig } from "@/lib/config/public-config";

const RESPONSE_BODY = {
  did: publicConfig.NEXT_PUBLIC_FEED_SERVICE_DID,
  feeds: FEED_REGISTRY,
};

export function GET() {
  return NextResponse.json(RESPONSE_BODY, {
    headers: {
      "Cache-Control": `public, max-age=${STATIC_CACHE_MAX_AGE_SECONDS}`,
    },
  });
}
