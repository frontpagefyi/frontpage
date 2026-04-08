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

export interface Post {
  author: string;
  initials: string;
  avatarBg: string;
  time: string;
  badges?: PostBadge[];
  title: string;
  image?: string;
  body?: string;
  linkPreview?: LinkPreview;
  video?: { thumbnail: string };
  votes: number | string;
  comments: number;
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

export interface Community {
  name: string;
  icon?: string;
  theme?: CommunityTheme;
  banner: CommunityBanner;
  posts: Post[];
}
