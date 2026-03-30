import "server-only";

import { cache } from "react";
import { db } from "@/lib/db";
import { eq, and, or, sql } from "drizzle-orm";
import * as schema from "@/lib/schema";
import { AtUri } from "@atproto/syntax";
import { getUser } from "../user";
import { type DID, parseDid } from "../atproto/did";
import {
  bannedUserSubQuery,
  postVisibilityFilters,
} from "./visibility";

export type HydratedPost = {
  id: number;
  rkey: string;
  cid: string | null;
  title: string;
  url: string;
  createdAt: Date;
  authorDid: DID;
  voteCount: number;
  commentCount: number;
  userHasVoted: boolean;
};

const buildUserHasVotedQuery = cache(async () => {
  const user = await getUser();

  return db
    .select({ postId: schema.PostVote.postId })
    .from(schema.PostVote)
    .where(user ? eq(schema.PostVote.authorDid, user.did) : sql`false`)
    .as("hasVoted");
});

export async function hydratePosts(
  postUris: string[],
): Promise<HydratedPost[]> {
  if (postUris.length === 0) return [];

  const parsedUris = postUris.map((uri) => {
    const atUri = new AtUri(uri);
    const authorDid = parseDid(atUri.host);
    if (!authorDid) {
      throw new Error(`Invalid DID in post URI: ${atUri.host}`);
    }
    return { authorDid, collection: atUri.collection, rkey: atUri.rkey, uri };
  });

  const uriConditions = parsedUris.map(
    (parsedUri) =>
      and(
        eq(schema.Post.authorDid, parsedUri.authorDid),
        eq(schema.Post.collection, parsedUri.collection),
        eq(schema.Post.rkey, parsedUri.rkey),
      ),
  );

  const userHasVoted = await buildUserHasVotedQuery();

  const rows = await db
    .select({
      id: schema.Post.id,
      rkey: schema.Post.rkey,
      cid: schema.Post.cid,
      title: schema.Post.title,
      url: schema.Post.url,
      createdAt: schema.Post.createdAt,
      authorDid: schema.Post.authorDid,
      collection: schema.Post.collection,
      voteCount: schema.PostAggregates.voteCount,
      commentCount: schema.PostAggregates.commentCount,
      userHasVoted: userHasVoted.postId,
    })
    .from(schema.Post)
    .innerJoin(
      schema.PostAggregates,
      eq(schema.PostAggregates.postId, schema.Post.id),
    )
    .leftJoin(userHasVoted, eq(userHasVoted.postId, schema.Post.id))
    .leftJoin(
      bannedUserSubQuery,
      eq(bannedUserSubQuery.did, schema.Post.authorDid),
    )
    .where(
      and(
        postVisibilityFilters(bannedUserSubQuery),
        or(...uriConditions),
      ),
    );

  const rowMap = new Map<string, (typeof rows)[number]>();
  for (const row of rows) {
    const key = `${row.authorDid}:${row.collection}:${row.rkey}`;
    rowMap.set(key, row);
  }

  const hydrated: HydratedPost[] = [];
  for (const parsedUri of parsedUris) {
    const row = rowMap.get(`${parsedUri.authorDid}:${parsedUri.collection}:${parsedUri.rkey}`);
    if (!row) continue;
    hydrated.push({
      id: row.id,
      rkey: row.rkey,
      cid: row.cid || null,
      title: row.title,
      url: row.url,
      createdAt: row.createdAt,
      authorDid: row.authorDid,
      voteCount: row.voteCount,
      commentCount: row.commentCount,
      userHasVoted: Boolean(row.userHasVoted),
    });
  }

  return hydrated;
}
