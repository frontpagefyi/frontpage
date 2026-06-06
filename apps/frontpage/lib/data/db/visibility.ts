import "server-only";

import { cache } from "react";
import { db } from "@/lib/db";
import { eq, and, or, isNull, sql } from "drizzle-orm";
import * as schema from "@/lib/schema";
import { getUser } from "../user";

/**
 * Subquery for joining against banned/hidden users.
 * Used in both post and comment visibility filtering.
 */
export const bannedUserSubQuery = db
  .select({
    did: schema.LabelledProfile.did,
    isHidden: schema.LabelledProfile.isHidden,
  })
  .from(schema.LabelledProfile)
  .as("bannedUser");

/**
 * WHERE conditions for post visibility: status is live AND author is not banned.
 * Use with posts/skeletons where banned content should be fully excluded.
 */
export function postVisibilityFilters(bannedUser: typeof bannedUserSubQuery) {
  return and(
    eq(schema.Post.status, "live"),
    or(isNull(bannedUser.isHidden), eq(bannedUser.isHidden, false)),
  );
}

/**
 * Subquery that checks whether the current user has voted on a post.
 * Returns a subquery aliased as "hasVoted" with a postId column.
 * Cached per-request via React's `cache()`.
 */
export const buildUserHasVotedQuery = cache(async () => {
  const user = await getUser();

  return db
    .select({ postId: schema.PostVote.postId })
    .from(schema.PostVote)
    .where(user ? eq(schema.PostVote.authorDid, user.did) : sql`false`)
    .as("hasVoted");
});
