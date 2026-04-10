import { useState, useCallback } from "react";

/**
 * Manages save/bookmark toggle state with animation key.
 * `animKey` increments on save (not unsave) to retrigger CSS animation.
 */
export function useSave() {
  const [saved, setSaved] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const toggle = useCallback(() => {
    const next = !saved;
    setSaved(next);
    if (next) setAnimKey((k) => k + 1);
  }, [saved]);

  return { saved, animKey, toggle };
}
