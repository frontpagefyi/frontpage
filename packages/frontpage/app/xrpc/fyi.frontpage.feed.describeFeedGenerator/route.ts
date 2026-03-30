import { NextResponse } from "next/server";

const FRONTPAGE_DID = "did:plc:klmr76mpewpv7rtm3xgpzd7x";
const SERVICE_DID = "did:web:frontpage.fyi";

const RESPONSE_BODY = {
  did: SERVICE_DID,
  feeds: [
    { uri: `at://${FRONTPAGE_DID}/fyi.frontpage.feed.generator/hot` },
    { uri: `at://${FRONTPAGE_DID}/fyi.frontpage.feed.generator/new` },
    { uri: `at://${FRONTPAGE_DID}/fyi.frontpage.feed.generator/top` },
  ],
};

export async function GET() {
  return NextResponse.json(RESPONSE_BODY, {
    headers: {
      "Cache-Control": "public, max-age=86400",
    },
  });
}
