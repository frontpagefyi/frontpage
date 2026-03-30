import "server-only";

import { db } from "@/lib/db";
import { eq, desc, and, or, lt, sql, type SQL } from "drizzle-orm";
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

function buildAtUri(
  authorDid: string,
  collection: string,
  rkey: string,
): string {
  return `at://${authorDid}/${collection}/${rkey}`;
}

/**
 * Parse a compound cursor of the form "value::id".
 * The value portion is the ordering column value, id is the tiebreaker.
 */
function parseCompoundCursor(
  cursor: string | undefined,
): { value: string; id: number } | null {
  if (!cursor) return null;
  const separatorIndex = cursor.lastIndexOf("::");
  if (separatorIndex === -1) return null;
  const value = cursor.slice(0, separatorIndex);
  const id = parseInt(cursor.slice(separatorIndex + 2), 10);
  if (!value || isNaN(id)) return null;
  return { value, id };
}

function buildCompoundCursor(value: string | number, id: number): string {
  return `${value}::${id}`;
}

export async function getHotSkeleton(
  limit: number,
  cursor: string | undefined,
): Promise<SkeletonResult> {
  const parsed = parseCompoundCursor(cursor);

  // Keyset pagination: (rank < cursorRank) OR (rank = cursorRank AND id < cursorId)
  let cursorFilter: SQL | undefined;
  if (parsed) {
    const cursorRank = parseFloat(parsed.value);
    cursorFilter = or(
      lt(schema.PostAggregates.rank, cursorRank),
      and(
        eq(schema.PostAggregates.rank, cursorRank),
        lt(schema.Post.id, parsed.id),
      ),
    );
  }

  const rows = await db
    .select({
      id: schema.Post.id,
      authorDid: schema.Post.authorDid,
      collection: schema.Post.collection,
      rkey: schema.Post.rkey,
      rank: schema.PostAggregates.rank,
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
    .where(and(postVisibilityFilters(bannedUserSubQuery), cursorFilter))
    .orderBy(desc(schema.PostAggregates.rank), desc(schema.Post.id))
    .limit(limit);

  const feed: SkeletonPost[] = rows.map((row) => ({
    post: buildAtUri(row.authorDid, row.collection, row.rkey),
  }));

  const lastRow = rows[rows.length - 1];
  const nextCursor = lastRow
    ? buildCompoundCursor(lastRow.rank, lastRow.id)
    : undefined;

  return { feed, cursor: nextCursor };
}

export async function getNewSkeleton(
  limit: number,
  cursor: string | undefined,
): Promise<SkeletonResult> {
  const parsed = parseCompoundCursor(cursor);

  let cursorFilter: SQL | undefined;
  if (parsed) {
    // createdAt is stored as ISO string — string comparison works for DESC ordering
    cursorFilter = or(
      lt(schema.Post.createdAt, new Date(parsed.value)),
      and(
        eq(schema.Post.createdAt, new Date(parsed.value)),
        lt(schema.Post.id, parsed.id),
      ),
    );
  }

  const rows = await db
    .select({
      id: schema.Post.id,
      authorDid: schema.Post.authorDid,
      collection: schema.Post.collection,
      rkey: schema.Post.rkey,
      createdAt: schema.Post.createdAt,
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
    .where(and(postVisibilityFilters(bannedUserSubQuery), cursorFilter))
    .orderBy(desc(schema.Post.createdAt), desc(schema.Post.id))
    .limit(limit);

  const feed: SkeletonPost[] = rows.map((row) => ({
    post: buildAtUri(row.authorDid, row.collection, row.rkey),
  }));

  const lastRow = rows[rows.length - 1];
  const nextCursor = lastRow
    ? buildCompoundCursor(lastRow.createdAt.toISOString(), lastRow.id)
    : undefined;

  return { feed, cursor: nextCursor };
}

export async function getTopSkeleton(
  limit: number,
  cursor: string | undefined,
): Promise<SkeletonResult> {
  const parsed = parseCompoundCursor(cursor);

  let cursorFilter: SQL | undefined;
  if (parsed) {
    const cursorVoteCount = parseInt(parsed.value, 10);
    cursorFilter = or(
      lt(schema.PostAggregates.voteCount, cursorVoteCount),
      and(
        eq(schema.PostAggregates.voteCount, cursorVoteCount),
        lt(schema.Post.id, parsed.id),
      ),
    );
  }

  const rows = await db
    .select({
      id: schema.Post.id,
      authorDid: schema.Post.authorDid,
      collection: schema.Post.collection,
      rkey: schema.Post.rkey,
      voteCount: schema.PostAggregates.voteCount,
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
    .where(and(postVisibilityFilters(bannedUserSubQuery), cursorFilter))
    .orderBy(desc(schema.PostAggregates.voteCount), desc(schema.Post.id))
    .limit(limit);

  const feed: SkeletonPost[] = rows.map((row) => ({
    post: buildAtUri(row.authorDid, row.collection, row.rkey),
  }));

  const lastRow = rows[rows.length - 1];
  const nextCursor = lastRow
    ? buildCompoundCursor(lastRow.voteCount, lastRow.id)
    : undefined;

  return { feed, cursor: nextCursor };
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
