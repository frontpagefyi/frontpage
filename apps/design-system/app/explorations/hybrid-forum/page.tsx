"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Pin,
  MessageSquare,
  Eye,
  Clock,
  Heart,
  Reply,
  X,
} from "lucide-react";

interface ThreadReply {
  author: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

interface Thread {
  id: number;
  pinned?: boolean;
  title: string;
  author: string;
  avatar: string;
  replies: number;
  views: string;
  lastPost: string;
  body: string;
  image?: string;
  replyList: ThreadReply[];
}

const threads: Thread[] = [
  {
    id: 1,
    pinned: true,
    title: "Community rules & getting started",
    author: "moderator",
    avatar: "",
    replies: 24,
    views: "1.2k",
    lastPost: "2h ago",
    body: "Welcome to Creative Coding! Please read the rules before posting...",
    replyList: [],
  },
  {
    id: 2,
    title: "Just finished this isometric city — 6 months of pixel work",
    author: "pixelweaver",
    avatar: "https://i.pravatar.cc/48?img=3",
    replies: 94,
    views: "3.4k",
    lastPost: "12m ago",
    body: "Over 200 unique buildings, dynamic lighting system, and animated citizens going about their daily routines. Used a custom palette generator to keep everything cohesive across the whole cityscape. The hardest part was the z-ordering for overlapping buildings — ended up using a modified painter's algorithm with per-building face splitting.",
    image:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=800&h=300&q=80",
    replyList: [
      {
        author: "shader_witch",
        avatar: "https://i.pravatar.cc/36?img=5",
        text: "This is incredible. How did you handle the z-ordering for the isometric tiles?",
        time: "10m ago",
        likes: 12,
      },
      {
        author: "pixelweaver",
        avatar: "https://i.pravatar.cc/36?img=3",
        text: "Painter's algorithm with a custom sort — buildings get split into front/back faces so characters can walk behind them",
        time: "8m ago",
        likes: 8,
      },
      {
        author: "bytebard",
        avatar: "https://i.pravatar.cc/36?img=8",
        text: "The lighting is what gets me. Is that baked or runtime?",
        time: "5m ago",
        likes: 3,
      },
    ],
  },
  {
    id: 3,
    title: "Anyone tried the new WebGPU compute shaders?",
    author: "shader_witch",
    avatar: "https://i.pravatar.cc/48?img=5",
    replies: 47,
    views: "891",
    lastPost: "34m ago",
    body: "Just got my hands on the latest Chrome Canary build and the performance improvements are insane. Running 1M particles at 60fps with zero CPU overhead. The API is surprisingly clean too — feels like writing Metal shaders but in the browser.",
    replyList: [
      {
        author: "pixelweaver",
        avatar: "https://i.pravatar.cc/36?img=3",
        text: "Have you tried the storage buffer approach? I got 2M particles that way.",
        time: "30m ago",
        likes: 15,
      },
      {
        author: "flowstate",
        avatar: "https://i.pravatar.cc/36?img=12",
        text: "Would love to see a benchmark comparison with WebGL compute. Is it actually faster or just cleaner API?",
        time: "25m ago",
        likes: 7,
      },
      {
        author: "shader_witch",
        avatar: "https://i.pravatar.cc/36?img=5",
        text: "@flowstate roughly 3x faster for particle sims, but the real win is the API ergonomics. No more gl.bindBuffer() hell.",
        time: "20m ago",
        likes: 22,
      },
      {
        author: "glsl_gang",
        avatar: "https://i.pravatar.cc/36?img=20",
        text: "We should add WebGPU examples to the shader playground. @shader_witch want to collab?",
        time: "15m ago",
        likes: 4,
      },
    ],
  },
  {
    id: 4,
    title: "Made a cellular automata music generator",
    author: "bytebard",
    avatar: "https://i.pravatar.cc/48?img=8",
    replies: 32,
    views: "654",
    lastPost: "1h ago",
    body: "Each cell's state maps to a MIDI note. Conway's Game of Life becomes a generative synth. The emergent melodies are surprisingly musical — certain patterns produce these haunting chord progressions.",
    replyList: [
      {
        author: "noise_maker",
        avatar: "https://i.pravatar.cc/36?img=11",
        text: "Have you tried mapping the cell neighborhoods to chord progressions instead of individual notes? Might get more musical output.",
        time: "45m ago",
        likes: 9,
      },
      {
        author: "bytebard",
        avatar: "https://i.pravatar.cc/36?img=8",
        text: "@noise_maker that's genius, trying it now",
        time: "40m ago",
        likes: 3,
      },
    ],
  },
  {
    id: 5,
    title: "Weekly challenge #47: Generative landscapes",
    author: "admin",
    avatar: "https://i.pravatar.cc/48?img=33",
    replies: 18,
    views: "412",
    lastPost: "2h ago",
    body: "This week's theme: landscapes generated from real-world data. Elevation maps, weather data, satellite imagery — whatever data source inspires you. Submissions close Sunday.",
    replyList: [],
  },
  {
    id: 6,
    title: "How I recreated the Windows 98 screensavers in p5.js",
    author: "retro_dev",
    avatar: "https://i.pravatar.cc/48?img=14",
    replies: 63,
    views: "2.1k",
    lastPost: "3h ago",
    body: "Maze, Starfield, Pipes, 3D Text — all the classics. The hardest was getting the pipe elbows right. Published as a single HTML file you can run anywhere.",
    replyList: [
      {
        author: "pixelweaver",
        avatar: "https://i.pravatar.cc/36?img=3",
        text: "The Starfield one is perfect. Did you measure the actual speed curve of the original?",
        time: "2h ago",
        likes: 11,
      },
      {
        author: "retro_dev",
        avatar: "https://i.pravatar.cc/36?img=14",
        text: "Yes! Recorded the original at 60fps and matched the acceleration curve. It's exponential, not linear.",
        time: "1h ago",
        likes: 18,
      },
    ],
  },
  {
    id: 7,
    title: "Seeking collaborators for open-source shader playground",
    author: "glsl_gang",
    avatar: "https://i.pravatar.cc/48?img=20",
    replies: 11,
    views: "287",
    lastPost: "4h ago",
    body: "Building a browser-based GLSL sandbox with live-reload, multi-pass support, and shared shader URLs. Looking for help with the editor (Monaco integration) and the WebGPU backend.",
    replyList: [],
  },
];

function Avatar({
  src,
  author,
  size = 18,
}: {
  src: string;
  author: string;
  size?: number;
}) {
  if (!src) {
    return (
      <div
        className="rounded-full bg-bg-interactive flex items-center justify-center text-text-muted font-bold shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        {author[0]?.toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={author}
      className="rounded-full shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

function ThreadPanel({ thread }: { thread: Thread }) {
  return (
    <div className="bg-bg-base border-t border-bg-elevated px-6 py-5 space-y-5">
      {/* OP */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Avatar src={thread.avatar} author={thread.author} size={32} />
          <div>
            <span className="text-sm font-semibold text-text-primary">
              {thread.author}
            </span>
            <span className="text-xs text-text-muted ml-2">OP</span>
          </div>
          <span className="text-xs text-text-muted ml-auto">
            {thread.lastPost}
          </span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          {thread.body}
        </p>
        {thread.image && (
          <img
            src={thread.image}
            alt=""
            className="rounded-lg w-full max-h-64 object-cover"
          />
        )}
      </div>

      {/* Replies */}
      {thread.replyList.length > 0 && (
        <div className="space-y-0">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Replies ({thread.replyList.length})
          </h4>
          <div className="space-y-0 border-l-2 border-bg-elevated ml-4">
            {thread.replyList.map((reply, i) => (
              <div key={i} className="pl-4 py-3 relative">
                <div className="flex items-center gap-2 mb-1">
                  <Avatar
                    src={reply.avatar}
                    author={reply.author}
                    size={24}
                  />
                  <span className="text-sm font-semibold text-text-primary">
                    {reply.author}
                  </span>
                  <span className="text-xs text-text-muted">{reply.time}</span>
                  <span className="flex items-center gap-1 text-xs text-text-muted ml-auto">
                    <Heart size={12} />
                    {reply.likes}
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed pl-8">
                  {reply.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reply input placeholder */}
      <div className="flex items-center gap-3 pt-2 border-t border-bg-elevated">
        <Reply size={14} className="text-text-muted" />
        <div className="flex-1 bg-bg-surface border border-bg-elevated rounded-md px-3 py-2 text-sm text-text-muted">
          Write a reply...
        </div>
      </div>
    </div>
  );
}

export default function HybridForumPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  function toggleThread(id: number) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">
          Hybrid Forum + Threaded View
        </h1>
        <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
          An experiment combining a dense forum table layout with inline
          threaded expansion. Click any row to expand the thread in-place
          without navigating away. Click again or use the collapse button to
          close it.
        </p>
      </div>

      {/* Forum table */}
      <div className="rounded-xl border border-bg-elevated overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-2.5 bg-bg-surface border-b border-bg-elevated text-xs font-semibold text-text-muted uppercase tracking-wider">
          <span>Thread</span>
          <div className="flex items-center gap-6 text-right">
            <span className="w-14">Replies</span>
            <span className="w-14">Views</span>
            <span className="w-20">Last Post</span>
          </div>
        </div>

        {/* Rows */}
        {threads.map((thread) => {
          const isExpanded = expandedId === thread.id;

          return (
            <div key={thread.id}>
              {/* Row */}
              <button
                onClick={() => toggleThread(thread.id)}
                className={`
                  w-full grid grid-cols-[1fr_auto] gap-4 px-4 py-3 text-left
                  border-b border-bg-elevated
                  transition-colors duration-150
                  cursor-pointer
                  ${isExpanded ? "bg-bg-surface" : "hover:bg-bg-surface/60"}
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Chevron */}
                  <span
                    className="text-text-muted transition-transform duration-200 shrink-0"
                    style={{
                      transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                  >
                    <ChevronRight size={14} />
                  </span>

                  {/* Avatar */}
                  <Avatar
                    src={thread.avatar}
                    author={thread.author}
                    size={18}
                  />

                  {/* Title + author */}
                  <div className="flex items-center gap-2 min-w-0">
                    {thread.pinned && (
                      <Pin
                        size={12}
                        className="text-accent-primary shrink-0"
                      />
                    )}
                    <span className="text-sm font-semibold text-text-primary truncate">
                      {thread.title}
                    </span>
                    <span className="text-xs text-text-muted shrink-0">
                      by {thread.author}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-xs text-text-secondary">
                  <span className="w-14 text-right flex items-center justify-end gap-1">
                    <MessageSquare size={12} className="text-text-muted" />
                    {thread.replies}
                  </span>
                  <span className="w-14 text-right flex items-center justify-end gap-1">
                    <Eye size={12} className="text-text-muted" />
                    {thread.views}
                  </span>
                  <span className="w-20 text-right flex items-center justify-end gap-1">
                    <Clock size={12} className="text-text-muted" />
                    {thread.lastPost}
                  </span>
                </div>
              </button>

              {/* Expanded panel — grid-rows animation */}
              <div
                className={`
                  grid transition-all duration-300 ease-out
                  ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                `}
              >
                <div className="overflow-hidden">
                  {isExpanded && (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(null);
                        }}
                        className="absolute top-3 right-3 p-1 rounded-md hover:bg-bg-elevated text-text-muted transition-colors"
                        aria-label="Collapse thread"
                      >
                        <X size={16} />
                      </button>
                      <ThreadPanel thread={thread} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
