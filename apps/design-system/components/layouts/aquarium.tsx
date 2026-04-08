const fish = [
  { title: "Isometric city", meta: "pixelweaver \u00B7 287\u2191", top: 40, left: 30 },
  { title: "WebGPU shaders", meta: "shader_witch \u00B7 156\u2191", top: 120, left: 380 },
  { title: "Cell automata music", meta: "bytebard \u00B7 203\u2191", top: 220, left: 200 },
  { title: "Win98 screensavers", meta: "retro_dev \u00B7 134\u2191", top: 60, left: 280 },
  { title: "Challenge #47", meta: "admin \u00B7 98\u2191", top: 280, left: 50 },
];

const bubbles = [
  { left: "10%", size: 8, bottom: 20 },
  { left: "30%", size: 12, bottom: 60 },
  { left: "60%", size: 6, bottom: 40 },
  { left: "80%", size: 10, bottom: 80 },
  { left: "45%", size: 7, bottom: 10 },
];

export function AquariumLayout() {
  return (
    <div className="px-6 py-5 max-w-[600px] mx-auto">
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, oklch(30% 0.08 250), oklch(20% 0.12 260), oklch(15% 0.1 270))",
          height: 380,
        }}
      >
        {/* Bubbles */}
        {bubbles.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              left: b.left,
              bottom: b.bottom,
              width: b.size,
              height: b.size,
              background: "radial-gradient(circle at 30% 30%, oklch(80% 0.05 220), oklch(50% 0.08 240))",
            }}
          />
        ))}

        {/* Fish / post cards */}
        {fish.map((f, i) => (
          <div
            key={i}
            className="absolute"
            style={{ top: f.top, left: f.left }}
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 cursor-pointer hover:bg-white/20 transition-colors">
              <div className="text-xs font-semibold text-white/90">
                {f.title}
              </div>
              <div className="text-[10px] text-white/60">{f.meta}</div>
            </div>
          </div>
        ))}

        {/* Subtle water shimmer at top */}
        <div
          className="absolute top-0 left-0 right-0 h-8 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, oklch(50% 0.06 220 / 0.15), transparent)",
          }}
        />
      </div>
    </div>
  );
}
