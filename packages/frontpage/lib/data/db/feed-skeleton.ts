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

const CURSOR_SEPARATOR = "::";

/**
 * Parse a compound cursor of the form "value::id".
 * The value portion is the ordering column value, id is the tiebreaker.
 */
function parseCompoundCursor(
  cursor: string | undefined,
): { value: string; id: number } | null {
  if (!cursor) return null;
  const separatorIndex = cursor.lastIndexOf(CURSOR_SEPARATOR);
  if (separatorIndex === -1) return null;
  const value = cursor.slice(0, separatorIndex);
  const id = parseInt(cursor.slice(separatorIndex + CURSOR_SEPARATOR.length), 10);
  if (!value || isNaN(id)) return null;
  return { value, id };
}

function buildCompoundCursor(value: string | number, id: number): string {
  return `${value}${CURSOR_SEPARATOR}${id}`;
}

// ---------------------------------------------------------------------------
// Parameterised skeleton queries
// ---------------------------------------------------------------------------

/**
 * Configuration for skeleton queries that require a PostAggregates join.
 * Used by hot (rank) and top (voteCount) feeds.
 */
type AggregateSkeletonConfig<T> = {
  /** Extra columns to select from PostAggregates */
  extraSelect: Record<string, unknown>;
  /** Order by expressions */
  orderBy: SQL[];
  /** Parse the cursor value portion into a typed value */
  parseCursorValue: (value: string) => T;
  /** Build the cursor WHERE filter */
  buildCursorFilter: (cursorValue: T, cursorId: number) => SQL | undefined;
  /** Serialize cursor value from the last row */
  serializeCursorValue: (row: Record<string, unknown>) => string;
};

async function queryAggregateSkeletonPosts<T>(
  config: AggregateSkeletonConfig<T>,
  limit: number,
  cursor: string | undefined,
): Promise<SkeletonResult> {
  const parsed = parseCompoundCursor(cursor);

  let cursorFilter: SQL | undefined;
  if (parsed) {
    const cursorValue = config.parseCursorValue(parsed.value);
    cursorFilter = config.buildCursorFilter(cursorValue, parsed.id);
  }

  const rows = await db
    .select({
      id: schema.Post.id,
      authorDid: schema.Post.authorDid,
      collection: schema.Post.collection,
      rkey: schema.Post.rkey,
      ...config.extraSelect,
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
    .orderBy(...config.orderBy)
    .limit(limit);

  const feed: SkeletonPost[] = rows.map((row) => ({
    post: buildAtUri(row.authorDid, row.collection, row.rkey),
  }));

  const lastRow = rows[rows.length - 1];
  const nextCursor = lastRow
    ? buildCompoundCursor(
        config.serializeCursorValue(lastRow as unknown as Record<string, unknown>),
        lastRow.id,
      )
    : undefined;

  return { feed, cursor: nextCursor };
}

/**
 * Configuration for skeleton queries that only need the Post table.
 * Used by the new (createdAt) feed.
 */
type PostOnlySkeletonConfig<T> = {
  /** Extra columns to select from Post */
  extraSelect: Record<string, unknown>;
  /** Order by expressions */
  orderBy: SQL[];
  /** Parse the cursor value portion into a typed value */
  parseCursorValue: (value: string) => T;
  /** Build the cursor WHERE filter */
  buildCursorFilter: (cursorValue: T, cursorId: number) => SQL | undefined;
  /** Serialize cursor value from the last row */
  serializeCursorValue: (row: Record<string, unknown>) => string;
};

async function queryPostOnlySkeletonPosts<T>(
  config: PostOnlySkeletonConfig<T>,
  limit: number,
  cursor: string | undefined,
): Promise<SkeletonResult> {
  const parsed = parseCompoundCursor(cursor);

  let cursorFilter: SQL | undefined;
  if (parsed) {
    const cursorValue = config.parseCursorValue(parsed.value);
    cursorFilter = config.buildCursorFilter(cursorValue, parsed.id);
  }

  const rows = await db
    .select({
      id: schema.Post.id,
      authorDid: schema.Post.authorDid,
      collection: schema.Post.collection,
      rkey: schema.Post.rkey,
      ...config.extraSelect,
    })
    .from(schema.Post)
    .leftJoin(
      bannedUserSubQuery,
      eq(bannedUserSubQuery.did, schema.Post.authorDid),
    )
    .where(and(postVisibilityFilters(bannedUserSubQuery), cursorFilter))
    .orderBy(...config.orderBy)
    .limit(limit);

  const feed: SkeletonPost[] = rows.map((row) => ({
    post: buildAtUri(row.authorDid, row.collection, row.rkey),
  }));

  const lastRow = rows[rows.length - 1];
  const nextCursor = lastRow
    ? buildCompoundCursor(
        config.serializeCursorValue(lastRow as unknown as Record<string, unknown>),
        lastRow.id,
      )
    : undefined;

  return { feed, cursor: nextCursor };
}

// ---------------------------------------------------------------------------
// Public skeleton functions (thin wrappers)
// ---------------------------------------------------------------------------

export function getHotSkeleton(
  limit: number,
  cursor: string | undefined,
): Promise<SkeletonResult> {
  return queryAggregateSkeletonPosts(
    {
      extraSelect: { rank: schema.PostAggregates.rank },
      orderBy: [desc(schema.PostAggregates.rank), desc(schema.Post.id)],
      parseCursorValue: (value) => parseFloat(value),
      buildCursorFilter: (cursorValue, cursorId) =>
        or(
          lt(schema.PostAggregates.rank, cursorValue),
          and(
            eq(schema.PostAggregates.rank, cursorValue),
            lt(schema.Post.id, cursorId),
          ),
        ),
      serializeCursorValue: (row) => String((row as { rank: number }).rank),
    },
    limit,
    cursor,
  );
}

export function getNewSkeleton(
  limit: number,
  cursor: string | undefined,
): Promise<SkeletonResult> {
  return queryPostOnlySkeletonPosts(
    {
      extraSelect: { createdAt: schema.Post.createdAt },
      orderBy: [desc(schema.Post.createdAt), desc(schema.Post.id)],
      parseCursorValue: (value) => new Date(value),
      buildCursorFilter: (cursorValue, cursorId) =>
        or(
          lt(schema.Post.createdAt, cursorValue),
          and(
            eq(schema.Post.createdAt, cursorValue),
            lt(schema.Post.id, cursorId),
          ),
        ),
      serializeCursorValue: (row) =>
        (row as { createdAt: Date }).createdAt.toISOString(),
    },
    limit,
    cursor,
  );
}

export function getTopSkeleton(
  limit: number,
  cursor: string | undefined,
): Promise<SkeletonResult> {
  return queryAggregateSkeletonPosts(
    {
      extraSelect: { voteCount: schema.PostAggregates.voteCount },
      orderBy: [desc(schema.PostAggregates.voteCount), desc(schema.Post.id)],
      parseCursorValue: (value) => parseInt(value, 10),
      buildCursorFilter: (cursorValue, cursorId) =>
        or(
          lt(schema.PostAggregates.voteCount, cursorValue),
          and(
            eq(schema.PostAggregates.voteCount, cursorValue),
            lt(schema.Post.id, cursorId),
          ),
        ),
      serializeCursorValue: (row) =>
        String((row as { voteCount: number }).voteCount),
    },
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
