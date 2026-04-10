"use client";

import { useState, useCallback, useRef, useEffect, useMemo, useOptimistic, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
  Link2,
  Flag,
} from "lucide-react";
import { MoreMenu } from "./more-menu";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { ThreadComment } from "./thread-comment";
import { GooBlobs } from "./goo-blobs";
import { useGooBlob } from "@/lib/use-goo-blob";
import { getThread, addComment as addCommentAction } from "@/lib/actions/posts";
import type { Post, Comment } from "@/lib/types";
import { toast } from "@/lib/toast";
import { renderWithMentions } from "@/lib/mention";
import { routes, CURRENT_USER, ANIM } from "@/lib/constants";
import { useLike } from "@/lib/use-like";
import { useSave } from "@/lib/use-save";

function sortComments(comments: Comment[], sort: "top" | "new" | "old"): Comment[] {
  const sorted = [...comments];
  switch (sort) {
    case "top":
      return sorted.sort((a, b) => b.votes - a.votes);
    case "new":
      return sorted.reverse();
    case "old":
      return sorted;
  }
}

function findComment(comments: Comment[], id: string): Comment | null {
  for (const c of comments) {
    if (c.id === id) return c;
    if (c.replies) {
      const found = findComment(c.replies, id);
      if (found) return found;
    }
  }
  return null;
}

interface ThreadViewProps {
  post: Post;
  initialComments?: Comment[];
  communityName: string;
  onBack: () => void;
}

export function ThreadView({ post, initialComments, communityName, onBack }: ThreadViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const { liked, animating: likeAnimating, count: likeCount, heartRef, toggle: toggleLike } = useLike(post.id, post.votes, post.voted, "post");
  const { saved, animKey: saveCount, toggle: toggleSave } = useSave(post.id, post.saved);
  const [comments, setComments] = useState<Comment[]>(initialComments ?? []);
  const [optimisticComments, addOptimisticComment] = useOptimistic<Comment[], Comment>(
    comments,
    (state, newComment) => [...state, newComment],
  );
  const [replyText, setReplyText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [scrollToId, setScrollToId] = useState<string | null>(null);
  const [activeReplyId, _setActiveReplyId] = useState<string | null>(null);
  const setActiveReplyId = useCallback((id: string | null) => {
    _setActiveReplyId(id);
    if (id) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }, []);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const [commentSort, _setCommentSort] = useState<"top" | "new" | "old">(() => {
    if (typeof window === "undefined") return "top";
    const param = new URLSearchParams(window.location.search).get("csort");
    return param === "new" || param === "old" ? param : "top";
  });
  const setCommentSort = useCallback((sort: "top" | "new" | "old") => {
    _setCommentSort(sort);
    const params = new URLSearchParams(window.location.search);
    if (sort === "top") params.delete("csort");
    else params.set("csort", sort);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname]);
  const sortedComments = useMemo(() => sortComments(optimisticComments, commentSort), [optimisticComments, commentSort]);

  // Memoized author set for @mention autocomplete
  const allAuthors = useMemo(() => {
    const authors = new Set<string>();
    const collect = (list: Comment[]) => { for (const c of list) { authors.add(c.author); if (c.replies) collect(c.replies); } };
    collect(comments);
    authors.add(post.author);
    return [...authors];
  }, [comments, post.author]);
  const commentSortOptions = ["top", "new", "old"] as const;
  const commentSortIndex = commentSortOptions.indexOf(commentSort);
  const { containerRef: sortRef, setItemRef: setSortItemRef, pill: sortPill } = useGooBlob(commentSortIndex);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [threadStack, setThreadStack] = useState<Comment[]>([]);

  // Sync thread stack with URL (&thread=id)
  const updateThreadUrl = useCallback((stack: Comment[]) => {
    const params = new URLSearchParams(window.location.search);
    if (stack.length > 0) {
      params.set("thread", stack[stack.length - 1].id);
    } else {
      params.delete("thread");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname]);

  // Sync comments when initialComments prop updates (from parent async fetch)
  useEffect(() => {
    if (initialComments && initialComments.length > 0) {
      setComments(initialComments);
      // Restore sub-thread from URL
      const threadId = new URLSearchParams(window.location.search).get("thread");
      if (threadId) {
        const found = findComment(initialComments, threadId);
        if (found) setThreadStack([found]);
      }
    }
  }, [initialComments]);

  // Fallback: fetch if no initial comments provided
  useEffect(() => {
    if ((!initialComments || initialComments.length === 0) && post.id) {
      getThread(post.id).then((loaded) => {
        setComments(loaded);
        const threadId = new URLSearchParams(window.location.search).get("thread");
        if (threadId) {
          const found = findComment(loaded, threadId);
          if (found) setThreadStack([found]);
        }
      });
    }
  }, [post.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle browser back/forward for thread stack
  const commentsRef = useRef(comments);
  commentsRef.current = comments;
  useEffect(() => {
    const onPopState = () => {
      const threadId = new URLSearchParams(window.location.search).get("thread");
      if (threadId) {
        const found = findComment(commentsRef.current, threadId);
        setThreadStack(found ? [found] : []);
      } else {
        setThreadStack([]);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Callback ref — scrolls element into view when React attaches it
  const scrollRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      requestAnimationFrame(() => {
        node.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }, []);

  const handleSubmitReply = useCallback(() => {
    if (!replyText.trim() || !post.id) return;
    const body = replyText.trim();
    const postId = post.id;
    const replyId = activeReplyId;
    setReplyText("");

    startTransition(async () => {
      // Optimistic comment shown immediately (top-level only)
      if (!replyId) {
        const optimisticId = `optimistic_${Date.now()}`;
        addOptimisticComment({
          id: optimisticId,
          author: CURRENT_USER.username,
          initials: CURRENT_USER.initials,
          avatarBg: CURRENT_USER.avatarBg,
          avatarUrl: CURRENT_USER.avatarUrl,
          badges: [],
          body,
          time: "just now",
          votes: 0,
          replies: [],
        });
        setScrollToId(optimisticId);
      }

      const newComment = await addCommentAction(postId, replyId, body);
      if (replyId) {
        // Nested reply — fetch full tree so the new reply appears in the right place
        const updated = await getThread(postId);
        setComments(updated);
        setActiveReplyId(null);
        setScrollToId(newComment.id);
      } else {
        // Top-level — replace optimistic with confirmed. Don't re-scroll since
        // the optimistic entry already scrolled into view at the same position.
        setComments((prev) => [...prev, newComment]);
      }
    });
  }, [replyText, post.id, activeReplyId, addOptimisticComment, startTransition]);


  return (
    <div
      className="max-w-2xl mx-auto px-4 py-4 md:py-6"
      style={{ animation: "thread-enter 0.3s cubic-bezier(0.05, 0.7, 0.1, 1) both" }}
    >
      {/* Back button — pops thread stack first, then exits thread view */}
      <button
        onClick={() => {
          if (threadStack.length > 0) {
            const next = threadStack.slice(0, -1);
            setThreadStack(next);
            updateThreadUrl(next);
          } else {
            onBack();
          }
        }}
        className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors mb-4 group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        <span>{threadStack.length > 0 ? "Back to thread" : communityName}</span>
      </button>

      {/* ── Original Post ── */}
      <article
        className="bg-bg-surface rounded-xl border border-bg-elevated overflow-hidden"
        style={{ animation: "post-enter 0.25s cubic-bezier(0, 0, 0, 1) both" }}
      >
        {/* Post image */}
        {post.image ? (
          <div className="rounded-lg overflow-hidden max-h-[560px] flex items-center bg-bg-elevated">
            <Image
              src={post.image}
              alt={post.title}
              width={672}
              height={400}
              className="w-full object-contain max-h-[560px]"
              style={{ width: '100%', height: 'auto' }}
              unoptimized
            />
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
              unoptimized
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
                <Link href={routes.profile(post.author)} className="font-bold text-text-primary hover:text-accent-secondary hover:underline transition-colors">{post.author}</Link>
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

          {/* Link preview — above body so the link is main content, body is commentary */}
          {post.linkPreview ? (
            <a
              href={post.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg bg-bg-elevated border border-bg-overlay no-underline overflow-hidden mb-4"
            >
              {post.linkPreview.image ? (
                <Image
                  src={post.linkPreview.image}
                  alt={post.linkPreview.title}
                  width={600}
                  height={315}
                  className="w-full aspect-[1.91/1] object-cover"
                  style={{ width: "100%", height: "auto" }}
                  unoptimized
                />
              ) : null}
              <div className="px-3 py-2.5">
                <div className="text-sm font-semibold leading-snug">{post.linkPreview.title}</div>
                <div className="text-xs text-text-muted flex items-center gap-1 mt-1">
                  <ExternalLink size={10} /> {post.linkPreview.domain}
                </div>
              </div>
            </a>
          ) : null}

          {/* Body */}
          {post.body ? (
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              {renderWithMentions(post.body)}
            </p>
          ) : null}

          {/* Action bar */}
          <div className="flex items-center gap-1 pt-3 border-t border-bg-elevated">
            <button
              ref={heartRef}
              onClick={toggleLike}
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
                className={likeAnimating ? "motion-safe:animate-[heart-pop_0.7s_cubic-bezier(0.17,0.89,0.32,1.49)]" : ""}
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
              onClick={toggleSave}
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
            <div className="ml-auto">
              <MoreMenu
                open={postMenuOpen}
                onToggle={() => { setPostMenuOpen(!postMenuOpen); setActiveMenuId(null); }}
                onClose={() => setPostMenuOpen(false)}
                position="above"
                items={[
                  { icon: <Link2 size={13} />, label: "Copy link", onClick: () => {
                    navigator.clipboard.writeText(window.location.href);
                    setPostMenuOpen(false);
                    toast("Copied to clipboard");
                  }},
                  { icon: <Flag size={13} />, label: "Report post", destructive: true, onClick: () => setPostMenuOpen(false) },
                ]}
              />
            </div>
          </div>
        </div>
      </article>

      {/* ── Sort bar ── */}
      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="font-serif text-base font-bold">
          {post.comments} Comments
        </h2>
        <div ref={sortRef as React.RefObject<HTMLDivElement>} className="relative flex items-center gap-1 text-[11px] text-text-muted">
          <GooBlobs filterId="goo-comment-sort" pill={sortPill} className="rounded-md" />
          {commentSortOptions.map((key, i) => (
            <button
              key={key}
              ref={setSortItemRef(i)}
              onClick={() => setCommentSort(key)}
              className={`relative z-10 px-2.5 py-1 rounded-md transition-colors capitalize ${
                commentSort === key ? "text-text-primary font-medium" : "hover:text-text-secondary"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* ── Comments thread ── */}
      {threadStack.length > 0 ? (
        <>
          <button
            onClick={() => { const next = threadStack.slice(0, -1); setThreadStack(next); updateThreadUrl(next); }}
            className="flex items-center gap-1.5 text-xs text-accent-secondary hover:text-accent-secondary/80 transition-colors mb-4"
          >
            ← Back to full thread
          </button>
          <div className="space-y-5 pb-24">
            <ThreadComment
              key={threadStack[threadStack.length - 1].id}
              comment={threadStack[threadStack.length - 1]}
              index={0}
              parentDelay={0.05}
              activeReplyId={activeReplyId}
              onReplyToggle={setActiveReplyId}
              activeMenuId={activeMenuId}
              onMenuToggle={(id) => { setActiveMenuId(id); if (id) setPostMenuOpen(false); }}
              onContinueThread={(c) => { const next = [...threadStack, c]; setThreadStack(next); updateThreadUrl(next); }}
            />
          </div>
        </>
      ) : (
        <div className="space-y-5 pb-24">
          {sortedComments.map((comment, i) => {
            const isLast = i === sortedComments.length - 1;
            const isOptimistic = comment.id.startsWith("optimistic_");
            return (
              <div
                key={comment.id}
                ref={comment.id === scrollToId ? scrollRef : undefined}
                className={isOptimistic ? "opacity-60" : undefined}
              >
                <ThreadComment
                  comment={comment}
                  index={i}
                  parentDelay={0.05}
                  activeReplyId={activeReplyId}
                  onReplyToggle={setActiveReplyId}
                  activeMenuId={activeMenuId}
                  onMenuToggle={(id) => { setActiveMenuId(id); if (id) setPostMenuOpen(false); }}
                  onContinueThread={(c) => { const next = [...threadStack, c]; setThreadStack(next); updateThreadUrl(next); }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* ── Sticky comment bar ── */}
      <div className="sticky bottom-0 left-0 right-0 bg-bg-base/80 backdrop-blur-xl border-t border-bg-elevated px-4 py-3">
        {activeReplyId ? (() => {
          const replyTarget = findComment(comments, activeReplyId);
          return (
            <div className="flex items-center gap-2 max-w-2xl mx-auto mb-2">
              <div className="flex-1 min-w-0 flex items-center gap-1.5 text-[11px]">
                <span className="text-accent-secondary shrink-0">Replying to</span>
                <strong className="text-text-primary shrink-0">{replyTarget?.author ?? "comment"}</strong>
                <span className="text-text-muted truncate">{replyTarget?.body}</span>
              </div>
              <button
                onClick={() => setActiveReplyId(null)}
                className="text-[11px] text-text-muted hover:text-text-secondary transition-colors shrink-0"
              >
                ✕
              </button>
            </div>
          );
        })() : null}
        <div className="flex items-center gap-2.5 max-w-2xl mx-auto">
          <Avatar
            initials=""
            bg=""
            src={CURRENT_USER.avatarUrl}
            size={28}
          />
          <div
            className="relative flex-1 flex items-center gap-2 rounded-full bg-bg-elevated/60 border border-bg-overlay focus-within:border-accent-secondary/40 transition-colors px-3.5 py-2 focus-visible:outline-none"
          >
            {/* @mention autocomplete */}
            {mentionQuery !== null ? (() => {
              const filtered = allAuthors.filter((a) =>
                a.toLowerCase().includes(mentionQuery.toLowerCase())
              ).slice(0, 5);

              return filtered.length > 0 ? (
                <div className="absolute bottom-full left-0 mb-1 w-full bg-bg-surface border border-bg-elevated rounded-lg shadow-[0_8px_24px_oklch(0%_0_0_/_0.4)] py-1 z-[70]">
                  {filtered.map((username) => (
                    <button
                      key={username}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const before = replyText.slice(0, replyText.lastIndexOf("@"));
                        setReplyText(before + "@" + username + " ");
                        setMentionQuery(null);
                        inputRef.current?.focus();
                      }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
                    >
                      <span className="text-accent-secondary">@</span>
                      {username}
                    </button>
                  ))}
                </div>
              ) : null;
            })() : null}

            <input
              ref={inputRef}
              type="text"
              value={replyText}
              onChange={(e) => {
                const val = e.target.value;
                setReplyText(val);
                // Detect @mention typing
                const atIdx = val.lastIndexOf("@");
                if (atIdx >= 0 && (atIdx === 0 || val[atIdx - 1] === " ")) {
                  const query = val.slice(atIdx + 1);
                  if (!query.includes(" ")) {
                    setMentionQuery(query);
                    return;
                  }
                }
                setMentionQuery(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setMentionQuery(null);
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmitReply();
              }}
              placeholder={activeReplyId ? "Write a reply\u2026" : "Add a comment\u2026"}
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none focus-visible:outline-none"
            />
            <button
              onClick={handleSubmitReply}
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
