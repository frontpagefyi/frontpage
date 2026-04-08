const featuredCards = [
  {
    title: "Isometric city — 6 months of pixel work",
    meta: "pixelweaver · 287 likes · 94 comments",
    imgBg:
      "url('https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=800&q=80') center/cover no-repeat, linear-gradient(135deg, var(--indigo-900), var(--indigo-700))",
  },
  {
    title: "WebGPU compute shaders are here",
    meta: "shader_witch · 156 likes · 47 comments",
    imgBg:
      "url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80') center/cover no-repeat, linear-gradient(135deg, oklch(30% 0.08 220), oklch(25% 0.06 200))",
  },
  {
    title: "Cellular automata music generator",
    meta: "bytebard · 203 likes · 32 comments",
    imgBg:
      "url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80') center/cover no-repeat, linear-gradient(135deg, oklch(30% 0.08 150), oklch(25% 0.06 130))",
  },
  {
    title: "Windows 98 screensavers in p5.js",
    meta: "retro_dev · 134 likes · 63 comments",
    imgBg:
      "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80') center/cover no-repeat, linear-gradient(135deg, oklch(30% 0.08 40), oklch(25% 0.06 30))",
  },
];

const listItems = [
  {
    rank: 5,
    title: "Weekly challenge #47: Generative landscapes",
    stats: "98 · 18c",
  },
  {
    rank: 6,
    title: "Seeking collaborators for shader playground",
    stats: "76 · 11c",
  },
  {
    rank: 7,
    title: "Real-time fluid simulation with Navier-Stokes",
    stats: "54 · 29c",
  },
  {
    rank: 8,
    title: "I made every pixel on my screen interactive",
    stats: "41 · 15c",
  },
  {
    rank: 9,
    title: "Perlin noise tutorial that actually makes sense",
    stats: "38 · 22c",
  },
  {
    rank: 10,
    title: "ASCII art ray tracer in 200 lines of Rust",
    stats: "29 · 8c",
  },
];

export function MarqueeLayout() {
  return (
    <div className="p-4">
      {/* Horizontal carousel */}
      <div className="flex gap-3 overflow-x-auto pb-3 [-webkit-overflow-scrolling:touch] [scroll-snap-type:x_mandatory]">
        {featuredCards.map((card) => (
          <div
            key={card.title}
            className="min-w-[260px] shrink-0 bg-bg-elevated rounded-xl overflow-hidden [scroll-snap-align:start] border border-bg-overlay"
          >
            <div
              className="h-[120px]"
              style={{ background: card.imgBg }}
            />
            <div className="p-3">
              <div className="font-serif text-sm font-bold leading-[1.3] mb-1">
                {card.title}
              </div>
              <div className="text-[10px] text-text-muted">{card.meta}</div>
            </div>
          </div>
        ))}
      </div>

      {/* "Everything Else" label */}
      <div className="text-[11px] font-bold uppercase text-text-muted tracking-[1px] mt-4 mb-2 pb-1 border-b border-bg-elevated">
        Everything Else
      </div>

      {/* Compact ranked list */}
      {listItems.map((item) => (
        <div
          key={item.rank}
          className="flex items-center gap-3 py-2 text-xs"
        >
          <span className="font-mono text-[11px] text-text-muted min-w-[20px]">
            {item.rank}.
          </span>
          <span className="flex-1 font-medium">{item.title}</span>
          <span className="text-[10px] text-text-muted">{item.stats}</span>
        </div>
      ))}
    </div>
  );
}
