"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Search, X, TrendingUp, Clock, MessageCircle, Heart } from "lucide-react";
import type { Post } from "@/lib/types";

const recentSearches = [
  "pixel art tutorials",
  "companion planting guide",
  "GLSL shader effects",
];

const trending = [
  { label: "Weekend Game Jam", posts: 47 },
  { label: "Tomato growing tips", posts: 23 },
  { label: "Retro console mods", posts: 18 },
  { label: "Golden hour photography", posts: 12 },
];

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  posts?: Post[];
  onSelectPost?: (post: Post) => void;
}

export function SearchOverlay({ open, onClose, posts = [], onSelectPost }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.body?.toLowerCase().includes(q),
    );
  }, [query, posts]);

  const hasQuery = query.trim().length > 0;

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    } else {
      // Clear query asynchronously to avoid setState in effect body
      const t = setTimeout(() => setQuery(""), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 md:bottom-0 bottom-16 z-[55] ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg-base/90 backdrop-blur-md"
        style={{
          opacity: open ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
        onClick={onClose}
      />

      {/* Content */}
      <div
        className="relative max-w-lg mx-auto px-4 pt-[10vh] md:pt-[15vh] max-h-full overflow-y-auto pb-8"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-20px)",
          transition: open
            ? "opacity 0.3s ease 0.05s, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1) 0.05s"
            : "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        {/* Search input */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the atmosphere…"
            className="w-full bg-bg-surface border border-bg-elevated rounded-2xl pl-12 pr-12 py-4 text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-secondary/50 focus:ring-1 focus:ring-accent-secondary/30"
          />
          <button
            onClick={() => (hasQuery ? setQuery("") : onClose())}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results or default content */}
        {hasQuery ? (
          <div className="mt-4">
            {results.length > 0 ? (
              <>
                <div className="text-[10px] uppercase tracking-widest text-text-muted px-1 mb-2">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </div>
                <div className="space-y-0.5">
                  {results.map((post, i) => (
                    <button
                      key={post.id ?? `${post.author}-${post.title}`}
                      onClick={() => { onSelectPost?.(post); onClose(); }}
                      className="flex flex-col gap-1 w-full px-3 py-3 rounded-xl text-left hover:bg-bg-surface transition-colors"
                      style={{
                        animation: `post-enter 0.3s ease ${i * 0.05}s both`,
                      }}
                    >
                      <span className="text-sm font-medium text-text-primary leading-snug">
                        {post.title}
                      </span>
                      <span className="flex items-center gap-3 text-[11px] text-text-muted">
                        <span>{post.author}</span>
                        <span className="flex items-center gap-1">
                          <Heart size={10} /> {post.votes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={10} /> {post.comments}
                        </span>
                        <span>{post.time}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-text-muted">
                  No results for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Try a different search term
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Recent searches */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-text-muted px-1 mb-2">
                <Clock size={11} />
                Recent
              </div>
              <div className="space-y-0.5">
                {recentSearches.map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuery(q)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-colors text-left"
                  >
                    <Search size={14} className="text-text-muted shrink-0" />
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-text-muted px-1 mb-2">
                <TrendingUp size={11} />
                Trending
              </div>
              <div className="space-y-0.5">
                {trending.map((t, i) => (
                  <button
                    key={t.label}
                    onClick={() => setQuery(t.label)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-colors text-left"
                    style={{
                      opacity: open ? 1 : 0,
                      transform: open ? "translateY(0)" : "translateY(8px)",
                      transition: open
                        ? `opacity 0.3s ease ${0.1 + i * 0.05}s, transform 0.3s ease ${0.1 + i * 0.05}s`
                        : "opacity 0.15s ease, transform 0.15s ease",
                    }}
                  >
                    <span className="text-[10px] font-bold text-text-muted w-5 text-right shrink-0">
                      {i + 1}
                    </span>
                    <span className="flex-1">{t.label}</span>
                    <span className="text-[10px] text-text-muted">
                      {t.posts} posts
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Keyboard hint — desktop only */}
        <div className="mt-6 text-center text-[10px] text-text-muted hidden md:block">
          <kbd className="px-1.5 py-0.5 rounded bg-bg-elevated border border-bg-overlay text-[10px]">
            esc
          </kbd>{" "}
          to close
        </div>
      </div>
    </div>
  );
}
