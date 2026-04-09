"use client";

import { useState, useRef, useCallback } from "react";

interface DraggableDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function DraggableDrawer({ open, onClose, children, className = "" }: DraggableDrawerProps) {
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setDragging(true);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging) return;
    const dy = Math.max(0, e.touches[0].clientY - startY.current);
    setDragY(dy);
  }, [dragging]);

  const onTouchEnd = useCallback(() => {
    setDragging(false);
    if (dragY > 80) {
      onClose();
    }
    setDragY(0);
  }, [dragY, onClose]);

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={`absolute bottom-0 left-0 right-0 bg-bg-surface rounded-t-2xl shadow-[0_-8px_40px_oklch(0%_0_0_/_0.4)] ring-1 ring-white/10 md:hidden overflow-hidden ${className}`}
      style={{
        transform: open
          ? `translateY(${dragY}px)`
          : "translateY(calc(100% + 64px))",
        transition: dragging
          ? "none"
          : open
            ? "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
            : "transform 0.3s cubic-bezier(0.4, 0, 1, 1)",
      }}
    >
      {children}
    </div>
  );
}
