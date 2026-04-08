const items = [
  {
    title: "Isometric city — 6 months",
    stats: ["287 likes", "94 comments"],
    wide: true,
    bg: "url('https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=800&q=80') center/cover no-repeat, linear-gradient(135deg, var(--indigo-900), var(--indigo-700))",
  },
  {
    title: "Fluid simulation GLSL",
    stats: ["54 likes"],
    bg: "url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80') center/cover no-repeat, linear-gradient(135deg, oklch(30% 0.08 220), oklch(25% 0.06 200))",
  },
  {
    title: "Win98 screensavers",
    stats: ["134 likes"],
    bg: "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80') center/cover no-repeat, linear-gradient(135deg, oklch(30% 0.08 40), oklch(25% 0.06 30))",
  },
  {
    title: "Cellular automata",
    stats: ["203 likes"],
    bg: "url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80') center/cover no-repeat, linear-gradient(135deg, oklch(30% 0.08 150), oklch(25% 0.06 130))",
  },
  {
    title: "Generative landscapes",
    stats: ["98 likes"],
    bg: "url('https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=400&q=80') center/cover no-repeat",
  },
  {
    title: "Perlin noise patterns",
    stats: ["38 likes"],
    bg: "url('https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=400&q=80') center/cover no-repeat",
  },
  {
    title: "Interactive pixel canvas",
    stats: ["41 likes", "15 comments"],
    wide: true,
    bg: "linear-gradient(135deg, oklch(22% 0.05 350), oklch(18% 0.03 330))",
  },
];

export function GalleryLayout() {
  return (
    <div className="p-1">
      <div className="grid grid-cols-3 gap-1">
        {items.map((item) => (
          <div
            key={item.title}
            className={`relative overflow-hidden cursor-pointer group ${
              item.wide ? "col-span-2 aspect-[2]" : "aspect-square"
            }`}
          >
            {/* Image / background */}
            <div
              className="absolute inset-0"
              style={{ background: item.bg }}
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[oklch(0%_0_0/0.6)] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 text-center">
              <div className="text-xs font-bold mb-1 text-white">
                {item.title}
              </div>
              <div className="text-[10px] text-[oklch(80%_0_0)] flex gap-3">
                {item.stats.map((stat) => (
                  <span key={stat}>{stat}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
