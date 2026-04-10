"use server";

import { db } from "@/lib/db/store";
import { buildCommentTree, toPost } from "./helpers";
import { getActiveUsername } from "./auth";
import type { CommentData, PostData } from "@/lib/db/schema";
import type { Post, Comment } from "@/lib/types";

async function currentUser() {
  return (await getActiveUsername()) ?? "will";
}

// ── Queries ──

export async function getPostsByCommunity(communityId: string): Promise<Post[]> {
  const viewer = await currentUser();
  return db.getPostsByCommunity(communityId).map((p) => toPost(p, viewer));
}

export async function getPost(id: string): Promise<Post | undefined> {
  const data = db.getPost(id);
  const viewer = await currentUser();
  return data ? toPost(data, viewer) : undefined;
}

export async function getThread(postId: string): Promise<Comment[]> {
  const flat = db.getCommentsByPost(postId);
  const viewer = await currentUser();
  return buildCommentTree(flat, viewer);
}

export async function hasVoted(targetId: string): Promise<boolean> {
  return db.hasVoted(await currentUser(), targetId);
}

export async function hasSaved(postId: string): Promise<boolean> {
  return db.hasSaved(await currentUser(), postId);
}

export async function getSavedPosts(): Promise<Post[]> {
  const viewer = await currentUser();
  return db.getSavedPosts(viewer).map((p) => toPost(p, viewer));
}

// ── Mutations ──

export async function toggleVote(
  targetId: string,
  targetType: "post" | "comment",
): Promise<{ voted: boolean; newCount: number }> {
  const voted = db.toggleVote({ userId: await currentUser(), targetId, targetType });

  let newCount = 0;
  if (targetType === "post") {
    newCount = db.getPost(targetId)?.votes ?? 0;
  } else {
    newCount = db.getCommentVotes(targetId);
  }

  return { voted, newCount };
}

export async function toggleSave(postId: string): Promise<boolean> {
  return db.toggleSave({ userId: await currentUser(), postId });
}

export async function addComment(
  postId: string,
  parentId: string | null,
  body: string,
): Promise<Comment> {
  const user = db.getUser(await currentUser());
  const data: CommentData = {
    id: `cmt_${Date.now().toString(36)}`,
    postId,
    parentId,
    author: user?.username ?? await currentUser(),
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

export async function createPost(opts: {
  communityId: string;
  type: import("@/lib/types").PostType;
  title: string;
  body?: string;
  image?: string;
  url?: string;
  linkPreview?: { image: string; title: string; domain: string };
}): Promise<Post> {
  const user = db.getUser(await currentUser());
  const data: PostData = {
    id: `post_${Date.now().toString(36)}`,
    communityId: opts.communityId,
    author: user?.username ?? await currentUser(),
    initials: user?.initials ?? "?",
    avatarBg: user?.avatarBg ?? "var(--color-indigo-600)",
    badges: user?.badges ?? [],
    type: opts.type,
    title: opts.title,
    body: opts.body || undefined,
    image: opts.image || undefined,
    url: opts.url || undefined,
    linkPreview: opts.linkPreview,
    createdAt: new Date(),
    votes: 0,
    commentCount: 0,
  };
  db.addPost(data);
  return toPost(data, user?.username);
}
