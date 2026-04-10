"use server";

import { db } from "@/lib/db/store";
import { toPost, toCommunity } from "./helpers";
import { getActiveUsername } from "./auth";
import type { Post, PostBadge } from "@/lib/types";

export interface UserProfile {
  username: string;
  displayName: string;
  initials: string;
  avatarBg: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bio: string;
  handle: string;
  joinedAt: string;
  badges: PostBadge[];
  stats: {
    posts: number;
    comments: number;
    karma: number;
    communities: number;
  };
}

export async function getProfile(username: string): Promise<UserProfile | null> {
  const user = db.getUser(username);
  if (!user) return null;

  const posts = db.getPostsByAuthor(username);
  const comments = db.getCommentsByAuthor(username);
  const communities = db.getCommunitiesForUser(username);

  const karma =
    posts.reduce((sum, p) => sum + p.votes, 0) +
    comments.reduce((sum, c) => sum + c.votes, 0);

  const joined = user.joinedAt;
  const months = Math.floor((Date.now() - joined.getTime()) / (30 * 86_400_000));
  const joinedStr = months < 1 ? "This month" : months < 12 ? `${months}mo ago` : `${Math.floor(months / 12)}y ago`;

  return {
    username: user.username,
    displayName: user.displayName,
    initials: user.initials,
    avatarBg: user.avatarBg,
    avatarUrl: user.avatarUrl,
    bannerUrl: user.bannerUrl,
    bio: user.bio,
    handle: user.handle,
    joinedAt: joinedStr,
    badges: user.badges as PostBadge[],
    stats: {
      posts: posts.length,
      comments: comments.length,
      karma,
      communities: communities.length,
    },
  };
}

export async function getProfilePosts(username: string): Promise<Post[]> {
  const viewer = await getActiveUsername() ?? "will";
  return db.getPostsByAuthor(username).map((p) => toPost(p, viewer));
}

export async function getProfileCommunities(username: string) {
  return db.getCommunitiesForUser(username).map(toCommunity);
}
