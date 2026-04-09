"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ArrowLeft,
  Clock,
  Eye,
  Play,
  ExternalLink,
  Send,
  MoreHorizontal,
  Link2,
  Flag,
} from "lucide-react";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { ThreadComment } from "./thread-comment";
import { getThread, addComment as addCommentAction } from "@/lib/actions/posts";
import type { Post, Comment } from "@/lib/types";
import { toast } from "@/lib/toast";

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

interface ThreadViewProps {
  post: Post;
  communityName: string;
  onBack: () => void;
}

export function ThreadView({ post, communityName, onBack }: ThreadViewProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const baseVotes = typeof post.votes === "number" ? post.votes : parseInt(post.votes) || 0;
  const [likeCount, setLikeCount] = useState(baseVotes);
  const heartRef = useRef<HTMLButtonElement>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [postMenuOpen, setPostMenuOpen] = useState(false);

  // Load comments from server action
  useEffect(() => {
    if (post.id) {
      getThread(post.id).then(setComments);
    }
  }, [post.id]);

  const handleRootReply = useCallback(async () => {
    if (!replyText.trim() || !post.id) return;
    const newComment = await addCommentAction(post.id, null, replyText.trim());
    setComments((prev) => [...prev, newComment]);
    setReplyText("");
  }, [replyText, post.id]);

  const handleLike = useCallback(() => {
    const next = !liked;
    setLiked(next);
    setLikeCount(baseVotes + (next ? 1 : 0));
    if (next && heartRef.current) {
      spawnHeartParticles(heartRef.current);
    }
  }, [liked, baseVotes]);

  return (
    <div
      className="max-w-2xl mx-auto px-4 py-4 md:py-6"
      style={{ animation: "thread-enter 0.3s cubic-bezier(0.05, 0.7, 0.1, 1) both" }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors mb-4 group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        <span>{communityName}</span>
      </button>

      {/* ── Original Post ── */}
      <article
        className="bg-bg-surface rounded-xl border border-bg-elevated overflow-hidden"
        style={{ animation: "post-enter 0.25s cubic-bezier(0, 0, 0, 1) both" }}
      >
        {/* Post image */}
        {post.image ? (
          <div className="relative h-48 md:h-72">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-surface via-transparent to-transparent" />
          </div>
        ) : null}

        {post.video ? (
          <div className="relative h-48 md:h-72 cursor-pointer">
            <Image
              src={post.video.thumbnail}
              alt="Video thumbnail"
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                <Play size={28} className="text-bg-base ml-0.5" />
              </div>
            </div>
          </div>
        ) : null}

        <div className="p-4 md:p-6">
          {/* Author */}
          <div className="flex items-center gap-2.5 mb-4">
            <Avatar initials={post.initials} bg={post.avatarBg} src={post.avatarUrl} size={36} />
            <div>
              <div className="flex items-center gap-1.5 text-sm">
                <a href={`/explorations/profile/${post.author}`} className="font-bold text-text-primary hover:text-accent-secondary hover:underline transition-colors">{post.author}</a>
                {post.badges?.map((b) => (
                  <Badge key={b.label} variant={b.variant} label={b.label} icon={b.icon} />
                ))}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock size={10} /> {post.time}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={10} /> {typeof post.comments === "number" ? `${Math.round(post.comments * 22)}` : post.comments} views
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-serif text-xl md:text-2xl font-bold leading-snug mb-3">
            {post.title}
          </h1>

          {/* Body */}
          {post.body ? (
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              {post.body}
            </p>
          ) : null}

          {/* Link preview */}
          {post.linkPreview ? (
            <a
              href="#"
              className="flex gap-3 p-3 rounded-lg bg-bg-elevated border border-bg-overlay no-underline mb-4"
            >
              <Image
                src={post.linkPreview.image}
                alt={post.linkPreview.title}
                width={96}
                height={64}
                className="rounded object-cover shrink-0"
                style={{ width: 'auto', height: 'auto' }}
              />
              <div>
                <div className="text-sm font-semibold">{post.linkPreview.title}</div>
                <div className="text-xs text-text-muted flex items-center gap-1 mt-1">
                  <ExternalLink size={10} /> {post.linkPreview.domain}
                </div>
              </div>
            </a>
          ) : null}

          {/* Action bar */}
          <div className="flex items-center gap-1 pt-3 border-t border-bg-elevated">
            <button
              ref={heartRef}
              onClick={handleLike}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm tabular-nums transition-all ${
                liked
                  ? "text-[oklch(55%_0.2_20)] bg-[oklch(55%_0.2_20_/_0.1)]"
                  : "text-text-muted hover:text-text-secondary hover:bg-bg-elevated/60"
              }`}
            >
              <Heart
                size={16}
                strokeWidth={2.25}
                fill={liked ? "currentColor" : "none"}
                className={liked ? "motion-safe:animate-[heart-pop_0.7s_cubic-bezier(0.17,0.89,0.32,1.49)]" : ""}
              />
              {likeCount}
            </button>

            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-secondary hover:bg-bg-elevated/60 transition-all">
              <MessageCircle size={16} strokeWidth={2.25} />
              {post.comments}
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast("Copied to clipboard");
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-secondary hover:bg-bg-elevated/60 transition-all"
            >
              <Share2 size={16} strokeWidth={2.25} />
              Share
            </button>

            <button
              onClick={() => {
                const next = !saved;
                setSaved(next);
                if (next) setSaveCount((c) => c + 1);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all ${
                saved
                  ? "text-accent-primary bg-accent-primary/10"
                  : "text-text-muted hover:text-text-secondary hover:bg-bg-elevated/60"
              }`}
            >
              <Bookmark
                key={saveCount}
                size={16}
                strokeWidth={2.25}
                fill={saved ? "currentColor" : "none"}
                className={saveCount > 0 ? "motion-safe:animate-[bookmark-drop_0.7s_cubic-bezier(0.17,0.89,0.32,1.49)]" : ""}
              />
              {saved ? "Saved" : "Save"}
            </button>

            {/* More menu */}
            <div className="relative ml-auto">
              <button
                onClick={() => { setPostMenuOpen(!postMenuOpen); setActiveMenuId(null); }}
                className={`flex items-center px-2 py-2 rounded-lg transition-all ${
                  postMenuOpen
                    ? "text-text-secondary bg-bg-elevated/60"
                    : "text-text-muted hover:text-text-secondary hover:bg-bg-elevated/60"
                }`}
              >
                <MoreHorizontal size={16} />
              </button>
              {postMenuOpen ? (
                <>
                  <div className="fixed inset-0 z-[60]" onClick={() => setPostMenuOpen(false)} />
                  <div className="absolute right-0 bottom-full mb-1 z-[70] bg-bg-surface border border-bg-elevated rounded-lg shadow-[0_4px_16px_oklch(0%_0_0_/_0.3)] py-1 min-w-[150px]">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setPostMenuOpen(false);
                        toast("Copied to clipboard");
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
                    >
                      <Link2 size={13} />
                      Copy link
                    </button>
                    <div className="border-t border-bg-elevated my-1" />
                    <button
                      onClick={() => setPostMenuOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-text-muted hover:bg-bg-elevated hover:text-accent-destructive transition-colors"
                    >
                      <Flag size={13} />
                      Report post
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </article>

      {/* ── Sort bar ── */}
      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="font-serif text-base font-bold">
          {post.comments} Comments
        </h2>
        <div className="flex items-center gap-1 text-[11px] text-text-muted">
          <button className="px-2.5 py-1 rounded-md bg-bg-elevated text-text-secondary font-medium">
            Top
          </button>
          <button className="px-2.5 py-1 rounded-md hover:bg-bg-elevated/60 transition-colors">
            New
          </button>
          <button className="px-2.5 py-1 rounded-md hover:bg-bg-elevated/60 transition-colors">
            Old
          </button>
        </div>
      </div>

      {/* ── Comments thread ── */}
      <div className="space-y-5 pb-24">
        {comments.map((comment, i) => (
          <ThreadComment
            key={comment.id}
            comment={comment}
            index={i}
            parentDelay={0.05}
            activeReplyId={activeReplyId}
            onReplyToggle={setActiveReplyId}
            activeMenuId={activeMenuId}
            onMenuToggle={(id) => { setActiveMenuId(id); if (id) setPostMenuOpen(false); }}
          />
        ))}
      </div>

      {/* ── Sticky comment bar ── */}
      <div className="sticky bottom-0 left-0 right-0 bg-bg-base/80 backdrop-blur-xl border-t border-bg-elevated px-4 py-3">
        <div className="flex items-center gap-2.5 max-w-2xl mx-auto">
          <Avatar
            initials=""
            bg=""
            src="https://i.pravatar.cc/80?u=frontpage-demo"
            size={28}
          />
          <div
            className="flex-1 flex items-center gap-2 rounded-full bg-bg-elevated/60 border border-bg-overlay focus-within:border-accent-secondary/40 transition-colors px-3.5 py-2"
          >
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleRootReply(); }}
              placeholder="Add a comment…"
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
            />
            <button
              onClick={handleRootReply}
              disabled={!replyText.trim()}
              className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-accent-secondary text-white hover:bg-accent-secondary/80 disabled:opacity-30 transition-colors"
              aria-label="Send comment"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
