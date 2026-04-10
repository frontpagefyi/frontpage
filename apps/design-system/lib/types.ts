export interface PostBadge {
  variant: "artist" | "og" | "live" | "mod";
  label: string;
  icon?: string; // lucide icon name, e.g. "palette", "crown"
}

export interface LinkPreview {
  image: string;
  title: string;
  domain: string;
}

export type PostType = "text" | "image" | "link" | "video";

export interface Post {
  id?: string;
  type?: PostType;
  communityId?: string;
  communityName?: string;
  communityIcon?: string;
  communityColor?: string;
  communityBanner?: string;
  author: string;
  initials: string;
  avatarBg: string;
  avatarUrl?: string;
  time: string;
  badges?: PostBadge[];
  title: string;
  image?: string;
  body?: string;
  url?: string;
  linkPreview?: LinkPreview;
  video?: { thumbnail: string };
  votes: number;
  comments: number;
  voted?: boolean;
  saved?: boolean;
}

export interface CommunityTheme {
  [key: string]: string;
}

export interface CommunityBanner {
  name: string;
  bannerImage?: string;
  members: string;
  online: number;
  established: string;
}

export interface Comment {
  id: string;
  author: string;
  initials: string;
  avatarBg: string;
  avatarUrl?: string;
  badges?: PostBadge[];
  body: string;
  time: string;
  votes: number;
  voted?: boolean;
  replies?: Comment[];
}

export interface Community {
  name: string;
  icon?: string;
  theme?: CommunityTheme;
  banner: CommunityBanner;
  posts: Post[];
}
