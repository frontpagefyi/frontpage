import { NextResponse } from "next/server";
import {
  FEED_SERVICE_DID,
  STATIC_CACHE_MAX_AGE_SECONDS,
} from "@/lib/data/feed-constants";

const DID_DOCUMENT = {
  "@context": ["https://www.w3.org/ns/did/v1"],
  id: FEED_SERVICE_DID,
  service: [
    {
      id: "#frontpage_fg",
      type: "FrontpageFeedGenerator",
      serviceEndpoint: "https://frontpage.fyi",
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
