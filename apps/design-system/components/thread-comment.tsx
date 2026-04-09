"use client";

import { useState, useCallback, useRef } from "react";
import { Heart, MessageCircle, ChevronDown, MoreHorizontal } from "lucide-react";
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

interface ThreadCommentProps {
  comment: Comment;
  depth?: number;
  index?: number;
  parentDelay?: number;
}

const THREAD_COLORS = [
  "oklch(64.8% 0.147 259)", // indigo
  "oklch(72% 0.16 145)",    // green
  "oklch(70% 0.15 290)",    // purple
  "oklch(75% 0.18 75)",     // amber
  "oklch(65% 0.2 350)",     // rose
];

export function ThreadComment({ comment, depth = 0, index = 0, parentDelay = 0 }: ThreadCommentProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [voteCount, setVoteCount] = useState(comment.votes);
  const [replying, setReplying] = useState(false);
  const heartRef = useRef<HTMLButtonElement>(null);

  const threadColor = THREAD_COLORS[depth % THREAD_COLORS.length];
  const entryDelay = parentDelay + index * 0.06;
  const hasReplies = comment.replies && comment.replies.length > 0;

  const handleLike = useCallback(() => {
    const next = !liked;
    setLiked(next);
    setVoteCount(comment.votes + (next ? 1 : 0));
    if (next && heartRef.current) {
      spawnHeartParticles(heartRef.current);
    }
  }, [liked, comment.votes]);

  return (
    <div
      className="relative"
      style={{
        animation: `comment-enter 0.4s cubic-bezier(0, 0, 0.2, 1) ${entryDelay}s both`,
      }}
    >
      {/* Thread connector line */}
      {depth > 0 ? (
        <div
          className="absolute left-0 top-0 bottom-0 w-px"
          style={{ backgroundColor: threadColor, opacity: 0.25 }}
        />
      ) : null}

      <div className={depth > 0 ? "pl-4" : ""}>
        {/* Comment header */}
        <div className="flex items-start gap-2.5 group">
          <div className="shrink-0 mt-0.5">
            <Avatar initials={comment.initials} bg={comment.avatarBg} size={depth === 0 ? 32 : 26} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Author line */}
            <div className="flex items-center gap-1.5 text-xs">
              <strong className="text-text-primary">{comment.author}</strong>
              {comment.badges?.map((b) => (
                <Badge key={b.label} variant={b.variant} label={b.label} icon={b.icon} />
              ))}
              <span className="text-text-muted">&middot; {comment.time}</span>

              {/* Collapse toggle */}
              {hasReplies ? (
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="ml-auto text-text-muted hover:text-text-secondary transition-colors p-0.5 opacity-0 group-hover:opacity-100"
                  aria-label={collapsed ? "Expand replies" : "Collapse replies"}
                >
                  <ChevronDown
                    size={14}
                    className="transition-transform duration-200"
                    style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0)" }}
                  />
                </button>
              ) : null}
            </div>

            {/* Body */}
            <p className="text-sm text-text-secondary leading-relaxed mt-1">
              {comment.body}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-2 text-[11px] text-text-muted">
              <button
                ref={heartRef}
                onClick={handleLike}
                className={`flex items-center gap-1 tabular-nums transition-colors ${
                  liked ? "text-[oklch(55%_0.2_20)]" : "hover:text-text-secondary"
                }`}
              >
                <Heart
                  size={13}
                  fill={liked ? "currentColor" : "none"}
                  className={liked ? "motion-safe:animate-[heart-pop_0.7s_cubic-bezier(0.17,0.89,0.32,1.49)]" : ""}
                />
                {voteCount}
              </button>
              <button
                onClick={() => setReplying(!replying)}
                className={`flex items-center gap-1 transition-colors ${
                  replying ? "text-accent-secondary" : "hover:text-text-secondary"
                }`}
              >
                <MessageCircle size={13} />
                Reply
              </button>
              <button className="hover:text-text-secondary transition-colors ml-auto opacity-0 group-hover:opacity-100">
                <MoreHorizontal size={13} />
              </button>
            </div>

            {/* Reply composer */}
            {replying ? (
              <ReplyComposer
                onSubmit={() => setReplying(false)}
                onCancel={() => setReplying(false)}
              />
            ) : null}

            {/* Nested replies */}
            {hasReplies && !collapsed ? (
              <div className="mt-3 space-y-3">
                {comment.replies!.map((reply, i) => (
                  <ThreadComment
                    key={reply.id}
                    comment={reply}
                    depth={depth + 1}
                    index={i}
                    parentDelay={entryDelay + 0.08}
                  />
                ))}
              </div>
            ) : null}

            {/* Collapsed indicator */}
            {hasReplies && collapsed ? (
              <button
                onClick={() => setCollapsed(false)}
                className="mt-2 text-[11px] text-accent-secondary hover:text-accent-secondary/80 transition-colors flex items-center gap-1"
              >
                <ChevronDown size={12} className="-rotate-90" />
                {comment.replies!.length} {comment.replies!.length === 1 ? "reply" : "replies"} hidden
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
