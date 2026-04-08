"use client";

import { useState } from "react";
import {
  ChevronRight,
  Plus,
  Compass,
  PlusCircle,
  Settings,
  Bell,
} from "lucide-react";
import { Avatar } from "./avatar";

interface SidebarCommunity {
  name: string;
  icon?: string;
  active?: boolean;
  notif?: number;
}

interface SidebarProps {
  communities: SidebarCommunity[];
  avatarInitials?: string;
  avatarBg?: string;
  onCommunityClick?: (index: number) => void;
}

export function Sidebar({
  communities,
  avatarInitials = "wc",
  avatarBg = "linear-gradient(135deg, oklch(64.78% 0.1472 259), oklch(75% 0.18 75))",
  onCommunityClick,
}: SidebarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {expanded && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setExpanded(false)}
        />
      )}
      <nav
        className={`flex flex-col bg-bg-surface border-r border-bg-elevated h-full transition-[width] duration-200 z-50 ${
          expanded ? "w-56" : "w-14"
        }`}
        aria-label="Communities"
      >
        {/* Toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center h-10 hover:bg-bg-elevated transition-colors"
          title="Toggle sidebar"
        >
          <ChevronRight
            size={16}
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        {/* Label */}
        {expanded && (
          <div className="text-[10px] uppercase tracking-widest text-text-muted px-3 py-2">
            Your Communities
          </div>
        )}

        {/* Community items */}
        <div className="flex-1 overflow-y-auto space-y-0.5 px-1.5">
          {communities.map((comm, i) => (
            <button
              key={comm.name}
              onClick={() => onCommunityClick?.(i)}
              className={`flex items-center gap-2.5 w-full rounded-lg px-2 py-1.5 transition-colors text-left ${
                comm.active
                  ? "bg-bg-elevated text-text-primary"
                  : "text-text-muted hover:bg-bg-elevated hover:text-text-secondary"
              }`}
              title={comm.name}
            >
              {comm.icon ? (
                <img
                  src={comm.icon}
                  alt=""
                  className="w-7 h-7 rounded-md object-cover shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-bold">fp</span>
                </div>
              )}
              {expanded && (
                <>
                  <span className="text-sm truncate flex-1">{comm.name}</span>
                  {comm.notif && (
                    <span className="text-[10px] bg-accent-destructive text-white rounded-full px-1.5 py-0.5 leading-none">
                      {comm.notif}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-bg-elevated mx-2 my-1" />

        {/* Actions */}
        <div className="space-y-0.5 px-1.5 pb-1">
          {[
            { icon: Plus, label: "Create a post", accent: true },
            { icon: Compass, label: "Discover communities" },
            { icon: PlusCircle, label: "Create a community" },
            { icon: Settings, label: "Settings" },
          ].map(({ icon: ActionIcon, label, accent }) => (
            <button
              key={label}
              className={`flex items-center gap-2.5 w-full rounded-lg px-2 py-1.5 transition-colors ${
                accent
                  ? "text-accent-secondary hover:bg-bg-elevated"
                  : "text-text-muted hover:bg-bg-elevated hover:text-text-secondary"
              }`}
              title={label}
            >
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <ActionIcon size={20} />
              </div>
              {expanded && <span className="text-sm">{label}</span>}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Notifications */}
        <div className="px-1.5">
          <button
            className="flex items-center gap-2.5 w-full rounded-lg px-2 py-1.5 text-text-muted hover:bg-bg-elevated hover:text-text-secondary transition-colors"
            title="Notifications"
          >
            <div className="w-7 h-7 flex items-center justify-center shrink-0">
              <Bell size={20} />
            </div>
            {expanded && <span className="text-sm">Notifications</span>}
          </button>
        </div>

        {/* Profile */}
        <div className="px-1.5 pb-2">
          <button
            className="flex items-center gap-2.5 w-full rounded-lg px-2 py-1.5 text-text-muted hover:bg-bg-elevated hover:text-text-secondary transition-colors"
            title="Profile"
          >
            <Avatar initials={avatarInitials} bg={avatarBg} size={28} />
            {expanded && <span className="text-sm">Profile</span>}
          </button>
        </div>
      </nav>
    </>
  );
}
