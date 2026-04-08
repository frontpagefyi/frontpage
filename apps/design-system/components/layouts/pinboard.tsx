const pins = [
  {
    title: "Isometric city — 6 months of pixel work",
    meta: "pixelweaver \u00B7 287 likes",
    top: 20,
    left: 30,
    rotate: -2,
    width: 220,
    image: "url('https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=400&q=80')",
  },
  {
    title: "WebGPU compute shaders — 1M particles at 60fps",
    meta: "shader_witch \u00B7 156 likes",
    top: 30,
    left: 290,
    rotate: 1.5,
    width: 180,
    image: null,
  },
  {
    title: "Cellular automata music generator",
    meta: "bytebard \u00B7 203 likes",
    top: 160,
    left: 200,
    rotate: -1,
    width: 200,
    image: null,
  },
  {
    title: "Windows 98 screensavers in p5.js",
    meta: "retro_dev \u00B7 134 likes",
    top: 10,
    left: 520,
    rotate: 3,
    width: 190,
    image: "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80')",
  },
  {
    title: "Seeking shader playground collaborators",
    meta: "glsl_gang \u00B7 76 likes",
    top: 200,
    left: 480,
    rotate: -2.5,
    width: 180,
    image: null,
  },
  {
    title: "Weekly challenge #47: Generative landscapes",
    meta: "admin \u00B7 98 likes",
    top: 280,
    left: 40,
    rotate: 2,
    width: 170,
    image: null,
  },
];

export function PinboardLayout() {
  return (
    <div
      className="relative h-[400px] overflow-hidden"
      style={{
        background: `repeating-linear-gradient(0deg, transparent, transparent 19px, var(--bg-elevated) 19px, var(--bg-elevated) 20px),
          repeating-linear-gradient(90deg, transparent, transparent 19px, var(--bg-elevated) 19px, var(--bg-elevated) 20px)`,
      }}
    >
      {pins.map((pin) => (
        <div
          key={pin.title}
          className="absolute bg-bg-surface rounded-md shadow-[0_4px_12px_oklch(0%_0_0/0.3)] overflow-hidden transition-transform hover:scale-[1.04] hover:shadow-[0_8px_24px_oklch(0%_0_0/0.4)] hover:z-10"
          style={{
            top: pin.top,
            left: pin.left,
            width: pin.width,
            transform: `rotate(${pin.rotate}deg)`,
          }}
        >
          {/* Tape */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 h-3 bg-[oklch(80%_0.05_85/0.7)] rounded-sm z-10" />

          {/* Image if present */}
          {pin.image && (
            <div
              className="h-[80px] bg-cover bg-center"
              style={{ backgroundImage: pin.image }}
            />
          )}

          {/* Body */}
          <div className="px-3 pt-4 pb-2.5">
            <div className="text-[12px] font-bold leading-tight mb-1">{pin.title}</div>
            <div className="text-[10px] text-text-muted">{pin.meta}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
