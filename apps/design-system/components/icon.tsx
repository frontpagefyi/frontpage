import { type LucideIcon } from "lucide-react";

interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
}

export function Icon({ icon: LucideIcon, size = 14, className }: IconProps) {
  return <LucideIcon size={size} className={className} />;
}
