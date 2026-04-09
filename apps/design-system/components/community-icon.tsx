import Image from "next/image";

interface CommunityIconProps {
  icon?: string;
  name?: string;
  size?: number;
  className?: string;
}

export function CommunityIcon({
  icon,
  name = "fp",
  size = 40,
  className = "",
}: CommunityIconProps) {
  const initials = name.slice(0, 2).toLowerCase();

  if (icon) {
    return (
      <Image
        src={icon}
        alt=""
        width={size}
        height={size}
        className={`rounded-lg object-cover overflow-hidden ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-900 flex items-center justify-center overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <span
        className="text-white font-bold"
        style={{ fontSize: size * 0.25 }}
      >
        {initials}
      </span>
    </div>
  );
}
