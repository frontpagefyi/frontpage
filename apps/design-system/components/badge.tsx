import { Sparkles, Star, Radio, Shield, type LucideIcon } from "lucide-react";

type BadgeVariant = "artist" | "og" | "live" | "mod";

const variantConfig: Record<BadgeVariant, { color: string; glow: string; icon: LucideIcon }> = {
  artist: {
    color: "oklch(75% 0.18 75)",
    glow: "oklch(75% 0.18 75 / 0.3)",
    icon: Sparkles,
  },
  og: {
    color: "oklch(72% 0.16 145)",
    glow: "oklch(72% 0.16 145 / 0.3)",
    icon: Star,
  },
  live: {
    color: "oklch(68% 0.22 25)",
    glow: "oklch(68% 0.22 25 / 0.3)",
    icon: Radio,
  },
  mod: {
    color: "oklch(70% 0.15 259)",
    glow: "oklch(70% 0.15 259 / 0.3)",
    icon: Shield,
  },
};

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
  icon?: string;
}

export function Badge({ variant, label }: BadgeProps) {
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide whitespace-nowrap"
      title={label}
    >
      <span
        className="flex items-center justify-center w-4 h-4 rounded-full"
        style={{
          color: config.color,
          filter: `drop-shadow(0 0 3px ${config.glow})`,
        }}
      >
        <IconComponent size={12} />
      </span>
      <span
        className="hidden sm:inline"
        style={{ color: config.color }}
      >
        {label}
      </span>
    </span>
  );
}
