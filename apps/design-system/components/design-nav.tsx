"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/foundations", label: "Foundations" },
  { href: "/explorations", label: "Explorations" },
];

function DraggableBackButton() {
  const [pos, setPos] = useState({ x: 300, y: 500 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, origX: 0, origY: 0, moved: false });

  useEffect(() => {
    setPos({ x: window.innerWidth - 80, y: window.innerHeight - 140 });
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y, moved: false };
    setDragging(true);
  }, [pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragRef.current.moved = true;
    setPos({
      x: Math.max(0, Math.min(window.innerWidth - 70, dragRef.current.origX + dx)),
      y: Math.max(0, Math.min(window.innerHeight - 40, dragRef.current.origY + dy)),
    });
  }, [dragging]);

  const onPointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  return (
    <Link
      href="/explorations"
      draggable={false}
      onClick={(e) => { if (dragRef.current.moved) e.preventDefault(); }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={`fixed z-[9999] flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-accent-secondary text-white text-xs font-semibold shadow-[0_2px_12px_oklch(64.8%_0.147_259_/_0.5)] select-none touch-none ${
        dragging ? "cursor-grabbing scale-110 shadow-[0_4px_20px_oklch(64.8%_0.147_259_/_0.6)]" : "cursor-grab hover:shadow-[0_4px_16px_oklch(64.8%_0.147_259_/_0.5)]"
      }`}
      style={{
        left: pos.x,
        top: pos.y,
        transition: dragging ? "none" : "opacity 0.2s, transform 0.15s, box-shadow 0.15s",
      }}
    >
      <ArrowLeft size={12} />
      Back
    </Link>
  );
}

export function DesignNav() {
  const pathname = usePathname();

  const fullScreenDemos = ["/explorations/community-feed", "/explorations/threaded-forum"];
  if (fullScreenDemos.some((d) => pathname.startsWith(d))) {
    return <DraggableBackButton />;
  }

  return (
    <nav className="flex items-center gap-1 px-4 py-2 bg-bg-surface border-b border-bg-elevated">
      <span className="text-sm font-semibold text-text-primary mr-4 font-serif">
        Frontpage DS
      </span>
      {navLinks.map(({ href, label }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              isActive
                ? "bg-bg-interactive text-text-primary"
                : "text-text-muted hover:text-text-secondary hover:bg-bg-elevated"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
