# Design System Next.js Conversion

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the static HTML/CSS/JS design system into a standalone Next.js app with typed React components and Tailwind CSS, ready to pilfer into the main Frontpage app.

**Architecture:** Standalone Next.js 16 app in `design-system/` with App Router. Design tokens defined as Tailwind theme config (OKLCH colors, spacing, radii, fonts). Each UI component is a typed React component with props. Pages correspond to existing HTML pages (foundations, mockups, catalog, explorations).

**Tech Stack:** Next.js 16.2, React 19, TypeScript 5.9, Tailwind CSS 4.1, Lucide React icons

---

### Task 1: Scaffold Next.js App

**Files:**
- Create: `design-system/package.json`
- Create: `design-system/next.config.ts`
- Create: `design-system/tsconfig.json`
- Create: `design-system/app/layout.tsx`
- Create: `design-system/app/page.tsx`
- Create: `design-system/app/globals.css`
- Create: `design-system/.gitignore`

- [ ] **Step 1: Initialize the Next.js app**

```bash
cd design-system
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --no-import-alias --skip-install
```

If it complains the directory is not empty, move the existing static files to `design-system/static-legacy/` first, run create-next-app, then move them back.

- [ ] **Step 2: Install dependencies**

```bash
cd design-system
pnpm install
```

- [ ] **Step 3: Verify it runs**

```bash
cd design-system
pnpm dev
```

Open `http://localhost:3000` — should see the default Next.js page.

- [ ] **Step 4: Move legacy static files**

Move all the original HTML/CSS/JS files into `design-system/static-legacy/` so they're preserved but not served:

```bash
mkdir -p static-legacy
mv *.html *.css *.js static-legacy/
```

- [ ] **Step 5: Commit**

```bash
git add design-system/
git commit -m "feat: scaffold Next.js app for design system"
```

---

### Task 2: Design Tokens as Tailwind Theme

**Files:**
- Modify: `design-system/app/globals.css`
- Reference: `design-system/static-legacy/tokens.css`

Port all CSS custom properties from `tokens.css` into Tailwind's `@theme` directive. This is Tailwind v4 syntax — no `tailwind.config.ts` needed.

- [ ] **Step 1: Write globals.css with Tailwind v4 theme**

Replace the contents of `design-system/app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  /* Fonts */
  --font-sans: 'Source Sans 3', ui-sans-serif, system-ui, sans-serif;
  --font-serif: 'Source Serif 4', ui-serif, Georgia, serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* Colors — OKLCH */
  --color-bg-base: oklch(13.6% 0.02 270);
  --color-bg-surface: oklch(18% 0.018 270);
  --color-bg-elevated: oklch(22% 0.016 270);
  --color-bg-overlay: oklch(26% 0.014 270);
  --color-bg-interactive: oklch(30% 0.012 270);

  --color-text-primary: oklch(95% 0.005 270);
  --color-text-secondary: oklch(75% 0.02 270);
  --color-text-muted: oklch(62% 0.025 270);
  --color-text-inverse: oklch(13.6% 0.02 270);

  --color-accent-primary: oklch(75% 0.18 75);
  --color-accent-secondary: oklch(55% 0.2 280);
  --color-accent-success: oklch(72% 0.19 150);
  --color-accent-warning: oklch(85% 0.16 85);
  --color-accent-destructive: oklch(55% 0.22 25);
  --color-accent-live: oklch(60% 0.27 25);

  /* Brand indigo scale */
  --color-indigo-50: oklch(97.78% 0.0108 259);
  --color-indigo-100: oklch(93.56% 0.0321 259);
  --color-indigo-200: oklch(88.11% 0.0609 259);
  --color-indigo-300: oklch(82.67% 0.0908 259);
  --color-indigo-400: oklch(74.22% 0.1398 259);
  --color-indigo-500: oklch(64.78% 0.1472 259);
  --color-indigo-600: oklch(57.33% 0.1299 259);
  --color-indigo-700: oklch(46.89% 0.1067 259);
  --color-indigo-800: oklch(39.44% 0.0898 259);
  --color-indigo-900: oklch(32% 0.0726 259);
  --color-indigo-950: oklch(23.78% 0.054 259);

  /* Spacing (4px base grid) */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}

/* Base resets */
body {
  background: var(--color-bg-base);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-serif);
  letter-spacing: -0.02em;
}

/* Focus styles — WCAG 2.4.7, 2.4.11 */
*:focus-visible {
  outline: 2px solid var(--color-accent-secondary);
  outline-offset: 2px;
}
```

- [ ] **Step 2: Add Google Fonts via next/font**

Create `design-system/app/fonts.ts`:

```typescript
import { Source_Sans_3, Source_Serif_4, JetBrains_Mono } from "next/font/google";

export const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
```

- [ ] **Step 3: Wire fonts into layout**

Update `design-system/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { sourceSans, sourceSerif, jetbrainsMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frontpage Design System",
  description: "Design system explorations for Frontpage",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Create a minimal home page that renders token swatches**

Update `design-system/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Frontpage Design System</h1>
      <div className="grid grid-cols-5 gap-4">
        {["bg-base", "bg-surface", "bg-elevated", "bg-overlay", "bg-interactive"].map(
          (name) => (
            <div key={name} className="space-y-2">
              <div
                className="h-16 rounded-lg border border-bg-elevated"
                style={{ background: `var(--color-${name})` }}
              />
              <p className="text-xs text-text-muted">{name}</p>
            </div>
          )
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Verify tokens work**

```bash
pnpm dev
```

Open `http://localhost:3000` — should see the heading in Source Serif and 5 color swatches from dark to light. All using Tailwind classes backed by the OKLCH tokens.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add design tokens as Tailwind v4 theme"
```

---

### Task 3: Core UI Components — Avatar, Badge, Icon

**Files:**
- Create: `design-system/components/avatar.tsx`
- Create: `design-system/components/badge.tsx`
- Create: `design-system/components/icon.tsx`
- Reference: `design-system/static-legacy/components.js` (lines 164-176 for avatar, badges)

These are the atomic building blocks used by everything else.

- [ ] **Step 1: Install lucide-react**

```bash
cd design-system
pnpm add lucide-react
```

- [ ] **Step 2: Create Icon component**

Create `design-system/components/icon.tsx`:

```tsx
import { type LucideIcon } from "lucide-react";

interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
}

export function Icon({ icon: LucideIcon, size = 14, className }: IconProps) {
  return <LucideIcon size={size} className={className} />;
}
```

- [ ] **Step 3: Create Avatar component**

Create `design-system/components/avatar.tsx`:

```tsx
interface AvatarProps {
  initials: string;
  bg: string;
  size?: number;
  src?: string;
  className?: string;
}

export function Avatar({
  initials,
  bg,
  size = 32,
  src,
  className = "",
}: AvatarProps) {
  const style = {
    width: size,
    height: size,
    fontSize: size * 0.4,
    background: src ? undefined : bg,
    backgroundImage: src ? `url(${src})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white shrink-0 ${className}`}
      style={style}
    >
      {!src && initials}
    </div>
  );
}
```

- [ ] **Step 4: Create Badge component**

Create `design-system/components/badge.tsx`:

```tsx
import { type LucideIcon } from "lucide-react";

type BadgeVariant = "artist" | "og" | "live" | "mod";

const variantStyles: Record<BadgeVariant, string> = {
  artist:
    "bg-gradient-to-r from-accent-primary to-[oklch(70%_0.2_55)] text-[#1a1000]",
  og: "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white",
  live: "bg-accent-live text-white",
  mod: "bg-accent-secondary text-white",
};

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
  icon?: LucideIcon;
}

export function Badge({ variant, label, icon: IconComponent }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full uppercase whitespace-nowrap ${variantStyles[variant]}`}
    >
      {IconComponent && <IconComponent size={9} />}
      {label}
    </span>
  );
}
```

- [ ] **Step 5: Verify components render**

Add to `design-system/app/page.tsx` temporarily:

```tsx
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/badge";
import { Palette, Crown } from "lucide-react";

// Inside the main element, after the swatches:
<div className="mt-8 flex items-center gap-4">
  <Avatar initials="pw" bg="var(--color-indigo-600)" />
  <Avatar initials="sw" bg="oklch(50% 0.15 180)" size={24} />
  <Badge variant="artist" label="Artist" icon={Palette} />
  <Badge variant="og" label="OG" icon={Crown} />
</div>
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Avatar, Badge, Icon components"
```

---

### Task 4: Feed Post Component

**Files:**
- Create: `design-system/components/feed-post.tsx`
- Create: `design-system/lib/types.ts`
- Reference: `design-system/static-legacy/components.js` (lines 170-226, renderFeedPost)

- [ ] **Step 1: Define shared types**

Create `design-system/lib/types.ts`:

```typescript
import { type LucideIcon } from "lucide-react";

export interface PostBadge {
  variant: "artist" | "og" | "live" | "mod";
  label: string;
  icon?: LucideIcon;
}

export interface LinkPreview {
  image: string;
  title: string;
  domain: string;
}

export interface Post {
  author: string;
  initials: string;
  avatarBg: string;
  time: string;
  badges?: PostBadge[];
  title: string;
  image?: string;
  body?: string;
  linkPreview?: LinkPreview;
  video?: { thumbnail: string };
  votes: number | string;
  comments: number;
}

export interface CommunityTheme {
  [key: string]: string;
}

export interface CommunityBanner {
  name: string;
  bannerImage?: string;
  members: string;
  online: number;
  established: string;
}

export interface Community {
  name: string;
  icon?: string;
  theme?: CommunityTheme;
  banner: CommunityBanner;
  posts: Post[];
}
```

- [ ] **Step 2: Create FeedPost component**

Create `design-system/components/feed-post.tsx`:

```tsx
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
      {/* Meta row */}
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <Avatar initials={post.initials} bg={post.avatarBg} size={24} />
        <strong className="text-text-primary">{post.author}</strong>
        {post.badges?.map((b) => (
          <Badge key={b.label} variant={b.variant} label={b.label} icon={b.icon} />
        ))}
        <span>&middot; {post.time}</span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-base font-semibold leading-snug">
        {post.title}
      </h3>

      {/* Content */}
      {post.image && (
        <div className="rounded-lg overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full object-cover"
          />
        </div>
      )}
      {post.body && (
        <p className="text-sm text-text-secondary leading-relaxed">
          {post.body}
        </p>
      )}
      {post.linkPreview && (
        <a
          href="#"
          className="flex gap-3 p-3 rounded-lg bg-bg-elevated border border-bg-overlay no-underline"
        >
          <img
            src={post.linkPreview.image}
            alt={post.linkPreview.title}
            className="w-24 h-16 rounded object-cover shrink-0"
          />
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
          <img
            src={post.video.thumbnail}
            alt="Video thumbnail"
            className="w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
              <Play size={24} className="text-bg-base ml-0.5" />
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 text-xs text-text-muted pt-1">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-1.5 transition-colors ${
            liked ? "text-accent-destructive" : "hover:text-text-secondary"
          }`}
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
```

- [ ] **Step 3: Verify with sample data on home page**

Update `design-system/app/page.tsx` to import `FeedPost` and render one with hardcoded data from the Creative Coding community to confirm it works.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add FeedPost component with types"
```

---

### Task 5: Sidebar Component

**Files:**
- Create: `design-system/components/sidebar.tsx`
- Reference: `design-system/static-legacy/components.js` (lines 86-130, sidebar render functions)

- [ ] **Step 1: Create Sidebar component**

Create `design-system/components/sidebar.tsx`:

```tsx
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
  online?: number;
}

interface SidebarProps {
  communities: SidebarCommunity[];
  onSelect?: (index: number) => void;
  avatarBg?: string;
  avatarInitials?: string;
}

export function Sidebar({
  communities,
  onSelect,
  avatarBg = "var(--color-indigo-500)",
  avatarInitials = "wc",
}: SidebarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Scrim */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/30 z-20"
          onClick={() => setExpanded(false)}
        />
      )}

      <nav
        className={`fixed left-0 top-0 h-screen flex flex-col gap-1 z-30 bg-bg-base transition-all duration-300 ease-out ${
          expanded ? "w-[260px] px-2 py-3 shadow-xl" : "w-[72px] px-2.5 py-2"
        }`}
      >
        {/* Toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-bg-elevated text-text-muted"
        >
          <ChevronRight
            size={16}
            className={`transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Communities */}
        <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted px-2 mt-2 mb-1">
          {expanded && "Communities"}
        </div>
        {communities.map((c, i) => (
          <button
            key={c.name}
            onClick={() => onSelect?.(i)}
            className={`flex items-center gap-3 rounded-lg transition-colors ${
              expanded ? "px-3 py-2" : "justify-center p-2"
            } ${
              c.active
                ? "bg-bg-elevated text-text-primary"
                : "text-text-muted hover:bg-bg-elevated hover:text-text-secondary"
            }`}
          >
            <div className="w-[38px] h-[38px] rounded-lg overflow-hidden shrink-0">
              {c.icon ? (
                <img
                  src={c.icon}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-indigo-700 flex items-center justify-center text-white text-xs font-bold">
                  {c.name.charAt(0)}
                </div>
              )}
            </div>
            {expanded && (
              <>
                <span className="text-sm font-medium truncate">{c.name}</span>
                {c.notif && (
                  <span className="ml-auto text-[10px] font-bold bg-accent-destructive text-white rounded-full px-1.5 py-0.5">
                    {c.notif}
                  </span>
                )}
                {c.online && !c.notif && (
                  <span className="ml-auto text-[10px] text-text-muted">
                    {c.online}
                  </span>
                )}
              </>
            )}
          </button>
        ))}

        {/* Divider */}
        <div className="h-px bg-bg-elevated my-2" />

        {/* Actions */}
        {[
          { icon: Plus, label: "Create a post" },
          { icon: Compass, label: "Discover" },
          { icon: PlusCircle, label: "Create community" },
          { icon: Settings, label: "Settings" },
        ].map(({ icon: ActionIcon, label }) => (
          <button
            key={label}
            className={`flex items-center gap-3 text-text-muted hover:bg-bg-elevated hover:text-text-secondary rounded-lg transition-colors ${
              expanded ? "px-3 py-2" : "justify-center p-2"
            }`}
          >
            <ActionIcon size={20} />
            {expanded && <span className="text-sm">{label}</span>}
          </button>
        ))}

        {/* Spacer + bottom items */}
        <div className="flex-1" />
        <button
          className={`flex items-center gap-3 text-text-muted hover:bg-bg-elevated rounded-lg transition-colors ${
            expanded ? "px-3 py-2" : "justify-center p-2"
          }`}
        >
          <Bell size={20} />
          {expanded && <span className="text-sm">Notifications</span>}
        </button>
        <button
          className={`flex items-center gap-3 rounded-lg transition-colors ${
            expanded ? "px-3 py-2" : "justify-center p-2"
          }`}
        >
          <Avatar initials={avatarInitials} bg={avatarBg} size={32} />
          {expanded && <span className="text-sm">Profile</span>}
        </button>
      </nav>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add Sidebar component"
```

---

### Task 6: Content Tabs and Sort Bar

**Files:**
- Create: `design-system/components/content-tabs.tsx`
- Create: `design-system/components/feed-sort.tsx`
- Reference: `design-system/static-legacy/components.js` (lines 158-164 for sort, 498-560 for tabs)

- [ ] **Step 1: Create FeedSort component**

Create `design-system/components/feed-sort.tsx`:

```tsx
"use client";

import { Flame, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";

const sorts = [
  { key: "hot", label: "Hot", icon: Flame },
  { key: "new", label: "New", icon: Clock },
  { key: "top", label: "Top", icon: TrendingUp },
] as const;

type SortKey = (typeof sorts)[number]["key"];

interface FeedSortProps {
  value?: SortKey;
  onChange?: (sort: SortKey) => void;
}

export function FeedSort({ value = "hot", onChange }: FeedSortProps) {
  const [active, setActive] = useState<SortKey>(value);

  function handleClick(key: SortKey) {
    setActive(key);
    onChange?.(key);
  }

  return (
    <div className="flex gap-1" role="tablist" aria-label="Sort posts">
      {sorts.map(({ key, label, icon: SortIcon }) => (
        <button
          key={key}
          role="tab"
          aria-selected={active === key}
          onClick={() => handleClick(key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            active === key
              ? "bg-accent-secondary text-white"
              : "text-text-muted hover:bg-bg-elevated hover:text-text-secondary"
          }`}
        >
          <SortIcon size={14} />
          {label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create ContentTabs component**

Create `design-system/components/content-tabs.tsx`:

```tsx
"use client";

import { AtSign, BookOpen, Search } from "lucide-react";
import { useState, type ReactNode } from "react";
import { FeedSort } from "./feed-sort";

type TabKey = "posts" | "atmo" | "wiki";

interface ContentTabsProps {
  children: Record<TabKey, ReactNode>;
}

export function ContentTabs({ children }: ContentTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("posts");

  return (
    <div>
      {/* Tab bar */}
      <div className="sticky top-0 z-10 bg-bg-base flex items-center gap-2 px-4 py-2 max-w-[840px] mx-auto">
        {activeTab === "posts" ? (
          <FeedSort />
        ) : (
          <button
            onClick={() => setActiveTab("posts")}
            className="text-xs text-text-muted hover:text-text-secondary"
          >
            &larr; Posts
          </button>
        )}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() =>
              setActiveTab(activeTab === "atmo" ? "posts" : "atmo")
            }
            className={`p-2 rounded-lg transition-colors ${
              activeTab === "atmo"
                ? "bg-bg-elevated text-text-primary"
                : "text-text-muted hover:bg-bg-elevated"
            }`}
            title="Atmosphere"
          >
            <AtSign size={18} />
          </button>
          <button
            onClick={() =>
              setActiveTab(activeTab === "wiki" ? "posts" : "wiki")
            }
            className={`p-2 rounded-lg transition-colors ${
              activeTab === "wiki"
                ? "bg-bg-elevated text-text-primary"
                : "text-text-muted hover:bg-bg-elevated"
            }`}
            title="Wiki"
          >
            <BookOpen size={18} />
          </button>
          <div className="relative">
            <input
              type="search"
              placeholder="Search…"
              className="bg-bg-elevated text-text-secondary text-xs rounded-lg pl-8 pr-3 py-1.5 w-40 placeholder:text-text-muted border-none outline-none focus:ring-2 focus:ring-accent-secondary"
              aria-label="Search"
            />
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-[680px] mx-auto">
        {children[activeTab]}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add ContentTabs and FeedSort components"
```

---

### Task 7: Community App Page (Interactive Demo)

**Files:**
- Create: `design-system/app/demo/page.tsx`
- Create: `design-system/lib/sample-data.ts`
- Reference: `design-system/static-legacy/index.html` (community data objects)

- [ ] **Step 1: Extract sample community data**

Create `design-system/lib/sample-data.ts` — port the 4 community data objects from `static-legacy/index.html` (Creative Coding, Home Gardening, Retro Gaming, Photography) into typed TypeScript objects using the `Community` type from `lib/types.ts`. Include posts, banner, wiki data. Remove the HTML entity encodings and use proper strings.

This file will be large (~200 lines) — it's pure data, no logic.

- [ ] **Step 2: Create the demo page**

Create `design-system/app/demo/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { ContentTabs } from "@/components/content-tabs";
import { FeedPost } from "@/components/feed-post";
import { communities } from "@/lib/sample-data";

export default function DemoPage() {
  const [activeCommunity, setActiveCommunity] = useState(0);
  const community = communities[activeCommunity];

  return (
    <div
      className="h-screen overflow-y-auto overflow-x-hidden bg-bg-base"
      style={community.theme ?? undefined}
    >
      <Sidebar
        communities={communities.map((c, i) => ({
          name: c.name,
          icon: c.icon,
          active: i === activeCommunity,
        }))}
        onSelect={setActiveCommunity}
      />

      <main className="ml-[72px]">
        <ContentTabs>
          {{
            posts: (
              <div className="space-y-4 py-4">
                {community.posts.map((post, i) => (
                  <FeedPost key={i} post={post} />
                ))}
              </div>
            ),
            atmo: (
              <div className="py-8 text-center text-text-muted">
                Atmosphere tab — coming next
              </div>
            ),
            wiki: (
              <div className="py-8 text-center text-text-muted">
                Wiki tab — coming next
              </div>
            ),
          }}
        </ContentTabs>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Verify the demo**

```bash
pnpm dev
```

Open `http://localhost:3000/demo` — should see the sidebar with 4 community icons, click between them, see posts change, sort tabs work.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add interactive community demo page"
```

---

### Task 8: Foundations Page (Token Documentation)

**Files:**
- Create: `design-system/app/foundations/page.tsx`
- Create: `design-system/components/color-swatch.tsx`
- Create: `design-system/components/type-specimen.tsx`
- Create: `design-system/components/spacing-scale.tsx`
- Reference: `design-system/static-legacy/foundations.html`

This is the token documentation page — shows all colors, typography, and spacing.

- [ ] **Step 1: Create ColorSwatch component**

Create `design-system/components/color-swatch.tsx`:

```tsx
interface ColorSwatchProps {
  name: string;
  value: string;
}

export function ColorSwatch({ name, value }: ColorSwatchProps) {
  return (
    <div className="space-y-1.5">
      <div
        className="h-16 rounded-lg border border-bg-elevated"
        style={{ background: value }}
      />
      <div className="text-xs font-mono text-text-muted">{name}</div>
      <div className="text-[10px] font-mono text-text-muted/60">{value}</div>
    </div>
  );
}
```

- [ ] **Step 2: Create TypeSpecimen and SpacingScale similarly**

Each renders a section of the foundations page. TypeSpecimen shows the font families at different sizes/weights. SpacingScale shows the spacing tokens as bars.

- [ ] **Step 3: Create the foundations page**

Assemble all token documentation sections into `design-system/app/foundations/page.tsx` — color palettes (surfaces, text, accents, indigo scale), type specimens, spacing scale visualization.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add foundations page with token documentation"
```

---

### Task 9: Navigation Shell

**Files:**
- Create: `design-system/components/design-nav.tsx`
- Modify: `design-system/app/layout.tsx`

Add the page navigation bar (Foundations / Demo / Catalog / Explorations) that appears on all design system pages.

- [ ] **Step 1: Create DesignNav component**

Create `design-system/components/design-nav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/foundations", label: "Foundations" },
  { href: "/demo", label: "Demo" },
  { href: "/catalog", label: "Catalog" },
];

export function DesignNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 flex items-center gap-2 px-6 h-12 bg-bg-surface border-b border-bg-elevated">
      <span className="font-serif font-bold text-sm mr-4">
        Design System
      </span>
      <div className="flex gap-0.5">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors no-underline ${
              pathname === href
                ? "bg-accent-secondary/10 text-accent-secondary"
                : "text-text-muted hover:bg-bg-elevated hover:text-text-secondary"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Add DesignNav to layout (except demo page which has its own layout)**

Update `design-system/app/layout.tsx` to include `<DesignNav />` in the body. Create `design-system/app/demo/layout.tsx` that does NOT include the nav (the demo page is its own full-screen experience).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add design system navigation shell"
```

---

### Task 10: Layout Catalog Page (60 Concepts)

**Files:**
- Create: `design-system/app/catalog/page.tsx`
- Create: `design-system/components/layouts/` (one file per layout concept, or grouped)
- Reference: `design-system/static-legacy/layout-catalog.html`

This is the biggest page — 60 layout concept previews. Strategy: create a `LayoutPreview` wrapper component and individual layout mini-previews. Start with 5-10 of the most interesting ones (Forum, Timeline, Compact List, Chat-First, Terminal, Bento, Digest, Stacked Panels) and add the rest incrementally.

- [ ] **Step 1: Create LayoutPreview wrapper**

Create `design-system/components/layout-preview.tsx`:

```tsx
interface LayoutPreviewProps {
  number: number;
  name: string;
  vibe: string;
  description: string;
  children: React.ReactNode;
}

export function LayoutPreview({
  number,
  name,
  vibe,
  description,
  children,
}: LayoutPreviewProps) {
  return (
    <section className="max-w-[960px] mx-auto mb-12 px-6" id={name.toLowerCase().replace(/\s+/g, "-")}>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-mono text-xs text-accent-secondary font-semibold">
          {String(number).padStart(2, "0")}
        </span>
        <h2 className="font-serif text-2xl font-bold">{name}</h2>
        <span className="text-xs text-text-muted italic">{vibe}</span>
      </div>
      <p className="text-sm text-text-secondary mb-4 max-w-[640px]">
        {description}
      </p>
      <div className="bg-bg-surface border border-bg-elevated rounded-xl overflow-hidden min-h-[320px] relative">
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create individual layout components**

Create files in `design-system/components/layouts/` — e.g., `forum.tsx`, `timeline.tsx`, `compact-list.tsx`, etc. Each exports a component that renders the mini-preview with sample data. Port the HTML/CSS from the static catalog into JSX with Tailwind classes.

Start with 5 layouts to establish the pattern, add the rest iteratively.

- [ ] **Step 3: Create the catalog page**

Create `design-system/app/catalog/page.tsx` that imports and renders all layout previews with the sticky nav at top.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add layout catalog page with initial layouts"
```

---

## Future Tasks (not in this plan)

These build on the foundation above and can be planned separately:

- **Atmosphere tab components** — Bluesky, WhiteWind, Smoke Signal cards
- **Wiki tab components** — community info, rules, mods, tags
- **Community theming** — per-community CSS variable overrides
- **Mobile layout** — bottom nav, drawer, responsive breakpoints
- **Remaining 50+ layout catalog entries**
- **Component library page** — interactive component playground
- **Dark/light mode toggle**
- **Deploy to Vercel**
