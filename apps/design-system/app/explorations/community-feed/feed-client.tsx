"use client";

import { useState, useMemo, useTransition, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { Users, Clock, PenLine } from "lucide-react";
import { Sidebar, MobileHeader } from "@/components/sidebar";
import { ContentTabs } from "@/components/content-tabs";
import { FeedSort } from "@/components/feed-sort";
import { FeedPost } from "@/components/feed-post";
import { ThreadView } from "@/components/thread-view";
import { themeToStyle } from "@/lib/theme";
import {
  getPostsByCommunity,
  getThread,
} from "@/lib/actions/posts";
import {
  toggleJoin as toggleJoinAction,
} from "@/lib/actions/communities";
import type { Post, Comment, CommunityTheme, CommunityBanner } from "@/lib/types";

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
  initialIndex?: number;
  initialPostId?: string;
  initialComments?: Comment[];
  initialSort?: SortKey;
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
        const va = a.votes;
        const vb = b.votes;
        return vb / (1 + parseTime(b.time) / 60) - va / (1 + parseTime(a.time) / 60);
      });
    case "new":
      return sorted.sort((a, b) => parseTime(a.time) - parseTime(b.time));
    case "top":
      return sorted.sort((a, b) => {
        const va = a.votes;
        const vb = b.votes;
        return vb - va;
      });
  }
}

export function FeedClient({ communities, initialPosts, initialIndex = 0, initialPostId, initialComments = [], initialSort = "hot" }: FeedClientProps) {
  const [activeIndex, _setActiveIndex] = useState(initialIndex);
  const activeIndexRef = useRef(initialIndex);
  const setActiveIndex = useCallback((i: number) => { _setActiveIndex(i); activeIndexRef.current = i; }, []);
  const [sortKey, setSortKey] = useState<SortKey>(initialSort);
  const [joinedSet, setJoinedSet] = useState<Set<string>>(new Set());
  const [mobileTab, setMobileTab] = useState<MobileTab>("posts");
  const [feedKey, setFeedKey] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(
    initialPostId ? initialPosts.find((p) => p.id === initialPostId) ?? null : null,
  );
  const [selectedComments, setSelectedComments] = useState<Comment[]>(initialComments);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [, startTransition] = useTransition();

  const scrollRef = useRef(0);
  const mainRef = useRef<HTMLElement>(null);

  // Build URL from current state
  const buildUrl = useCallback((communityId: string, postId?: string | null) => {
    const url = new URL(window.location.href);
    url.searchParams.set("community", communityId);
    if (postId) {
      url.searchParams.set("post", postId);
    } else {
      url.searchParams.delete("post");
    }
    return url.toString();
  }, []);

  // Navigate to a post (saves scroll position, prefetches comments)
  const selectPost = useCallback((post: Post | null) => {
    if (post?.id) {
      scrollRef.current = mainRef.current?.scrollTop ?? 0;
      getThread(post.id).then(setSelectedComments);
    } else {
      setSelectedComments([]);
    }
    setSelectedPost(post);
    const communityId = communities[activeIndex]?.id ?? "comm_home";
    window.history.pushState(
      { scroll: post ? scrollRef.current : 0 },
      "",
      buildUrl(communityId, post?.id),
    );
  }, [activeIndex, communities, buildUrl]);


  // Handle browser back/forward
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      const params = new URLSearchParams(window.location.search);
      const communityParam = params.get("community");
      const postId = params.get("post");

      // Restore community
      if (communityParam) {
        const idx = communities.findIndex((c) => c.id === communityParam);
        if (idx >= 0 && idx !== activeIndexRef.current) {
          setActiveIndex(idx);
          setLoading(true);
          startTransition(async () => {
            const newPosts = await getPostsByCommunity(communityParam);
            setPosts(newPosts);
            setLoading(false);
            if (postId) {
              const found = newPosts.find((p) => p.id === postId);
              setSelectedPost(found ?? null);
            } else {
              setSelectedPost(null);
              // Restore scroll position
              const savedScroll = e.state?.scroll ?? 0;
              requestAnimationFrame(() => {
                mainRef.current?.scrollTo(0, savedScroll);
              });
            }
          });
          return;
        }
      }

      // Same community, toggle post
      if (postId) {
        const found = posts.find((p) => p.id === postId);
        setSelectedPost(found ?? null);
      } else {
        setSelectedPost(null);
        // Restore scroll position
        const savedScroll = e.state?.scroll ?? 0;
        requestAnimationFrame(() => {
          mainRef.current?.scrollTo(0, savedScroll);
        });
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [posts, communities, startTransition, setActiveIndex]);

  const community = communities[activeIndex];
  const isJoined = joinedSet.has(community.id);

  const sidebarCommunities = communities.map((c, i) => ({
    name: c.name,
    icon: c.icon,
    active: i === activeIndex,
  }));

  const sorted = useMemo(() => sortPosts(posts, sortKey), [posts, sortKey]);

  const handleCommunityClick = useCallback((i: number) => {
    // If same community but viewing a thread, just go back to feed
    if (i === activeIndex && !selectedPost) return;
    if (i === activeIndex && selectedPost) {
      selectPost(null);
      return;
    }
    setActiveIndex(i);
    setSortKey("hot");
    setMobileTab("posts");
    setSelectedPost(null);
    setShowAnimation(true);
    setLoading(true);
    setFeedKey((k) => k + 1);
    window.history.pushState({ scroll: 0 }, "", buildUrl(communities[i].id));
    startTransition(async () => {
      const newPosts = await getPostsByCommunity(communities[i].id);
      setPosts(newPosts);
      setLoading(false);
    });
  }, [activeIndex, selectedPost, communities, startTransition, buildUrl, selectPost]);

  const handleSort = (key: SortKey) => {
    setSortKey(key);
    const url = new URL(window.location.href);
    if (key === "hot") {
      url.searchParams.delete("sort");
    } else {
      url.searchParams.set("sort", key);
    }
    window.history.replaceState({}, "", url.toString());
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
        onSelectPost={selectPost}
      />

      <main ref={mainRef} className="relative flex-1 overflow-y-auto pb-20 md:pb-0">
        {/* ── Thread View ── */}
        {selectedPost ? (
          <>
            <div className="md:hidden">
              <ThreadView
                post={selectedPost}
                initialComments={selectedComments}
                communityName={community.name}
                onBack={() => selectPost(null)}
              />
            </div>
            <div className="hidden md:block">
              <Banner community={community} />
              <ThreadView
                post={selectedPost}
                initialComments={selectedComments}
                communityName={community.name}
                onBack={() => selectPost(null)}
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
                <div key={feedKey} className={`px-4 py-4 space-y-4 transition-opacity duration-150 ${loading ? "opacity-0" : "opacity-100"}`}>
                  {sorted.map((post, i) => (
                    <FeedPost
                      key={post.id ?? `${post.author}-${post.title}`}
                      post={post}
                      showCommunity={community.id === "comm_home"}
                      onCommunityClick={() => {
                        const idx = communities.findIndex((c) => c.name === post.communityName);
                        if (idx >= 0) handleCommunityClick(idx);
                      }}
                      onCommentClick={() => selectPost(post)}
                      style={showAnimation ? {
                        animation: `post-enter 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.06}s both`,
                      } : undefined}
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
                      <div key={feedKey} className={`space-y-4 transition-opacity duration-150 ${loading ? "opacity-0" : "opacity-100"}`}>
                        {sorted.map((post, i) => (
                          <FeedPost
                            key={post.id ?? `${post.author}-${post.title}`}
                            post={post}
                            showCommunity={community.id === "comm_home"}
                            onCommunityClick={() => {
                              const idx = communities.findIndex((c) => c.name === post.communityName);
                              if (idx >= 0) handleCommunityClick(idx);
                            }}
                            onCommentClick={() => selectPost(post)}
                            style={{
                              animation: `post-enter 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.06}s both`,
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

        {/* New Post FAB — desktop only (mobile uses actions drawer) */}
        {!selectedPost ? (
          <button
            className="hidden md:flex absolute bottom-6 right-6 z-30 items-center gap-2 px-4 py-3 rounded-full bg-accent-primary text-white text-sm font-medium shadow-lg hover:brightness-110 active:scale-95 transition-all"
            aria-label="New post"
          >
            <PenLine size={18} />
            New Post
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
        <Image
          src={community.banner.bannerImage}
          alt={community.banner.name}
          fill
          sizes="100vw"
          className="object-cover"
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
