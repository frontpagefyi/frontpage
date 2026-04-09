"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  const [internal, setInternal] = useState<SortKey>("hot");
  const active = value ?? internal;

  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  const measure = useCallback(() => {
    const idx = sortOptions.findIndex((o) => o.key === active);
    const btn = btnRefs.current[idx];
    if (!btn) return;
    setPill({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [active]);

  useEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [measure]);

  const handleClick = (key: SortKey) => {
    setInternal(key);
    onChange?.(key);
  };

  return (
    <div ref={containerRef} className="relative flex gap-1" role="tablist" aria-label="Sort posts">
      {/* Goo filter for liquid blob effect */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="goo-sort">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Blob layer with goo filter */}
      <div className="absolute inset-0 pointer-events-none" style={{ filter: "url(#goo-sort)" }}>
        {/* Main blob — moves fast */}
        <div
          className="absolute top-0 h-full rounded-full bg-bg-interactive"
          style={{
            left: pill.left,
            width: pill.width,
            transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
        {/* Trail blob — follows slower, creates the goo stretch */}
        <div
          className="absolute top-0 h-full rounded-full bg-bg-interactive"
          style={{
            left: pill.left,
            width: pill.width,
            transition: "left 0.5s cubic-bezier(0.2, 0, 0, 1), width 0.4s cubic-bezier(0.2, 0, 0, 1)",
          }}
        />
      </div>

      {/* Tab buttons */}
      {sortOptions.map(({ key, label, icon: SortIcon }, i) => (
        <button
          key={key}
          ref={(el) => { btnRefs.current[i] = el; }}
          role="tab"
          aria-selected={active === key}
          onClick={() => handleClick(key)}
          className={`relative z-10 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full hover:translate-y-[-1px] active:translate-y-0 active:scale-[0.97] motion-safe:transition-[color,transform] motion-safe:duration-150 ${
            active === key
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
