const tiles = [
  {
    title: "Isometric city — 6 months of pixel work",
    meta: "pixelweaver \u00B7 287 likes",
    type: "image",
    size: "featured" as const,
    bg: "url('https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=800&q=80') center/cover no-repeat",
  },
  {
    title: "WebGPU compute shaders",
    meta: "47 replies",
    type: "discussion",
    size: "standard" as const,
    bg: "url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80') center/cover no-repeat",
  },
  {
    title: "Cellular automata MIDI",
    meta: "203 likes",
    type: "project",
    size: "standard" as const,
    bg: "url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80') center/cover no-repeat",
  },
  {
    title: "Weekly challenge #47: Generative landscapes",
    meta: "18 entries \u00B7 3 days left",
    type: "challenge",
    size: "wide" as const,
    bg: "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80') center/cover no-repeat",
  },
  {
    title: "Win98 screensavers in p5.js",
    meta: "retro_dev \u00B7 134 likes",
    type: "tutorial",
    size: "tall" as const,
    bg: "url('https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=400&q=80') center/cover no-repeat",
  },
];

const sizeClasses = {
  featured: "col-span-2 row-span-2",
  wide: "col-span-2",
  tall: "row-span-2",
  standard: "",
};

export function BentoLayout() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-4 auto-rows-[100px] gap-2">
        {tiles.map((tile) => (
          <div
            key={tile.title}
            className={`bg-bg-elevated rounded-md overflow-hidden relative cursor-pointer transition-transform hover:scale-[1.02] hover:z-10 ${sizeClasses[tile.size]}`}
          >
            <div className="absolute inset-0" style={{ background: tile.bg }} />
            {/* Type badge */}
            <div className="absolute top-1.5 left-1.5 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white">
              {tile.type}
            </div>
            {/* Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent">
              <div className="text-[11px] font-bold leading-tight text-white">{tile.title}</div>
              <div className="text-[10px] text-white/70">{tile.meta}</div>
            </div>
          </div>
        ))}

        {/* CTA tile */}
        <div className="bg-bg-elevated rounded-md overflow-hidden flex items-center justify-center p-2.5">
          <div className="text-center">
            <div className="text-[10px] font-bold text-accent-secondary">OPEN CALL</div>
            <div className="text-[11px] font-semibold mt-1">Shader playground contributors</div>
          </div>
        </div>
      </div>
    </div>
  );
}
