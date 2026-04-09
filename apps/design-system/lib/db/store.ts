/**
 * In-memory data store for the design system.
 *
 * This acts as a pseudo-backend: all reads and writes go through here,
 * and server actions are the only public interface. The store is mutable
 * within a single server process — data resets on restart.
 *
 * Not thread-safe (doesn't need to be for a demo), but the shape is
 * identical to what a real DB adapter would expose.
 */

import type {
  PostData,
  CommentData,
  CommunityData,
  VoteData,
  SaveData,
  MembershipData,
} from "./schema";

// ── Store shape ──

interface Store {
  communities: CommunityData[];
  posts: PostData[];
  comments: CommentData[];
  votes: VoteData[];
  saves: SaveData[];
  memberships: MembershipData[];
}

const store: Store = {
  communities: [],
  posts: [],
  comments: [],
  votes: [],
  saves: [],
  memberships: [],
};

// ── Helpers ──

function timeAgoToDate(timeAgo: string): Date {
  const m = timeAgo.match(/(\d+)(m|h|d|w)/);
  if (!m) return new Date();
  const n = parseInt(m[1]);
  const now = Date.now();
  switch (m[2]) {
    case "m": return new Date(now - n * 60_000);
    case "h": return new Date(now - n * 3_600_000);
    case "d": return new Date(now - n * 86_400_000);
    case "w": return new Date(now - n * 604_800_000);
    default: return new Date();
  }
}

let nextId = 1;
function genId(prefix: string): string {
  return `${prefix}_${(nextId++).toString(36).padStart(4, "0")}`;
}

// ── Seed data ──

function seed() {
  // Communities
  const communities: CommunityData[] = [
    {
      id: "comm_creative",
      name: "Creative Coding",
      icon: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=56&h=56&q=80",
      banner: {
        name: "Creative Coding",
        bannerImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=400&q=80",
        members: "2,847",
        online: 134,
        established: "Jan 2025",
      },
    },
    {
      id: "comm_garden",
      name: "Home Gardening",
      icon: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=56&h=56&q=80",
      theme: {
        "--bg-base": "oklch(95% 0.02 145)",
        "--bg-surface": "oklch(99% 0.005 145)",
        "--bg-elevated": "oklch(91% 0.025 145)",
        "--bg-overlay": "oklch(87% 0.02 145)",
        "--bg-interactive": "oklch(83% 0.02 145)",
        "--text-primary": "oklch(18% 0.04 145)",
        "--text-secondary": "oklch(35% 0.04 145)",
        "--text-muted": "oklch(40% 0.035 145)",
        "--accent-primary": "oklch(42% 0.2 145)",
        "--accent-secondary": "oklch(40% 0.18 145)",
      },
      banner: {
        name: "Home Gardening",
        bannerImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&h=400&q=80",
        members: "4,812",
        online: 23,
        established: "Mar 2024",
      },
    },
    {
      id: "comm_retro",
      name: "Retro Gaming",
      icon: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=56&h=56&q=80",
      theme: {
        "--bg-base": "oklch(10% 0.02 350)",
        "--bg-surface": "oklch(15% 0.03 350)",
        "--bg-elevated": "oklch(20% 0.03 350)",
        "--bg-overlay": "oklch(24% 0.03 350)",
        "--bg-interactive": "oklch(28% 0.03 350)",
        "--text-primary": "oklch(92% 0.02 350)",
        "--text-secondary": "oklch(72% 0.03 350)",
        "--text-muted": "oklch(60% 0.04 350)",
        "--accent-primary": "oklch(65% 0.25 350)",
        "--accent-secondary": "oklch(70% 0.2 350)",
      },
      banner: {
        name: "Retro Gaming",
        bannerImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&h=400&q=80",
        members: "12,340",
        online: 89,
        established: "Jan 2025",
      },
    },
    {
      id: "comm_photo",
      name: "Photography",
      icon: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=56&h=56&q=80",
      theme: {
        "--bg-base": "oklch(12% 0.005 60)",
        "--bg-surface": "oklch(17% 0.008 60)",
        "--bg-elevated": "oklch(22% 0.008 60)",
        "--bg-overlay": "oklch(26% 0.008 60)",
        "--bg-interactive": "oklch(30% 0.006 60)",
        "--text-primary": "oklch(92% 0.01 60)",
        "--text-secondary": "oklch(72% 0.015 60)",
        "--text-muted": "oklch(60% 0.015 60)",
        "--accent-primary": "oklch(78% 0.17 75)",
        "--accent-secondary": "oklch(70% 0.12 60)",
      },
      banner: {
        name: "Photography",
        bannerImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=400&q=80",
        members: "8,921",
        online: 56,
        established: "Feb 2025",
      },
    },
  ];

  // Posts — seeded from the original sample-data structure
  const posts: PostData[] = [
    // Creative Coding
    {
      id: "post_cc_1", communityId: "comm_creative",
      author: "pixelweaver", initials: "pw", avatarBg: "var(--color-indigo-600)",
      createdAt: timeAgoToDate("3h"),
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
      title: "Just finished this isometric city \u2014 6 months of pixel work",
      image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=800&h=400&q=80",
      votes: 48, commentCount: 94,
    },
    {
      id: "post_cc_2", communityId: "comm_creative",
      author: "shader_wizard", initials: "sw", avatarBg: "oklch(50% 0.15 180)",
      createdAt: timeAgoToDate("5h"),
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      title: "New GLSL tutorial: Recreating The Matrix Code effect",
      body: "Step-by-step breakdown of how to create the iconic falling characters effect using fragment shaders. Covers the column setup, randomized character selection, and that signature green phosphor glow. Full source on GitHub.",
      votes: 142, commentCount: 47,
    },
    {
      id: "post_cc_3", communityId: "comm_creative",
      author: "genart_weaver", initials: "gw", avatarBg: "oklch(55% 0.15 145)",
      createdAt: timeAgoToDate("8h"),
      badges: [],
      title: "A History of Algorithmic Art \u2014 deep dive into generative origins",
      linkPreview: {
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=200&h=140&q=80",
        title: "From Vera Moln\u00e1r to Processing: How algorithms became art",
        domain: "generativeart.org",
      },
      votes: 76, commentCount: 23,
    },
    {
      id: "post_cc_4", communityId: "comm_creative",
      author: "synthwave", initials: "sy", avatarBg: "oklch(60% 0.2 30)",
      createdAt: timeAgoToDate("12h"),
      badges: [{ variant: "og", icon: "Star", label: "OG" }, { variant: "live", icon: "Radio", label: "Live" }],
      title: "Live coding session: building a particle system from scratch",
      video: { thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&h=400&q=80" },
      votes: 203, commentCount: 67,
    },
    {
      id: "post_cc_5", communityId: "comm_creative",
      author: "pixel_nova", initials: "pn", avatarBg: "oklch(55% 0.18 310)",
      createdAt: timeAgoToDate("1d"),
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
      title: "What\u2019s everyone using for pixel art these days? Aseprite vs Pixelorama?",
      body: "I\u2019ve been using Aseprite forever but Pixelorama is looking really good lately. It\u2019s open source and the animation timeline has gotten way better. Anyone made the switch?",
      votes: 34, commentCount: 89,
    },

    // Home Gardening
    {
      id: "post_hg_1", communityId: "comm_garden",
      author: "greenthumb", initials: "gt", avatarBg: "oklch(55% 0.15 145)",
      createdAt: timeAgoToDate("2h"),
      badges: [],
      title: "Companion planting guide for small raised beds",
      image: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=800&h=400&q=80",
      votes: 312, commentCount: 67,
    },
    {
      id: "post_hg_2", communityId: "comm_garden",
      author: "seedpacket", initials: "sp", avatarBg: "oklch(60% 0.12 60)",
      createdAt: timeAgoToDate("5h"),
      badges: [],
      title: "What\u2019s wrong with my tomatoes? Leaves are curling inward",
      body: "First time growing tomatoes in zone 7b. The lower leaves are fine but the top growth is curling like crazy. Watering every other day, full sun. Already checked for aphids \u2014 nothing. Help?",
      votes: 89, commentCount: 42,
    },
    {
      id: "post_hg_3", communityId: "comm_garden",
      author: "rootbound", initials: "rb", avatarBg: "oklch(50% 0.18 200)",
      createdAt: timeAgoToDate("8h"),
      badges: [],
      title: "Built a self-watering wicking bed from an old IBC tote",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&h=400&q=80",
      votes: 458, commentCount: 93,
    },

    // Retro Gaming
    {
      id: "post_rg_1", communityId: "comm_retro",
      author: "arcadeking", initials: "ak", avatarBg: "oklch(55% 0.2 350)",
      createdAt: timeAgoToDate("1h"),
      badges: [],
      title: "Weekend Game Jam results are in \u2014 47 entries!",
      body: "Huge turnout this week. The theme was \u201cone button\u201d and people went wild. Top 3 all built completely different games with the same constraint. Check out the submissions thread and vote for your favourites.",
      votes: 567, commentCount: 134,
    },
    {
      id: "post_rg_2", communityId: "comm_retro",
      author: "crt_enjoyer", initials: "ct", avatarBg: "oklch(60% 0.15 200)",
      createdAt: timeAgoToDate("4h"),
      badges: [],
      title: "Found a Sony PVM-20M4U at a thrift store for $15",
      image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&h=400&q=80",
      votes: 1200, commentCount: 203,
    },
    {
      id: "post_rg_3", communityId: "comm_retro",
      author: "8bit_betty", initials: "8b", avatarBg: "oklch(65% 0.18 80)",
      createdAt: timeAgoToDate("7h"),
      badges: [],
      title: "Hot take: the Game Boy Camera is the best camera ever made",
      body: "The 128x112 resolution, the 4 shades of green, the absurd thermal printer \u2014 it forces you to think about composition in a way no modern camera does. Every shot is a deliberate creative choice. Fight me.",
      votes: 234, commentCount: 156,
    },

    // Photography
    {
      id: "post_ph_1", communityId: "comm_photo",
      author: "lenscraft", initials: "lc", avatarBg: "oklch(55% 0.1 60)",
      createdAt: timeAgoToDate("4h"),
      badges: [],
      title: "Golden hour at the abandoned observatory",
      image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=800&h=400&q=80",
      votes: 743, commentCount: 94,
    },
    {
      id: "post_ph_2", communityId: "comm_photo",
      author: "darkroom_dan", initials: "df", avatarBg: "oklch(50% 0.12 200)",
      createdAt: timeAgoToDate("6h"),
      badges: [],
      title: "Weekly challenge results: \u201cReflections\u201d",
      body: "Another incredible week. 89 submissions and the quality keeps going up. Winner is @lenscraft with that puddle shot downtown \u2014 the symmetry is unreal. New challenge drops tomorrow.",
      votes: 312, commentCount: 67,
    },
    {
      id: "post_ph_3", communityId: "comm_photo",
      author: "nightmode", initials: "nm", avatarBg: "oklch(55% 0.15 300)",
      createdAt: timeAgoToDate("10h"),
      badges: [],
      title: "Milky Way over Death Valley \u2014 45 stacked exposures",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&h=400&q=80",
      votes: 1800, commentCount: 187,
    },
  ];

  // Comments for the isometric city post
  const comments: CommentData[] = [
    {
      id: "cmt_1", postId: "post_cc_1", parentId: null,
      author: "shader_wizard", initials: "sw", avatarBg: "oklch(50% 0.15 180)",
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      body: "This is absolutely incredible. The shadow consistency across 12 tile sheets is insane \u2014 I can barely keep it straight across 3. Did you use any kind of reference grid overlay or was it all by eye?",
      createdAt: timeAgoToDate("2h"), votes: 23,
    },
    {
      id: "cmt_2", postId: "post_cc_1", parentId: "cmt_1",
      author: "pixelweaver", initials: "pw", avatarBg: "var(--color-indigo-600)",
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
      body: "Thanks! I built a shadow template in the first week \u2014 basically a 45-degree line tool that I\u2019d overlay on each tile before shading. Took a while to set up but saved me hundreds of hours in the long run.",
      createdAt: timeAgoToDate("2h"), votes: 15,
    },
    {
      id: "cmt_3", postId: "post_cc_1", parentId: "cmt_2",
      author: "shader_wizard", initials: "sw", avatarBg: "oklch(50% 0.15 180)",
      badges: [],
      body: "That\u2019s genius. Would you consider sharing the template? I\u2019m starting an iso project and this would be a game changer.",
      createdAt: timeAgoToDate("1h"), votes: 8,
    },
    {
      id: "cmt_4", postId: "post_cc_1", parentId: "cmt_2",
      author: "genart_weaver", initials: "gw", avatarBg: "oklch(55% 0.15 145)",
      badges: [],
      body: "Seconding this \u2014 a proper shadow template would be incredibly useful for the community.",
      createdAt: timeAgoToDate("45m"), votes: 5,
    },
    {
      id: "cmt_5", postId: "post_cc_1", parentId: null,
      author: "synthwave", initials: "sy", avatarBg: "oklch(60% 0.2 30)",
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      body: "The attention to detail is wild. I zoomed in on the market district and every stall has different goods. How do you stay motivated on something this long?",
      createdAt: timeAgoToDate("2h"), votes: 19,
    },
    {
      id: "cmt_6", postId: "post_cc_1", parentId: "cmt_5",
      author: "pixelweaver", initials: "pw", avatarBg: "var(--color-indigo-600)",
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
      body: "Honestly? I almost quit at month 4. The trick was streaming \u2014 having people watch while I worked made me accountable. Also breaking it into districts helped. Each district felt like a mini-project with its own finish line.",
      createdAt: timeAgoToDate("1h"), votes: 31,
    },
    {
      id: "cmt_7", postId: "post_cc_1", parentId: "cmt_6",
      author: "pixel_nova", initials: "pn", avatarBg: "oklch(55% 0.18 310)",
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
      body: "The district approach is smart. I\u2019ve been doing something similar with my sprite sheets \u2014 treating each character as a self-contained project rather than part of a massive set.",
      createdAt: timeAgoToDate("50m"), votes: 7,
    },
    {
      id: "cmt_8", postId: "post_cc_1", parentId: null,
      author: "pixel_nova", initials: "pn", avatarBg: "oklch(55% 0.18 310)",
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
      body: "What resolution are the individual tiles? And did you use a specific palette or roll your own?",
      createdAt: timeAgoToDate("1h"), votes: 11,
    },
    {
      id: "cmt_9", postId: "post_cc_1", parentId: "cmt_8",
      author: "pixelweaver", initials: "pw", avatarBg: "var(--color-indigo-600)",
      badges: [],
      body: "Each tile is 64x32 (standard iso diamond). The palette is a modified version of ENDESGA-64 with about 20 extra colours I added for the sky gradients and water reflections. I\u2019ll post the .pal file if there\u2019s interest.",
      createdAt: timeAgoToDate("45m"), votes: 14,
    },
    {
      id: "cmt_10", postId: "post_cc_1", parentId: "cmt_9",
      author: "8bit_betty", initials: "8b", avatarBg: "oklch(65% 0.18 80)",
      badges: [],
      body: "Please do! ENDESGA-64 is already my go-to but those water colours look incredible.",
      createdAt: timeAgoToDate("30m"), votes: 4,
    },
    {
      id: "cmt_11", postId: "post_cc_1", parentId: null,
      author: "glitch_garden", initials: "gg", avatarBg: "oklch(55% 0.2 350)",
      badges: [{ variant: "mod", icon: "Shield", label: "Mod" }],
      body: "Pinning this to the community showcase. This is exactly the kind of long-form dedication we love seeing here. Congrats on shipping it.",
      createdAt: timeAgoToDate("30m"), votes: 42,
    },
    {
      id: "cmt_12", postId: "post_cc_1", parentId: null,
      author: "arcadeking", initials: "ak", avatarBg: "oklch(55% 0.2 350)",
      badges: [],
      body: "Any chance you\u2019d make this available as a tileset? Would love to use some of these buildings in a game jam project (with credit obviously).",
      createdAt: timeAgoToDate("20m"), votes: 9,
    },
  ];

  store.communities = communities;
  store.posts = posts;
  store.comments = comments;
  store.votes = [];
  store.saves = [];
  store.memberships = [];
}

// Seed on first import
seed();

// ── Public read/write interface (used by server actions only) ──

export const db = {
  // Communities
  getCommunities: () => store.communities,
  getCommunity: (id: string) => store.communities.find((c) => c.id === id),

  // Posts
  getPostsByCommunity: (communityId: string) =>
    store.posts.filter((p) => p.communityId === communityId),
  getPost: (id: string) => store.posts.find((p) => p.id === id),

  // Comments (flat — caller builds the tree)
  getCommentsByPost: (postId: string) =>
    store.comments.filter((c) => c.postId === postId),
  getCommentVotes: (commentId: string): number => {
    const comment = store.comments.find((c) => c.id === commentId);
    return comment?.votes ?? 0;
  },
  addComment: (comment: CommentData) => {
    store.comments.push(comment);
    const post = store.posts.find((p) => p.id === comment.postId);
    if (post) post.commentCount++;
  },

  // Votes
  hasVoted: (userId: string, targetId: string) =>
    store.votes.some((v) => v.userId === userId && v.targetId === targetId),
  toggleVote: (vote: VoteData): boolean => {
    const idx = store.votes.findIndex(
      (v) => v.userId === vote.userId && v.targetId === vote.targetId,
    );
    if (idx >= 0) {
      store.votes.splice(idx, 1);
      // Decrement
      if (vote.targetType === "post") {
        const post = store.posts.find((p) => p.id === vote.targetId);
        if (post) post.votes--;
      } else {
        const comment = store.comments.find((c) => c.id === vote.targetId);
        if (comment) comment.votes--;
      }
      return false; // removed
    }
    store.votes.push(vote);
    // Increment
    if (vote.targetType === "post") {
      const post = store.posts.find((p) => p.id === vote.targetId);
      if (post) post.votes++;
    } else {
      const comment = store.comments.find((c) => c.id === vote.targetId);
      if (comment) comment.votes++;
    }
    return true; // added
  },

  // Saves
  hasSaved: (userId: string, postId: string) =>
    store.saves.some((s) => s.userId === userId && s.postId === postId),
  toggleSave: (save: SaveData): boolean => {
    const idx = store.saves.findIndex(
      (s) => s.userId === save.userId && s.postId === save.postId,
    );
    if (idx >= 0) {
      store.saves.splice(idx, 1);
      return false;
    }
    store.saves.push(save);
    return true;
  },

  // Memberships
  isMember: (userId: string, communityId: string) =>
    store.memberships.some(
      (m) => m.userId === userId && m.communityId === communityId,
    ),
  toggleMembership: (membership: MembershipData): boolean => {
    const idx = store.memberships.findIndex(
      (m) =>
        m.userId === membership.userId &&
        m.communityId === membership.communityId,
    );
    if (idx >= 0) {
      store.memberships.splice(idx, 1);
      return false;
    }
    store.memberships.push(membership);
    return true;
  },
};
