const selections = [
  { code: "A1", title: "Isometric city \u2014 pixelweaver", active: true },
  { code: "A2", title: "Cell automata music \u2014 bytebard", active: false },
  { code: "A3", title: "WebGPU shaders \u2014 shader_witch", active: false },
  { code: "B1", title: "Win98 screensavers \u2014 retro_dev", active: false },
  { code: "B2", title: "Challenge #47 \u2014 admin", active: false },
  { code: "B3", title: "Fluid sim \u2014 flowstate", active: false },
  { code: "C1", title: "Shader playground \u2014 glsl_gang", active: false },
  { code: "C2", title: "Perlin noise tut \u2014 noise_maker", active: false },
];

export function JukeboxLayout() {
  return (
    <div className="px-6 py-5 max-w-[480px] mx-auto">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, oklch(50% 0.08 55), oklch(35% 0.1 45))",
          boxShadow: "0 4px 20px oklch(0% 0 0 / 0.3)",
        }}
      >
        {/* Now Playing display */}
        <div
          className="mx-5 mt-5 rounded-xl px-5 py-4 text-center"
          style={{
            background: "oklch(18% 0.02 260)",
            boxShadow: "inset 0 2px 8px oklch(0% 0 0 / 0.3)",
          }}
        >
          <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
            Now Playing
          </div>
          <div className="text-sm font-bold text-white/90">
            Isometric city &mdash; 6 months
          </div>
          <div className="text-xs text-white/60 mt-0.5">pixelweaver</div>
        </div>

        {/* Selector grid */}
        <div className="px-5 py-4 space-y-1">
          {selections.map((s) => (
            <div
              key={s.code}
              className={`flex items-center gap-3 rounded-lg px-3 py-1.5 cursor-pointer transition-colors ${
                s.active
                  ? "bg-amber-500/20"
                  : "hover:bg-white/5"
              }`}
            >
              <span
                className={`text-[11px] font-bold font-mono w-6 text-center ${
                  s.active ? "text-amber-400" : "text-white/50"
                }`}
              >
                {s.code}
              </span>
              <span
                className={`text-xs ${
                  s.active
                    ? "text-amber-200 font-semibold"
                    : "text-white/70"
                }`}
              >
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
