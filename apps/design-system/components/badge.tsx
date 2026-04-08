import { icons } from "lucide-react";

type BadgeVariant = "artist" | "og" | "live" | "mod";

const variantStyles: Record<BadgeVariant, string> = {
  artist: "bg-gradient-to-r from-accent-primary to-[oklch(70%_0.2_55)] text-[#1a1000]",
  og: "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white",
  live: "bg-accent-live text-white",
  mod: "bg-accent-secondary text-white",
};

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
  icon?: string;
}

export function Badge({ variant, label, icon }: BadgeProps) {
  const IconComponent = icon
    ? icons[icon as keyof typeof icons]
    : undefined;

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full uppercase whitespace-nowrap ${variantStyles[variant]}`}>
      {IconComponent && <IconComponent size={9} />}
      {label}
    </span>
  );
}
