import { z } from "zod";

// ── Atoms ──

export const postBadgeSchema = z.object({
  variant: z.enum(["artist", "og", "live", "mod"]),
  label: z.string(),
  icon: z.string().optional(),
});

export const linkPreviewSchema = z.object({
  image: z.string().url(),
  title: z.string(),
  domain: z.string(),
});

// ── Posts ──

export const postSchema = z.object({
  id: z.string(),
  communityId: z.string(),
  author: z.string(),
  initials: z.string(),
  avatarBg: z.string(),
  createdAt: z.date(),
  badges: z.array(postBadgeSchema).default([]),
  title: z.string().min(1).max(300),
  image: z.string().optional(),
  body: z.string().optional(),
  linkPreview: linkPreviewSchema.optional(),
  video: z.object({ thumbnail: z.string() }).optional(),
  votes: z.number().int().default(0),
  commentCount: z.number().int().default(0),
});

// ── Comments (flat in the store — tree built by helpers) ──

export const commentSchema = z.object({
  id: z.string(),
  postId: z.string(),
  parentId: z.string().nullable(),
  author: z.string(),
  initials: z.string(),
  avatarBg: z.string(),
  badges: z.array(postBadgeSchema).default([]),
  body: z.string().min(1).max(10000),
  createdAt: z.date(),
  votes: z.number().int().default(0),
});

// ── Communities ──

export const communityThemeSchema = z.record(z.string(), z.string());

export const communityBannerSchema = z.object({
  name: z.string(),
  bannerImage: z.string().optional(),
  members: z.string(),
  online: z.number().int(),
  established: z.string(),
});

export const communitySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional(),
  theme: communityThemeSchema.optional(),
  banner: communityBannerSchema,
});

// ── User profiles ──

export const userProfileSchema = z.object({
  username: z.string(),
  displayName: z.string(),
  initials: z.string(),
  avatarBg: z.string(),
  avatarUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  bio: z.string(),
  handle: z.string(), // AT Protocol handle
  joinedAt: z.date(),
  badges: z.array(postBadgeSchema).default([]),
});

export type UserProfileData = z.infer<typeof userProfileSchema>;

// ── User interactions ──

export const voteSchema = z.object({
  userId: z.string(),
  targetId: z.string(), // post or comment id
  targetType: z.enum(["post", "comment"]),
});

export const saveSchema = z.object({
  userId: z.string(),
  postId: z.string(),
});

export const membershipSchema = z.object({
  userId: z.string(),
  communityId: z.string(),
});

// ── Inferred types ──

export type PostData = z.infer<typeof postSchema>;
export type CommentData = z.infer<typeof commentSchema>;
export type CommunityData = z.infer<typeof communitySchema>;
export type PostBadgeData = z.infer<typeof postBadgeSchema>;
export type LinkPreviewData = z.infer<typeof linkPreviewSchema>;
export type VoteData = z.infer<typeof voteSchema>;
export type SaveData = z.infer<typeof saveSchema>;
export type MembershipData = z.infer<typeof membershipSchema>;
