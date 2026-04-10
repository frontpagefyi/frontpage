import { useState, useCallback, useRef, useEffect, useTransition } from "react";
import { spawnHeartParticles } from "./particles";
import { toggleVote } from "./actions/posts";

/**
 * Manages like/heart toggle state with particle animation.
 * Initial state comes from server via post.voted, syncs when props change.
 * `animating` is only true on explicit user toggle, not on sync/mount.
 */
export function useLike(targetId: string | undefined, initialVotes: number, initialVoted = false, targetType: "post" | "comment" = "post", particleScale: "sm" | "md" = "md") {
  const [liked, setLiked] = useState(initialVoted);
  const [count, setCount] = useState(initialVotes);
  const [animating, setAnimating] = useState(false);
  const heartRef = useRef<HTMLButtonElement>(null);
  const [, startTransition] = useTransition();

  // Sync when server-provided values change (no animation)
  useEffect(() => { setLiked(initialVoted); setAnimating(false); }, [initialVoted]);
  useEffect(() => { setCount(initialVotes); }, [initialVotes]);

  const toggle = useCallback(() => {
    const next = !liked;
    setLiked(next);
    setAnimating(next);
    setCount((c) => c + (next ? 1 : -1));
    if (next && heartRef.current) {
      spawnHeartParticles(heartRef.current, particleScale);
    }
    if (targetId) {
      startTransition(async () => {
        const result = await toggleVote(targetId, targetType);
        setLiked(result.voted);
        setCount(result.newCount);
      });
    }
  }, [liked, targetId, targetType, particleScale, startTransition]);

  return { liked, animating, count, heartRef, toggle };
}
