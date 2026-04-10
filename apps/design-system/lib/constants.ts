/** Route helpers — single source of truth for URL patterns. */
export const routes = {
  profile: (username: string) => `/explorations/profile/${username}`,
  communityFeed: "/explorations/community-feed",
} as const;

/** Demo user for the design system. */
export const CURRENT_USER = {
  username: "will",
  initials: "wc",
  avatarBg: "var(--color-indigo-600)",
  avatarUrl: "https://i.pravatar.cc/80?u=frontpage-demo",
} as const;

/** Animation class constants to avoid repeated magic strings. */
export const ANIM = {
  heartPop: "motion-safe:animate-[heart-pop_0.7s_cubic-bezier(0.17,0.89,0.32,1.49)]",
  bookmarkDrop: "motion-safe:animate-[bookmark-drop_0.7s_cubic-bezier(0.17,0.89,0.32,1.49)]",
} as const;
