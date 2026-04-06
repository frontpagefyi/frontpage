import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { Commit } from "@/lib/data/atproto/event";
import { getPdsUrl } from "@/lib/data/atproto/did";
import { handleComment, handlePost, handleVote } from "./handlers";
import { eq } from "drizzle-orm";
import { nsids } from "@/lib/data/atproto/repo";
import { timingSafeEqual } from "node:crypto";
import { serverConfig } from "@/lib/config/server-config";

const knownCollections = [
  nsids.FyiUnravelFrontpagePost,
  nsids.FyiFrontpageFeedPost,
  nsids.FyiUnravelFrontpageComment,
  nsids.FyiFrontpageFeedComment,
  nsids.FyiUnravelFrontpageVote,
  nsids.FyiFrontpageFeedVote,
] as const;

export async function POST(request: Request) {
  const auth = request.headers.get("Authorization");
  if (
    !auth ||
    !timingSafeEqual(
      Buffer.from(auth),
      Buffer.from(`Bearer ${serverConfig.DRAINPIPE_CONSUMER_SECRET}`),
    )
  ) {
    console.error("Unauthorized request");
    return new Response("Unauthorized", { status: 401 });
  }

  const commit = Commit.safeParse(await request.json());
  if (!commit.success) {
    console.error("Could not parse commit from drainpipe", commit.error);
    return new Response("Invalid request", { status: 400 });
  }

  const { ops, repo, seq } = commit.data;
  const row = await db
    .select()
    .from(schema.ConsumedOffset)
    .where(eq(schema.ConsumedOffset.offset, seq))
    .limit(1);

  const operationConsumed = Boolean(row[0]);
  if (operationConsumed) {
    console.log("Already consumed sequence:", seq);
    return new Response("OK");
  }

  const service = await getPdsUrl(repo);
  if (!service) {
    throw new Error("No AtprotoPersonalDataServer service found");
  }
  const promises = ops.map(async (op) => {
    const { collection, rkey } = op.path;
    console.log("Processing", collection, rkey, op.action);

    switch (collection) {
      case nsids.FyiFrontpageFeedPost:
      case nsids.FyiUnravelFrontpagePost: {
        await handlePost({ op, repo, rkey });
        break;
      }

      case nsids.FyiFrontpageFeedComment:
      case nsids.FyiUnravelFrontpageComment: {
        await handleComment({ op, repo, rkey });
        break;
      }

      case nsids.FyiFrontpageFeedVote:
      case nsids.FyiUnravelFrontpageVote: {
        await handleVote({ op, repo, rkey });
        break;
      }

      default: {
        if (
          knownCollections.includes(
            collection as (typeof knownCollections)[number],
          )
        ) {
          // Known collection without a handler — this is a programming error.
          // Throw to prevent the offset from being committed so the op
          // can be reprocessed after a code fix.
          throw new Error(
            `Unhandled known collection: ${collection} in op ${JSON.stringify(op)}`,
          );
        }
        // Unknown collections are expected (e.g. user-created records)
        console.log(`Skipping unknown collection: ${collection}`);
      }
    }
  });

  await Promise.all(promises);
  await db.insert(schema.ConsumedOffset).values({ offset: seq });
  return new Response("OK");
}
