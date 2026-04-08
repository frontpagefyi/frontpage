const items = [
  { rank: 1, score: 287, title: "Just finished this isometric city — 6 months of pixel work", author: "pixelweaver", comments: 94 },
  { rank: 2, score: 203, title: "Made a cellular automata music generator", author: "bytebard", comments: 32 },
  { rank: 3, score: 156, title: "Anyone tried the new WebGPU compute shaders?", author: "shader_witch", comments: 47 },
  { rank: 4, score: 134, title: "How I recreated the Windows 98 screensavers in p5.js", author: "retro_dev", comments: 63 },
  { rank: 5, score: 98, title: "Weekly challenge #47: Generative landscapes", author: "admin", comments: 18 },
  { rank: 6, score: 76, title: "Seeking collaborators for open-source shader playground", author: "glsl_gang", comments: 11 },
  { rank: 7, score: 54, title: "Real-time fluid simulation with Navier-Stokes in GLSL", author: "flowstate", comments: 29 },
  { rank: 8, score: 41, title: "I made every pixel on my screen interactive", author: "touchpixel", comments: 15 },
  { rank: 9, score: 38, title: "Perlin noise tutorial that actually makes sense", author: "noise_maker", comments: 22 },
  { rank: 10, score: 29, title: "Show FP: ASCII art ray tracer in 200 lines of Rust", author: "cast_shadows", comments: 8 },
];

export function CompactListLayout() {
  return (
    <div className="px-5 py-4 font-sans">
      {/* Header */}
      <div className="text-[11px] text-text-muted font-semibold uppercase pb-2 border-b border-bg-elevated mb-1">
        Creative Coding &middot; Hot
      </div>

      {/* Rows */}
      {items.map((item) => (
        <div key={item.rank} className="flex items-baseline gap-3 py-2 text-[13px]">
          <span className="text-text-muted text-xs min-w-[20px] text-right font-mono">
            {item.rank}.
          </span>
          <span className="text-accent-primary text-[11px] font-semibold min-w-[32px]">
            {item.score}
          </span>
          <span className="flex-1 font-medium">
            <span className="text-text-primary hover:text-accent-secondary cursor-pointer">
              {item.title}
            </span>{" "}
            <span className="text-[10px] text-text-muted">({item.author})</span>
          </span>
          <span className="text-[10px] text-text-muted">{item.comments} comments</span>
        </div>
      ))}
    </div>
  );
}
