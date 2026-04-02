import { NextResponse } from "next/server";
import { FRONTPAGE_ATPROTO_HANDLE } from "@/lib/constants";
import {
  FEED_SERVICE_DID,
  STATIC_CACHE_MAX_AGE_SECONDS,
} from "@/lib/feed-constants";

// This is a receive-only identity — Frontpage verifies incoming JWTs but
// does not sign outbound ones, so no verificationMethod is needed.
const DID_DOCUMENT = {
  "@context": ["https://www.w3.org/ns/did/v1"],
  id: FEED_SERVICE_DID,
  service: [
    {
      id: "#frontpage_fg",
      type: "FrontpageFeedGenerator",
      serviceEndpoint: `https://${FRONTPAGE_ATPROTO_HANDLE}`,
    },
  ],
};

export function GET() {
  return NextResponse.json(DID_DOCUMENT, {
    headers: {
      "Cache-Control": `public, max-age=${STATIC_CACHE_MAX_AGE_SECONDS}`,
    },
  });
}
