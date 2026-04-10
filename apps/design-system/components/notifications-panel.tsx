"use client";

import { useState } from "react";
import { Heart, MessageCircle, UserPlus, Star, AtSign, type LucideIcon } from "lucide-react";
import { Avatar } from "./avatar";
import { DraggableDrawer } from "./draggable-drawer";
import { routes } from "@/lib/constants";
import type { Post, Comment } from "@/lib/types";

interface Notification {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  username: string;
  avatarUrl?: string;
  initials: string;
  avatarBg: string;
  action: string;
  target?: string;
  postId?: string;
  time: string;
  unread: boolean;
}

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  posts?: Post[];
  comments?: Comment[];
  onSelectPost?: (post: Post) => void;
}

/** Build notifications from real posts and user data. */
function buildNotifications(posts: Post[]): Notification[] {
  const notifs: Notification[] = [];

  // Find posts by other users and generate like/reply/mention notifications
  for (const post of posts) {
    if (post.author === "will") continue;

    // Someone liked your post (pick first few)
    if (notifs.length < 2 && post.votes > 30) {
      notifs.push({
        id: `like-${post.id}`,
        icon: Heart,
        iconColor: "oklch(55% 0.2 20)",
        username: post.author,
        avatarUrl: post.avatarUrl,
        initials: post.initials,
        avatarBg: post.avatarBg,
        action: "liked your comment on",
        target: post.title,
        postId: post.id,
        time: "5m ago",
        unread: true,
      });
    }

    // Someone replied to a thread
    if (notifs.length < 4 && post.comments > 10) {
      notifs.push({
        id: `reply-${post.id}`,
        icon: MessageCircle,
        iconColor: "oklch(64.8% 0.147 259)",
        username: post.author,
        avatarUrl: post.avatarUrl,
        initials: post.initials,
        avatarBg: post.avatarBg,
        action: "replied in",
        target: post.title,
        postId: post.id,
        time: "20m ago",
        unread: true,
      });
    }
  }

  // Static notifications that reference real users
  notifs.push(
    {
      id: "follow-1",
      icon: UserPlus,
      iconColor: "oklch(72% 0.16 145)",
      username: "greenthumb",
      avatarUrl: "https://i.pravatar.cc/200?u=greenthumb",
      initials: "gt",
      avatarBg: "oklch(55% 0.15 145)",
      action: "followed you",
      time: "1h ago",
      unread: true,
    },
    {
      id: "award-1",
      icon: Star,
      iconColor: "oklch(75% 0.18 75)",
      username: "synthwave",
      avatarUrl: "https://i.pravatar.cc/200?u=synthwave",
      initials: "sy",
      avatarBg: "oklch(60% 0.2 30)",
      action: "awarded OG on",
      target: posts.find((p) => p.author === "shader_wizard")?.title ?? "a post",
      postId: posts.find((p) => p.author === "shader_wizard")?.id,
      time: "3h ago",
      unread: false,
    },
    {
      id: "mention-1",
      icon: AtSign,
      iconColor: "oklch(70% 0.15 259)",
      username: "genart_weaver",
      avatarUrl: "https://i.pravatar.cc/200?u=genart_weaver",
      initials: "gw",
      avatarBg: "oklch(55% 0.15 145)",
      action: "mentioned you in",
      target: posts.find((p) => p.author === "genart_weaver")?.title ?? "a post",
      postId: posts.find((p) => p.author === "genart_weaver")?.id,
      time: "5h ago",
      unread: false,
    },
  );

  return notifs.slice(0, 7);
}

export function NotificationsPanel({ open, onClose, posts = [], onSelectPost }: NotificationsPanelProps) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const notifications = buildNotifications(posts);

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const hasUnread = notifications.some((n) => n.unread && !readIds.has(n.id));

  const handleClick = (n: Notification) => {
    setReadIds((prev) => new Set([...prev, n.id]));
    if (n.postId && onSelectPost) {
      const post = posts.find((p) => p.id === n.postId);
      if (post) {
        onSelectPost(post);
        onClose();
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 bottom-16 md:bottom-0 z-[55] ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/40"
        style={{ opacity: open ? 1 : 0, transition: "opacity 0.2s ease" }}
        onClick={onClose}
      />

      {/* Desktop */}
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-bg-surface border-l border-bg-elevated shadow-[-8px_0_40px_oklch(0%_0_0_/_0.3)] md:block hidden"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: open
            ? "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
            : "transform 0.3s cubic-bezier(0.4, 0, 1, 1)",
        }}
      >
        <PanelContent notifications={notifications} hasUnread={hasUnread} readIds={readIds} onMarkAllRead={markAllRead} onClick={handleClick} />
      </div>

      {/* Mobile */}
      <DraggableDrawer open={open} onClose={onClose} className="max-h-[70vh]">
        <div className="w-10 h-1 rounded-full bg-bg-elevated mx-auto mt-3 mb-1" />
        <PanelContent notifications={notifications} hasUnread={hasUnread} readIds={readIds} onMarkAllRead={markAllRead} onClick={handleClick} />
      </DraggableDrawer>
    </div>
  );
}

function PanelContent({
  notifications,
  hasUnread,
  readIds,
  onMarkAllRead,
  onClick,
}: {
  notifications: Notification[];
  hasUnread: boolean;
  readIds: Set<string>;
  onMarkAllRead: () => void;
  onClick: (n: Notification) => void;
}) {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-bg-elevated">
        <h2 className="font-serif font-bold text-base">Alerts</h2>
        {hasUnread ? (
          <button
            onClick={onMarkAllRead}
            className="text-xs text-accent-secondary hover:text-accent-secondary/80 transition-colors"
          >
            Mark all read
          </button>
        ) : (
          <span className="text-xs text-text-muted">All caught up</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {notifications.map((n, i) => {
          const isUnread = n.unread && !readIds.has(n.id);
          return (
            <button
              key={n.id}
              onClick={() => onClick(n)}
              className={`flex items-start gap-3 w-full px-4 py-3 text-left transition-colors hover:bg-bg-elevated/50 ${
                isUnread ? "bg-accent-secondary/5" : ""
              }`}
              style={{
                animation: `post-enter 0.4s cubic-bezier(0, 0, 0.2, 1) ${i * 0.06}s both`,
              }}
            >
              <div className="relative shrink-0 mt-0.5">
                <Avatar initials={n.initials} bg={n.avatarBg} src={n.avatarUrl} size={36} />
                <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-bg-surface flex items-center justify-center">
                  <n.icon size={11} style={{ color: n.iconColor }} />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug">
                  <a href={routes.profile(n.username)} onClick={(e) => e.stopPropagation()} className="font-bold text-text-primary hover:text-accent-secondary hover:underline transition-colors">
                    {n.username}
                  </a>{" "}
                  <span className="text-text-secondary">{n.action}</span>
                  {n.target ? (
                    <span className="text-text-primary font-medium"> {n.target}</span>
                  ) : null}
                </p>
                <span className="text-[10px] text-text-muted mt-0.5 block">{n.time}</span>
              </div>
              {isUnread ? (
                <span className="w-2 h-2 rounded-full bg-accent-secondary shrink-0 mt-2" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
