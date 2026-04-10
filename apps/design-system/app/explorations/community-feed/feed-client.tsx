"use client";

import { useState, useMemo, useTransition, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import { Users, Clock } from "lucide-react";
import { Sidebar, MobileHeader } from "@/components/sidebar";
import { ContentTabs } from "@/components/content-tabs";
import { Avatar } from "@/components/avatar";
import { FeedSort } from "@/components/feed-sort";
import { FeedPost } from "@/components/feed-post";

// Lazy-load heavy components that aren't visible on initial render
const ThreadView = dynamic(() => import("@/components/thread-view").then((m) => m.ThreadView), {
  loading: () => <ThreadSkeleton />,
});
const NewPostComposer = dynamic(() => import("@/components/new-post-composer").then((m) => m.NewPostComposer), { ssr: false });
import { themeToStyle } from "@/lib/theme";
import {
  getPostsByCommunity,
  getPost,
  getThread,
  createPost,
} from "@/lib/actions/posts";
import {
  toggleJoin as toggleJoinAction,
  getCommunity,
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

interface ActiveUser {
  username: string;
  displayName: string;
  initials: string;
  avatarBg: string;
  avatarUrl?: string;
}

interface FeedClientProps {
  communities: ClientCommunity[];
  activeCommunity: ClientCommunity;
  initialPosts: Post[];
  initialPostId?: string;
  initialComments?: Comment[];
  initialSort?: SortKey;
  activeUser: ActiveUser;
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

export function FeedClient({ communities, activeCommunity: initialActiveCommunity, initialPosts, initialPostId, initialComments = [], initialSort = "hot", activeUser }: FeedClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [community, setCommunity] = useState<ClientCommunity>(initialActiveCommunity);
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
  const [composerOpen, setComposerOpen] = useState(false);
  const [, startTransition] = useTransition();

  const scrollRef = useRef(0);
  const mainRef = useRef<HTMLElement>(null);

  // Build URL from current state
  const buildUrl = useCallback((communityId: string, postId?: string | null) => {
    const params = new URLSearchParams();
    params.set("community", communityId);
    if (postId) params.set("post", postId);
    return `${pathname}?${params.toString()}`;
  }, [pathname]);

  // Navigate to a post or back to feed
  const selectPost = useCallback(async (post: Post | null) => {
    if (post?.id) {
      // Opening a thread — fetch fresh post before showing to avoid vote flicker
      scrollRef.current = mainRef.current?.scrollTop ?? 0;
      setSelectedComments([]);
      const [fresh, comments] = await Promise.all([
        getPost(post.id),
        getThread(post.id),
      ]);
      setSelectedPost(fresh ?? post);
      setSelectedComments(comments);
    } else {
      // Going back to feed — refresh posts before showing to avoid vote flicker
      setSelectedPost(null);
      setSelectedComments([]);
      const fresh = await getPostsByCommunity(community.id);
      setPosts(fresh);
    }
    router.push(buildUrl(community.id, post?.id), { scroll: false });
  }, [community, buildUrl, router]);


  // Handle browser back/forward
  useEffect(() => {
    const onPopState = async () => {
      const params = new URLSearchParams(window.location.search);
      const communityParam = params.get("community") ?? "comm_home";
      const postId = params.get("post");

      // Community changed
      if (communityParam !== community.id) {
        setLoading(true);
        const [comm, newPosts] = await Promise.all([
          getCommunity(communityParam),
          getPostsByCommunity(communityParam),
        ]);
        if (comm) setCommunity(comm);
        setPosts(newPosts);
        setLoading(false);
        if (postId) {
          const found = newPosts.find((p) => p.id === postId);
          setSelectedComments([]);
          setSelectedPost(found ?? null);
          if (found) getThread(postId).then(setSelectedComments);
        } else {
          setSelectedPost(null);
        }
        return;
      }

      // Same community, toggle post
      if (postId) {
        setSelectedComments([]);
        const [fresh, comments] = await Promise.all([
          getPost(postId),
          getThread(postId),
        ]);
        setSelectedPost(fresh ?? null);
        setSelectedComments(comments);
      } else {
        setSelectedPost(null);
        const fresh = await getPostsByCommunity(community.id);
        setPosts(fresh);
        requestAnimationFrame(() => {
          mainRef.current?.scrollTo(0, scrollRef.current);
        });
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [community.id]);

  const isJoined = joinedSet.has(community.id);

  const sidebarCommunities = communities.map((c) => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
  }));

  const sorted = useMemo(() => sortPosts(posts, sortKey), [posts, sortKey]);

  const handleCommunityClick = useCallback((communityId: string) => {
    // Same community — if viewing a thread go back to feed, otherwise no-op
    if (communityId === community.id) {
      if (selectedPost) selectPost(null);
      return;
    }
    setSortKey("hot");
    setMobileTab("posts");
    setSelectedPost(null);
    setShowAnimation(true);
    setLoading(true);
    setFeedKey((k) => k + 1);
    router.push(buildUrl(communityId), { scroll: false });
    startTransition(async () => {
      const [comm, newPosts] = await Promise.all([
        getCommunity(communityId),
        getPostsByCommunity(communityId),
      ]);
      if (comm) setCommunity(comm);
      setPosts(newPosts);
      setLoading(false);
    });
  }, [community.id, selectedPost, startTransition, buildUrl, selectPost, router]);

  const handleSort = (key: SortKey) => {
    setSortKey(key);
    const params = new URLSearchParams(window.location.search);
    if (key === "hot") {
      params.delete("sort");
    } else {
      params.set("sort", key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
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
      // Re-run server component to update sidebar communities list
      router.refresh();
    });
  };

  const handleNewPost = useCallback(async (opts: {
    type: import("@/lib/types").PostType;
    title: string;
    body?: string;
    image?: string;
    url?: string;
    linkPreview?: { image: string; title: string; domain: string };
  }) => {
    const post = await createPost({ ...opts, communityId: community.id });
    setPosts((prev) => [post, ...prev]);
  }, [community.id]);

  const themeStyle = themeToStyle(community.theme);

  return (
    <div className="flex h-dvh overflow-hidden bg-bg-base text-text-primary" style={themeStyle}>
      <Sidebar
        activeCommunityId={community.id}
        communities={sidebarCommunities}
        avatarSrc={activeUser.avatarUrl}
        posts={posts}
        onCommunityClick={handleCommunityClick}
        onMobileTab={(tab) => setMobileTab(tab as MobileTab)}
        onSelectPost={selectPost}
        onNewPost={() => setComposerOpen(true)}
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
              <Banner community={community} joined={isJoined} onJoinToggle={handleJoinToggle} />
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
                  <ComposeBar onClick={() => setComposerOpen(true)} user={activeUser} />
                  {sorted.map((post, i) => (
                    <FeedPost
                      key={post.id ?? `${post.author}-${post.title}`}
                      post={post}
                      showCommunity={community.id === "comm_home"}
                      onCommunityClick={() => {
                        if (post.communityId) handleCommunityClick(post.communityId);
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
              <Banner community={community} joined={isJoined} onJoinToggle={handleJoinToggle} />
              <div className="max-w-3xl mx-auto px-4 py-6">
                <ContentTabs sortKey={sortKey} onSortChange={handleSort}>
                  {{
                    posts: (
                      <div key={feedKey} className={`space-y-4 transition-opacity duration-150 ${loading ? "opacity-0" : "opacity-100"}`}>
                        <ComposeBar onClick={() => setComposerOpen(true)} user={activeUser} />
                        {sorted.map((post, i) => (
                          <FeedPost
                            key={post.id ?? `${post.author}-${post.title}`}
                            post={post}
                            showCommunity={community.id === "comm_home"}
                            onCommunityClick={() => {
                              if (post.communityId) handleCommunityClick(post.communityId);
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

      </main>

      <NewPostComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        communityName={community.name}
        onSubmit={handleNewPost}
        user={activeUser}
      />
    </div>
  );
}

/** Inline "Create a post" bar at the top of the feed. */
function ComposeBar({ onClick, user }: { onClick: () => void; user: ActiveUser }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full rounded-xl bg-bg-surface border border-bg-elevated px-4 py-3 text-left hover:border-[oklch(100%_0_0_/_0.12)] hover:shadow-[0_2px_12px_oklch(0%_0_0_/_0.1)] transition-all group"
    >
      <Avatar
        initials={user.initials}
        bg={user.avatarBg}
        src={user.avatarUrl}
        size={32}
      />
      <span className="flex-1 text-sm text-text-muted group-hover:text-text-secondary transition-colors">
        Create a post...
      </span>
    </button>
  );
}

/** Banner sub-component to avoid duplication. */
function Banner({ community, joined, onJoinToggle }: { community: ClientCommunity; joined?: boolean; onJoinToggle?: () => void }) {
  const isHome = community.id === "comm_home";
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
      <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
        <div>
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
        {!isHome && onJoinToggle ? (
          <button
            onClick={onJoinToggle}
            className="relative px-5 py-2 rounded-full text-xs font-semibold overflow-hidden active:scale-[0.95]"
            style={{ transition: "transform 0.2s" }}
          >
            <span
              className="absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(135deg, oklch(40% 0.08 259), oklch(45% 0.1 290), oklch(42% 0.07 259))",
                boxShadow: joined ? "none" : "inset 0 1px 0 oklch(100% 0 0 / 0.1), 0 1px 8px oklch(45% 0.1 290 / 0.3)",
                opacity: joined ? 0 : 1,
                transition: "opacity 0.4s ease",
              }}
            />
            <span
              className="absolute inset-0 rounded-full border border-text-muted/30 bg-bg-surface/40 backdrop-blur-sm"
              style={{ opacity: joined ? 1 : 0, transition: "opacity 0.4s ease" }}
            />
            <span
              className="relative z-10"
              style={{ color: joined ? "var(--color-text-secondary)" : "white", transition: "color 0.3s ease" }}
            >
              {joined ? "Joined ✓" : "Join"}
            </span>
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** Skeleton shown while ThreadView chunk loads or comments are fetching. */
function ThreadSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-pulse">
      <div className="h-3 w-24 rounded bg-bg-elevated" />
      <div className="rounded-xl bg-bg-surface border border-bg-elevated p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-bg-elevated" />
          <div className="space-y-1.5">
            <div className="h-3 w-20 rounded bg-bg-elevated" />
            <div className="h-2 w-16 rounded bg-bg-elevated" />
          </div>
        </div>
        <div className="h-6 w-3/4 rounded bg-bg-elevated" />
        <div className="h-4 w-full rounded bg-bg-elevated" />
        <div className="h-4 w-2/3 rounded bg-bg-elevated" />
        <div className="flex gap-3 pt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-16 rounded-lg bg-bg-elevated" />
          ))}
        </div>
      </div>
      {/* Comment skeletons */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-3 pl-2">
          <div className="w-0.5 bg-bg-elevated rounded-full" />
          <div className="flex-1 space-y-2 py-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-bg-elevated" />
              <div className="h-3 w-20 rounded bg-bg-elevated" />
            </div>
            <div className="h-3 w-full rounded bg-bg-elevated" />
            <div className="h-3 w-1/2 rounded bg-bg-elevated" />
          </div>
        </div>
      ))}
    </div>
  );
}
