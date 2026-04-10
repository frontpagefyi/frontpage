"use client";

import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/badge";
import { FeedSort } from "@/components/feed-sort";

export function ComponentShowcase() {
  return (
    <div className="space-y-8">
      {/* Avatars */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-text-secondary">Avatars</h3>
        <div className="flex items-center gap-3">
          <Avatar initials="WC" bg="oklch(55% 0.2 280)" size={40} />
          <Avatar initials="AK" bg="oklch(72% 0.19 150)" size={32} />
          <Avatar initials="JD" bg="oklch(75% 0.18 75)" size={24} />
          <Avatar initials="MR" bg="oklch(60% 0.27 25)" size={20} />
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-text-secondary">Badges</h3>
        <div className="flex items-center gap-3">
          <Badge variant="artist" label="Artist" />
          <Badge variant="og" label="OG" />
          <Badge variant="live" label="Live" />
          <Badge variant="mod" label="Mod" />
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-text-secondary">
          Feed Sort
        </h3>
        <FeedSort value="hot" onChange={() => {}} />
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-text-secondary">Buttons</h3>
        <div className="flex items-center gap-3">
          <button className="bg-accent-secondary text-white rounded-lg px-4 py-2 text-sm font-semibold">
            Primary Action
          </button>
          <button className="bg-bg-elevated text-text-secondary rounded-lg px-4 py-2 text-sm font-semibold">
            Secondary Action
          </button>
        </div>
      </div>
    </div>
  );
}
