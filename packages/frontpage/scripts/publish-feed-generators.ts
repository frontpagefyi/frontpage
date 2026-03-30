/**
 * Publish feed generator records to the frontpage.fyi PDS repo.
 *
 * Run once after deploying the feeds feature. Requires authentication
 * as the frontpage.fyi account.
 *
 * Usage:
 *   npx tsx packages/frontpage/scripts/publish-feed-generators.ts
 *
 * Environment:
 *   Requires the same env as the main app (PRIVATE_JWK, PUBLIC_JWK, etc.)
 *   or an authenticated session with the frontpage.fyi account.
 */

const FRONTPAGE_DID = "did:plc:klmr76mpewpv7rtm3xgpzd7x";
const FEED_SERVICE_DID = "did:web:frontpage.fyi";
const COLLECTION = "fyi.frontpage.feed.generator";

const FEEDS = [
  {
    rkey: "hot",
    displayName: "Hot",
    description: "Trending posts on Frontpage, ranked by votes and recency",
  },
  {
    rkey: "new",
    displayName: "New",
    description: "Latest posts on Frontpage, newest first",
  },
  {
    rkey: "top",
    displayName: "Top",
    description: "Most upvoted posts on Frontpage",
  },
];

async function main() {
  // Resolve the PDS URL for frontpage.fyi
  const plcResponse = await fetch(
    `https://plc.directory/${FRONTPAGE_DID}`,
  );
  const didDoc = await plcResponse.json();
  const pdsService = didDoc.service?.find(
    (s: { type: string }) => s.type === "AtprotoPersonalDataServer",
  );
  if (!pdsService?.serviceEndpoint) {
    throw new Error("Could not find PDS for frontpage.fyi");
  }
  const pdsUrl = pdsService.serviceEndpoint;
  console.log(`PDS: ${pdsUrl}`);

  for (const feed of FEEDS) {
    const record = {
      $type: COLLECTION,
      did: FEED_SERVICE_DID,
      displayName: feed.displayName,
      description: feed.description,
      createdAt: new Date().toISOString(),
    };

    console.log(
      `\nTo publish "${feed.displayName}" feed, run this against the PDS:`,
    );
    console.log(`\nPUT ${pdsUrl}/xrpc/com.atproto.repo.putRecord`);
    console.log(
      JSON.stringify(
        {
          repo: FRONTPAGE_DID,
          collection: COLLECTION,
          rkey: feed.rkey,
          record,
        },
        null,
        2,
      ),
    );
  }

  console.log("\n---");
  console.log(
    "These requests require authentication as the frontpage.fyi account.",
  );
  console.log(
    "Use an authenticated ATP agent or the PDS admin API to execute them.",
  );
}

main().catch(console.error);
