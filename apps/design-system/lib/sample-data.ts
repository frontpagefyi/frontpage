import type { Community } from "@/lib/types";

export const communities: Community[] = [
  // Creative Coding — default dark theme
  {
    name: "Creative Coding",
    icon: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=56&h=56&q=80",
    banner: {
      name: "Creative Coding",
      bannerImage:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=400&q=80",
      members: "2,847",
      online: 134,
      established: "Jan 2025",
    },
    posts: [
      {
        author: "pixelweaver",
        initials: "pw",
        avatarBg: "var(--color-indigo-600)",
        time: "3h ago",
        badges: [{ variant: "artist", icon: "Palette", label: "Artist" }],
        title: "Just finished this isometric city \u2014 6 months of pixel work",
        image:
          "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=800&h=400&q=80",
        votes: 48,
        comments: 94,
      },
      {
        author: "shader_wizard",
        initials: "sw",
        avatarBg: "oklch(50% 0.15 180)",
        time: "5h ago",
        badges: [{ variant: "og", icon: "Crown", label: "OG" }],
        title: "New GLSL tutorial: Recreating The Matrix Code effect",
        body: "Step-by-step breakdown of how to create the iconic falling characters effect using fragment shaders. Covers the column setup, randomized character selection, and that signature green phosphor glow. Full source on GitHub.",
        votes: 142,
        comments: 47,
      },
      {
        author: "genart_weaver",
        initials: "gw",
        avatarBg: "oklch(55% 0.15 145)",
        time: "8h ago",
        title:
          "A History of Algorithmic Art \u2014 deep dive into generative origins",
        linkPreview: {
          image:
            "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=200&h=140&q=80",
          title:
            "From Vera Moln\u00e1r to Processing: How algorithms became art",
          domain: "generativeart.org",
        },
        votes: 76,
        comments: 23,
      },
      {
        author: "synthwave",
        initials: "sy",
        avatarBg: "oklch(60% 0.2 30)",
        time: "12h ago",
        badges: [
          { variant: "og", icon: "Crown", label: "OG" },
          { variant: "live", icon: "Radio", label: "Live" },
        ],
        title: "Live coding session: building a particle system from scratch",
        video: {
          thumbnail:
            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&h=400&q=80",
        },
        votes: 203,
        comments: 67,
      },
      {
        author: "pixel_nova",
        initials: "pn",
        avatarBg: "oklch(55% 0.18 310)",
        time: "1d ago",
        badges: [{ variant: "artist", icon: "Palette", label: "Artist" }],
        title:
          "What\u2019s everyone using for pixel art these days? Aseprite vs Pixelorama?",
        body: "I\u2019ve been using Aseprite forever but Pixelorama is looking really good lately. It\u2019s open source and the animation timeline has gotten way better. Anyone made the switch?",
        votes: 34,
        comments: 89,
      },
    ],
  },

  // Home Gardening — light theme
  {
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
      bannerImage:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&h=400&q=80",
      members: "4,812",
      online: 23,
      established: "Mar 2024",
    },
    posts: [
      {
        author: "greenthumb",
        initials: "gt",
        avatarBg: "oklch(55% 0.15 145)",
        time: "2h ago",
        title: "Companion planting guide for small raised beds",
        image:
          "https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=800&h=400&q=80",
        votes: 312,
        comments: 67,
      },
      {
        author: "seedpacket",
        initials: "sp",
        avatarBg: "oklch(60% 0.12 60)",
        time: "5h ago",
        title:
          "What\u2019s wrong with my tomatoes? Leaves are curling inward",
        body: "First time growing tomatoes in zone 7b. The lower leaves are fine but the top growth is curling like crazy. Watering every other day, full sun. Already checked for aphids \u2014 nothing. Help?",
        votes: 89,
        comments: 42,
      },
      {
        author: "rootbound",
        initials: "rb",
        avatarBg: "oklch(50% 0.18 200)",
        time: "8h ago",
        title: "Built a self-watering wicking bed from an old IBC tote",
        image:
          "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&h=400&q=80",
        votes: 458,
        comments: 93,
      },
    ],
  },

  // Retro Gaming — dark magenta theme
  {
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
      bannerImage:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&h=400&q=80",
      members: "12,340",
      online: 89,
      established: "Jan 2025",
    },
    posts: [
      {
        author: "arcadeking",
        initials: "ak",
        avatarBg: "oklch(55% 0.2 350)",
        time: "1h ago",
        title: "Weekend Game Jam results are in \u2014 47 entries!",
        body: "Huge turnout this week. The theme was \u201cone button\u201d and people went wild. Top 3 all built completely different games with the same constraint. Check out the submissions thread and vote for your favourites.",
        votes: 567,
        comments: 134,
      },
      {
        author: "crt_enjoyer",
        initials: "ct",
        avatarBg: "oklch(60% 0.15 200)",
        time: "4h ago",
        title: "Found a Sony PVM-20M4U at a thrift store for $15",
        image:
          "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&h=400&q=80",
        votes: "1.2k",
        comments: 203,
      },
      {
        author: "8bit_betty",
        initials: "8b",
        avatarBg: "oklch(65% 0.18 80)",
        time: "7h ago",
        title: "Hot take: the Game Boy Camera is the best camera ever made",
        body: "The 128x112 resolution, the 4 shades of green, the absurd thermal printer \u2014 it forces you to think about composition in a way no modern camera does. Every shot is a deliberate creative choice. Fight me.",
        votes: 234,
        comments: 156,
      },
    ],
  },

  // Photography — warm amber theme
  {
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
      bannerImage:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=400&q=80",
      members: "8,921",
      online: 56,
      established: "Feb 2025",
    },
    posts: [
      {
        author: "lenscraft",
        initials: "lc",
        avatarBg: "oklch(55% 0.1 60)",
        time: "4h ago",
        title: "Golden hour at the abandoned observatory",
        image:
          "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=800&h=400&q=80",
        votes: 743,
        comments: 94,
      },
      {
        author: "darkroom_dan",
        initials: "df",
        avatarBg: "oklch(50% 0.12 200)",
        time: "6h ago",
        title: "Weekly challenge results: \u201cReflections\u201d",
        body: "Another incredible week. 89 submissions and the quality keeps going up. Winner is @lenscraft with that puddle shot downtown \u2014 the symmetry is unreal. New challenge drops tomorrow.",
        votes: 312,
        comments: 67,
      },
      {
        author: "nightmode",
        initials: "nm",
        avatarBg: "oklch(55% 0.15 300)",
        time: "10h ago",
        title: "Milky Way over Death Valley \u2014 45 stacked exposures",
        image:
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&h=400&q=80",
        votes: "1.8k",
        comments: 187,
      },
    ],
  },
];
