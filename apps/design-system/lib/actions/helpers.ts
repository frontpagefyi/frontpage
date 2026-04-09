import type { CommentData } from "@/lib/db/schema";
import type { Comment, Post, PostBadge } from "@/lib/types";
import type { PostData, CommunityData } from "@/lib/db/schema";
import { db } from "@/lib/db/store";

/** Build a nested comment tree from flat comments. */
export function buildCommentTree(flat: CommentData[]): Comment[] {
  const map = new Map<string, Comment>();
  const roots: Comment[] = [];

  // Create Comment nodes — resolve author from user store
  for (const c of flat) {
    const user = db.getUser(c.author);
    map.set(c.id, {
      id: c.id,
      author: c.author,
      initials: user?.initials ?? c.initials,
      avatarBg: user?.avatarBg ?? c.avatarBg,
      avatarUrl: user?.avatarUrl,
      badges: (user?.badges ?? c.badges) as PostBadge[],
      body: c.body,
      time: formatTimeAgo(c.createdAt),
      votes: c.votes,
      replies: [],
    });
  }

  // Wire parents
  for (const c of flat) {
    const node = map.get(c.id)!;
    if (c.parentId) {
      const parent = map.get(c.parentId);
      if (parent) {
        parent.replies ??= [];
        parent.replies.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
}

/** Convert a PostData to the frontend Post type. Resolves author from user store. */
export function toPost(data: PostData): Post {
  const community = db.getCommunity(data.communityId);
  const user = db.getUser(data.author);
  return {
    id: data.id,
    communityName: community?.name,
    communityIcon: community?.icon,
    communityColor: community?.theme?.["--accent-primary"],
    communityBanner: community?.banner.bannerImage,
    author: data.author,
    initials: user?.initials ?? data.initials,
    avatarBg: user?.avatarBg ?? data.avatarBg,
    avatarUrl: user?.avatarUrl,
    time: formatTimeAgo(data.createdAt),
    badges: (user?.badges ?? data.badges) as PostBadge[],
    title: data.title,
    image: data.image,
    body: data.body,
    linkPreview: data.linkPreview,
    video: data.video,
    votes: data.votes,
    comments: db.getCommentsByPost(data.id).length,
  };
}

/** Convert a CommunityData to the shape the existing components expect. */
export function toCommunity(data: CommunityData) {
  return {
    id: data.id,
    name: data.name,
    icon: data.icon,
    theme: data.theme,
    banner: data.banner,
  };
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}
