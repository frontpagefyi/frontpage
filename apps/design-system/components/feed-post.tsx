"use client";

import { Heart, MessageCircle, Share2, Bookmark, ExternalLink, Play } from "lucide-react";
import { useState } from "react";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import type { Post } from "@/lib/types";

export function FeedPost({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);

  return (
    <article className="bg-bg-surface rounded-xl border border-bg-elevated p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <Avatar initials={post.initials} bg={post.avatarBg} size={24} />
        <strong className="text-text-primary">{post.author}</strong>
        {post.badges?.map((b) => (
          <Badge key={b.label} variant={b.variant} label={b.label} icon={b.icon} />
        ))}
        <span>&middot; {post.time}</span>
      </div>

      <h3 className="font-serif text-base font-semibold leading-snug">{post.title}</h3>

      {post.image && (
        <div className="rounded-lg overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full object-cover" />
        </div>
      )}
      {post.body && (
        <p className="text-sm text-text-secondary leading-relaxed">{post.body}</p>
      )}
      {post.linkPreview && (
        <a href="#" className="flex gap-3 p-3 rounded-lg bg-bg-elevated border border-bg-overlay no-underline">
          <img src={post.linkPreview.image} alt={post.linkPreview.title} className="w-24 h-16 rounded object-cover shrink-0" />
          <div>
            <div className="text-sm font-semibold">{post.linkPreview.title}</div>
            <div className="text-xs text-text-muted flex items-center gap-1 mt-1">
              <ExternalLink size={10} /> {post.linkPreview.domain}
            </div>
          </div>
        </a>
      )}
      {post.video && (
        <div className="rounded-lg overflow-hidden relative cursor-pointer">
          <img src={post.video.thumbnail} alt="Video thumbnail" className="w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
              <Play size={24} className="text-bg-base ml-0.5" />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 text-xs text-text-muted pt-1">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-1.5 transition-colors ${liked ? "text-accent-destructive" : "hover:text-text-secondary"}`}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
          {post.votes}
        </button>
        <span className="flex items-center gap-1.5 hover:text-text-secondary cursor-pointer">
          <MessageCircle size={16} /> {post.comments}
        </span>
        <span className="flex items-center gap-1.5 hover:text-text-secondary cursor-pointer">
          <Share2 size={16} /> Share
        </span>
        <span className="flex items-center gap-1.5 hover:text-text-secondary cursor-pointer">
          <Bookmark size={16} /> Save
        </span>
      </div>
    </article>
  );
}
