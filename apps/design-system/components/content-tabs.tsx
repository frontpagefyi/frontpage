"use client";

import { useState, type ReactNode } from "react";
import { AtSign, BookOpen, ArrowLeft } from "lucide-react";
import { FeedSort } from "./feed-sort";

type TabKey = "posts" | "atmo" | "wiki";

interface ContentTabsProps {
  children: Record<TabKey, ReactNode>;
  sortKey: "hot" | "new" | "top";
  onSortChange: (key: "hot" | "new" | "top") => void;
}

const secondaryTabs: { key: TabKey; icon: typeof AtSign; label: string }[] = [
  { key: "atmo", icon: AtSign, label: "Atmosphere" },
  { key: "wiki", icon: BookOpen, label: "Wiki" },
];

export function ContentTabs({ children, sortKey, onSortChange }: ContentTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("posts");

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex items-center gap-2">
        {activeTab !== "posts" ? (
          <button
            onClick={() => setActiveTab("posts")}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            <ArrowLeft size={14} />
            Posts
          </button>
        ) : (
          <FeedSort value={sortKey} onChange={onSortChange} />
        )}

        <div className="flex-1" />

        {/* Secondary tabs */}
        <div className="flex items-center gap-1">
          {secondaryTabs.map(({ key, icon: TabIcon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(activeTab === key ? "posts" : key)}
              className={`p-2 rounded-lg transition-colors ${
                activeTab === key
                  ? "bg-bg-interactive text-text-primary"
                  : "text-text-muted hover:text-text-secondary hover:bg-bg-elevated"
              }`}
              title={label}
            >
              <TabIcon size={18} />
            </button>
          ))}

        </div>
      </div>

      {/* Active panel */}
      <div key={activeTab} className="animate-fade-in">
        {children[activeTab]}
      </div>
    </div>
  );
}
