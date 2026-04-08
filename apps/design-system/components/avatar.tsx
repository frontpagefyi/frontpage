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
      className={`rounded-full flex items-center justify-center font-bold text-white shrink-0 ${className}`}
      style={style}
    >
      {!src && initials}
    </div>
  );
}
