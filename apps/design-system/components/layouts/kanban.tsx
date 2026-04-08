const columns = [
  {
    title: "New",
    count: 3,
    cards: [
      { title: "Seeking shader playground collaborators", author: "glsl_gang", score: 76, tags: ["open-source"] },
      { title: "ASCII ray tracer in 200 lines of Rust", author: "cast_shadows", score: 29, tags: [] },
      { title: "Perlin noise tutorial that makes sense", author: "noise_maker", score: 38, tags: [] },
    ],
  },
  {
    title: "Trending",
    count: 2,
    cards: [
      { title: "WebGPU compute shaders — 1M particles", author: "shader_witch", score: 156, tags: ["gpu", "webgpu"] },
      { title: "Cellular automata music generator", author: "bytebard", score: 203, tags: ["audio"] },
    ],
  },
  {
    title: "Hall of Fame",
    count: 1,
    cards: [
      { title: "Isometric city — 6 months of pixel work", author: "pixelweaver", score: 287, tags: ["pixel-art", "featured"] },
    ],
  },
  {
    title: "Needs Reply",
    count: 2,
    cards: [
      { title: "Help: GLSL noise function not compiling on Safari", author: "newbie_gl", score: 5, tags: ["help"] },
      { title: "Why does my particle sim slow down after 10k?", author: "just_started", score: 3, tags: [] },
    ],
  },
];

export function KanbanLayout() {
  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex gap-3 min-w-[800px]">
        {columns.map((col) => (
          <div key={col.title} className="flex-1 bg-bg-elevated rounded-xl p-3 min-w-[180px]">
            {/* Column title */}
            <div className="text-[11px] font-bold uppercase text-text-muted tracking-[0.5px] mb-2.5 flex items-center gap-2">
              {col.title}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-bg-overlay text-text-muted">
                {col.count}
              </span>
            </div>

            {/* Cards */}
            {col.cards.map((card) => (
              <div
                key={card.title}
                className="bg-bg-surface rounded-md p-2.5 mb-2 border border-bg-overlay cursor-grab transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_oklch(0%_0_0/0.2)]"
              >
                <div className="text-xs font-semibold leading-tight mb-1">{card.title}</div>
                <div className="text-[10px] text-text-muted flex justify-between">
                  <span>{card.author}</span>
                  <span>{card.score}&uarr;</span>
                </div>
                {card.tags.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded-full bg-bg-elevated text-text-muted font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
