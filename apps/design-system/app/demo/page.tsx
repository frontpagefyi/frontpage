"use client";

import { useState } from "react";
import { Users, Clock } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { ContentTabs } from "@/components/content-tabs";
import { FeedPost } from "@/components/feed-post";
import { communities } from "@/lib/sample-data";

export default function DemoPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const community = communities[activeIndex];

  const sidebarCommunities = communities.map((c, i) => ({
    name: c.name,
    icon: c.icon,
    active: i === activeIndex,
  }));

  // Apply community theme as inline CSS variables
  const themeStyle = community.theme
    ? (Object.entries(community.theme).reduce(
        (acc, [key, value]) => {
          // Map theme keys like "--bg-base" to CSS custom properties "--color-bg-base"
          const cssVar = key.replace("--", "--color-");
          acc[cssVar] = value;
          return acc;
        },
        {} as Record<string, string>,
      ) as React.CSSProperties)
    : undefined;

  return (
    <div className="flex h-dvh overflow-hidden" style={themeStyle}>
      <Sidebar
        communities={sidebarCommunities}
        onCommunityClick={setActiveIndex}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Banner */}
        <div className="relative h-48 overflow-hidden">
          {community.banner.bannerImage && (
            <img
              src={community.banner.bannerImage}
              alt={community.banner.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base/90 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <h1 className="text-2xl font-serif font-bold text-text-primary">
              {community.banner.name}
            </h1>
            <div className="flex items-center gap-4 text-xs text-text-muted mt-1">
              <span className="flex items-center gap-1">
                <Users size={12} /> {community.banner.members} members
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-accent-success inline-block" />
                {community.banner.online} online
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> Est. {community.banner.established}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-4 py-6">
          <ContentTabs>
            {{
              posts: (
                <div className="space-y-4">
                  {community.posts.map((post) => (
                    <FeedPost key={post.title} post={post} />
                  ))}
                </div>
              ),
              atmo: (
                <div className="rounded-xl bg-bg-surface border border-bg-elevated p-6">
                  <p className="text-sm text-text-muted">
                    Atmosphere feed for {community.name}. Bluesky posts,
                    WhiteWind articles, and Smoke Signal events from the
                    community would appear here.
                  </p>
                </div>
              ),
              wiki: (
                <div className="rounded-xl bg-bg-surface border border-bg-elevated p-6 space-y-4">
                  <h3 className="font-serif text-lg font-semibold">
                    About {community.name}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Community wiki and information would appear here, including
                    rules, resources, moderators, and tags.
                  </p>
                </div>
              ),
            }}
          </ContentTabs>
        </div>
      </main>
    </div>
  );
}
