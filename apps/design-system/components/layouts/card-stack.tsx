const cards = [
  {
    title: "Just finished this isometric city — 6 months of pixel work",
    meta: "pixelweaver \u00B7 3h ago \u00B7 287 likes \u00B7 94 comments",
    image: "url('https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=800&q=80')",
    z: 3,
    translateY: 0,
    scale: 1,
    opacity: 1,
  },
  {
    title: "Anyone tried the new WebGPU compute shaders?",
    meta: "shader_witch \u00B7 5h ago",
    image: "url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80')",
    z: 2,
    translateY: 12,
    scale: 0.96,
    opacity: 0.7,
  },
  {
    title: "Cellular automata music generator",
    meta: "bytebard \u00B7 8h ago",
    image: "url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80')",
    z: 1,
    translateY: 24,
    scale: 0.92,
    opacity: 0.4,
  },
];

export function CardStackLayout() {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      {/* Card stack */}
      <div className="relative w-[320px] h-[280px]">
        {cards.map((card) => (
          <div
            key={card.title}
            className="absolute inset-x-0 top-0 bg-bg-surface rounded-xl overflow-hidden shadow-[0_8px_30px_oklch(0%_0_0/0.3)]"
            style={{
              zIndex: card.z,
              transform: `translateY(${card.translateY}px) scale(${card.scale})`,
              opacity: card.opacity,
            }}
          >
            <div
              className="h-[160px] bg-cover bg-center"
              style={{ backgroundImage: card.image }}
            />
            <div className="p-4">
              <div className="text-[14px] font-bold leading-tight mb-1">{card.title}</div>
              <div className="text-[12px] text-text-muted mb-3">{card.meta}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4 mt-6">
        <div className="w-[48px] h-[48px] rounded-full border-2 border-accent-destructive text-accent-destructive flex items-center justify-center text-[20px] cursor-pointer transition-transform hover:scale-110">
          &#10005;
        </div>
        <div className="w-[48px] h-[48px] rounded-full border-2 border-accent-primary text-accent-primary flex items-center justify-center text-[20px] cursor-pointer transition-transform hover:scale-110">
          &#9733;
        </div>
        <div className="w-[48px] h-[48px] rounded-full border-2 border-accent-success text-accent-success flex items-center justify-center text-[20px] cursor-pointer transition-transform hover:scale-110">
          &#10084;
        </div>
      </div>
    </div>
  );
}
