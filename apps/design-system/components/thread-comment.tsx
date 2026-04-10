"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Share2, Link2, Flag, ChevronRight } from "lucide-react";
import { MoreMenu } from "./more-menu";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import type { Comment } from "@/lib/types";
import { toast } from "@/lib/toast";
import { renderWithMentions } from "@/lib/mention";
import { routes } from "@/lib/constants";
import { useLike } from "@/lib/use-like";

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
  onContinueThread?: (comment: Comment) => void;
}

const MAX_VISUAL_DEPTH = 3;

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
  onContinueThread,
}: ThreadCommentProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { liked, animating: likeAnimating, count: voteCount, heartRef, toggle: handleLike } = useLike(comment.id, comment.votes, comment.voted, "comment", "sm");

  const threadColor = THREAD_COLORS[depth % THREAD_COLORS.length];
  const entryDelay = parentDelay + index * 0.03;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isReplying = activeReplyId === comment.id;
  const isMenuOpen = activeMenuId === comment.id;
  const totalReplies = hasReplies ? countAllReplies(comment) : 0;

  const handleCopyLink = useCallback(() => {
    const url = new URL(window.location.href);
    url.hash = `comment-${comment.id}`;
    navigator.clipboard.writeText(url.toString());
    onMenuToggle(null);
    toast("Copied to clipboard");
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
            <Avatar initials={comment.initials} bg={comment.avatarBg} src={comment.avatarUrl} size={20} />
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
              <Avatar initials={comment.initials} bg={comment.avatarBg} src={comment.avatarUrl} size={depth === 0 ? 32 : 26} />
            </div>

            <div className="flex-1 min-w-0">
              {/* Author line */}
              <div className="flex items-center gap-1.5 text-xs">
                <Link
                  href={routes.profile(comment.author)}
                  className="font-bold text-text-primary hover:text-accent-secondary hover:underline transition-colors"
                >
                  {comment.author}
                </Link>
                {comment.badges?.map((b) => (
                  <Badge key={b.label} variant={b.variant} label={b.label} icon={b.icon} />
                ))}
                <span className="text-text-muted">&middot; {comment.time}</span>
              </div>

              {/* Body — click to collapse children (only if not selecting text) */}
              <p
                className="text-sm text-text-secondary leading-relaxed mt-1 select-text cursor-pointer"
                onClick={() => {
                  const sel = window.getSelection();
                  if (sel && sel.toString().length > 0) return;
                  setCollapsed(true);
                }}
              >
                {renderWithMentions(comment.body)}
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
                    strokeWidth={2.25}
                    fill={liked ? "currentColor" : "none"}
                    className={likeAnimating ? "motion-safe:animate-[heart-pop_0.7s_cubic-bezier(0.17,0.89,0.32,1.49)]" : ""}
                  />
                  {voteCount}
                </button>
                <button
                  onClick={() => onReplyToggle(isReplying ? null : comment.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    isReplying ? "text-accent-secondary" : "hover:text-text-secondary"
                  }`}
                >
                  <MessageCircle size={14} strokeWidth={2.25} />
                  Reply
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 hover:text-text-secondary transition-colors"
                >
                  <Share2 size={14} strokeWidth={2.25} />
                  Share
                </button>

                {/* More menu */}
                <MoreMenu
                  open={isMenuOpen}
                  onToggle={() => onMenuToggle(isMenuOpen ? null : comment.id)}
                  onClose={() => onMenuToggle(null)}
                  position="below"
                  items={[
                    { icon: <Link2 size={13} />, label: "Copy link", onClick: handleCopyLink },
                    { icon: <Flag size={13} />, label: "Report", destructive: true, onClick: () => onMenuToggle(null) },
                  ]}
                />
              </div>

              {/* Reply indicator — composer rendered at root level by ThreadView */}
              {isReplying ? (
                <div className="text-[11px] text-accent-secondary mt-2">Replying...</div>
              ) : null}

              {/* Nested replies — cap at MAX_VISUAL_DEPTH then show "Continue thread" */}
              {hasReplies ? (
                depth >= MAX_VISUAL_DEPTH ? (
                  <button
                    onClick={() => onContinueThread?.(comment)}
                    className="mt-3 text-xs text-accent-secondary hover:text-accent-secondary/80 transition-colors flex items-center gap-1"
                  >
                    Continue this thread ({totalReplies} more) →
                  </button>
                ) : (
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
                        onContinueThread={onContinueThread}
                      />
                    ))}
                  </div>
                )
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
