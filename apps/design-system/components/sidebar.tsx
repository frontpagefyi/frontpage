"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Compass,
  Bell,
  Home,
  Search,
  Layers,
  Users,
  AtSign,
  BookOpen,
} from "lucide-react";
import { Avatar } from "./avatar";
import { CommunityIcon } from "./community-icon";
import { SearchOverlay } from "./search-overlay";
import { NotificationsPanel } from "./notifications-panel";
import { ProfilePanel } from "./profile-panel";
import { DraggableDrawer } from "./draggable-drawer";

const EASE = "var(--ease-sidebar)";

interface SidebarCommunity {
  name: string;
  icon?: string;
  active?: boolean;
  notif?: number;
}

interface SidebarProps {
  communities: SidebarCommunity[];
  avatarSrc?: string;
  posts?: import("@/lib/types").Post[];
  onCommunityClick?: (index: number) => void;
  onMobileTab?: (tab: string) => void;
}

function SidebarLabel({
  children,
  expanded,
  className = "",
}: {
  children: React.ReactNode;
  expanded: boolean;
  className?: string;
}) {
  return (
    <span
      className={`text-sm whitespace-nowrap overflow-hidden ${
        expanded ? "opacity-100 max-w-[180px]" : "opacity-0 max-w-0"
      } ${className}`}
      style={{ transition: `opacity 200ms ${EASE}, max-width 200ms ${EASE}` }}
    >
      {children}
    </span>
  );
}

function SidebarItem({
  icon,
  label,
  expanded,
  title,
  onClick,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  title: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full rounded-lg py-1.5 px-3 motion-safe:transition-colors ${className}`}
      title={title}
    >
      <div className="w-10 h-10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <SidebarLabel expanded={expanded}>{label}</SidebarLabel>
    </button>
  );
}

/* ── Mobile header with blurred banner ── */
export function MobileHeader({
  communityName,
  communityIcon,
  bannerImage,
  joined = false,
  onJoinToggle,
  children,
}: {
  communityName?: string;
  communityIcon?: string;
  bannerImage?: string;
  joined?: boolean;
  onJoinToggle?: () => void;
  children?: React.ReactNode;
}) {

  return (
    <div className="md:hidden">
      {/* Banner backdrop — contains both header and sort bar */}
      <div className="relative overflow-hidden">
        {/* Blurred background image spans full area */}
        {bannerImage ? (
          <Image
            src={bannerImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm"
            fill
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base/60 via-bg-base/70 to-bg-base/85" />

        {/* Header content */}
        <div className="relative px-4 pt-4 pb-2">
          <div className="flex items-center gap-2.5">
            <CommunityIcon icon={communityIcon} size={36} className="ring-1 ring-white/20" />
            <span className="font-serif font-bold text-lg text-text-primary drop-shadow-sm flex-1">
              {communityName ?? "Frontpage"}
            </span>
            <button
              onClick={onJoinToggle}
              className="relative text-[11px] font-semibold px-3.5 py-1.5 rounded-full overflow-hidden active:scale-[0.95]"
              style={{ transition: "transform 0.2s, box-shadow 0.4s ease" }}
            >
              {/* Soft luminous gradient — fades out when joined */}
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(135deg, oklch(40% 0.08 259), oklch(45% 0.1 290), oklch(42% 0.07 259))",
                  boxShadow: joined ? "none" : "inset 0 1px 0 oklch(100% 0 0 / 0.1), 0 1px 8px oklch(45% 0.1 290 / 0.3)",
                  opacity: joined ? 0 : 1,
                  transition: "opacity 0.4s ease, box-shadow 0.4s ease",
                }}
              />
              {/* Joined border — fades in when joined */}
              <span
                className="absolute inset-0 rounded-full border border-text-muted/30 bg-bg-surface/40 backdrop-blur-sm"
                style={{
                  opacity: joined ? 1 : 0,
                  transition: "opacity 0.4s ease",
                }}
              />
              <span
                className="relative z-10"
                style={{
                  color: joined ? "var(--color-text-secondary)" : "white",
                  transition: "color 0.3s ease",
                }}
              >
                {joined ? "Joined ✓" : "Join"}
              </span>
            </button>
          </div>
        </div>

        {/* Sort bar — inside the banner, blends with it */}
        {children ? (
          <div className="relative px-4 pb-3 pt-1">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ── Mobile bottom tab bar + actions drawer ── */
function MobileBottomNav({
  avatarSrc,
  communities,
  posts,
  onCommunityClick,
  onMobileTab,
}: {
  avatarSrc: string;
  communities: SidebarCommunity[];
  posts: import("@/lib/types").Post[];
  onCommunityClick?: (index: number) => void;
  onMobileTab?: (tab: string) => void;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const closeAll = () => { setSearchOpen(false); setNotifOpen(false); setDrawerOpen(false); setProfileOpen(false); };

  return (
    <>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} posts={posts} />
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} avatarSrc={avatarSrc} />

      {/* Drawer backdrop + panel */}
      <div
        className={`fixed inset-0 bottom-16 z-40 md:hidden ${
          drawerOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60"
          style={{
            opacity: drawerOpen ? 1 : 0,
            transition: drawerOpen
              ? "opacity 0.25s ease"
              : "opacity 0.35s ease 0.1s",
          }}
          onClick={() => setDrawerOpen(false)}
        />
        <DraggableDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} className="max-h-[70vh] overflow-y-auto">
          <div className="w-10 h-1 rounded-full bg-bg-elevated mx-auto mt-3 mb-2" />
          <div className="px-4 pb-2">
            <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
              Actions
            </p>
            <button
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm text-text-secondary hover:bg-bg-elevated active:bg-bg-elevated transition-colors"
              onClick={() => setDrawerOpen(false)}
            >
              <Plus size={18} className="text-accent-secondary" />
              New post
            </button>
            <button
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm text-text-secondary hover:bg-bg-elevated active:bg-bg-elevated transition-colors"
              onClick={() => setDrawerOpen(false)}
            >
              <Users size={18} className="text-text-muted" />
              New community
            </button>
            <button
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm text-text-secondary hover:bg-bg-elevated active:bg-bg-elevated transition-colors"
              onClick={() => setDrawerOpen(false)}
            >
              <Compass size={18} className="text-text-muted" />
              Discover
            </button>
          </div>
          <div className="border-t border-bg-elevated mx-4 my-1" />
          <div className="px-4 pb-2">
            <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
              Browse
            </p>
            <button
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm text-text-secondary hover:bg-bg-elevated active:bg-bg-elevated transition-colors"
              onClick={() => { setDrawerOpen(false); onMobileTab?.("atmo"); }}
            >
              <AtSign size={18} className="text-text-muted" />
              Atmosphere
            </button>
            <button
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm text-text-secondary hover:bg-bg-elevated active:bg-bg-elevated transition-colors"
              onClick={() => { setDrawerOpen(false); onMobileTab?.("wiki"); }}
            >
              <BookOpen size={18} className="text-text-muted" />
              Wiki
            </button>
          </div>
          <div className="border-t border-bg-elevated mx-4 my-1" />
          <div className="px-4 pb-4">
            {/* Home link */}
            {communities.length > 0 && communities[0].name === "Frontpage" ? (
              <>
                <button
                  key="frontpage-home"
                  onClick={() => { onCommunityClick?.(0); setDrawerOpen(false); }}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 ${
                    communities[0].active
                      ? "bg-accent-secondary/10 text-text-primary font-semibold"
                      : "text-text-secondary hover:bg-bg-elevated active:bg-bg-elevated"
                  }`}
                >
                  <Image src="/frontpage-logo.svg" alt="Frontpage" width={28} height={28} style={{ width: 28, height: 28 }} />
                  Home
                </button>
                <div className="border-t border-bg-elevated mx-1 my-1.5" />
              </>
            ) : null}
            <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
              Communities
            </p>
            {communities.filter((_, i) => !(i === 0 && communities[0].name === "Frontpage")).map((comm) => {
              const idx = communities.indexOf(comm);
              return (
              <button
                key={comm.name}
                onClick={() => {
                  onCommunityClick?.(idx);
                  setDrawerOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  comm.active
                    ? "bg-accent-secondary/10 text-text-primary font-semibold"
                    : "text-text-secondary hover:bg-bg-elevated active:bg-bg-elevated"
                }`}
              >
                <CommunityIcon icon={comm.icon} name={comm.name} size={28} />
                {comm.name}
              </button>
              );
            })}
          </div>
        </DraggableDrawer>
      </div>

      {/* Bottom tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-[100] bg-bg-surface border-t border-bg-elevated flex justify-around items-end px-2 pt-2 pb-[env(safe-area-inset-bottom,8px)] md:hidden"
        aria-label="Navigation"
      >
        <button
          onClick={() => { closeAll(); onCommunityClick?.(0); }}
          className={`flex flex-col items-center gap-0.5 min-w-[44px] min-h-[44px] justify-center ${
            !searchOpen && !notifOpen && !drawerOpen && !profileOpen ? "text-accent-secondary" : "text-text-muted"
          }`}
        >
          <Home size={20} />
          <span className="text-[10px]">Home</span>
        </button>
        <button
          onClick={() => { closeAll(); setSearchOpen(!searchOpen); }}
          className={`flex flex-col items-center gap-0.5 min-w-[44px] min-h-[44px] justify-center ${
            searchOpen ? "text-accent-secondary" : "text-text-muted"
          }`}
        >
          <Search size={20} />
          <span className="text-[10px]">Search</span>
        </button>
        <button
          onClick={() => { closeAll(); setDrawerOpen(!drawerOpen); }}
          className="flex flex-col items-center gap-0.5 min-w-[44px] justify-center text-text-muted -mt-5"
        >
          <div
            className={`w-11 h-11 rounded-full bg-accent-secondary flex items-center justify-center shadow-[0_4px_16px_oklch(64.8%_0.147_259_/_0.4)] active:scale-[0.92] active:shadow-[0_2px_8px_oklch(64.8%_0.147_259_/_0.25)] motion-safe:transition-[transform,box-shadow,rotate] motion-safe:duration-300 ${
              drawerOpen ? "rotate-45" : "rotate-0"
            }`}
          >
            {drawerOpen ? (
              <Plus size={20} className="text-white" />
            ) : (
              <Layers size={20} className="text-white" />
            )}
          </div>
          <span className="text-[10px]">{drawerOpen ? "Close" : "Actions"}</span>
        </button>
        <button
          onClick={() => { closeAll(); setNotifOpen(!notifOpen); }}
          className={`flex flex-col items-center gap-0.5 min-w-[44px] min-h-[44px] justify-center ${
            notifOpen ? "text-accent-secondary" : "text-text-muted"
          }`}
        >
          <Bell size={20} />
          <span className="text-[10px]">Alerts</span>
        </button>
        <button
          onClick={() => { closeAll(); setProfileOpen(!profileOpen); }}
          className={`flex flex-col items-center gap-0.5 min-w-[44px] min-h-[44px] justify-center ${
            profileOpen ? "text-accent-secondary" : "text-text-muted"
          }`}
        >
          <Avatar initials="" bg="" src={avatarSrc} size={24} />
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>
    </>
  );
}

export function Sidebar({
  communities,
  avatarSrc = "https://i.pravatar.cc/80?u=frontpage-demo",
  posts = [],
  onCommunityClick,
  onMobileTab,
}: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} posts={posts} />
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} avatarSrc={avatarSrc} />

      {/* ── Desktop sidebar ── */}
      <div className="relative shrink-0 h-full z-50 hidden md:block">
        <nav
          className={`flex flex-col bg-bg-surface border-r border-bg-elevated h-full overflow-hidden ${
            expanded ? "w-64" : "w-20"
          }`}
          style={{
            transition: `width 200ms ${EASE}`,
            boxShadow: expanded
              ? "8px 0 24px oklch(0% 0 0 / 0.25)"
              : "none",
          }}
          aria-label="Communities"
        >
          {/* ── Logo = Home button ── */}
          {(() => {
            const isHome = communities[0]?.name === "Frontpage" && communities[0]?.active;
            return (
              <div className="shrink-0 px-2 pt-3 pb-1">
                <button
                  onClick={() => onCommunityClick?.(0)}
                  className={`group relative flex items-center gap-3 w-full rounded-lg py-1.5 px-3 motion-safe:transition-colors text-left ${
                    isHome
                      ? "bg-accent-secondary/10 text-text-primary"
                      : "text-text-muted hover:bg-bg-elevated hover:text-text-secondary"
                  }`}
                  title="Home"
                >
                  <Image
                    src="/frontpage-logo.svg"
                    alt="Frontpage"
                    width={40}
                    height={40}
                    className="shrink-0 rounded-xl motion-safe:transition-[border-radius] motion-safe:duration-150 group-hover:rounded-lg"
                    style={{ width: 40, height: 40 }}
                  />
                  <SidebarLabel
                    expanded={expanded}
                    className="font-serif font-bold"
                  >
                    Frontpage
                  </SidebarLabel>
                  {isHome ? (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full bg-accent-secondary" />
                  ) : null}
                </button>
              </div>
            );
          })()}

          <div className="h-[10vh] shrink-0" />

          {/* ── Communities ── */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-3">
            <div
              className={`text-[10px] uppercase tracking-widest text-text-muted px-3 pb-2 whitespace-nowrap ${
                expanded ? "opacity-100" : "opacity-0"
              }`}
              style={{ transition: `opacity 200ms ${EASE}` }}
            >
              Communities
            </div>
            <div className="space-y-1">
              {communities.map((comm, i) => {
                if (i === 0 && comm.name === "Frontpage") return null;
                const originalIndex = i;
                return (
                <button
                  key={comm.name}
                  onClick={() => onCommunityClick?.(originalIndex)}
                  className={`group relative flex items-center gap-3 w-full rounded-lg py-1.5 px-3 motion-safe:transition-colors text-left ${
                    comm.active
                      ? "bg-accent-secondary/10 text-text-primary"
                      : "text-text-muted hover:bg-bg-elevated hover:text-text-secondary"
                  }`}
                  title={comm.name}
                >
                  <div className="relative shrink-0">
                    <CommunityIcon
                      icon={comm.icon}
                      name={comm.name}
                      size={40}
                      className="rounded-xl motion-safe:transition-[border-radius] motion-safe:duration-150 group-hover:rounded-lg"
                    />
                    {comm.notif ? (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-accent-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none px-1">
                        {comm.notif}
                      </span>
                    ) : null}
                  </div>
                  <SidebarLabel expanded={expanded}>
                    <span className={comm.active ? "font-semibold" : ""}>
                      {comm.name}
                    </span>
                  </SidebarLabel>
                  {comm.notif ? (
                    <span
                      className={`text-[10px] bg-accent-secondary text-white rounded-full px-1.5 py-0.5 leading-none shrink-0 whitespace-nowrap ${
                        expanded ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ transition: `opacity 200ms ${EASE}` }}
                    >
                      {comm.notif}
                    </span>
                  ) : null}
                  {/* Active right bar */}
                  {comm.active ? (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full bg-accent-secondary" />
                  ) : null}
                </button>
                );
              })}
            </div>
            <div className="border-t border-bg-elevated mx-1 my-2" />
            <div className="space-y-0.5">
              {/* New — popout menu */}
              <div className="relative">
                <button
                  onClick={() => setCreateOpen(!createOpen)}
                  className="flex items-center gap-3 w-full rounded-lg py-1.5 px-3 motion-safe:transition-colors text-accent-secondary hover:bg-accent-secondary/10 font-medium"
                  title="New"
                >
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <Plus size={20} />
                  </div>
                  <SidebarLabel expanded={expanded}>New</SidebarLabel>
                </button>
                {createOpen ? (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setCreateOpen(false)}
                    />
                    <div className="absolute left-full top-0 ml-2 z-40 bg-bg-surface border border-bg-elevated rounded-lg shadow-[0_4px_16px_oklch(0%_0_0_/_0.3)] py-1 min-w-[160px]">
                      <button
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
                        onClick={() => setCreateOpen(false)}
                      >
                        <Plus size={14} />
                        New post
                      </button>
                      <button
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
                        onClick={() => setCreateOpen(false)}
                      >
                        <Users size={14} />
                        New community
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
              <SidebarItem
                icon={<Compass size={20} />}
                label="Discover"
                expanded={expanded}
                title="Discover communities"
                className="text-text-muted hover:bg-bg-elevated hover:text-text-secondary"
              />
            </div>
          </div>

          {/* ── Bottom ── */}
          <div className="shrink-0 border-t border-bg-elevated px-2 py-2 space-y-0.5">
            <SidebarItem
              icon={<Bell size={20} />}
              label="Notifications"
              expanded={expanded}
              title="Notifications"
              onClick={() => setNotifOpen(true)}
              className="text-text-muted hover:bg-bg-elevated hover:text-text-secondary"
            />
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 w-full rounded-lg py-1.5 px-3 motion-safe:transition-colors text-text-muted hover:bg-bg-elevated hover:text-text-secondary"
              title="Profile"
            >
              <Avatar initials="" bg="" src={avatarSrc} size={40} />
              <SidebarLabel expanded={expanded}>Profile</SidebarLabel>
            </button>
          </div>
        </nav>

        {/* ── Expand/collapse bubble ── */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 rounded-full bg-bg-elevated border border-bg-overlay flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-overlay motion-safe:transition-colors z-10"
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* ── Mobile bottom nav ── */}
      <MobileBottomNav
        avatarSrc={avatarSrc}
        communities={communities}
        posts={posts}
        onCommunityClick={onCommunityClick}
        onMobileTab={onMobileTab}
      />
    </>
  );
}
