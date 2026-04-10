import type { ReactNode } from "react";
import { routes } from "./constants";

/** Parse text and render @mentions as profile links. */
export function renderWithMentions(text: string): ReactNode[] {
  const parts = text.split(/(@\w+)/g);
  return parts.map((part, i) => {
    if (part.startsWith("@")) {
      const username = part.slice(1);
      return (
        <a
          key={i}
          href={routes.profile(username)}
          className="text-accent-secondary hover:underline transition-colors font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}
