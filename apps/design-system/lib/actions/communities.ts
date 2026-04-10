"use server";

import { db } from "@/lib/db/store";
import { toCommunity, toPost } from "./helpers";
import { getActiveUsername } from "./auth";
import type { Post } from "@/lib/types";

async function currentUser() {
  return (await getActiveUsername()) ?? "will";
}

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
  const viewer = await currentUser();
  const posts = db.getPostsByCommunity(id).map((p) => toPost(p, viewer));
  return { community: toCommunity(data), posts };
}

export async function toggleJoin(communityId: string): Promise<boolean> {
  return db.toggleMembership({ userId: await currentUser(), communityId });
}

export async function isJoined(communityId: string): Promise<boolean> {
  return db.isMember(await currentUser(), communityId);
}

export async function getJoinedCommunities() {
  const username = await currentUser();
  return db.getJoinedCommunities(username).map(toCommunity);
}
