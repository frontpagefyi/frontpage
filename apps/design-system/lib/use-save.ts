import { useState, useCallback, useEffect, useTransition } from "react";
import { toggleSave as toggleSaveAction } from "./actions/posts";

/**
 * Manages save/bookmark toggle state with animation key.
 * Initial state comes from server via post.saved, syncs when props change.
 */
export function useSave(postId?: string, initialSaved = false) {
  const [saved, setSaved] = useState(initialSaved);
  const [animKey, setAnimKey] = useState(0);
  const [, startTransition] = useTransition();

  // Sync when server-provided value changes (e.g. after navigation refresh)
  useEffect(() => { setSaved(initialSaved); }, [initialSaved]);

  const toggle = useCallback(() => {
    const next = !saved;
    setSaved(next);
    if (next) setAnimKey((k) => k + 1);
    if (postId) {
      startTransition(async () => {
        const result = await toggleSaveAction(postId);
        setSaved(result);
      });
    }
  }, [saved, postId, startTransition]);

  return { saved, animKey, toggle };
}
