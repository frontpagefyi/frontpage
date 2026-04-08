"use client";

import { useEffect, useState } from "react";

interface TocItem {
  number: number;
  name: string;
  id: string;
}

export function CatalogToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible section
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="sticky top-16 max-h-[calc(100vh-80px)] overflow-y-auto pr-4 pb-8">
      <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">
        Layouts
      </div>
      <div className="flex flex-col gap-0.5">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition-colors ${
                isActive
                  ? "bg-bg-elevated text-text-primary font-medium"
                  : "text-text-muted hover:text-text-secondary hover:bg-bg-elevated/50"
              }`}
            >
              <span className={`font-mono text-[10px] w-5 shrink-0 ${isActive ? "text-accent-secondary" : ""}`}>
                {String(item.number).padStart(2, "0")}
              </span>
              <span className="truncate">{item.name}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
