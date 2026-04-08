"use client";

import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/badge";
import { FeedPost } from "@/components/feed-post";
import { FeedSort } from "@/components/feed-sort";
import type { Post } from "@/lib/types";

const samplePost: Post = {
  author: "alice_designs",
  initials: "AD",
  avatarBg: "linear-gradient(135deg, oklch(64.78% 0.1472 259), oklch(75% 0.18 75))",
  time: "3h ago",
  badges: [{ variant: "artist", label: "Artist", icon: "Palette" }],
  title: "Exploring OKLCH color spaces for design systems",
  body: "OKLCH provides perceptually uniform color manipulation, making it ideal for generating accessible and harmonious palettes across light and dark themes.",
  votes: 128,
  comments: 24,
};

export default function Home() {
  return (
    <main className="p-8 max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Frontpage Design System</h1>

      {/* Token swatches */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Color Tokens</h2>
        <div className="grid grid-cols-5 gap-4">
          {["bg-base", "bg-surface", "bg-elevated", "bg-overlay", "bg-interactive"].map(
            (name) => (
              <div key={name} className="space-y-2">
                <div
                  className="h-16 rounded-lg border border-bg-elevated"
                  style={{ background: `var(--color-${name})` }}
                />
                <p className="text-xs text-text-muted">{name}</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Avatars */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Avatars</h2>
        <div className="flex items-center gap-3">
          <Avatar initials="WC" bg="oklch(64.78% 0.1472 259)" size={40} />
          <Avatar initials="AD" bg="oklch(55% 0.2 280)" size={32} />
          <Avatar initials="JM" bg="oklch(72% 0.19 150)" size={24} />
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Badges</h2>
        <div className="flex items-center gap-2">
          <Badge variant="artist" label="Artist" icon="Palette" />
          <Badge variant="og" label="OG" icon="Star" />
          <Badge variant="live" label="Live" />
          <Badge variant="mod" label="Mod" />
        </div>
      </section>

      {/* FeedSort */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Feed Sort</h2>
        <FeedSort />
      </section>

      {/* FeedPost */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Feed Post</h2>
        <FeedPost post={samplePost} />
      </section>
    </main>
  );
}
