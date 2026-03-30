import "server-only";

import { db } from "@/lib/db";
import { eq, desc, and, lt } from "drizzle-orm";
import * as schema from "@/lib/schema";
import {
  bannedUserSubQuery,
  postVisibilityFilters,
} from "./visibility";

export type SkeletonPost = { post: string };
export type SkeletonResult = {
  feed: SkeletonPost[];
  cursor?: string;
};

const KNOWN_FEEDS = new Set(["hot", "new", "top"]);

export function isKnownFeed(rkey: string): boolean {
  return KNOWN_FEEDS.has(rkey);
}

function buildAtUri(authorDid: string, collection: string, rkey: string): string {
  return `at://${authorDid}/${collection}/${rkey}`;
}

function parseCursor(cursor: string | undefined): { id: number } | null {
  if (!cursor) return null;
  const id = parseInt(cursor, 10);
  if (isNaN(id)) return null;
  return { id };
}

async function querySkeletonPosts(
  orderBy: ReturnType<typeof desc>,
  limit: number,
  cursor: string | undefined,
) {
  const parsed = parseCursor(cursor);

  const rows = await db
    .select({
      id: schema.Post.id,
      authorDid: schema.Post.authorDid,
      collection: schema.Post.collection,
      rkey: schema.Post.rkey,
    })
    .from(schema.Post)
    .innerJoin(
      schema.PostAggregates,
      eq(schema.PostAggregates.postId, schema.Post.id),
    )
    .leftJoin(
      bannedUserSubQuery,
      eq(bannedUserSubQuery.did, schema.Post.authorDid),
    )
    .where(
      and(
        postVisibilityFilters(bannedUserSubQuery),
        parsed ? lt(schema.Post.id, parsed.id) : undefined,
      ),
    )
    .orderBy(orderBy)
    .limit(limit);

  const feed: SkeletonPost[] = rows.map((row) => ({
    post: buildAtUri(row.authorDid, row.collection, row.rkey),
  }));

  const lastRow = rows[rows.length - 1];
  const nextCursor = lastRow ? String(lastRow.id) : undefined;

  return { feed, cursor: nextCursor } satisfies SkeletonResult;
}

export async function getHotSkeleton(
  limit: number,
  cursor: string | undefined,
): Promise<SkeletonResult> {
  return querySkeletonPosts(
    desc(schema.PostAggregates.rank),
    limit,
    cursor,
  );
}

export async function getNewSkeleton(
  limit: number,
  cursor: string | undefined,
): Promise<SkeletonResult> {
  return querySkeletonPosts(
    desc(schema.Post.createdAt),
    limit,
    cursor,
  );
}

export async function getTopSkeleton(
  limit: number,
  cursor: string | undefined,
): Promise<SkeletonResult> {
  return querySkeletonPosts(
    desc(schema.PostAggregates.voteCount),
    limit,
    cursor,
  );
}

export function getSkeletonByAlgorithm(
  algorithm: string,
  limit: number,
  cursor: string | undefined,
): Promise<SkeletonResult> {
  switch (algorithm) {
    case "hot":
      return getHotSkeleton(limit, cursor);
    case "new":
      return getNewSkeleton(limit, cursor);
    case "top":
      return getTopSkeleton(limit, cursor);
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
}
