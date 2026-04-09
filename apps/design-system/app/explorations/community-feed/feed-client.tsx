"use client";

import { useState, useMemo, useTransition } from "react";
import { Users, Clock, PenLine } from "lucide-react";
import { Sidebar, MobileHeader } from "@/components/sidebar";
import { ContentTabs } from "@/components/content-tabs";
import { FeedSort } from "@/components/feed-sort";
import { FeedPost } from "@/components/feed-post";
import { ThreadView } from "@/components/thread-view";
import { themeToStyle } from "@/lib/theme";
import {
  getPostsByCommunity,
} from "@/lib/actions/posts";
import {
  toggleJoin as toggleJoinAction,
} from "@/lib/actions/communities";
import type { Post, CommunityTheme, CommunityBanner } from "@/lib/types";

type SortKey = "hot" | "new" | "top";
type MobileTab = "posts" | "atmo" | "wiki";

/** Community shape the client needs (no raw DB types). */
export interface ClientCommunity {
  id: string;
  name: string;
  icon?: string;
  theme?: CommunityTheme;
  banner: CommunityBanner;
}

interface FeedClientProps {
  communities: ClientCommunity[];
  initialPosts: Post[];
}

function parseTime(t: string): number {
  const m = t.match(/(\d+)(m|h|d)/);
  if (!m) return 0;
  const n = parseInt(m[1]);
  if (m[2] === "m") return n;
  if (m[2] === "h") return n * 60;
  return n * 1440;
}

function sortPosts(posts: Post[], sort: SortKey): Post[] {
  const sorted = [...posts];
  switch (sort) {
    case "hot":
      return sorted.sort((a, b) => {
        const va = typeof a.votes === "number" ? a.votes : parseInt(a.votes as string) || 0;
        const vb = typeof b.votes === "number" ? b.votes : parseInt(b.votes as string) || 0;
        return vb / (1 + parseTime(b.time) / 60) - va / (1 + parseTime(a.time) / 60);
      });
    case "new":
      return sorted.sort((a, b) => parseTime(a.time) - parseTime(b.time));
    case "top":
      return sorted.sort((a, b) => {
        const va = typeof a.votes === "number" ? a.votes : parseInt(a.votes as string) || 0;
        const vb = typeof b.votes === "number" ? b.votes : parseInt(b.votes as string) || 0;
        return vb - va;
      });
  }
}

export function FeedClient({ communities, initialPosts }: FeedClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("hot");
  const [joinedSet, setJoinedSet] = useState<Set<string>>(new Set());
  const [mobileTab, setMobileTab] = useState<MobileTab>("posts");
  const [feedKey, setFeedKey] = useState(0);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [, startTransition] = useTransition();

  const community = communities[activeIndex];
  const isJoined = joinedSet.has(community.id);

  const sidebarCommunities = communities.map((c, i) => ({
    name: c.name,
    icon: c.icon,
    active: i === activeIndex,
  }));

  const sorted = useMemo(() => sortPosts(posts, sortKey), [posts, sortKey]);

  const handleCommunityClick = (i: number) => {
    setActiveIndex(i);
    setSortKey("hot");
    setMobileTab("posts");
    setSelectedPost(null);
    setFeedKey((k) => k + 1);
    // Fetch posts for the new community
    startTransition(async () => {
      const newPosts = await getPostsByCommunity(communities[i].id);
      setPosts(newPosts);
    });
  };

  const handleSort = (key: SortKey) => {
    setSortKey(key);
    setFeedKey((k) => k + 1);
  };

  const handleJoinToggle = () => {
    startTransition(async () => {
      const joined = await toggleJoinAction(community.id);
      setJoinedSet((prev) => {
        const next = new Set(prev);
        if (joined) next.add(community.id);
        else next.delete(community.id);
        return next;
      });
    });
  };

  const themeStyle = themeToStyle(community.theme);

  return (
    <div className="flex h-dvh overflow-hidden bg-bg-base text-text-primary" style={themeStyle}>
      <Sidebar
        communities={sidebarCommunities}
        posts={posts}
        onCommunityClick={handleCommunityClick}
        onMobileTab={(tab) => setMobileTab(tab as MobileTab)}
      />

      <main className="relative flex-1 overflow-y-auto pb-20 md:pb-0">
        {/* ── Thread View ── */}
        {selectedPost ? (
          <>
            <div className="md:hidden">
              <ThreadView
                post={selectedPost}
                communityName={community.name}
                onBack={() => setSelectedPost(null)}
              />
            </div>
            <div className="hidden md:block">
              <Banner community={community} />
              <ThreadView
                post={selectedPost}
                communityName={community.name}
                onBack={() => setSelectedPost(null)}
              />
            </div>
          </>
        ) : (
          <>
            {/* ── Mobile ── */}
            <MobileHeader
              communityName={community.name}
              communityIcon={community.icon}
              bannerImage={community.banner.bannerImage}
              joined={isJoined}
              onJoinToggle={handleJoinToggle}
            >
              {mobileTab === "posts" ? (
                <FeedSort value={sortKey} onChange={handleSort} />
              ) : (
                <button
                  onClick={() => setMobileTab("posts")}
                  className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  ← Back to posts
                </button>
              )}
            </MobileHeader>

            <div className="md:hidden">
              {mobileTab === "posts" ? (
                <div key={feedKey} className="px-4 py-4 space-y-4">
                  {sorted.map((post, i) => (
                    <FeedPost
                      key={`${post.author}-${post.title}`}
                      post={post}
                      onCommentClick={() => setSelectedPost(post)}
                      style={{
                        animation: `post-enter 0.6s cubic-bezier(0, 0, 0.2, 1) ${i * 0.12}s both`,
                      }}
                    />
                  ))}
                </div>
              ) : mobileTab === "atmo" ? (
                <div className="px-4 py-4 animate-fade-in">
                  <div className="rounded-xl bg-bg-surface border border-bg-elevated p-6">
                    <p className="text-sm text-text-muted">
                      Atmosphere feed for {community.name}. Bluesky posts,
                      WhiteWind articles, and Smoke Signal events from the
                      community would appear here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-4 animate-fade-in">
                  <div className="rounded-xl bg-bg-surface border border-bg-elevated p-6 space-y-4">
                    <h3 className="font-serif text-lg font-semibold">
                      About {community.name}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      Community wiki and information would appear here, including
                      rules, resources, moderators, and tags.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Desktop ── */}
            <div className="hidden md:block">
              <Banner community={community} />
              <div className="max-w-2xl mx-auto px-4 py-6">
                <ContentTabs sortKey={sortKey} onSortChange={handleSort}>
                  {{
                    posts: (
                      <div key={feedKey} className="space-y-4">
                        {sorted.map((post, i) => (
                          <FeedPost
                            key={`${post.author}-${post.title}`}
                            post={post}
                            onCommentClick={() => setSelectedPost(post)}
                            style={{
                              animation: `post-enter 0.6s cubic-bezier(0, 0, 0.2, 1) ${i * 0.12}s both`,
                            }}
                          />
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
            </div>
          </>
        )}

        {/* New Post FAB */}
        {!selectedPost ? (
          <button
            className="fixed bottom-6 right-6 md:absolute md:bottom-6 md:right-6 z-30 flex items-center gap-2 px-4 py-3 rounded-full bg-accent-primary text-white text-sm font-medium shadow-lg hover:brightness-110 active:scale-95 transition-all"
            aria-label="New post"
          >
            <PenLine size={18} />
            <span className="hidden sm:inline">New Post</span>
          </button>
        ) : null}
      </main>
    </div>
  );
}

/** Banner sub-component to avoid duplication. */
function Banner({ community }: { community: ClientCommunity }) {
  return (
    <div className="relative h-48 overflow-hidden">
      {community.banner.bannerImage ? (
        <img
          src={community.banner.bannerImage}
          alt={community.banner.name}
          className="w-full h-full object-cover"
        />
      ) : null}
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
  );
}
