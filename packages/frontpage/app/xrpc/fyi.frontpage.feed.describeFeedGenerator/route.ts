import { NextResponse } from "next/server";
import {
  FEED_SERVICE_DID,
  FEED_GENERATOR_COLLECTION,
  FRONTPAGE_DID,
  STATIC_CACHE_MAX_AGE_SECONDS,
} from "@/lib/data/feed-constants";

const RESPONSE_BODY = {
  did: FEED_SERVICE_DID,
  feeds: [
    { uri: `at://${FRONTPAGE_DID}/${FEED_GENERATOR_COLLECTION}/hot` },
    { uri: `at://${FRONTPAGE_DID}/${FEED_GENERATOR_COLLECTION}/new` },
    { uri: `at://${FRONTPAGE_DID}/${FEED_GENERATOR_COLLECTION}/top` },
  ],
};

export function GET() {
  return NextResponse.json(RESPONSE_BODY, {
    headers: {
      "Cache-Control": `public, max-age=${STATIC_CACHE_MAX_AGE_SECONDS}`,
    },
  });
}
