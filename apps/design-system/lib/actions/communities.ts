"use server";

import { db } from "@/lib/db/store";
import { toCommunity, toPost } from "./helpers";
import type { Post } from "@/lib/types";

const DEMO_USER = "user_demo";

export async function getCommunities() {
  return db.getCommunities().map(toCommunity);
}

export async function getCommunity(id: string) {
  const data = db.getCommunity(id);
  return data ? toCommunity(data) : undefined;
}

/** Get community with its posts in one call. */
export async function getCommunityWithPosts(id: string): Promise<{
  community: ReturnType<typeof toCommunity>;
  posts: Post[];
} | null> {
  const data = db.getCommunity(id);
  if (!data) return null;
  const posts = db.getPostsByCommunity(id).map(toPost);
  return { community: toCommunity(data), posts };
}

export async function toggleJoin(communityId: string): Promise<boolean> {
  return db.toggleMembership({ userId: DEMO_USER, communityId });
}

export async function isJoined(communityId: string): Promise<boolean> {
  return db.isMember(DEMO_USER, communityId);
}
