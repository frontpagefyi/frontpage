import "server-only";

import { db } from "@/lib/db";
import { eq, and, or, isNull } from "drizzle-orm";
import * as schema from "@/lib/schema";

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
export function postVisibilityFilters(
  bannedUser: typeof bannedUserSubQuery,
) {
  return and(
    eq(schema.Post.status, "live"),
    or(isNull(bannedUser.isHidden), eq(bannedUser.isHidden, false)),
  );
}
