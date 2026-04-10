"use client";

import { MoreHorizontal } from "lucide-react";
import type { ReactNode } from "react";

interface MenuItemProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}

interface MoreMenuProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  items: MenuItemProps[];
  /** Where the dropdown opens relative to the trigger */
  position?: "above" | "below";
  /** Whether the trigger is always visible or only on group hover */
  alwaysVisible?: boolean;
}

export function MoreMenu({
  open,
  onToggle,
  onClose,
  items,
  position = "below",
  alwaysVisible = true,
}: MoreMenuProps) {
  const posClass = position === "above"
    ? "bottom-full mb-1"
    : "top-full mt-1";

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center transition-colors ${
          open
            ? "text-text-secondary"
            : alwaysVisible
              ? "text-text-muted hover:text-text-secondary"
              : "opacity-0 group-hover:opacity-100 text-text-muted hover:text-text-secondary"
        }`}
      >
        <MoreHorizontal size={16} strokeWidth={2.25} />
      </button>
      {open ? (
        <>
          <div className="fixed inset-0 z-[60]" onClick={onClose} />
          <div className={`absolute right-0 ${posClass} z-[70] bg-bg-surface border border-bg-elevated rounded-lg shadow-[0_8px_24px_oklch(0%_0_0_/_0.4)] py-1 min-w-[150px]`}>
            {items.map((item, i) => (
              <div key={item.label}>
                {i > 0 && item.destructive ? (
                  <div className="border-t border-bg-elevated my-1" />
                ) : null}
                <button
                  onClick={item.onClick}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-xs transition-colors ${
                    item.destructive
                      ? "text-text-muted hover:bg-bg-elevated hover:text-accent-destructive"
                      : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
