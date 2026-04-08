"use client";

import { useState } from "react";
import { Pin, ChevronLeft, ChevronRight } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/components/badge";
import { communities } from "@/lib/sample-data";

interface ForumThread {
  id: number;
  pinned?: boolean;
  title: string;
  author: string;
  badges?: { variant: "artist" | "og" | "live" | "mod"; label: string; icon?: string }[];
  replies: number;
  hotReplies?: boolean;
  views: string;
  lastPostAuthor: string;
  lastPostTime: string;
}

const stickyThreads: ForumThread[] = [
  {
    id: 1,
    pinned: true,
    title: "Getting Started with Creative Coding — Resources & Tools",
    author: "glitch_garden",
    badges: [{ variant: "og", icon: "Crown", label: "OG" }],
    replies: 234,
    views: "12.4k",
    lastPostAuthor: "shader_wizard",
    lastPostTime: "2h ago",
  },
  {
    id: 2,
    pinned: true,
    title: "Community Rules & Guidelines",
    author: "mod_team",
    replies: 12,
    views: "8.9k",
    lastPostAuthor: "mod_team",
    lastPostTime: "1w ago",
  },
];

const regularThreads: ForumThread[] = [
  {
    id: 3,
    title: "Just finished this isometric city — 6 months of pixel work",
    author: "pixelweaver",
    badges: [{ variant: "artist", icon: "Palette", label: "Artist" }],
    replies: 94,
    hotReplies: true,
    views: "2.1k",
    lastPostAuthor: "synthwave",
    lastPostTime: "15m ago",
  },
  {
    id: 4,
    title: "GLSL Tutorial: Recreating The Matrix Code effect",
    author: "shader_wizard",
    replies: 47,
    views: "1.8k",
    lastPostAuthor: "pixel_nova",
    lastPostTime: "1h ago",
  },
  {
    id: 5,
    title: "A History of Algorithmic Art — deep dive into generative origins",
    author: "genart_weaver",
    replies: 23,
    views: "890",
    lastPostAuthor: "genart_weaver",
    lastPostTime: "3h ago",
  },
  {
    id: 6,
    title: "Live coding session: building a particle system from scratch",
    author: "synthwave",
    badges: [{ variant: "og", icon: "Crown", label: "OG" }],
    replies: 67,
    views: "3.4k",
    lastPostAuthor: "pixelweaver",
    lastPostTime: "4h ago",
  },
  {
    id: 7,
    title: "Aseprite vs Pixelorama — what are you using?",
    author: "pixel_nova",
    badges: [{ variant: "artist", icon: "Palette", label: "Artist" }],
    replies: 89,
    hotReplies: true,
    views: "1.2k",
    lastPostAuthor: "glitch_garden",
    lastPostTime: "6h ago",
  },
  {
    id: 8,
    title: "New p5.js WebGL2 integration — compute shaders on the web!",
    author: "shader_wizard",
    replies: 56,
    views: "2.3k",
    lastPostAuthor: "synthwave",
    lastPostTime: "8h ago",
  },
];

function ThreadRow({
  thread,
  isSelected,
  onSelect,
}: {
  thread: ForumThread;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`grid items-center gap-4 px-4 py-3 border-b border-bg-elevated cursor-pointer transition-colors hover:bg-bg-elevated/60 ${
        isSelected ? "bg-bg-elevated" : ""
      } ${thread.pinned ? "border-l-2 border-l-accent-secondary" : ""}`}
      style={{ gridTemplateColumns: "1fr 100px 100px 140px" }}
    >
      {/* Thread info */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          {thread.pinned && (
            <Pin size={12} className="text-accent-secondary shrink-0" />
          )}
          <span
            className={`text-sm font-medium truncate ${
              isSelected ? "text-accent-secondary" : "text-text-primary"
            }`}
          >
            {thread.title}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
          <span>by {thread.author}</span>
          {thread.badges?.map((badge) => (
            <Badge
              key={badge.label}
              variant={badge.variant}
              label={badge.label}
              icon={badge.icon}
            />
          ))}
        </div>
      </div>

      {/* Replies */}
      <div className="text-center">
        <span
          className={`text-sm font-medium ${
            thread.hotReplies ? "text-accent-primary" : "text-text-secondary"
          }`}
        >
          {thread.replies}
        </span>
      </div>

      {/* Views */}
      <div className="text-center">
        <span className="text-sm text-text-muted">{thread.views}</span>
      </div>

      {/* Last Post */}
      <div className="text-right min-w-0">
        <div className="text-[11px] text-text-muted truncate">
          {thread.lastPostAuthor}
        </div>
        <div className="text-[11px] text-text-muted">{thread.lastPostTime}</div>
      </div>
    </div>
  );
}

function Pagination() {
  const [activePage, setActivePage] = useState(1);
  const pages = [1, 2, 3, "...", 47];

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={i} className="px-2 text-sm text-text-muted">
            ...
          </span>
        ) : (
          <button
            key={i}
            onClick={() => setActivePage(page as number)}
            className={`min-w-[32px] h-8 px-2 rounded text-sm transition-colors ${
              activePage === page
                ? "bg-accent-secondary text-white font-medium"
                : "text-text-muted hover:bg-bg-elevated hover:text-text-secondary"
            }`}
          >
            {page}
          </button>
        )
      )}
      <button className="min-w-[32px] h-8 px-2 rounded text-sm text-text-muted hover:bg-bg-elevated hover:text-text-secondary transition-colors">
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

export default function ThreadedForumPage() {
  const [activeCommunity, setActiveCommunity] = useState(0);
  const [selectedThread, setSelectedThread] = useState<number | null>(null);

  const sidebarCommunities = communities.map((c, i) => ({
    name: c.name,
    icon: c.icon,
    active: i === activeCommunity,
    notif: i === 0 ? 3 : undefined,
  }));

  const community = communities[activeCommunity];

  return (
    <div
      className="flex h-[calc(100vh-57px)] overflow-hidden"
      style={community?.theme as React.CSSProperties}
    >
      {/* Sidebar */}
      <div className="shrink-0 h-full">
        <Sidebar
          communities={sidebarCommunities}
          onCommunityClick={(i) => {
            setActiveCommunity(i);
            setSelectedThread(null);
          }}
        />
      </div>

      {/* Forum content */}
      <div className="flex-1 overflow-y-auto bg-bg-base">
        {/* Forum header */}
        <div className="border-b border-bg-elevated bg-bg-surface px-6 py-4">
          <div className="flex items-center gap-3 mb-2">
            {community?.icon ? (
              <img
                src={community.icon}
                alt=""
                className="w-9 h-9 rounded-lg object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center">
                <span className="text-white text-xs font-bold">fp</span>
              </div>
            )}
            <div>
              <h1 className="text-lg font-serif font-bold text-text-primary">
                Creative Coding & Pixel Art
              </h1>
              <nav className="text-[11px] text-text-muted flex items-center gap-1">
                <span className="hover:text-accent-secondary cursor-pointer transition-colors">
                  frontpage
                </span>
                <ChevronLeft size={10} className="rotate-180" />
                <span className="hover:text-accent-secondary cursor-pointer transition-colors">
                  communities
                </span>
                <ChevronLeft size={10} className="rotate-180" />
                <span className="text-text-secondary">
                  Creative Coding & Pixel Art
                </span>
              </nav>
            </div>
          </div>
        </div>

        {/* Table header */}
        <div
          className="grid items-center gap-4 px-4 py-2 border-b border-bg-elevated bg-bg-surface/50"
          style={{ gridTemplateColumns: "1fr 100px 100px 140px" }}
        >
          <span className="text-[10px] uppercase tracking-widest font-bold text-text-muted">
            Thread
          </span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-text-muted text-center">
            Replies
          </span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-text-muted text-center">
            Views
          </span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-text-muted text-right">
            Last Post
          </span>
        </div>

        {/* Sticky threads */}
        {stickyThreads.map((thread) => (
          <ThreadRow
            key={thread.id}
            thread={thread}
            isSelected={selectedThread === thread.id}
            onSelect={() =>
              setSelectedThread(
                selectedThread === thread.id ? null : thread.id
              )
            }
          />
        ))}

        {/* Separator */}
        <div className="h-px bg-bg-elevated" />

        {/* Regular threads */}
        {regularThreads.map((thread) => (
          <ThreadRow
            key={thread.id}
            thread={thread}
            isSelected={selectedThread === thread.id}
            onSelect={() =>
              setSelectedThread(
                selectedThread === thread.id ? null : thread.id
              )
            }
          />
        ))}

        {/* Pagination */}
        <Pagination />
      </div>
    </div>
  );
}
