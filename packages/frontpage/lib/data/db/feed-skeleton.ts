import "server-only";

import { db } from "@/lib/db";
import { eq, desc, and, or, lt, type SQL } from "drizzle-orm";
import * as schema from "@/lib/schema";
import { bannedUserSubQuery, postVisibilityFilters } from "./visibility";
import { type FeedSlug } from "@/lib/feed-constants";
import { exhaustiveCheck, invariant } from "@/lib/utils";
import { type FyiFrontpageFeedGetFeedSkeleton } from "@repo/frontpage-atproto-client";

export type SkeletonResult = FyiFrontpageFeedGetFeedSkeleton.OutputSchema;

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
 * Returns null when no cursor is provided (first page).
 * Throws on malformed cursors.
 */
function parseCompoundCursor(
  cursor: string | undefined,
): { value: string; id: number } | null {
  if (!cursor) return null;
  const separatorIndex = cursor.lastIndexOf(CURSOR_SEPARATOR);
  if (separatorIndex === -1) {
    throw new Error(`Invalid cursor format: missing separator`);
  }
  const value = cursor.slice(0, separatorIndex);
  const id = parseInt(
    cursor.slice(separatorIndex + CURSOR_SEPARATOR.length),
    10,
  );
  if (!value || isNaN(id)) {
    throw new Error(`Invalid cursor format: malformed value or id`);
  }
  return { value, id };
}

function buildCompoundCursor(value: string | number, id: number): string {
  return `${value}${CURSOR_SEPARATOR}${id}`;
}

const basePostColumns = {
  id: schema.Post.id,
  authorDid: schema.Post.authorDid,
  collection: schema.Post.collection,
  rkey: schema.Post.rkey,
};

function toSkeletonResult<
  TRow extends {
    id: number;
    authorDid: string;
    collection: string;
    rkey: string;
  },
>(
  rows: TRow[],
  limit: number,
  serializeCursorValue: (row: TRow) => string,
): SkeletonResult {
  const feed: SkeletonResult["feed"] = rows.map((row) => ({
    post: buildAtUri(row.authorDid, row.collection, row.rkey),
  }));

  // Only return a cursor if we got a full page — fewer rows means we're at the end.
  // Note: if the total post count is an exact multiple of limit, the last full page
  // will still emit a cursor and trigger one extra empty-page request. This is
  // intentional and matches the Bluesky reference implementation — avoiding it
  // would require a COUNT query.
  const lastRow = rows.length === limit ? rows[rows.length - 1] : undefined;
  const cursor = lastRow
    ? buildCompoundCursor(serializeCursorValue(lastRow), lastRow.id)
    : undefined;

  return { feed, cursor };
}

// ---------------------------------------------------------------------------
// Public skeleton functions
// ---------------------------------------------------------------------------

function getHotSkeleton(
  limit: number,
  cursor: string | undefined,
): Promise<SkeletonResult> {
  const parsed = parseCompoundCursor(cursor);

  let cursorFilter: SQL | undefined;
  if (parsed) {
    const rank = parseFloat(parsed.value);
    invariant(!isNaN(rank), "Invalid cursor: rank is not a number");
    cursorFilter = or(
      lt(schema.PostAggregates.rank, rank),
      and(eq(schema.PostAggregates.rank, rank), lt(schema.Post.id, parsed.id)),
    );
  }

  return db
    .select({ ...basePostColumns, rank: schema.PostAggregates.rank })
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
    .limit(limit)
    .then((rows) => toSkeletonResult(rows, limit, (row) => String(row.rank)));
}

function getNewSkeleton(
  limit: number,
  cursor: string | undefined,
): Promise<SkeletonResult> {
  const parsed = parseCompoundCursor(cursor);

  let cursorFilter: SQL | undefined;
  if (parsed) {
    const createdAt = new Date(parsed.value);
    invariant(
      !isNaN(createdAt.getTime()),
      "Invalid cursor: createdAt is not a valid date",
    );
    cursorFilter = or(
      lt(schema.Post.createdAt, createdAt),
      and(eq(schema.Post.createdAt, createdAt), lt(schema.Post.id, parsed.id)),
    );
  }

  return db
    .select({ ...basePostColumns, createdAt: schema.Post.createdAt })
    .from(schema.Post)
    .leftJoin(
      bannedUserSubQuery,
      eq(bannedUserSubQuery.did, schema.Post.authorDid),
    )
    .where(and(postVisibilityFilters(bannedUserSubQuery), cursorFilter))
    .orderBy(desc(schema.Post.createdAt), desc(schema.Post.id))
    .limit(limit)
    .then((rows) =>
      toSkeletonResult(rows, limit, (row) => row.createdAt.toISOString()),
    );
}

function getTopSkeleton(
  limit: number,
  cursor: string | undefined,
): Promise<SkeletonResult> {
  const parsed = parseCompoundCursor(cursor);

  let cursorFilter: SQL | undefined;
  if (parsed) {
    const voteCount = parseInt(parsed.value, 10);
    invariant(!isNaN(voteCount), "Invalid cursor: voteCount is not a number");
    cursorFilter = or(
      lt(schema.PostAggregates.voteCount, voteCount),
      and(
        eq(schema.PostAggregates.voteCount, voteCount),
        lt(schema.Post.id, parsed.id),
      ),
    );
  }

  return db
    .select({ ...basePostColumns, voteCount: schema.PostAggregates.voteCount })
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
    .limit(limit)
    .then((rows) =>
      toSkeletonResult(rows, limit, (row) => String(row.voteCount)),
    );
}

export function getSkeletonByAlgorithm(
  algorithm: FeedSlug,
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
      exhaustiveCheck(algorithm);
  }
}
