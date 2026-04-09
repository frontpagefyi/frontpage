interface AvatarProps {
  initials: string;
  bg: string;
  size?: number;
  src?: string;
  className?: string;
}

export function Avatar({ initials, bg, size = 32, src, className = "" }: AvatarProps) {
  const style = {
    width: size,
    height: size,
    fontSize: size * 0.4,
    background: src ? undefined : bg,
    backgroundImage: src ? `url(${src})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white shrink-0 ring-1 ring-bg-elevated overflow-hidden ${className}`}
      style={style}
    >
      {!src && (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: size * 0.75, height: size * 0.75 }}
        >
          <circle cx="16" cy="12" r="5.5" fill="white" opacity="0.9" />
          <path
            d="M16 20c-6 0-10 3-10 6.5V28h20v-1.5c0-3.5-4-6.5-10-6.5z"
            fill="white"
            opacity="0.9"
          />
        </svg>
      )}
    </div>
  );
}
