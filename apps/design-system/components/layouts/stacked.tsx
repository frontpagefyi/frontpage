const groups = [
  {
    title: "Visual Art & Pixel Work",
    count: 4,
    preview: "Isometric city — 6 months of pixel work \u00B7 Win98 screensavers in p5.js \u00B7 +2 more",
    meta: "Latest: 3h ago \u00B7 421 likes total",
  },
  {
    title: "GPU & Shader Talk",
    count: 3,
    preview: "WebGPU compute shaders \u00B7 Fluid simulation with Navier-Stokes \u00B7 +1 more",
    meta: "Latest: 5h ago \u00B7 286 likes total",
  },
  {
    title: "Generative / Algorithmic",
    count: 3,
    preview: "Cellular automata music generator \u00B7 Perlin noise tutorial \u00B7 +1 more",
    meta: "Latest: 8h ago \u00B7 270 likes total",
  },
  {
    title: "Community & Challenges",
    count: 2,
    preview: "Weekly challenge #47: Generative landscapes \u00B7 Community rules & getting started",
    meta: "Latest: 12h ago \u00B7 122 likes total",
  },
];

export function StackedLayout() {
  return (
    <div className="px-8 py-5 max-w-[560px] mx-auto">
      {groups.map((group) => (
        <div key={group.title} className="mb-4 cursor-pointer">
          {/* Top card */}
          <div className="bg-bg-elevated rounded-xl p-4 relative z-[3] shadow-[0_2px_8px_oklch(0%_0_0/0.2)]">
            <div className="font-bold text-sm mb-1 flex items-center gap-2">
              {group.title}
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-secondary text-white">
                {group.count}
              </span>
            </div>
            <div className="text-xs text-text-secondary">{group.preview}</div>
            <div className="text-[10px] text-text-muted mt-1">{group.meta}</div>
          </div>
          {/* Behind card 1 */}
          <div className="h-2 mx-2 bg-bg-overlay rounded-b-md relative z-[2] -top-0.5" />
          {/* Behind card 2 */}
          <div className="h-1.5 mx-4 bg-bg-interactive rounded-b-sm relative z-[1] -top-1" />
        </div>
      ))}
    </div>
  );
}
