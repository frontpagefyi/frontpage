"use server";

import { db } from "@/lib/db/store";
import { buildCommentTree, toPost } from "./helpers";
import type { CommentData } from "@/lib/db/schema";
import type { Post, Comment } from "@/lib/types";

const DEMO_USER = "will";

// ── Queries ──

export async function getPostsByCommunity(communityId: string): Promise<Post[]> {
  return db.getPostsByCommunity(communityId).map(toPost);
}

export async function getPost(id: string): Promise<Post | undefined> {
  const data = db.getPost(id);
  return data ? toPost(data) : undefined;
}

export async function getThread(postId: string): Promise<Comment[]> {
  const flat = db.getCommentsByPost(postId);
  return buildCommentTree(flat);
}

export async function hasVoted(targetId: string): Promise<boolean> {
  return db.hasVoted(DEMO_USER, targetId);
}

export async function hasSaved(postId: string): Promise<boolean> {
  return db.hasSaved(DEMO_USER, postId);
}

// ── Mutations ──

export async function toggleVote(
  targetId: string,
  targetType: "post" | "comment",
): Promise<{ voted: boolean; newCount: number }> {
  const voted = db.toggleVote({ userId: DEMO_USER, targetId, targetType });

  let newCount = 0;
  if (targetType === "post") {
    newCount = db.getPost(targetId)?.votes ?? 0;
  } else {
    newCount = db.getCommentVotes(targetId);
  }

  return { voted, newCount };
}

export async function toggleSave(postId: string): Promise<boolean> {
  return db.toggleSave({ userId: DEMO_USER, postId });
}

export async function addComment(
  postId: string,
  parentId: string | null,
  body: string,
): Promise<Comment> {
  const user = db.getUser(DEMO_USER);
  const data: CommentData = {
    id: `cmt_${Date.now().toString(36)}`,
    postId,
    parentId,
    author: user?.username ?? DEMO_USER,
    initials: user?.initials ?? "?",
    avatarBg: user?.avatarBg ?? "var(--color-indigo-600)",
    badges: user?.badges ?? [],
    body,
    createdAt: new Date(),
    votes: 0,
  };
  db.addComment(data);

  return {
    id: data.id,
    author: data.author,
    initials: user?.initials ?? data.initials,
    avatarBg: user?.avatarBg ?? data.avatarBg,
    avatarUrl: user?.avatarUrl,
    badges: (user?.badges ?? []) as import("@/lib/types").PostBadge[],
    body: data.body,
    time: "just now",
    votes: 0,
    replies: [],
  };
}
