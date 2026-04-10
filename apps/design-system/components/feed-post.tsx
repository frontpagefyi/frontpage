"use client";

import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ExternalLink,
  Play,
  Link2,
  Flag,
  Ban,
} from "lucide-react";
import { MoreMenu } from "./more-menu";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import type { Post } from "@/lib/types";
import { renderWithMentions } from "@/lib/mention";
import { routes, ANIM } from "@/lib/constants";
import { useLike } from "@/lib/use-like";
import { useSave } from "@/lib/use-save";

interface FeedPostProps {
  post: Post;
  showCommunity?: boolean;
  onCommunityClick?: () => void;
  style?: React.CSSProperties;
  onCommentClick?: () => void;
}

export function FeedPost({ post, showCommunity, onCommunityClick, style, onCommentClick }: FeedPostProps) {
  const { liked, count: likeCount, heartRef, toggle: toggleLike } = useLike(post.votes);
  const { saved, animKey: saveCount, toggle: toggleSave } = useSave();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article
      className="bg-bg-surface rounded-xl border border-bg-elevated p-4 space-y-4 motion-safe:transition-[transform,border-color,box-shadow] motion-safe:duration-200 hover:translate-y-[-2px] hover:border-[oklch(100%_0_0_/_0.12)] hover:shadow-[0_4px_20px_oklch(0%_0_0_/_0.15)]"
      style={style}
    >
      <div className="flex items-start gap-2 text-xs text-text-muted">
        {/* Stacked avatar: community icon + user avatar overlay (dev.to pattern) */}
        {showCommunity && post.communityIcon ? (
          <button
            onClick={(e) => { e.stopPropagation(); onCommunityClick?.(); }}
            className="relative shrink-0 mt-0.5"
          >
            <Image
              src={post.communityIcon}
              alt={post.communityName ?? ""}
              width={28}
              height={28}
              className="rounded-lg object-cover"
              style={{ width: 28, height: 28 }}
            />
            {post.avatarUrl ? (
              <Image
                src={post.avatarUrl}
                alt={post.author}
                width={16}
                height={16}
                className="absolute -bottom-1 -right-1 rounded-full object-cover ring-2 ring-bg-surface"
                style={{ width: 16, height: 16 }}
              />
            ) : (
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-2 ring-bg-surface flex items-center justify-center text-[6px] font-bold text-white"
                style={{ backgroundColor: post.avatarBg }}
              >
                {post.initials?.charAt(0).toUpperCase()}
              </div>
            )}
          </button>
        ) : (
          <Avatar initials={post.initials} bg={post.avatarBg} src={post.avatarUrl} size={24} />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <a href={routes.profile(post.author)} className="font-bold text-text-primary hover:text-accent-secondary hover:underline transition-colors">{post.author}</a>
            {post.badges?.map((b) => (
              <Badge key={b.label} variant={b.variant} label={b.label} icon={b.icon} />
            ))}
            <span>&middot; {post.time}</span>
          </div>
          {showCommunity && post.communityName ? (
            <button
              onClick={(e) => { e.stopPropagation(); onCommunityClick?.(); }}
              className="text-[11px] text-text-muted hover:text-accent-secondary transition-colors"
            >
              {post.communityName}
            </button>
          ) : null}
        </div>
      </div>

      <h3 className="font-serif text-lg font-semibold leading-snug">
        {post.title}
      </h3>

      {post.image ? (
        <div className="rounded-lg overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            width={600}
            height={400}
            className="w-full aspect-video object-cover"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      ) : null}
      {post.body ? (
        <p className="text-sm text-text-secondary leading-relaxed">
          {renderWithMentions(post.body)}
        </p>
      ) : null}
      {post.linkPreview ? (
        <a
          href="#"
          className="flex gap-3 p-3 rounded-lg bg-bg-elevated border border-bg-overlay no-underline"
        >
          <Image
            src={post.linkPreview.image}
            alt={post.linkPreview.title}
            width={96}
            height={64}
            className="rounded object-cover shrink-0"
            style={{ width: 96, height: 64 }}
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
          <Image
            src={post.video.thumbnail}
            alt="Video thumbnail"
            width={600}
            height={400}
            className="w-full aspect-video object-cover"
            style={{ width: '100%', height: 'auto' }}
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
          onClick={toggleLike}
          className={`relative flex items-center gap-1.5 tabular-nums motion-safe:transition-colors hover:translate-y-[-1px] active:translate-y-0 active:scale-[0.97] ${
            liked
              ? "text-[oklch(55%_0.2_20)]"
              : "hover:text-text-secondary"
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
        <button
          onClick={onCommentClick}
          className="flex items-center gap-1.5 hover:text-text-secondary hover:translate-y-[-1px] active:translate-y-0 active:scale-[0.97] motion-safe:transition-colors cursor-pointer"
        >
          <MessageCircle size={16} strokeWidth={2.25} /> {post.comments}
        </button>
        <button className="flex items-center gap-1.5 hover:text-text-secondary hover:translate-y-[-1px] active:translate-y-0 active:scale-[0.97] motion-safe:transition-colors cursor-pointer">
          <Share2 size={16} strokeWidth={2.25} /> Share
        </button>
        <button
          onClick={toggleSave}
          className={`flex items-center gap-1.5 hover:translate-y-[-1px] active:translate-y-0 active:scale-[0.97] motion-safe:transition-colors cursor-pointer ${
            saved ? "text-accent-primary" : "hover:text-text-secondary"
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
        <div className="ml-auto">
          <MoreMenu
            open={menuOpen}
            onToggle={() => setMenuOpen(!menuOpen)}
            onClose={() => setMenuOpen(false)}
            position="above"
            items={[
              { icon: <Link2 size={13} />, label: "Copy link", onClick: () => {
                const url = post.id
                  ? `${window.location.origin}/explorations/community-feed?post=${post.id}`
                  : window.location.href;
                navigator.clipboard.writeText(url);
                toast("Copied to clipboard");
                setMenuOpen(false);
              }},
              { icon: <Flag size={13} />, label: "Report post", destructive: true, onClick: () => { toast("Post reported"); setMenuOpen(false); }},
              { icon: <Ban size={13} />, label: "Block user", destructive: true, onClick: () => { toast(`Blocked ${post.author}`); setMenuOpen(false); }},
            ]}
          />
        </div>
      </div>
    </article>
  );
}
