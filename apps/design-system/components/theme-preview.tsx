import type { CSSProperties } from "react";

interface Theme {
  name: string;
  description: string;
  overrides: Record<string, string>;
}

const themes: Theme[] = [
  {
    name: "Creative Coding",
    description: "Default dark navy",
    overrides: {},
  },
  {
    name: "Home Gardening",
    description: "Light green",
    overrides: {
      "--color-bg-base": "oklch(95% 0.02 145)",
      "--color-bg-surface": "oklch(92% 0.018 145)",
      "--color-bg-elevated": "oklch(88% 0.016 145)",
      "--color-text-primary": "oklch(18% 0.04 145)",
      "--color-text-secondary": "oklch(35% 0.03 145)",
      "--color-text-muted": "oklch(50% 0.025 145)",
      "--color-accent-primary": "oklch(42% 0.2 145)",
    },
  },
  {
    name: "Retro Gaming",
    description: "Dark magenta",
    overrides: {
      "--color-bg-base": "oklch(10% 0.02 350)",
      "--color-bg-surface": "oklch(15% 0.018 350)",
      "--color-bg-elevated": "oklch(20% 0.016 350)",
      "--color-accent-primary": "oklch(65% 0.25 350)",
    },
  },
  {
    name: "Photography",
    description: "Warm amber",
    overrides: {
      "--color-bg-base": "oklch(12% 0.005 60)",
      "--color-bg-surface": "oklch(17% 0.005 60)",
      "--color-bg-elevated": "oklch(22% 0.005 60)",
      "--color-accent-primary": "oklch(78% 0.17 75)",
    },
  },
];

export function ThemePreview() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {themes.map((theme) => (
        <div
          key={theme.name}
          className="rounded-lg overflow-hidden border border-bg-overlay"
          style={theme.overrides as CSSProperties}
        >
          <div
            className="h-10"
            style={{ background: "var(--color-bg-elevated)" }}
          />
          <div
            className="p-3 space-y-2"
            style={{ background: "var(--color-bg-base)" }}
          >
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {theme.name}
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              {theme.description}
            </p>
            <div className="flex items-center gap-2">
              <div
                className="rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  background: "var(--color-accent-primary)",
                }}
              />
              <span
                className="text-xs"
                style={{ color: "var(--color-text-secondary, var(--color-text-primary))" }}
              >
                Accent
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
