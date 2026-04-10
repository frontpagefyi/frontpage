"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Settings, LogOut, Moon, BookOpen, Star, ChevronRight, Users, Bookmark } from "lucide-react";
import { Avatar } from "./avatar";
import { DraggableDrawer } from "./draggable-drawer";
import { clearActiveUser } from "@/lib/actions/auth";
import { CURRENT_USER } from "@/lib/constants";

const menuItems = [
  { icon: BookOpen, label: "My posts", color: "oklch(64.8% 0.147 259)", href: `/explorations/profile/${CURRENT_USER.username}` },
  { icon: Bookmark, label: "Saved", color: "oklch(75% 0.18 75)", href: `/explorations/profile/${CURRENT_USER.username}?tab=saved` },
  { icon: Users, label: "Communities", color: "oklch(72% 0.16 145)", href: "/explorations/discover" },
  { icon: Moon, label: "Dark mode", color: "oklch(70% 0.15 290)", toggle: true },
  { icon: Settings, label: "Settings", color: "oklch(55% 0.04 259)" },
];

interface ProfilePanelProps {
  open: boolean;
  onClose: () => void;
  avatarSrc?: string;
}

export function ProfilePanel({ open, onClose, avatarSrc }: ProfilePanelProps) {
  return (
    <div
      className={`fixed inset-0 md:bottom-0 bottom-16 z-[55] ${
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
        className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-bg-surface border-l border-bg-elevated shadow-[-8px_0_40px_oklch(0%_0_0_/_0.3)] md:block hidden overflow-hidden"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: open
            ? "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
            : "transform 0.3s cubic-bezier(0.4, 0, 1, 1)",
        }}
      >
        <PanelContent avatarSrc={avatarSrc} onClose={onClose} open={open} />
      </div>

      {/* Mobile */}
      <DraggableDrawer open={open} onClose={onClose}>
        <PanelContent avatarSrc={avatarSrc} onClose={onClose} open={open} mobile />
      </DraggableDrawer>
    </div>
  );
}

function PanelContent({
  avatarSrc,
  onClose,
  open,
  mobile = false,
}: {
  avatarSrc?: string;
  onClose: () => void;
  open: boolean;
  mobile?: boolean;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col overflow-y-auto">
      {/* Banner */}
      <div className="relative">
        <div className="h-24 overflow-hidden rounded-t-2xl md:rounded-none relative">
          <Image
            src="https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=600&h=200&q=80"
            alt=""
            width={600}
            height={200}
            className="w-full h-full object-cover"
            style={{ width: '100%', height: '100%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-surface/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-bg-elevated/50 shadow-[0_1px_3px_oklch(0%_0_0_/_0.2)]" />
          {mobile ? (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/30" />
          ) : null}
        </div>
        <div className="absolute -bottom-8 left-5">
          <div className="rounded-full ring-4 ring-bg-surface">
            <Avatar
              initials=""
              bg=""
              src={avatarSrc ?? "https://i.pravatar.cc/80?u=frontpage-demo"}
              size={60}
            />
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-5 pt-11 pb-2">
        <div className="font-serif font-bold text-lg text-text-primary">
          Will Corrigan
        </div>
        <div className="text-xs text-text-muted">@will.frontpage.social</div>
        <p className="text-xs text-text-secondary mt-2 leading-relaxed">
          Building community tools on the AT Protocol. Pixel art hobbyist. Probably gardening.
        </p>
        <div className="flex gap-4 mt-3 text-xs">
          <span>
            <strong className="text-text-primary">47</strong>{" "}
            <span className="text-text-muted">posts</span>
          </span>
          <span>
            <strong className="text-text-primary">2.4k</strong>{" "}
            <span className="text-text-muted">karma</span>
          </span>
          <span>
            <strong className="text-text-primary">8</strong>{" "}
            <span className="text-text-muted">communities</span>
          </span>
        </div>
      </div>

      <div className="border-t border-bg-elevated mx-4 mt-3" />

      <div className="px-3 py-2">
        {menuItems.map((item, i) => (
          <button
            key={item.label}
            onClick={() => { if (item.href) { onClose(); router.push(item.href); } }}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm text-text-secondary hover:bg-bg-elevated/60 hover:text-text-primary transition-colors"
            style={{
              animation: open ? `post-enter 0.3s ease ${0.05 + i * 0.04}s both` : "none",
            }}
          >
            <item.icon size={18} style={{ color: item.color }} />
            <span className="flex-1 text-left">{item.label}</span>
            {item.toggle ? (
              <div className="w-9 h-5 rounded-full bg-accent-secondary/80 relative">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm" />
              </div>
            ) : (
              <ChevronRight size={14} className="text-text-muted" />
            )}
          </button>
        ))}
      </div>

      <div className="border-t border-bg-elevated mx-4" />

      <div className="px-3 py-2 pb-6">
        <button
          onClick={async () => {
            await clearActiveUser();
            window.location.href = "/login";
          }}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm text-accent-destructive hover:bg-accent-destructive/10 transition-colors"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </div>
  );
}
