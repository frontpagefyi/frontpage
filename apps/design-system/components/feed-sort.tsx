"use client";

import { Flame, Clock, TrendingUp } from "lucide-react";
import { useGooBlob } from "@/lib/use-goo-blob";
import { GooBlobs } from "./goo-blobs";

const sortOptions = [
  { key: "hot", label: "Hot", icon: Flame },
  { key: "new", label: "New", icon: Clock },
  { key: "top", label: "Top", icon: TrendingUp },
] as const;

type SortKey = (typeof sortOptions)[number]["key"];

interface FeedSortProps {
  value: SortKey;
  onChange: (key: SortKey) => void;
}

export function FeedSort({ value, onChange }: FeedSortProps) {
  const activeIndex = sortOptions.findIndex((o) => o.key === value);
  const { containerRef, setItemRef, pill } = useGooBlob(activeIndex);

  return (
    <div ref={containerRef as React.RefObject<HTMLDivElement>} className="relative flex gap-1" role="tablist" aria-label="Sort posts">
      <GooBlobs filterId="goo-sort" pill={pill} className="rounded-full" />

      {sortOptions.map(({ key, label, icon: SortIcon }, i) => (
        <button
          key={key}
          ref={setItemRef(i)}
          role="tab"
          aria-selected={value === key}
          onClick={() => onChange(key)}
          className={`relative z-10 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full hover:translate-y-[-1px] active:translate-y-0 active:scale-[0.97] motion-safe:transition-[color,transform] motion-safe:duration-150 ${
            value === key
              ? "text-text-primary"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          <SortIcon size={14} />
          {label}
        </button>
      ))}
    </div>
  );
}
