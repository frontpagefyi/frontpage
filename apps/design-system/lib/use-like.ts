import { useState, useCallback, useRef } from "react";
import { spawnHeartParticles } from "./particles";

/**
 * Manages like/heart toggle state with particle animation.
 * Returns state + ref to attach to the heart button for particle spawning.
 */
export function useLike(initialVotes: number, particleScale: "sm" | "md" = "md") {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialVotes);
  const heartRef = useRef<HTMLButtonElement>(null);

  const toggle = useCallback(() => {
    const next = !liked;
    setLiked(next);
    setCount(initialVotes + (next ? 1 : 0));
    if (next && heartRef.current) {
      spawnHeartParticles(heartRef.current, particleScale);
    }
  }, [liked, initialVotes, particleScale]);

  return { liked, count, heartRef, toggle };
}
