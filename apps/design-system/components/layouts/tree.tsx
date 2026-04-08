const treeData = [
  { depth: 0, icon: "\u25BC", label: "creative-coding/", isFolder: true },
  { depth: 1, icon: "\u25BC", label: "visual-art/", isFolder: true, meta: "3 posts" },
  { depth: 2, icon: "\u25B6", label: "isometric-city-6-months.md", isFolder: false, meta: "287\u2191" },
  { depth: 2, icon: "\u25B6", label: "win98-screensavers-p5js.md", isFolder: false, meta: "134\u2191" },
  { depth: 2, icon: "\u25B6", label: "interactive-pixels.md", isFolder: false, meta: "41\u2191" },
  { depth: 1, icon: "\u25BC", label: "gpu-shaders/", isFolder: true, meta: "3 posts" },
  { depth: 2, icon: "\u25B6", label: "webgpu-compute-shaders.md", isFolder: false, meta: "156\u2191" },
  { depth: 2, icon: "\u25B6", label: "navier-stokes-glsl.md", isFolder: false, meta: "54\u2191" },
  { depth: 2, icon: "\u25B6", label: "shader-playground-collab.md", isFolder: false, meta: "76\u2191" },
  { depth: 1, icon: "\u25BC", label: "generative/", isFolder: true, meta: "3 posts" },
  { depth: 2, icon: "\u25B6", label: "cellular-automata-music.md", isFolder: false, meta: "203\u2191" },
  { depth: 2, icon: "\u25B6", label: "perlin-noise-tutorial.md", isFolder: false, meta: "38\u2191" },
  { depth: 2, icon: "\u25B6", label: "ascii-raytracer-rust.md", isFolder: false, meta: "29\u2191" },
  { depth: 1, icon: "\u25B6", label: "challenges/", isFolder: true, meta: "5 posts" },
  { depth: 1, icon: "\u25B6", label: "meta/", isFolder: true, meta: "2 posts" },
];

export function TreeLayout() {
  return (
    <div className="p-4">
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs">
        {treeData.map((item, i) => (
          <div
            key={i}
            className="flex items-center py-0.5 hover:bg-zinc-800/30 rounded px-1 cursor-pointer"
            style={{ paddingLeft: `${item.depth * 20 + 4}px` }}
          >
            <span className="text-[10px] text-zinc-500 w-4 flex-shrink-0">{item.icon}</span>
            <span
              className={`ml-1 ${
                item.isFolder ? "text-amber-400 font-semibold" : "text-zinc-300"
              }`}
            >
              {item.label}
            </span>
            {item.meta && (
              <span className="ml-auto text-[10px] text-zinc-600">{item.meta}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
