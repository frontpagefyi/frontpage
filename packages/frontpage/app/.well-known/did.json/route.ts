import { NextResponse } from "next/server";

const DID_DOCUMENT = {
  "@context": ["https://www.w3.org/ns/did/v1"],
  id: "did:web:frontpage.fyi",
  service: [
    {
      id: "#frontpage_fg",
      type: "FrontpageFeedGenerator",
      serviceEndpoint: "https://frontpage.fyi",
    },
  ],
};

export async function GET() {
  return NextResponse.json(DID_DOCUMENT, {
    headers: {
      "Cache-Control": "public, max-age=86400",
    },
  });
}
