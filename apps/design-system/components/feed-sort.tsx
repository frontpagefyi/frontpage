"use client";

import { useState } from "react";
import { Flame, Clock, TrendingUp } from "lucide-react";

const sortOptions = [
  { key: "hot", label: "Hot", icon: Flame },
  { key: "new", label: "New", icon: Clock },
  { key: "top", label: "Top", icon: TrendingUp },
] as const;

type SortKey = (typeof sortOptions)[number]["key"];

interface FeedSortProps {
  value?: SortKey;
  onChange?: (key: SortKey) => void;
}

export function FeedSort({ value, onChange }: FeedSortProps) {
  const [active, setActive] = useState<SortKey>(value ?? "hot");

  const handleClick = (key: SortKey) => {
    setActive(key);
    onChange?.(key);
  };

  return (
    <div className="flex gap-1" role="tablist" aria-label="Sort posts">
      {sortOptions.map(({ key, label, icon: SortIcon }) => (
        <button
          key={key}
          role="tab"
          aria-selected={active === key}
          onClick={() => handleClick(key)}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
            active === key
              ? "bg-bg-interactive text-text-primary"
              : "text-text-muted hover:text-text-secondary hover:bg-bg-elevated"
          }`}
        >
          <SortIcon size={14} />
          {label}
        </button>
      ))}
    </div>
  );
}
