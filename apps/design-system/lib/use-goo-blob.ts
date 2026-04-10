import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Tracks the position/size of the active element in a tab bar
 * for rendering a liquid goo blob behind it.
 *
 * Returns refs to attach to the container and each tab button,
 * plus the current pill position { left, width }.
 */
export function useGooBlob(activeIndex: number) {
  const containerRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  const measure = useCallback(() => {
    const el = itemRefs.current[activeIndex];
    if (!el) return;
    setPill({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeIndex]);

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

  const setItemRef = useCallback((index: number) => (el: HTMLElement | null) => {
    itemRefs.current[index] = el;
  }, []);

  return { containerRef, setItemRef, pill };
}
