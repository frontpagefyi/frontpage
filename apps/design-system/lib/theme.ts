import type { CommunityTheme } from "./types";

/**
 * Maps community theme keys (e.g. "--bg-base") to Tailwind CSS 4
 * custom property names (e.g. "--color-bg-base") for inline style overrides.
 */
export function themeToStyle(
  theme: CommunityTheme | undefined,
): React.CSSProperties | undefined {
  if (!theme) return undefined;
  const style: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme)) {
    if (!key.startsWith("--") || key.startsWith("--color-")) {
      // Already prefixed or not a CSS variable — skip
      continue;
    }
    style[`--color-${key.slice(2)}`] = value;
  }
  return style as React.CSSProperties;
}
