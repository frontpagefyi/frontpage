"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  AtSign,
  MessageSquare,
  Bookmark,
  Users,
  FileText,
} from "lucide-react";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/badge";
import { FeedPost } from "@/components/feed-post";
import type { UserProfile } from "@/lib/actions/users";
import type { Post } from "@/lib/types";

type Tab = "posts" | "comments" | "saved" | "communities";

interface ProfileClientProps {
  profile: UserProfile;
  posts: Post[];
  savedPosts?: Post[];
  isOwnProfile?: boolean;
  initialTab?: Tab;
}

export function ProfileClient({ profile, posts, savedPosts = [], isOwnProfile, initialTab }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab ?? "posts");

  const tabs: { key: Tab; label: string; count: number; icon: React.ReactNode }[] = [
    { key: "posts", label: "Posts", count: profile.stats.posts, icon: <FileText size={14} /> },
    { key: "comments", label: "Comments", count: profile.stats.comments, icon: <MessageSquare size={14} /> },
    ...(isOwnProfile ? [{ key: "saved" as Tab, label: "Saved", count: savedPosts.length, icon: <Bookmark size={14} /> }] : []),
    { key: "communities", label: "Communities", count: profile.stats.communities, icon: <Users size={14} /> },
  ];

  return (
    <div className="min-h-dvh bg-bg-base text-text-primary">
      {/* ── Banner ── */}
      <div className="relative h-44 md:h-56 overflow-hidden">
        {profile.bannerUrl ? (
          <Image
            src={profile.bannerUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${profile.avatarBg}, oklch(20% 0.03 259))`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent" />

        {/* Back button */}
        <Link
          href="/explorations/community-feed"
          className="absolute top-4 left-4 z-10 flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 no-underline"
        >
          <ArrowLeft size={14} />
          Back
        </Link>
      </div>

      {/* ── Profile header ── */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="relative -mt-14 mb-4">
          {/* Avatar */}
          <div className="relative inline-block">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profile.displayName}
                width={88}
                height={88}
                className="rounded-2xl ring-4 ring-bg-base object-cover"
                style={{ width: 88, height: 88 }}
              />
            ) : (
              <Avatar
                initials={profile.initials}
                bg={profile.avatarBg}
                size={88}
                className="rounded-2xl ring-4 ring-bg-base"
              />
            )}
          </div>
        </div>

        {/* Name + handle + badges */}
        <div className="mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-serif text-2xl font-bold leading-tight">
              {profile.displayName}
            </h1>
            {profile.badges.map((b) => (
              <Badge key={b.label} variant={b.variant} label={b.label} icon={b.icon} />
            ))}
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-text-muted">
            <span className="flex items-center gap-1">
              <AtSign size={13} />
              {profile.handle}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={13} />
              Joined {profile.joinedAt}
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-text-secondary leading-relaxed mb-5 max-w-lg">
          {profile.bio}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-6 mb-6 text-sm">
          <div>
            <span className="font-bold text-text-primary tabular-nums">{profile.stats.posts}</span>
            <span className="text-text-muted ml-1">posts</span>
          </div>
          <div>
            <span className="font-bold text-text-primary tabular-nums">{profile.stats.comments}</span>
            <span className="text-text-muted ml-1">comments</span>
          </div>
          <div>
            <span className="font-bold text-text-primary tabular-nums">
              {profile.stats.karma >= 1000
                ? `${(profile.stats.karma / 1000).toFixed(1)}k`
                : profile.stats.karma}
            </span>
            <span className="text-text-muted ml-1">karma</span>
          </div>
          <div>
            <span className="font-bold text-text-primary tabular-nums">{profile.stats.communities}</span>
            <span className="text-text-muted ml-1">communities</span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1 border-b border-bg-elevated mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm transition-colors relative ${
                activeTab === tab.key
                  ? "text-text-primary font-medium"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className="text-[11px] text-text-muted tabular-nums">{tab.count}</span>
              {activeTab === tab.key ? (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-accent-secondary" />
              ) : null}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className="pb-12">
          {activeTab === "posts" ? (
            posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post, i) => (
                  <FeedPost
                    key={post.id ?? `${post.author}-${post.title}`}
                    post={post}
                    showCommunity
                    style={{
                      animation: `post-enter 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.06}s both`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <EmptyState icon={<FileText size={24} />} text="No posts yet" />
            )
          ) : activeTab === "saved" ? (
            savedPosts.length > 0 ? (
              <div className="space-y-4">
                {savedPosts.map((post, i) => (
                  <FeedPost
                    key={post.id ?? `${post.author}-${post.title}`}
                    post={post}
                    showCommunity
                    style={{
                      animation: `post-enter 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.06}s both`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <EmptyState icon={<Bookmark size={24} />} text="No saved posts yet" />
            )
          ) : activeTab === "comments" ? (
            profile.stats.comments > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-text-muted">
                  {profile.stats.comments} comments across the community. Comment history coming soon.
                </p>
              </div>
            ) : (
              <EmptyState icon={<MessageSquare size={24} />} text="No comments yet" />
            )
          ) : (
            profile.stats.communities > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-text-muted">
                  Active in {profile.stats.communities} {profile.stats.communities === 1 ? "community" : "communities"}. Community list coming soon.
                </p>
              </div>
            ) : (
              <EmptyState icon={<Users size={24} />} text="Not in any communities yet" />
            )
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-text-muted gap-3">
      {icon}
      <span className="text-sm">{text}</span>
    </div>
  );
}
