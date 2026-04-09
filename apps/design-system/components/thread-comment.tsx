"use client";

import { useState, useCallback, useRef } from "react";
import { Heart, MessageCircle, Share2, Link2, Flag, ChevronRight, MoreHorizontal } from "lucide-react";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { ReplyComposer } from "./reply-composer";
import type { Comment } from "@/lib/types";

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
    const dist = 20 + Math.random() * 20;
    const el = document.createElement("span");
    el.textContent = "♥";
    el.style.cssText = `
      position:absolute;left:50%;top:50%;pointer-events:none;font-size:${8 + Math.random() * 4}px;
      color:${colors[i]};z-index:10;
      --hx:${Math.cos(angle) * dist}px;--hy:${Math.sin(angle) * dist}px;
      --hs:${0.3 + Math.random() * 0.7};--hr:${Math.random() * 90 - 45}deg;
      animation:heart-float ${0.9 + Math.random() * 0.4}s ease-out forwards;
    `;
    container.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

function countAllReplies(comment: Comment): number {
  if (!comment.replies) return 0;
  return comment.replies.reduce((sum, r) => sum + 1 + countAllReplies(r), 0);
}

interface ThreadCommentProps {
  comment: Comment;
  depth?: number;
  index?: number;
  parentDelay?: number;
  activeReplyId: string | null;
  onReplyToggle: (id: string | null) => void;
  activeMenuId: string | null;
  onMenuToggle: (id: string | null) => void;
}

const THREAD_COLORS = [
  "oklch(64.8% 0.147 259)", // indigo
  "oklch(72% 0.16 145)",    // green
  "oklch(70% 0.15 290)",    // purple
  "oklch(75% 0.18 75)",     // amber
  "oklch(65% 0.2 350)",     // rose
];

export function ThreadComment({
  comment,
  depth = 0,
  index = 0,
  parentDelay = 0,
  activeReplyId,
  onReplyToggle,
  activeMenuId,
  onMenuToggle,
}: ThreadCommentProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [voteCount, setVoteCount] = useState(comment.votes);
  const heartRef = useRef<HTMLButtonElement>(null);

  const threadColor = THREAD_COLORS[depth % THREAD_COLORS.length];
  const entryDelay = parentDelay + index * 0.03;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isReplying = activeReplyId === comment.id;
  const isMenuOpen = activeMenuId === comment.id;
  const totalReplies = hasReplies ? countAllReplies(comment) : 0;

  const handleLike = useCallback(() => {
    const next = !liked;
    setLiked(next);
    setVoteCount(comment.votes + (next ? 1 : 0));
    if (next && heartRef.current) {
      spawnHeartParticles(heartRef.current);
    }
  }, [liked, comment.votes]);

  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}#comment-${comment.id}`;
    navigator.clipboard.writeText(url);
    onMenuToggle(null);
  }, [comment.id, onMenuToggle]);

  return (
    <div
      className="relative"
      id={`comment-${comment.id}`}
      style={{
        animation: `comment-enter 0.25s cubic-bezier(0, 0, 0, 1) ${entryDelay}s both`,
      }}
    >
      {/* Clickable thread line */}
      {depth > 0 ? (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute left-0 top-0 bottom-0 w-4 group/line cursor-pointer z-[1]"
          aria-label={collapsed ? "Expand thread" : "Collapse thread"}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full transition-[width,opacity] group-hover/line:w-1 group-hover/line:opacity-50"
            style={{ backgroundColor: threadColor, opacity: 0.2 }}
          />
        </button>
      ) : null}

      <div className={depth > 0 ? "pl-4" : ""}>
        {/* Collapsed state */}
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="flex items-center gap-2 py-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors w-full text-left"
          >
            <Avatar initials={comment.initials} bg={comment.avatarBg} size={20} />
            <strong className="text-text-primary">{comment.author}</strong>
            <span>&middot; {comment.time}</span>
            <span className="text-accent-secondary flex items-center gap-0.5">
              <ChevronRight size={11} />
              {totalReplies > 0 ? `${totalReplies + 1} comments` : "expand"}
            </span>
          </button>
        ) : (
          <div className="flex items-start gap-2.5 group">
            <div className="shrink-0 mt-0.5">
              <Avatar initials={comment.initials} bg={comment.avatarBg} size={depth === 0 ? 32 : 26} />
            </div>

            <div className="flex-1 min-w-0">
              {/* Author line */}
              <div className="flex items-center gap-1.5 text-xs">
                {hasReplies ? (
                  <button
                    onClick={() => setCollapsed(true)}
                    className="flex items-center gap-1.5 hover:text-accent-secondary transition-colors"
                  >
                    <strong className="text-text-primary">{comment.author}</strong>
                  </button>
                ) : (
                  <strong className="text-text-primary">{comment.author}</strong>
                )}
                {comment.badges?.map((b) => (
                  <Badge key={b.label} variant={b.variant} label={b.label} icon={b.icon} />
                ))}
                <span className="text-text-muted">&middot; {comment.time}</span>
              </div>

              {/* Body — selectable text */}
              <p className="text-sm text-text-secondary leading-relaxed mt-1 select-text">
                {comment.body}
              </p>

              {/* Actions — bigger, inline */}
              <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                <button
                  ref={heartRef}
                  onClick={handleLike}
                  className={`relative flex items-center gap-1.5 tabular-nums transition-colors ${
                    liked ? "text-[oklch(55%_0.2_20)]" : "hover:text-text-secondary"
                  }`}
                >
                  <Heart
                    size={14}
                    fill={liked ? "currentColor" : "none"}
                    className={liked ? "motion-safe:animate-[heart-pop_0.7s_cubic-bezier(0.17,0.89,0.32,1.49)]" : ""}
                  />
                  {voteCount}
                </button>
                <button
                  onClick={() => onReplyToggle(isReplying ? null : comment.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    isReplying ? "text-accent-secondary" : "hover:text-text-secondary"
                  }`}
                >
                  <MessageCircle size={14} />
                  Reply
                </button>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}${window.location.pathname}#comment-${comment.id}`;
                    navigator.clipboard.writeText(url);
                  }}
                  className="flex items-center gap-1.5 hover:text-text-secondary transition-colors"
                >
                  <Share2 size={14} />
                  Share
                </button>

                {/* More menu */}
                <div className="relative">
                  <button
                    onClick={() => onMenuToggle(isMenuOpen ? null : comment.id)}
                    className={`flex items-center transition-colors ${
                      isMenuOpen ? "text-text-secondary" : "opacity-0 group-hover:opacity-100 hover:text-text-secondary"
                    }`}
                  >
                    <MoreHorizontal size={14} />
                  </button>
                  {isMenuOpen ? (
                    <>
                      <div className="fixed inset-0 z-[60]" onClick={() => onMenuToggle(null)} />
                      <div className="absolute left-0 top-full mt-1 z-[70] bg-bg-surface border border-bg-elevated rounded-lg shadow-[0_4px_16px_oklch(0%_0_0_/_0.3)] py-1 min-w-[140px]">
                        <button
                          onClick={handleCopyLink}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
                        >
                          <Link2 size={13} />
                          Copy link
                        </button>
                        <div className="border-t border-bg-elevated my-1" />
                        <button
                          onClick={() => onMenuToggle(null)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-text-muted hover:bg-bg-elevated hover:text-accent-destructive transition-colors"
                        >
                          <Flag size={13} />
                          Report
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Reply composer */}
              {isReplying ? (
                <ReplyComposer
                  onSubmit={() => onReplyToggle(null)}
                  onCancel={() => onReplyToggle(null)}
                />
              ) : null}

              {/* Nested replies */}
              {hasReplies ? (
                <div className="mt-3 space-y-3">
                  {comment.replies!.map((reply, i) => (
                    <ThreadComment
                      key={reply.id}
                      comment={reply}
                      depth={depth + 1}
                      index={i}
                      parentDelay={entryDelay + 0.04}
                      activeReplyId={activeReplyId}
                      onReplyToggle={onReplyToggle}
                      activeMenuId={activeMenuId}
                      onMenuToggle={onMenuToggle}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
