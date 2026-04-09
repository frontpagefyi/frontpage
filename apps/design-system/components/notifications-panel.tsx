"use client";

import { useState } from "react";
import { Heart, MessageCircle, UserPlus, Star, AtSign } from "lucide-react";
import { Avatar } from "./avatar";
import { DraggableDrawer } from "./draggable-drawer";

const initialNotifications = [
  {
    id: "1",
    icon: Heart,
    iconColor: "oklch(55% 0.2 20)",
    user: "shader_wizard",
    initials: "sw",
    avatarBg: "oklch(50% 0.15 180)",
    action: "liked your post",
    target: "Just finished this isometric city",
    time: "2m ago",
    unread: true,
  },
  {
    id: "2",
    icon: MessageCircle,
    iconColor: "oklch(64.8% 0.147 259)",
    user: "pixel_nova",
    initials: "pn",
    avatarBg: "oklch(55% 0.18 310)",
    action: "replied to",
    target: "What's everyone using for pixel art?",
    time: "15m ago",
    unread: true,
  },
  {
    id: "3",
    icon: UserPlus,
    iconColor: "oklch(72% 0.16 145)",
    user: "greenthumb",
    initials: "gt",
    avatarBg: "oklch(55% 0.15 145)",
    action: "followed you",
    target: "",
    time: "1h ago",
    unread: true,
  },
  {
    id: "4",
    icon: Star,
    iconColor: "oklch(75% 0.18 75)",
    user: "synthwave",
    initials: "sy",
    avatarBg: "oklch(60% 0.2 30)",
    action: "awarded OG to your post",
    target: "New GLSL tutorial: Matrix Code",
    time: "3h ago",
    unread: false,
  },
  {
    id: "5",
    icon: AtSign,
    iconColor: "oklch(70% 0.15 259)",
    user: "genart_weaver",
    initials: "gw",
    avatarBg: "oklch(55% 0.15 145)",
    action: "mentioned you in",
    target: "A History of Algorithmic Art",
    time: "5h ago",
    unread: false,
  },
];

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const markAllRead = () => {
    setReadIds(new Set(initialNotifications.map((n) => n.id)));
  };

  const hasUnread = initialNotifications.some((n) => n.unread && !readIds.has(n.id));

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
        <PanelContent hasUnread={hasUnread} readIds={readIds} onMarkAllRead={markAllRead} />
      </div>

      {/* Mobile */}
      <DraggableDrawer open={open} onClose={onClose} className="max-h-[70vh]">
        <div className="w-10 h-1 rounded-full bg-bg-elevated mx-auto mt-3 mb-1" />
        <PanelContent hasUnread={hasUnread} readIds={readIds} onMarkAllRead={markAllRead} />
      </DraggableDrawer>
    </div>
  );
}

function PanelContent({
  hasUnread,
  readIds,
  onMarkAllRead,
}: {
  hasUnread: boolean;
  readIds: Set<string>;
  onMarkAllRead: () => void;
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
        {initialNotifications.map((n, i) => {
          const isUnread = n.unread && !readIds.has(n.id);
          return (
            <button
              key={n.id}
              className={`flex items-start gap-3 w-full px-4 py-3 text-left transition-colors hover:bg-bg-elevated/50 ${
                isUnread ? "bg-accent-secondary/5" : ""
              }`}
              style={{
                animation: `post-enter 0.4s cubic-bezier(0, 0, 0.2, 1) ${i * 0.06}s both`,
              }}
            >
              <div className="relative shrink-0 mt-0.5">
                <Avatar initials={n.initials} bg={n.avatarBg} size={36} />
                <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-bg-surface flex items-center justify-center">
                  <n.icon size={11} style={{ color: n.iconColor }} />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug">
                  <strong className="text-text-primary">{n.user}</strong>{" "}
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
