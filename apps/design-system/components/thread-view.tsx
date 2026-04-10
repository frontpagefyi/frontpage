"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
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
  const { liked, count: likeCount, heartRef, toggle: toggleLike } = useLike(post.votes);
  const { saved, animKey: saveCount, toggle: toggleSave } = useSave();
  const [comments, setComments] = useState<Comment[]>(initialComments ?? []);
  const [replyText, setReplyText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
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
  const [commentSort, setCommentSort] = useState<"top" | "new" | "old">("top");
  const sortedComments = useMemo(() => sortComments(comments, commentSort), [comments, commentSort]);

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
    const url = new URL(window.location.href);
    if (stack.length > 0) {
      url.searchParams.set("thread", stack[stack.length - 1].id);
    } else {
      url.searchParams.delete("thread");
    }
    window.history.pushState({}, "", url.toString());
  }, []);

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

  const handleSubmitReply = useCallback(async () => {
    if (!replyText.trim() || !post.id) return;
    const newComment = await addCommentAction(post.id, activeReplyId, replyText.trim());
    if (activeReplyId) {
      // Replied to a comment — reload thread to show it nested
      const updated = await getThread(post.id);
      setComments(updated);
      setActiveReplyId(null);
    } else {
      setComments((prev) => [...prev, newComment]);
    }
    setReplyText("");
  }, [replyText, post.id, activeReplyId]);


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
                <a href={routes.profile(post.author)} className="font-bold text-text-primary hover:text-accent-secondary hover:underline transition-colors">{post.author}</a>
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
              {renderWithMentions(post.body)}
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
          {sortedComments.map((comment, i) => (
            <ThreadComment
              key={comment.id}
              comment={comment}
              index={i}
              parentDelay={0.05}
              activeReplyId={activeReplyId}
              onReplyToggle={setActiveReplyId}
              activeMenuId={activeMenuId}
              onMenuToggle={(id) => { setActiveMenuId(id); if (id) setPostMenuOpen(false); }}
              onContinueThread={(c) => { const next = [...threadStack, c]; setThreadStack(next); updateThreadUrl(next); }}
            />
          ))}
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
