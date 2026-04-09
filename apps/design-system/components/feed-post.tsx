"use client";

import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ExternalLink,
  Play,
} from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import type { Post } from "@/lib/types";

function spawnHeartParticles(container: HTMLElement) {
  const colors = [
    "oklch(55% 0.22 20)",
    "oklch(65% 0.20 30)",
    "oklch(60% 0.18 350)",
    "oklch(70% 0.15 15)",
    "oklch(55% 0.25 10)",
    "oklch(50% 0.20 340)",
    "oklch(62% 0.22 25)",
  ];
  for (let i = 0; i < 7; i++) {
    const angle = (Math.PI * 2 * i) / 7 + (Math.random() - 0.5) * 0.5;
    const dist = 25 + Math.random() * 30;
    const el = document.createElement("span");
    el.textContent = "♥";
    el.style.cssText = `
      position:absolute;left:50%;top:50%;pointer-events:none;font-size:${10 + Math.random() * 6}px;
      color:${colors[i]};z-index:10;
      --hx:${Math.cos(angle) * dist}px;--hy:${Math.sin(angle) * dist}px;
      --hs:${0.3 + Math.random() * 0.7};--hr:${Math.random() * 90 - 45}deg;
      animation:heart-float ${0.9 + Math.random() * 0.4}s ease-out forwards;
    `;
    container.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

interface FeedPostProps {
  post: Post;
  style?: React.CSSProperties;
  onCommentClick?: () => void;
}

export function FeedPost({ post, style, onCommentClick }: FeedPostProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const baseVotes = typeof post.votes === "number" ? post.votes : parseInt(post.votes) || 0;
  const [likeCount, setLikeCount] = useState(baseVotes);
  const heartRef = useRef<HTMLButtonElement>(null);

  const handleLike = useCallback(() => {
    const next = !liked;
    setLiked(next);
    setLikeCount(baseVotes + (next ? 1 : 0));
    if (next && heartRef.current) {
      spawnHeartParticles(heartRef.current);
    }
  }, [liked, baseVotes]);

  return (
    <article
      className="bg-bg-surface rounded-xl border border-bg-elevated p-4 space-y-3 motion-safe:transition-[transform,border-color,box-shadow] motion-safe:duration-200 hover:translate-y-[-2px] hover:border-[oklch(100%_0_0_/_0.12)] hover:shadow-[0_4px_20px_oklch(0%_0_0_/_0.15)]"
      style={style}
    >
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <Avatar initials={post.initials} bg={post.avatarBg} size={24} />
        <strong className="text-text-primary">{post.author}</strong>
        {post.badges?.map((b) => (
          <Badge
            key={b.label}
            variant={b.variant}
            label={b.label}
            icon={b.icon}
          />
        ))}
        <span>&middot; {post.time}</span>
      </div>

      <h3 className="font-serif text-base font-semibold leading-snug">
        {post.title}
      </h3>

      {post.image ? (
        <div className="rounded-lg overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full object-cover"
          />
        </div>
      ) : null}
      {post.body ? (
        <p className="text-sm text-text-secondary leading-relaxed">
          {post.body}
        </p>
      ) : null}
      {post.linkPreview ? (
        <a
          href="#"
          className="flex gap-3 p-3 rounded-lg bg-bg-elevated border border-bg-overlay no-underline"
        >
          <img
            src={post.linkPreview.image}
            alt={post.linkPreview.title}
            className="w-24 h-16 rounded object-cover shrink-0"
          />
          <div>
            <div className="text-sm font-semibold">
              {post.linkPreview.title}
            </div>
            <div className="text-xs text-text-muted flex items-center gap-1 mt-1">
              <ExternalLink size={10} /> {post.linkPreview.domain}
            </div>
          </div>
        </a>
      ) : null}
      {post.video ? (
        <div className="rounded-lg overflow-hidden relative cursor-pointer">
          <img
            src={post.video.thumbnail}
            alt="Video thumbnail"
            className="w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
              <Play size={24} className="text-bg-base ml-0.5" />
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex gap-4 text-xs text-text-muted pt-1">
        <button
          ref={heartRef}
          onClick={handleLike}
          className={`relative flex items-center gap-1.5 tabular-nums motion-safe:transition-colors hover:translate-y-[-1px] active:translate-y-0 active:scale-[0.97] ${
            liked
              ? "text-[oklch(55%_0.2_20)]"
              : "hover:text-text-secondary"
          }`}
        >
          <Heart
            size={16}
            fill={liked ? "currentColor" : "none"}
            className={liked ? "motion-safe:animate-[heart-pop_0.7s_cubic-bezier(0.17,0.89,0.32,1.49)]" : ""}
          />
          {likeCount}
        </button>
        <button
          onClick={onCommentClick}
          className="flex items-center gap-1.5 hover:text-text-secondary hover:translate-y-[-1px] active:translate-y-0 active:scale-[0.97] motion-safe:transition-colors cursor-pointer"
        >
          <MessageCircle size={16} /> {post.comments}
        </button>
        <button className="flex items-center gap-1.5 hover:text-text-secondary hover:translate-y-[-1px] active:translate-y-0 active:scale-[0.97] motion-safe:transition-colors cursor-pointer">
          <Share2 size={16} /> Share
        </button>
        <button
          onClick={() => {
            const next = !saved;
            setSaved(next);
            if (next) setSaveCount(c => c + 1);
          }}
          className={`flex items-center gap-1.5 hover:translate-y-[-1px] active:translate-y-0 active:scale-[0.97] motion-safe:transition-colors cursor-pointer ${
            saved ? "text-accent-primary" : "hover:text-text-secondary"
          }`}
        >
          <Bookmark
            key={saveCount}
            size={16}
            fill={saved ? "currentColor" : "none"}
            className={saveCount > 0 ? "motion-safe:animate-[bookmark-drop_0.7s_cubic-bezier(0.17,0.89,0.32,1.49)]" : ""}
          />
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </article>
  );
}
