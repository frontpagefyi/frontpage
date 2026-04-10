"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { GooBlobs } from "./goo-blobs";
import { useGooBlob } from "@/lib/use-goo-blob";
import { CURRENT_USER } from "@/lib/constants";

const EASE = "var(--ease-sidebar)";

interface SidebarCommunity {
  id: string;
  name: string;
  icon?: string;
  notif?: number;
}

interface SidebarProps {
  activeCommunityId?: string;
  communities: SidebarCommunity[];
  avatarSrc?: string;
  posts?: import("@/lib/types").Post[];
  onCommunityClick?: (communityId: string) => void;
  onMobileTab?: (tab: string) => void;
  onSelectPost?: (post: import("@/lib/types").Post) => void;
  onNewPost?: () => void;
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
  activeCommunityId,
  avatarSrc,
  communities,
  posts,
  onCommunityClick,
  onMobileTab,
  onSelectPost,
  onNewPost,
}: {
  activeCommunityId?: string;
  avatarSrc: string;
  communities: SidebarCommunity[];
  posts: import("@/lib/types").Post[];
  onCommunityClick?: (communityId: string) => void;
  onMobileTab?: (tab: string) => void;
  onSelectPost?: (post: import("@/lib/types").Post) => void;
  onNewPost?: () => void;
}) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    // Only highlight Home if the first community (Frontpage) is active
    return activeCommunityId === "comm_home" ? 0 : -1;
  });
  const { containerRef: navRef, setItemRef: setTabRef, pill } = useGooBlob(Math.max(0, activeTab));

  // Sync tab highlight when community changes from outside (e.g. clicking a post's community badge)
  useEffect(() => {
    setActiveTab(activeCommunityId === "comm_home" ? 0 : -1);
  }, [activeCommunityId]);

  const resetTab = () => {
    setActiveTab(activeCommunityId === "comm_home" ? 0 : -1);
  };
  const closeAll = () => { setSearchOpen(false); setNotifOpen(false); setDrawerOpen(false); setProfileOpen(false); };

  const tabs = [
    { icon: <Home size={20} />, label: "Home", action: () => { closeAll(); setActiveTab(0); onCommunityClick?.("comm_home"); } },
    { icon: <Search size={20} />, label: "Search", action: () => { closeAll(); setActiveTab(1); setSearchOpen(!searchOpen); } },
    { icon: <Layers size={20} />, label: "Actions", action: () => { closeAll(); setActiveTab(2); setDrawerOpen(!drawerOpen); } },
    { icon: <Bell size={20} />, label: "Alerts", action: () => { closeAll(); setActiveTab(3); setNotifOpen(!notifOpen); } },
    { icon: <Avatar initials="" bg="" src={avatarSrc} size={22} />, label: "Profile", action: () => { closeAll(); setActiveTab(4); setProfileOpen(!profileOpen); } },
  ];

  return (
    <>
      <SearchOverlay open={searchOpen} onClose={() => { setSearchOpen(false); resetTab(); }} posts={posts} onSelectPost={onSelectPost} />
      <NotificationsPanel open={notifOpen} onClose={() => { setNotifOpen(false); resetTab(); }} posts={posts} onSelectPost={onSelectPost} />
      <ProfilePanel open={profileOpen} onClose={() => { setProfileOpen(false); resetTab(); }} avatarSrc={avatarSrc} />

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
          onClick={() => { setDrawerOpen(false); resetTab(); }}
        />
        <DraggableDrawer open={drawerOpen} onClose={() => { setDrawerOpen(false); resetTab(); }} className="max-h-[70vh] overflow-y-auto">
          <div className="w-10 h-1 rounded-full bg-bg-elevated mx-auto mt-3 mb-2" />
          <div className="px-4 pb-2">
            <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
              Actions
            </p>
            <button
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm text-text-secondary hover:bg-bg-elevated active:bg-bg-elevated transition-colors"
              onClick={() => { setDrawerOpen(false); resetTab(); onNewPost?.(); }}
            >
              <Plus size={18} className="text-accent-secondary" />
              New post
            </button>
            <button
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm text-text-secondary hover:bg-bg-elevated active:bg-bg-elevated transition-colors"
              onClick={() => { setDrawerOpen(false); resetTab(); }}
            >
              <span className="relative">
                <Users size={18} className="text-text-muted" />
                <span className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 rounded-full bg-bg-surface flex items-center justify-center">
                  <Plus size={8} strokeWidth={3} className="text-text-muted" />
                </span>
              </span>
              New community
            </button>
          </div>
          <div className="border-t border-bg-elevated mx-4 my-1" />
          <div className="px-4 pb-2">
            <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
              Browse
            </p>
            <button
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm text-text-secondary hover:bg-bg-elevated active:bg-bg-elevated transition-colors"
              onClick={() => { setDrawerOpen(false); resetTab(); onMobileTab?.("atmo"); }}
            >
              <AtSign size={18} className="text-text-muted" />
              Atmosphere
            </button>
            <button
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm text-text-secondary hover:bg-bg-elevated active:bg-bg-elevated transition-colors"
              onClick={() => { setDrawerOpen(false); resetTab(); onMobileTab?.("wiki"); }}
            >
              <BookOpen size={18} className="text-text-muted" />
              Wiki
            </button>
          </div>
          <div className="border-t border-bg-elevated mx-4 my-1" />
          <div className="px-4 pb-4">
            {communities.length > 0 && communities[0].id === "comm_home" ? (
              <>
                <button
                  key="frontpage-home"
                  onClick={() => { onCommunityClick?.("comm_home"); setDrawerOpen(false); setActiveTab(0); }}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 ${
                    activeCommunityId === "comm_home"
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
            <button
              onClick={() => { setDrawerOpen(false); resetTab(); router.push("/explorations/discover"); }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-accent-secondary hover:bg-accent-secondary/10 transition-colors mb-1"
            >
              <div className="w-7 h-7 rounded-lg border-2 border-dashed border-accent-secondary/40 flex items-center justify-center shrink-0">
                <Plus size={14} />
              </div>
              Discover
            </button>
            {communities.map((comm) => {
              if (comm.id === "comm_home") return null;
              const isActive = comm.id === activeCommunityId;
              return (
                <button
                  key={comm.id}
                  onClick={() => { onCommunityClick?.(comm.id); setDrawerOpen(false); setActiveTab(-1); }}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
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

      {/* Bottom tab bar with liquid blob */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-[100] bg-bg-surface border-t border-bg-elevated px-1 pt-1 pb-[env(safe-area-inset-bottom,6px)] md:hidden"
        aria-label="Navigation"
      >
        <div ref={navRef as React.RefObject<HTMLDivElement>} className="relative flex justify-around">
          {activeTab >= 0 ? <GooBlobs filterId="goo-nav" pill={pill} height="h-10" className="rounded-xl" stdDeviation={5} /> : null}
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              ref={setTabRef(i)}
              onClick={tab.action}
              className={`relative z-10 flex flex-col items-center gap-0.5 min-w-[44px] min-h-[44px] justify-center transition-colors ${
                activeTab === i ? "text-text-primary" : "text-text-muted"
              }`}
            >
              {tab.icon}
              <span className="text-[10px]">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

export function Sidebar({
  activeCommunityId,
  communities,
  avatarSrc = CURRENT_USER.avatarUrl,
  posts = [],
  onCommunityClick,
  onMobileTab,
  onSelectPost,
  onNewPost,
}: SidebarProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} posts={posts} onSelectPost={onSelectPost} />
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} posts={posts} onSelectPost={onSelectPost} />
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
            const isHome = activeCommunityId === "comm_home";
            return (
              <div className="shrink-0 px-2 pt-3 pb-1">
                <button
                  onClick={() => onCommunityClick?.("comm_home")}
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
              {communities.map((comm) => {
                if (comm.id === "comm_home") return null;
                const isActive = comm.id === activeCommunityId;
                return (
                <button
                  key={comm.id}
                  onClick={() => onCommunityClick?.(comm.id)}
                  className={`group relative flex items-center gap-3 w-full rounded-lg py-1.5 px-3 motion-safe:transition-colors text-left ${
                    isActive
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
                    <span className={isActive ? "font-semibold" : ""}>
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
                  {isActive ? (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full bg-accent-secondary" />
                  ) : null}
                </button>
                );
              })}
            </div>

            {/* Discover — join more communities */}
            <button
              onClick={() => { router.push("/explorations/discover"); }}
              className="flex items-center gap-3 w-full rounded-lg py-1.5 px-3 motion-safe:transition-colors text-text-muted hover:text-accent-secondary group"
              title="Discover communities"
            >
              <div className="w-10 h-10 rounded-xl border-2 border-dashed border-bg-elevated flex items-center justify-center shrink-0 group-hover:border-accent-secondary/50 transition-colors">
                <Plus size={18} />
              </div>
              <SidebarLabel expanded={expanded}>Discover</SidebarLabel>
            </button>
            <button
              className="flex items-center gap-3 w-full rounded-lg py-1.5 px-3 motion-safe:transition-colors text-text-muted hover:text-text-secondary hover:bg-bg-elevated group"
              title="New community"
            >
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <Users size={18} />
                <span className="absolute top-1/2 -translate-y-1/2 -right-0.5 w-4 h-4 rounded-full bg-bg-surface flex items-center justify-center">
                  <Plus size={10} strokeWidth={3} />
                </span>
              </div>
              <SidebarLabel expanded={expanded}>New community</SidebarLabel>
            </button>
          </div>

          {/* ── Bottom ── */}
          <div className="shrink-0 border-t border-bg-elevated px-2 py-2 space-y-0.5">
            <SidebarItem
              icon={<Search size={20} />}
              label="Search"
              expanded={expanded}
              title="Search"
              onClick={() => setSearchOpen(true)}
              className="text-text-muted hover:bg-bg-elevated hover:text-text-secondary"
            />
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
        activeCommunityId={activeCommunityId}
        avatarSrc={avatarSrc}
        communities={communities}
        posts={posts}
        onCommunityClick={onCommunityClick}
        onMobileTab={onMobileTab}
        onSelectPost={onSelectPost}
        onNewPost={onNewPost}
      />
    </>
  );
}
