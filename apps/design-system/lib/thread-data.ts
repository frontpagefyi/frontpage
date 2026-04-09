import type { Comment } from "@/lib/types";

/** Sample comments keyed by post title. Posts without an entry get a generic set. */
const commentsByPost: Record<string, Comment[]> = {
  "Just finished this isometric city \u2014 6 months of pixel work": [
    {
      id: "c1",
      author: "shader_wizard",
      initials: "sw",
      avatarBg: "oklch(50% 0.15 180)",
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      body: "This is absolutely incredible. The shadow consistency across 12 tile sheets is insane \u2014 I can barely keep it straight across 3. Did you use any kind of reference grid overlay or was it all by eye?",
      time: "2h ago",
      votes: 23,
      replies: [
        {
          id: "c1-1",
          author: "pixelweaver",
          initials: "pw",
          avatarBg: "var(--color-indigo-600)",
          badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
          body: "Thanks! I built a shadow template in the first week \u2014 basically a 45-degree line tool that I\u2019d overlay on each tile before shading. Took a while to set up but saved me hundreds of hours in the long run.",
          time: "2h ago",
          votes: 15,
          replies: [
            {
              id: "c1-1-1",
              author: "shader_wizard",
              initials: "sw",
              avatarBg: "oklch(50% 0.15 180)",
              body: "That\u2019s genius. Would you consider sharing the template? I\u2019m starting an iso project and this would be a game changer.",
              time: "1h ago",
              votes: 8,
            },
            {
              id: "c1-1-2",
              author: "genart_weaver",
              initials: "gw",
              avatarBg: "oklch(55% 0.15 145)",
              body: "Seconding this \u2014 a proper shadow template would be incredibly useful for the community.",
              time: "45m ago",
              votes: 5,
            },
          ],
        },
      ],
    },
    {
      id: "c2",
      author: "synthwave",
      initials: "sy",
      avatarBg: "oklch(60% 0.2 30)",
      badges: [{ variant: "og", icon: "Star", label: "OG" }],
      body: "The attention to detail is wild. I zoomed in on the market district and every stall has different goods. How do you stay motivated on something this long?",
      time: "2h ago",
      votes: 19,
      replies: [
        {
          id: "c2-1",
          author: "pixelweaver",
          initials: "pw",
          avatarBg: "var(--color-indigo-600)",
          badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
          body: "Honestly? I almost quit at month 4. The trick was streaming \u2014 having people watch while I worked made me accountable. Also breaking it into districts helped. Each district felt like a mini-project with its own finish line.",
          time: "1h ago",
          votes: 31,
          replies: [
            {
              id: "c2-1-1",
              author: "pixel_nova",
              initials: "pn",
              avatarBg: "oklch(55% 0.18 310)",
              badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
              body: "The district approach is smart. I\u2019ve been doing something similar with my sprite sheets \u2014 treating each character as a self-contained project rather than part of a massive set.",
              time: "50m ago",
              votes: 7,
            },
          ],
        },
      ],
    },
    {
      id: "c3",
      author: "pixel_nova",
      initials: "pn",
      avatarBg: "oklch(55% 0.18 310)",
      badges: [{ variant: "artist", icon: "Sparkles", label: "Artist" }],
      body: "What resolution are the individual tiles? And did you use a specific palette or roll your own?",
      time: "1h ago",
      votes: 11,
      replies: [
        {
          id: "c3-1",
          author: "pixelweaver",
          initials: "pw",
          avatarBg: "var(--color-indigo-600)",
          body: "Each tile is 64x32 (standard iso diamond). The palette is a modified version of ENDESGA-64 with about 20 extra colours I added for the sky gradients and water reflections. I\u2019ll post the .pal file if there\u2019s interest.",
          time: "45m ago",
          votes: 14,
          replies: [
            {
              id: "c3-1-1",
              author: "8bit_betty",
              initials: "8b",
              avatarBg: "oklch(65% 0.18 80)",
              body: "Please do! ENDESGA-64 is already my go-to but those water colours look incredible.",
              time: "30m ago",
              votes: 4,
            },
          ],
        },
      ],
    },
    {
      id: "c4",
      author: "glitch_garden",
      initials: "gg",
      avatarBg: "oklch(55% 0.2 350)",
      badges: [{ variant: "mod", icon: "Shield", label: "Mod" }],
      body: "Pinning this to the community showcase. This is exactly the kind of long-form dedication we love seeing here. Congrats on shipping it.",
      time: "30m ago",
      votes: 42,
    },
    {
      id: "c5",
      author: "arcadeking",
      initials: "ak",
      avatarBg: "oklch(55% 0.2 350)",
      body: "Any chance you\u2019d make this available as a tileset? Would love to use some of these buildings in a game jam project (with credit obviously).",
      time: "20m ago",
      votes: 9,
    },
  ],
};

/** Generic fallback comments for posts without specific thread data. */
const fallbackComments: Comment[] = [
  {
    id: "f1",
    author: "synthwave",
    initials: "sy",
    avatarBg: "oklch(60% 0.2 30)",
    badges: [{ variant: "og", icon: "Star", label: "OG" }],
    body: "Great post! Really interesting perspective. I\u2019d love to hear more about how you approached this.",
    time: "1h ago",
    votes: 12,
    replies: [
      {
        id: "f1-1",
        author: "pixel_nova",
        initials: "pn",
        avatarBg: "oklch(55% 0.18 310)",
        body: "Agreed, the level of detail here is impressive. Would be great to see a follow-up.",
        time: "45m ago",
        votes: 5,
      },
    ],
  },
  {
    id: "f2",
    author: "genart_weaver",
    initials: "gw",
    avatarBg: "oklch(55% 0.15 145)",
    body: "This is the kind of content that makes this community special. Bookmarked for later.",
    time: "30m ago",
    votes: 8,
  },
  {
    id: "f3",
    author: "glitch_garden",
    initials: "gg",
    avatarBg: "oklch(55% 0.2 350)",
    badges: [{ variant: "mod", icon: "Shield", label: "Mod" }],
    body: "Quality post. Added to the community highlights.",
    time: "15m ago",
    votes: 18,
  },
];

export function getCommentsForPost(postTitle: string): Comment[] {
  return commentsByPost[postTitle] ?? fallbackComments;
}
