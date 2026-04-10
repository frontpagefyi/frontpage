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
  UserProfileData,
  VoteData,
  SaveData,
  MembershipData,
} from "./schema";

// ── Store shape ──

interface Store {
  communities: CommunityData[];
  posts: PostData[];
  comments: CommentData[];
  users: UserProfileData[];
  votes: VoteData[];
  saves: SaveData[];
  memberships: MembershipData[];
}

const store: Store = {
  communities: [],
  posts: [],
  comments: [],
  users: [],
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

// ── Seed data ──

function seed() {
  // Communities
  // Users
  const users: UserProfileData[] = [
    {
      username: "will",
      displayName: "Will",
      initials: "wc",
      avatarBg: "oklch(55% 0.15 259)",
      avatarUrl: "https://www.carebears.com/wp-content/uploads/2025/12/tender-heart.png",
      bio: "Building Frontpage. Exploring community design for the AT Protocol.",
      handle: "will.frontpage.fyi",
      joinedAt: timeAgoToDate("365d"),
      badges: [],
    },
    {
      username: "tim",
      displayName: "Tim",
      initials: "tm",
      avatarBg: "oklch(55% 0.18 180)",
      avatarUrl: "https://www.carebears.com/wp-content/uploads/2025/12/Cheer-bear.png",
      bio: "Engineering at Frontpage. Systems thinker.",
      handle: "tim.frontpage.fyi",
      joinedAt: timeAgoToDate("300d"),
      badges: [],
    },
    {
      username: "tom",
      displayName: "Tom",
      initials: "to",
      avatarBg: "oklch(55% 0.18 30)",
      avatarUrl: "https://www.carebears.com/wp-content/uploads/2025/12/grumpy-bear.png",
      bio: "Design at Frontpage. Pixels and polish.",
      handle: "tom.frontpage.fyi",
      joinedAt: timeAgoToDate("300d"),
      badges: [],
    },
    {
      username: "jake",
      displayName: "Jake",
      initials: "jk",
      avatarBg: "oklch(55% 0.18 145)",
      avatarUrl: "https://www.carebears.com/wp-content/uploads/2025/12/funshine-bear.png",
      bio: "Product at Frontpage. Community-first.",
      handle: "jake.frontpage.fyi",
      joinedAt: timeAgoToDate("300d"),
      badges: [],
    },
    {
      username: "damien",
      displayName: "Damien",
      initials: "dm",
      avatarBg: "oklch(55% 0.18 310)",
      avatarUrl: "https://www.carebears.com/wp-content/uploads/2025/12/bedtime-bear.png",
      bio: "Engineering at Frontpage. AT Protocol enthusiast.",
      handle: "damien.frontpage.fyi",
      joinedAt: timeAgoToDate("300d"),
      badges: [],
    },
    {
      username: "pixelweaver",
      displayName: "Pixel Weaver",
      initials: "pw",
      avatarBg: "var(--color-indigo-600)",
      avatarUrl: "https://i.pravatar.cc/200?u=pixelweaver",
      bannerUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=800&h=300&q=80",
      bio: "Isometric artist and pixel art obsessive. Building worlds one tile at a time. Currently working on a city simulator with hand-placed shadows.",
      handle: "pixelweaver.bsky.social",
      joinedAt: timeAgoToDate("180d"),
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
    },
    {
      username: "shader_wizard",
      displayName: "Shader Wizard",
      initials: "sw",
      avatarBg: "oklch(50% 0.15 180)",
      avatarUrl: "https://i.pravatar.cc/200?u=shader_wizard",
      bannerUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&h=300&q=80",
      bio: "GLSL / WebGPU enthusiast. Writing shader tutorials and building generative art tools. Previously at Shadertoy.",
      handle: "shaderwiz.bsky.social",
      joinedAt: timeAgoToDate("365d"),
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
    },
    {
      username: "synthwave",
      displayName: "Synthwave",
      initials: "sy",
      avatarBg: "oklch(60% 0.2 30)",
      avatarUrl: "https://i.pravatar.cc/200?u=synthwave",
      bannerUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&h=300&q=80",
      bio: "Live coder, particle systems addict, retro futurist. Streaming creative coding sessions every Friday. Building a music visualiser in Rust.",
      handle: "synthwave.frontpage.fyi",
      joinedAt: timeAgoToDate("400d"),
      badges: [{ variant: "og", icon: "Star", label: "OG" }, { variant: "live", icon: "Radio", label: "Live" }],
    },
    {
      username: "pixel_nova",
      displayName: "Pixel Nova",
      initials: "pn",
      avatarBg: "oklch(55% 0.18 310)",
      avatarUrl: "https://i.pravatar.cc/200?u=pixel_nova",
      bio: "Sprite artist and animation hobbyist. Aseprite evangelist. Making a game about mushrooms.",
      handle: "pixelnova.bsky.social",
      joinedAt: timeAgoToDate("90d"),
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
    },
    {
      username: "genart_weaver",
      displayName: "Generative Weaver",
      initials: "gw",
      avatarBg: "oklch(55% 0.15 145)",
      avatarUrl: "https://i.pravatar.cc/200?u=genart_weaver",
      bio: "Algorithmic art historian and Processing sketcher. Researching the intersection of code and craft.",
      handle: "genweaver.bsky.social",
      joinedAt: timeAgoToDate("200d"),
      badges: [],
    },
    {
      username: "glitch_garden",
      displayName: "Glitch Garden",
      initials: "gg",
      avatarBg: "oklch(55% 0.2 350)",
      avatarUrl: "https://i.pravatar.cc/200?u=glitch_garden",
      bio: "Community moderator. Keeping the creative space welcoming and weird. DMs open for feedback.",
      handle: "glitchgarden.frontpage.fyi",
      joinedAt: timeAgoToDate("500d"),
      badges: [{ variant: "mod", icon: "Shield", label: "Mod" }],
    },
    {
      username: "arcadeking",
      displayName: "Arcade King",
      initials: "ak",
      avatarBg: "oklch(55% 0.2 350)",
      avatarUrl: "https://i.pravatar.cc/200?u=arcadeking",
      bannerUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&h=300&q=80",
      bio: "Game jam organiser and retro hardware collector. Running the weekly jam since 2024. CRT hoarder.",
      handle: "arcadeking.bsky.social",
      joinedAt: timeAgoToDate("300d"),
      badges: [],
    },
    {
      username: "8bit_betty",
      displayName: "8-Bit Betty",
      initials: "8b",
      avatarBg: "oklch(65% 0.18 80)",
      avatarUrl: "https://i.pravatar.cc/200?u=8bit_betty",
      bio: "Game Boy Camera photographer. Hot take machine. Making a zine about low-res aesthetics.",
      handle: "8bitbetty.bsky.social",
      joinedAt: timeAgoToDate("150d"),
      badges: [],
    },
    {
      username: "crt_enjoyer",
      displayName: "CRT Enjoyer",
      initials: "ct",
      avatarBg: "oklch(60% 0.15 200)",
      avatarUrl: "https://i.pravatar.cc/200?u=crt_enjoyer",
      bio: "Analogue video enthusiast. Restoring vintage monitors and building RGB mod guides.",
      handle: "crtfan.bsky.social",
      joinedAt: timeAgoToDate("120d"),
      badges: [],
    },
    {
      username: "greenthumb",
      displayName: "Green Thumb",
      initials: "gt",
      avatarBg: "oklch(55% 0.15 145)",
      avatarUrl: "https://i.pravatar.cc/200?u=greenthumb",
      bannerUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&h=300&q=80",
      bio: "Zone 7b gardener. Companion planting nerd. Growing enough tomatoes to feed the neighbourhood.",
      handle: "greenthumb.bsky.social",
      joinedAt: timeAgoToDate("250d"),
      badges: [],
    },
    {
      username: "lenscraft",
      displayName: "Lens Craft",
      initials: "lc",
      avatarBg: "oklch(55% 0.1 60)",
      avatarUrl: "https://i.pravatar.cc/200?u=lenscraft",
      bannerUrl: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=800&h=300&q=80",
      bio: "Landscape and astrophotographer. Chasing golden hour at abandoned places. Fujifilm X-T5 shooter.",
      handle: "lenscraft.bsky.social",
      joinedAt: timeAgoToDate("200d"),
      badges: [],
    },
    {
      username: "nightmode",
      displayName: "Night Mode",
      initials: "nm",
      avatarBg: "oklch(55% 0.15 300)",
      avatarUrl: "https://i.pravatar.cc/200?u=nightmode",
      bannerUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&h=300&q=80",
      bio: "Milky Way hunter. 45 stacked exposures is just the beginning. Building a star tracker from scratch.",
      handle: "nightmode.bsky.social",
      joinedAt: timeAgoToDate("180d"),
      badges: [],
    },
  ];

  const communities: CommunityData[] = [
    {
      id: "comm_home",
      name: "Frontpage",
      description: "The front page of the AT Protocol. A place for communities to share, discuss, and connect across the atmosphere.",
      icon: "/frontpage-logo.svg",
      banner: {
        name: "Frontpage",
        bannerImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&h=400&q=80",
        members: "28,920",
        online: 302,
        established: "Jan 2024",
      },
    },
    {
      id: "comm_creative",
      name: "Creative Coding",
      description: "Generative art, shaders, creative tools, and algorithmic experiments. Share your sketches, tutorials, and works in progress.",
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
      description: "Growing food, flowers, and community. Tips on companion planting, raised beds, composting, and everything from balcony pots to backyard plots.",
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
      description: "Classic consoles, CRT monitors, game jams, and pixel art. Celebrating the games and hardware that started it all.",
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
      description: "From golden hour landscapes to dark room experiments. Weekly challenges, gear talk, and constructive critique.",
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
      type: "image",
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
      type: "link",
      url: "https://generativeart.org/history-of-algorithmic-art",
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
      type: "video",
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
      type: "image",
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
      type: "image",
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
      votes: 567, commentCount: 12,
    },
    {
      id: "post_rg_2", communityId: "comm_retro",
      author: "crt_enjoyer", initials: "ct", avatarBg: "oklch(60% 0.15 200)",
      createdAt: timeAgoToDate("4h"),
      badges: [],
      type: "image",
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
      type: "image",
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
      type: "image",
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
      id: "cmt_4a", postId: "post_cc_1", parentId: "cmt_3",
      author: "pixelweaver", initials: "pw", avatarBg: "var(--color-indigo-600)",
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
      body: "Just pushed it to my GitHub \u2014 it\u2019s a .aseprite file with guide layers for 30/45/60 degree light angles. Drop it as the bottom layer in any tile and paint on top.",
      createdAt: timeAgoToDate("50m"), votes: 19,
    },
    {
      id: "cmt_4b", postId: "post_cc_1", parentId: "cmt_4a",
      author: "shader_wizard", initials: "sw", avatarBg: "oklch(50% 0.15 180)",
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      body: "This is perfect. Already imported it into my project. Quick question \u2014 do you lock the guide layer or keep it editable? I\u2019m worried about accidentally painting on it.",
      createdAt: timeAgoToDate("40m"), votes: 6,
    },
    {
      id: "cmt_4c", postId: "post_cc_1", parentId: "cmt_4b",
      author: "pixelweaver", initials: "pw", avatarBg: "var(--color-indigo-600)",
      badges: [],
      body: "Lock it! In Aseprite you can right-click the layer and hit Lock. I also set opacity to 20% so it\u2019s barely visible but still guides your hand.",
      createdAt: timeAgoToDate("35m"), votes: 11,
    },
    {
      id: "cmt_4d", postId: "post_cc_1", parentId: "cmt_4c",
      author: "genart_weaver", initials: "gw", avatarBg: "oklch(55% 0.15 145)",
      badges: [],
      body: "The 20% opacity tip is genius. I\u2019ve been toggling visibility on and off like a caveman this whole time.",
      createdAt: timeAgoToDate("28m"), votes: 8,
    },
    {
      id: "cmt_4e", postId: "post_cc_1", parentId: "cmt_4d",
      author: "8bit_betty", initials: "8b", avatarBg: "oklch(65% 0.18 80)",
      badges: [],
      body: "Same here lol. Someone should write up a proper Aseprite workflow post for iso art \u2014 there\u2019s so many little tricks like this that nobody talks about.",
      createdAt: timeAgoToDate("22m"), votes: 4,
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
      id: "cmt_10a", postId: "post_cc_1", parentId: "cmt_10",
      author: "pixelweaver", initials: "pw", avatarBg: "var(--color-indigo-600)",
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
      body: "Posted! The water colours are at indices 48-63 in the .pal. I basically took ENDESGA\u2019s existing blues and shifted them warmer with a touch more saturation for the shallows.",
      createdAt: timeAgoToDate("25m"), votes: 12,
    },
    {
      id: "cmt_10b", postId: "post_cc_1", parentId: "cmt_10a",
      author: "synthwave", initials: "sy", avatarBg: "oklch(60% 0.2 30)",
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      body: "The warm shift on the shallows is what makes it. Most iso water looks dead because people just use pure blue. Yours has that tropical reef energy.",
      createdAt: timeAgoToDate("18m"), votes: 7,
    },
    {
      id: "cmt_10c", postId: "post_cc_1", parentId: "cmt_10b",
      author: "pixel_nova", initials: "pn", avatarBg: "oklch(55% 0.18 310)",
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
      body: "Honestly this sub-thread alone has taught me more about colour theory than a semester of art school. Saving all of this.",
      createdAt: timeAgoToDate("12m"), votes: 15,
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

    // ── post_cc_2: GLSL tutorial ──
    {
      id: "cmt_20", postId: "post_cc_2", parentId: null,
      author: "pixelweaver", initials: "pw", avatarBg: "var(--color-indigo-600)",
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
      body: "This is the best shader tutorial I\u2019ve seen in years. The way you break down the column logic is so clear \u2014 I finally understand how the spacing works.",
      createdAt: timeAgoToDate("4h"), votes: 34,
    },
    {
      id: "cmt_21", postId: "post_cc_2", parentId: "cmt_20",
      author: "shader_wizard", initials: "sw", avatarBg: "oklch(50% 0.15 180)",
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      body: "Glad it clicked! The column spacing was actually the hardest part to explain. I rewrote that section three times before it felt right.",
      createdAt: timeAgoToDate("3h"), votes: 12,
    },
    {
      id: "cmt_22", postId: "post_cc_2", parentId: null,
      author: "genart_weaver", initials: "gw", avatarBg: "oklch(55% 0.15 145)",
      badges: [],
      body: "Any plans for a part 2? Would love to see how you\u2019d approach the trail fade effect \u2014 mine always looks too linear.",
      createdAt: timeAgoToDate("3h"), votes: 18,
    },
    {
      id: "cmt_23", postId: "post_cc_2", parentId: "cmt_22",
      author: "shader_wizard", initials: "sw", avatarBg: "oklch(50% 0.15 180)",
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      body: "Part 2 is already drafted! It covers the phosphor persistence and the trail fade. Should be up next week.",
      createdAt: timeAgoToDate("2h"), votes: 22,
    },
    {
      id: "cmt_24", postId: "post_cc_2", parentId: null,
      author: "synthwave", initials: "sy", avatarBg: "oklch(60% 0.2 30)",
      badges: [],
      body: "Tried this in my live stream last night. Chat went wild when the characters started falling. Great stuff.",
      createdAt: timeAgoToDate("2h"), votes: 9,
    },

    // ── post_cc_3: Algorithmic Art history ──
    {
      id: "cmt_30", postId: "post_cc_3", parentId: null,
      author: "shader_wizard", initials: "sw", avatarBg: "oklch(50% 0.15 180)",
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      body: "The Vera Moln\u00e1r section is beautifully written. She doesn\u2019t get nearly enough credit for how far ahead of her time she was.",
      createdAt: timeAgoToDate("7h"), votes: 28,
    },
    {
      id: "cmt_31", postId: "post_cc_3", parentId: "cmt_30",
      author: "genart_weaver", initials: "gw", avatarBg: "oklch(55% 0.15 145)",
      badges: [],
      body: "Agreed. Her \u201cMachine Imaginaire\u201d work from the 1970s could pass as a modern generative NFT drop. Timeless stuff.",
      createdAt: timeAgoToDate("6h"), votes: 15,
    },
    {
      id: "cmt_32", postId: "post_cc_3", parentId: null,
      author: "pixel_nova", initials: "pn", avatarBg: "oklch(55% 0.18 310)",
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
      body: "Bookmarking this for my students. I teach an intro to creative coding and finding good historical context is always hard.",
      createdAt: timeAgoToDate("5h"), votes: 19,
    },

    // ── post_cc_4: Live coding particle system ──
    {
      id: "cmt_40", postId: "post_cc_4", parentId: null,
      author: "pixelweaver", initials: "pw", avatarBg: "var(--color-indigo-600)",
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
      body: "Caught this live and it was incredible. The moment you added gravity and everything just *clicked* \u2014 the chat exploded.",
      createdAt: timeAgoToDate("11h"), votes: 45,
    },
    {
      id: "cmt_41", postId: "post_cc_4", parentId: "cmt_40",
      author: "synthwave", initials: "sy", avatarBg: "oklch(60% 0.2 30)",
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      body: "Ha yeah that was a good moment. Honestly I wasn\u2019t sure the verlet integration would work first try but sometimes you get lucky.",
      createdAt: timeAgoToDate("10h"), votes: 18,
    },
    {
      id: "cmt_42", postId: "post_cc_4", parentId: null,
      author: "genart_weaver", initials: "gw", avatarBg: "oklch(55% 0.15 145)",
      badges: [],
      body: "Is the VOD available anywhere? I missed the stream and the timestamp links aren\u2019t working for me.",
      createdAt: timeAgoToDate("9h"), votes: 7,
    },
    {
      id: "cmt_43", postId: "post_cc_4", parentId: "cmt_42",
      author: "synthwave", initials: "sy", avatarBg: "oklch(60% 0.2 30)",
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      body: "Yeah the VOD is up now \u2014 had to re-encode it. Should be on the channel page.",
      createdAt: timeAgoToDate("8h"), votes: 5,
    },
    {
      id: "cmt_44", postId: "post_cc_4", parentId: null,
      author: "shader_wizard", initials: "sw", avatarBg: "oklch(50% 0.15 180)",
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      body: "The way you debug live is really instructive. Most tutorials edit out the mistakes but watching you reason through the collision detection bug was the most useful part.",
      createdAt: timeAgoToDate("8h"), votes: 31,
    },

    // ── post_cc_5: Aseprite vs Pixelorama ──
    {
      id: "cmt_50", postId: "post_cc_5", parentId: null,
      author: "8bit_betty", initials: "8b", avatarBg: "oklch(65% 0.18 80)",
      badges: [],
      body: "I switched to Pixelorama six months ago and haven\u2019t looked back. The animation timeline is genuinely better now, and being open source means I can actually fix bugs myself.",
      createdAt: timeAgoToDate("22h"), votes: 21,
    },
    {
      id: "cmt_51", postId: "post_cc_5", parentId: "cmt_50",
      author: "pixelweaver", initials: "pw", avatarBg: "var(--color-indigo-600)",
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
      body: "The one thing keeping me on Aseprite is the scripting API. I have dozens of Lua scripts for batch operations that I\u2019d have to rewrite.",
      createdAt: timeAgoToDate("20h"), votes: 14,
    },
    {
      id: "cmt_52", postId: "post_cc_5", parentId: null,
      author: "synthwave", initials: "sy", avatarBg: "oklch(60% 0.2 30)",
      badges: [],
      body: "Hot take: LibreSprite (the Aseprite fork from before it went paid) is still perfectly fine for 90% of pixel art workflows.",
      createdAt: timeAgoToDate("18h"), votes: 8,
    },
    {
      id: "cmt_53", postId: "post_cc_5", parentId: "cmt_52",
      author: "pixel_nova", initials: "pn", avatarBg: "oklch(55% 0.18 310)",
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
      body: "LibreSprite hasn\u2019t had a release in over a year though. At some point the lack of updates starts to matter.",
      createdAt: timeAgoToDate("16h"), votes: 11,
    },

    // ── post_hg_1: Companion planting ──
    {
      id: "cmt_60", postId: "post_hg_1", parentId: null,
      author: "seedpacket", initials: "sp", avatarBg: "oklch(60% 0.12 60)",
      badges: [],
      body: "This is exactly what I needed. I have a 4x8 raised bed and I\u2019ve been winging the layout every year. The tomato-basil-marigold combo is genius.",
      createdAt: timeAgoToDate("1h"), votes: 24,
    },
    {
      id: "cmt_61", postId: "post_hg_1", parentId: "cmt_60",
      author: "greenthumb", initials: "gt", avatarBg: "oklch(55% 0.15 145)",
      badges: [],
      body: "The marigolds are key \u2014 they repel aphids and whiteflies. I plant them as a border around everything now.",
      createdAt: timeAgoToDate("1h"), votes: 16,
    },
    {
      id: "cmt_62", postId: "post_hg_1", parentId: null,
      author: "rootbound", initials: "rb", avatarBg: "oklch(50% 0.18 200)",
      badges: [],
      body: "One thing to add: don\u2019t plant fennel near anything. It\u2019s allelopathic and will stunt everything around it. Learned that the hard way.",
      createdAt: timeAgoToDate("1h"), votes: 33,
    },
    {
      id: "cmt_63", postId: "post_hg_1", parentId: "cmt_62",
      author: "seedpacket", initials: "sp", avatarBg: "oklch(60% 0.12 60)",
      badges: [],
      body: "Wait really? I was about to plant fennel right next to my peppers. You just saved my harvest.",
      createdAt: timeAgoToDate("45m"), votes: 8,
    },

    // ── post_hg_2: Tomato leaf curl ──
    {
      id: "cmt_70", postId: "post_hg_2", parentId: null,
      author: "greenthumb", initials: "gt", avatarBg: "oklch(55% 0.15 145)",
      badges: [],
      body: "Sounds like physiological leaf roll \u2014 super common in zone 7b when you get hot days followed by cool nights. It\u2019s cosmetic, the plant is fine.",
      createdAt: timeAgoToDate("4h"), votes: 38,
    },
    {
      id: "cmt_71", postId: "post_hg_2", parentId: "cmt_70",
      author: "seedpacket", initials: "sp", avatarBg: "oklch(60% 0.12 60)",
      badges: [],
      body: "Oh thank god. I was about to rip them all out and start over. So I just leave them alone?",
      createdAt: timeAgoToDate("3h"), votes: 5,
    },
    {
      id: "cmt_72", postId: "post_hg_2", parentId: "cmt_71",
      author: "greenthumb", initials: "gt", avatarBg: "oklch(55% 0.15 145)",
      badges: [],
      body: "Yep. Just make sure you\u2019re not overwatering. Every other day might be too much depending on your soil. Stick your finger 2 inches in \u2014 if it\u2019s still moist, skip the watering.",
      createdAt: timeAgoToDate("2h"), votes: 21,
    },
    {
      id: "cmt_73", postId: "post_hg_2", parentId: null,
      author: "rootbound", initials: "rb", avatarBg: "oklch(50% 0.18 200)",
      badges: [],
      body: "Could also be herbicide drift if anyone nearby sprayed their lawn recently. That causes a very similar curl pattern.",
      createdAt: timeAgoToDate("3h"), votes: 14,
    },

    // ── post_hg_3: Wicking bed IBC tote ──
    {
      id: "cmt_80", postId: "post_hg_3", parentId: null,
      author: "greenthumb", initials: "gt", avatarBg: "oklch(55% 0.15 145)",
      badges: [],
      body: "This is brilliant. How long does the reservoir last before you need to refill? I\u2019m gone for work 3\u20134 days at a time and that\u2019s my biggest concern.",
      createdAt: timeAgoToDate("7h"), votes: 29,
    },
    {
      id: "cmt_81", postId: "post_hg_3", parentId: "cmt_80",
      author: "rootbound", initials: "rb", avatarBg: "oklch(50% 0.18 200)",
      badges: [],
      body: "In peak summer about 5\u20136 days with a full IBC tote (275 gallons). In spring/fall I\u2019ve gone 2 weeks without refilling. It\u2019s honestly changed my whole approach to gardening.",
      createdAt: timeAgoToDate("6h"), votes: 22,
    },
    {
      id: "cmt_82", postId: "post_hg_3", parentId: null,
      author: "seedpacket", initials: "sp", avatarBg: "oklch(60% 0.12 60)",
      badges: [],
      body: "Where did you source the IBC tote? I\u2019ve seen them on marketplace but I\u2019m always worried about what was stored in them before.",
      createdAt: timeAgoToDate("5h"), votes: 11,
    },
    {
      id: "cmt_83", postId: "post_hg_3", parentId: "cmt_82",
      author: "rootbound", initials: "rb", avatarBg: "oklch(50% 0.18 200)",
      badges: [],
      body: "Food-grade only \u2014 look for ones that held juice concentrate or food-safe soap. The label should say \u201cUN31HA1\u201d for food grade. I got mine from a juice factory for $40.",
      createdAt: timeAgoToDate("4h"), votes: 19,
    },

    // ── post_rg_1: Weekend Game Jam ──
    {
      id: "cmt_90", postId: "post_rg_1", parentId: null,
      author: "crt_enjoyer", initials: "ct", avatarBg: "oklch(60% 0.15 200)",
      badges: [],
      body: "The \u201cone button\u201d constraint produced some of the most creative entries I\u2019ve seen. That rhythm game where you only tap to change lanes was so simple and so addictive.",
      createdAt: timeAgoToDate("45m"), votes: 42,
    },
    {
      id: "cmt_91", postId: "post_rg_1", parentId: "cmt_90",
      author: "arcadeking", initials: "ak", avatarBg: "oklch(55% 0.2 350)",
      badges: [],
      body: "Right? Constraints breed creativity. Next month\u2019s theme is \u201c64x64 resolution\u201d \u2014 should be another good one.",
      createdAt: timeAgoToDate("30m"), votes: 18,
    },
    {
      id: "cmt_90a", postId: "post_rg_1", parentId: "cmt_90",
      author: "pixel_nova", initials: "pn", avatarBg: "oklch(55% 0.18 310)",
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
      body: "The rhythm game was mine! I almost went with a snake clone but the lane-switching idea hit me at 2am on day one. Glad people liked it.",
      createdAt: timeAgoToDate("28m"), votes: 31,
    },
    {
      id: "cmt_90a1", postId: "post_rg_1", parentId: "cmt_90a",
      author: "crt_enjoyer", initials: "ct", avatarBg: "oklch(60% 0.15 200)",
      badges: [],
      body: "Wait that was YOU? @pixel_nova please tell me you\u2019re going to expand it into a full game. The music sync was perfect.",
      createdAt: timeAgoToDate("25m"), votes: 12,
    },
    {
      id: "cmt_90a2", postId: "post_rg_1", parentId: "cmt_90a",
      author: "arcadeking", initials: "ak", avatarBg: "oklch(55% 0.2 350)",
      badges: [],
      body: "It deserved top 3 honestly. The polish level for 48 hours was unreal.",
      createdAt: timeAgoToDate("24m"), votes: 8,
    },
    {
      id: "cmt_90b", postId: "post_rg_1", parentId: "cmt_90",
      author: "genart_weaver", initials: "gw", avatarBg: "oklch(55% 0.15 145)",
      badges: [],
      body: "I love one-button games as a design exercise. Forces you to think about timing and rhythm instead of input complexity. My favourite constraint jams are always the simplest.",
      createdAt: timeAgoToDate("22m"), votes: 14,
    },
    {
      id: "cmt_91a", postId: "post_rg_1", parentId: "cmt_91",
      author: "8bit_betty", initials: "8b", avatarBg: "oklch(65% 0.18 80)",
      badges: [],
      body: "64x64 is going to be amazing. Already sketching out tile ideas. Are we allowed to use sub-pixel rendering or is it strict 64x64?",
      createdAt: timeAgoToDate("26m"), votes: 7,
    },
    {
      id: "cmt_91b", postId: "post_rg_1", parentId: "cmt_91",
      author: "synthwave", initials: "sy", avatarBg: "oklch(60% 0.2 30)",
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      body: "Strict pixel grid please. Half the fun is working within the literal constraint. Sub-pixel defeats the purpose.",
      createdAt: timeAgoToDate("23m"), votes: 16,
    },
    {
      id: "cmt_91b1", postId: "post_rg_1", parentId: "cmt_91b",
      author: "arcadeking", initials: "ak", avatarBg: "oklch(55% 0.2 350)",
      badges: [],
      body: "Confirmed \u2014 strict 64x64 pixel grid. Output resolution can be whatever but the game world is 64x64. No sub-pixel cheating.",
      createdAt: timeAgoToDate("20m"), votes: 22,
    },
    {
      id: "cmt_92", postId: "post_rg_1", parentId: null,
      author: "8bit_betty", initials: "8b", avatarBg: "oklch(65% 0.18 80)",
      badges: [],
      body: "I submitted the platformer with the one-button dash mechanic. Didn\u2019t place but learned a ton about game feel in 48 hours.",
      createdAt: timeAgoToDate("30m"), votes: 15,
    },
    {
      id: "cmt_92a", postId: "post_rg_1", parentId: "cmt_92",
      author: "crt_enjoyer", initials: "ct", avatarBg: "oklch(60% 0.15 200)",
      badges: [],
      body: "Your dash mechanic was actually my favourite. The screen shake on impact was so satisfying \u2014 how did you get that right in only 48 hours?",
      createdAt: timeAgoToDate("25m"), votes: 8,
    },
    {
      id: "cmt_92b", postId: "post_rg_1", parentId: "cmt_92a",
      author: "8bit_betty", initials: "8b", avatarBg: "oklch(65% 0.18 80)",
      badges: [],
      body: "Honestly I stole the formula from Vlambeer\u2019s GDC talk on game feel. 3 frames of freeze, 4px random offset, done. Works every time.",
      createdAt: timeAgoToDate("20m"), votes: 22,
    },
    {
      id: "cmt_92c", postId: "post_rg_1", parentId: "cmt_92b",
      author: "arcadeking", initials: "ak", avatarBg: "oklch(55% 0.2 350)",
      badges: [],
      body: "That talk should be required watching for anyone doing jam games. The hitstop alone transforms everything.",
      createdAt: timeAgoToDate("15m"), votes: 14,
    },
    {
      id: "cmt_92d", postId: "post_rg_1", parentId: "cmt_92c",
      author: "8bit_betty", initials: "8b", avatarBg: "oklch(65% 0.18 80)",
      badges: [],
      body: "The other one that changed my life was the Jan Willem Nijman talk about screen shake. Same conference I think. Between those two talks you have 90% of game feel solved.",
      createdAt: timeAgoToDate("12m"), votes: 19,
    },
    {
      id: "cmt_92e", postId: "post_rg_1", parentId: "cmt_92d",
      author: "synthwave", initials: "sy", avatarBg: "oklch(60% 0.2 30)",
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      body: "That\u2019s the one where he literally just adds screen shake to a boring rectangle game and it becomes playable? I show that to every new dev I mentor.",
      createdAt: timeAgoToDate("10m"), votes: 11,
    },
    {
      id: "cmt_92f", postId: "post_rg_1", parentId: "cmt_92e",
      author: "crt_enjoyer", initials: "ct", avatarBg: "oklch(60% 0.15 200)",
      badges: [],
      body: "Someone needs to make a modern version of that talk with WebGPU examples. The principles are timeless but the tooling has changed so much.",
      createdAt: timeAgoToDate("8m"), votes: 7,
    },
    {
      id: "cmt_92g", postId: "post_rg_1", parentId: "cmt_92f",
      author: "shader_wizard", initials: "sw", avatarBg: "oklch(50% 0.15 180)",
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      body: "I\u2019ve actually been drafting something like this. Screen shake, hitstop, chromatic aberration on impact, camera lerp \u2014 all in a single WebGPU compute shader. @arcadeking @8bit_betty would people watch that?",
      createdAt: timeAgoToDate("6m"), votes: 28,
    },
    {
      id: "cmt_92h", postId: "post_rg_1", parentId: "cmt_92g",
      author: "arcadeking", initials: "ak", avatarBg: "oklch(55% 0.2 350)",
      badges: [],
      body: "Absolutely yes. Post it here when it\u2019s done, I\u2019ll pin it.",
      createdAt: timeAgoToDate("5m"), votes: 15,
    },
    {
      id: "cmt_92i", postId: "post_rg_1", parentId: "cmt_92h",
      author: "pixel_nova", initials: "pn", avatarBg: "oklch(55% 0.18 310)",
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
      body: "Can you include sprite squash and stretch too? That\u2019s the one I always get wrong. My characters look like they\u2019re made of concrete.",
      createdAt: timeAgoToDate("4m"), votes: 9,
    },
    {
      id: "cmt_92j", postId: "post_rg_1", parentId: "cmt_92i",
      author: "shader_wizard", initials: "sw", avatarBg: "oklch(50% 0.15 180)",
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      body: "Good shout \u2014 adding it to the outline. Squash/stretch is deceptively hard to get right because the timing curve matters more than the amount.",
      createdAt: timeAgoToDate("3m"), votes: 6,
    },
    {
      id: "cmt_92k", postId: "post_rg_1", parentId: "cmt_92j",
      author: "8bit_betty", initials: "8b", avatarBg: "oklch(65% 0.18 80)",
      badges: [],
      body: "This thread went from \u201cnice game jam\u201d to \u201csomeone is about to make the definitive game feel tutorial\u201d and I\u2019m here for it.",
      createdAt: timeAgoToDate("2m"), votes: 21,
    },
    {
      id: "cmt_93", postId: "post_rg_1", parentId: "cmt_91",
      author: "pixel_nova", initials: "pn", avatarBg: "oklch(55% 0.18 310)",
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
      body: "64x64 is brutal but I\u2019m in. Pixel art people have an unfair advantage at that resolution though \u2014 are 3D entries even possible?",
      createdAt: timeAgoToDate("22m"), votes: 9,
    },
    {
      id: "cmt_93a", postId: "post_rg_1", parentId: "cmt_93",
      author: "arcadeking", initials: "ak", avatarBg: "oklch(55% 0.2 350)",
      badges: [],
      body: "Absolutely \u2014 last time we did a resolution constraint someone rendered voxels at 32x32 and it looked amazing. The limitation IS the aesthetic.",
      createdAt: timeAgoToDate("18m"), votes: 11,
    },
    {
      id: "cmt_93b", postId: "post_rg_1", parentId: "cmt_93a",
      author: "synthwave", initials: "sy", avatarBg: "oklch(60% 0.2 30)",
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      body: "Voxels at low res is underrated. You get that Minecraft-meets-Atari vibe. I might actually enter this one.",
      createdAt: timeAgoToDate("10m"), votes: 6,
    },
    {
      id: "cmt_94", postId: "post_rg_1", parentId: null,
      author: "shader_wizard", initials: "sw", avatarBg: "oklch(50% 0.15 180)",
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      body: "Top 3 all deserved it. The tower defence with one-button placement rotation was such a clever interpretation. Did anyone record gameplay of the top entries?",
      createdAt: timeAgoToDate("25m"), votes: 27,
    },
    {
      id: "cmt_94a", postId: "post_rg_1", parentId: "cmt_94",
      author: "arcadeking", initials: "ak", avatarBg: "oklch(55% 0.2 350)",
      badges: [],
      body: "All three winners streamed their 48-hour process \u2014 VODs are linked in the results post. The tower defence dev\u2019s timelapse is especially wild to watch.",
      createdAt: timeAgoToDate("20m"), votes: 16,
    },

    // ── post_rg_2: Sony PVM thrift store ──
    {
      id: "cmt_100", postId: "post_rg_2", parentId: null,
      author: "arcadeking", initials: "ak", avatarBg: "oklch(55% 0.2 350)",
      badges: [],
      body: "Fifteen dollars?! I paid $400 for mine and I thought THAT was a deal. The retro CRT market has gone completely insane.",
      createdAt: timeAgoToDate("3h"), votes: 89,
    },
    {
      id: "cmt_101", postId: "post_rg_2", parentId: "cmt_100",
      author: "crt_enjoyer", initials: "ct", avatarBg: "oklch(60% 0.15 200)",
      badges: [],
      body: "I know, I couldn\u2019t believe it either. The thrift store had it labeled as \u201cold TV \u2014 works.\u201d They had no idea what they had.",
      createdAt: timeAgoToDate("2h"), votes: 45,
    },
    {
      id: "cmt_102", postId: "post_rg_2", parentId: null,
      author: "8bit_betty", initials: "8b", avatarBg: "oklch(65% 0.18 80)",
      badges: [],
      body: "The 20M4U is the sweet spot \u2014 600 TV lines, component input, and small enough to actually fit on a desk. Incredible find.",
      createdAt: timeAgoToDate("2h"), votes: 34,
    },
    {
      id: "cmt_103", postId: "post_rg_2", parentId: "cmt_102",
      author: "crt_enjoyer", initials: "ct", avatarBg: "oklch(60% 0.15 200)",
      badges: [],
      body: "Already hooked up my SNES. Chrono Trigger on a PVM is a religious experience.",
      createdAt: timeAgoToDate("1h"), votes: 52,
    },

    // ── post_rg_3: Game Boy Camera hot take ──
    {
      id: "cmt_110", postId: "post_rg_3", parentId: null,
      author: "arcadeking", initials: "ak", avatarBg: "oklch(55% 0.2 350)",
      badges: [],
      body: "I unironically agree. The limitations force you to think about every single pixel. Modern cameras give you too many decisions to make.",
      createdAt: timeAgoToDate("6h"), votes: 38,
    },
    {
      id: "cmt_111", postId: "post_rg_3", parentId: "cmt_110",
      author: "8bit_betty", initials: "8b", avatarBg: "oklch(65% 0.18 80)",
      badges: [],
      body: "Exactly. And the thermal prints have this ephemeral quality \u2014 they fade over time, which makes each one feel precious.",
      createdAt: timeAgoToDate("5h"), votes: 22,
    },
    {
      id: "cmt_112", postId: "post_rg_3", parentId: null,
      author: "crt_enjoyer", initials: "ct", avatarBg: "oklch(60% 0.15 200)",
      badges: [],
      body: "Counter-take: the Game Boy Camera is a toy and that\u2019s fine. Not everything needs to be elevated to High Art. It\u2019s fun precisely because it doesn\u2019t take itself seriously.",
      createdAt: timeAgoToDate("5h"), votes: 27,
    },
    {
      id: "cmt_113", postId: "post_rg_3", parentId: "cmt_112",
      author: "8bit_betty", initials: "8b", avatarBg: "oklch(65% 0.18 80)",
      badges: [],
      body: "Why can\u2019t it be both? The best art comes from play. That\u2019s literally what the Game Boy was designed for.",
      createdAt: timeAgoToDate("4h"), votes: 19,
    },

    // ── post_ph_1: Golden hour observatory ──
    {
      id: "cmt_120", postId: "post_ph_1", parentId: null,
      author: "darkroom_dan", initials: "df", avatarBg: "oklch(50% 0.12 200)",
      badges: [],
      body: "The way the light hits the dome is unreal. What lens were you shooting with? The flare control is immaculate.",
      createdAt: timeAgoToDate("3h"), votes: 35,
    },
    {
      id: "cmt_121", postId: "post_ph_1", parentId: "cmt_120",
      author: "lenscraft", initials: "lc", avatarBg: "oklch(55% 0.1 60)",
      badges: [],
      body: "Sigma 35mm f/1.4 Art. No filters, just waited for the exact right moment. Got there 2 hours early and just sat with the light.",
      createdAt: timeAgoToDate("2h"), votes: 21,
    },
    {
      id: "cmt_122", postId: "post_ph_1", parentId: null,
      author: "nightmode", initials: "nm", avatarBg: "oklch(55% 0.15 300)",
      badges: [],
      body: "Is this the Griffith observatory or somewhere else? The decay on the building is gorgeous \u2014 gives it so much character.",
      createdAt: timeAgoToDate("2h"), votes: 14,
    },
    {
      id: "cmt_123", postId: "post_ph_1", parentId: "cmt_122",
      author: "lenscraft", initials: "lc", avatarBg: "oklch(55% 0.1 60)",
      badges: [],
      body: "It\u2019s an abandoned one in rural New Mexico. Can\u2019t share the exact location but it\u2019s worth the drive if you\u2019re ever out that way.",
      createdAt: timeAgoToDate("1h"), votes: 18,
    },

    // ── post_ph_2: Weekly challenge Reflections ──
    {
      id: "cmt_130", postId: "post_ph_2", parentId: null,
      author: "lenscraft", initials: "lc", avatarBg: "oklch(55% 0.1 60)",
      badges: [],
      body: "Thanks for the shoutout! That puddle shot was pure luck honestly \u2014 it rained 5 minutes before sunset and I just happened to be standing in the right spot.",
      createdAt: timeAgoToDate("5h"), votes: 28,
    },
    {
      id: "cmt_131", postId: "post_ph_2", parentId: "cmt_130",
      author: "darkroom_dan", initials: "df", avatarBg: "oklch(50% 0.12 200)",
      badges: [],
      body: "Luck is just preparation meeting opportunity. You were there with the right lens at the right time \u2014 that\u2019s not an accident.",
      createdAt: timeAgoToDate("4h"), votes: 19,
    },
    {
      id: "cmt_132", postId: "post_ph_2", parentId: null,
      author: "nightmode", initials: "nm", avatarBg: "oklch(55% 0.15 300)",
      badges: [],
      body: "89 submissions is insane for a weekly challenge. This community has really grown. What\u2019s tomorrow\u2019s theme?",
      createdAt: timeAgoToDate("4h"), votes: 12,
    },
    {
      id: "cmt_133", postId: "post_ph_2", parentId: "cmt_132",
      author: "darkroom_dan", initials: "df", avatarBg: "oklch(50% 0.12 200)",
      badges: [],
      body: "Tomorrow\u2019s theme is \u201cNegative Space.\u201d Should be a fun one for the minimalists in here.",
      createdAt: timeAgoToDate("3h"), votes: 15,
    },

    // ── post_ph_3: Milky Way Death Valley ──
    {
      id: "cmt_140", postId: "post_ph_3", parentId: null,
      author: "lenscraft", initials: "lc", avatarBg: "oklch(55% 0.1 60)",
      badges: [],
      body: "45 stacked exposures. The dedication is insane. What was your total integration time? The noise floor on this is incredibly low.",
      createdAt: timeAgoToDate("9h"), votes: 67,
    },
    {
      id: "cmt_141", postId: "post_ph_3", parentId: "cmt_140",
      author: "nightmode", initials: "nm", avatarBg: "oklch(55% 0.15 300)",
      badges: [],
      body: "About 90 minutes total \u2014 each frame was 2 minutes at ISO 3200. Stacked in Sequator then graded in Lightroom. The Bortle 1 skies at Death Valley do most of the heavy lifting.",
      createdAt: timeAgoToDate("8h"), votes: 42,
    },
    {
      id: "cmt_142", postId: "post_ph_3", parentId: null,
      author: "darkroom_dan", initials: "df", avatarBg: "oklch(50% 0.12 200)",
      badges: [],
      body: "This makes me want to drive out to a dark sky site. What tracker are you using for 2-minute exposures?",
      createdAt: timeAgoToDate("7h"), votes: 23,
    },
    {
      id: "cmt_143", postId: "post_ph_3", parentId: "cmt_142",
      author: "nightmode", initials: "nm", avatarBg: "oklch(55% 0.15 300)",
      badges: [],
      body: "Star Adventurer GTi. It\u2019s portable enough to hike with and accurate enough for 2\u20133 minute exposures at 35mm. Can\u2019t recommend it enough for landscape astro.",
      createdAt: timeAgoToDate("6h"), votes: 31,
    },
  ];

  store.users = users;
  store.communities = communities;
  store.posts = posts;
  store.comments = comments;
  store.votes = [];
  store.saves = [];
  // Everyone starts fresh — discover communities to join them
  store.memberships = [];

  // Sync commentCount from actual comment data
  for (const post of store.posts) {
    post.commentCount = store.comments.filter((c) => c.postId === post.id).length;
  }
}

// Seed on first import
seed();

// ── Public read/write interface (used by server actions only) ──

export const db = {
  // Communities
  // Users
  getUser: (username: string) => store.users.find((u) => u.username === username),
  getTeamUsers: () => store.users.filter((u) =>
    ["will", "tim", "tom", "jake", "damien"].includes(u.username),
  ),
  getPostsByAuthor: (username: string) => store.posts.filter((p) => p.author === username),
  getCommentsByAuthor: (username: string) => store.comments.filter((c) => c.author === username),
  getCommunitiesForUser: (username: string) => {
    const communityIds = new Set(
      store.posts.filter((p) => p.author === username).map((p) => p.communityId),
    );
    return store.communities.filter((c) => communityIds.has(c.id));
  },
  getJoinedCommunities: (username: string) => {
    const ids = store.memberships
      .filter((m) => m.userId === username)
      .map((m) => m.communityId);
    return store.communities.filter((c) => ids.includes(c.id));
  },

  // Communities
  getCommunities: () => store.communities,
  getCommunity: (id: string) => store.communities.find((c) => c.id === id),

  // Posts
  getAllPosts: () => [...store.posts],
  getPostsByCommunity: (communityId: string) =>
    communityId === "comm_home"
      ? [...store.posts]
      : store.posts.filter((p) => p.communityId === communityId),
  getPost: (id: string) => store.posts.find((p) => p.id === id),

  // Comments (flat — caller builds the tree)
  getCommentsByPost: (postId: string) =>
    store.comments.filter((c) => c.postId === postId),
  getCommentVotes: (commentId: string): number => {
    const comment = store.comments.find((c) => c.id === commentId);
    return comment?.votes ?? 0;
  },
  addPost: (post: PostData) => {
    store.posts.unshift(post);
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
  getSavedPosts: (userId: string) => {
    const postIds = store.saves.filter((s) => s.userId === userId).map((s) => s.postId);
    return store.posts.filter((p) => postIds.includes(p.id));
  },
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
