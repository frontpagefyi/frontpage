const timeSlots = ["10:00", "11:00", "12:00 NOW", "13:00", "14:00", "15:00"];

const channels = [
  {
    num: "01",
    name: "Art",
    slots: [
      { title: "Perlin Noise Tut", meta: "noise_maker" },
      { title: "Win98 Screensavers", meta: "retro_dev" },
      { title: "Isometric City", meta: "pixelweaver \u00B7 LIVE", live: true },
      { title: "Interactive Pixels", meta: "touchpixel" },
      null,
      null,
    ],
  },
  {
    num: "02",
    name: "GPU",
    slots: [
      { title: "Fluid Sim", meta: "flowstate" },
      null,
      { title: "WebGPU Shaders", meta: "shader_witch \u00B7 LIVE", live: true },
      { title: "Shader Playground", meta: "glsl_gang" },
      null,
      null,
    ],
  },
  {
    num: "03",
    name: "Gen",
    slots: [
      null,
      { title: "ASCII Raytracer", meta: "cast_shadows" },
      { title: "Cell Automata", meta: "bytebard \u00B7 LIVE", live: true },
      null,
      { title: "Challenge #47", meta: "admin" },
      null,
    ],
  },
];

export function TvguideLayout() {
  return (
    <div className="px-6 py-5 max-w-[600px] mx-auto">
      <div className="rounded-xl overflow-hidden border border-border-default bg-bg-surface">
        <div
          className="grid text-xs"
          style={{ gridTemplateColumns: "80px repeat(6, 1fr)" }}
        >
          {/* Header row */}
          <div className="bg-bg-elevated p-2 border-b border-r border-border-default" />
          {timeSlots.map((slot) => {
            const isNow = slot.includes("NOW");
            return (
              <div
                key={slot}
                className={`p-2 text-center font-bold border-b border-r border-border-default last:border-r-0 text-[10px] ${
                  isNow
                    ? "bg-red-500 text-white"
                    : "bg-bg-elevated text-text-secondary"
                }`}
              >
                {slot}
              </div>
            );
          })}

          {/* Channel rows */}
          {channels.map((ch) => (
            <>
              {/* Channel label */}
              <div
                key={`ch-${ch.num}`}
                className="bg-bg-elevated p-2 border-b border-r border-border-default flex items-center gap-1"
              >
                <span className="text-[10px] font-bold text-accent-primary">
                  {ch.num}
                </span>
                <span className="text-[11px] font-semibold text-text-primary">
                  {ch.name}
                </span>
              </div>

              {/* Time slots */}
              {ch.slots.map((slot, i) => {
                const isLiveCol = i === 2;
                return (
                  <div
                    key={`${ch.num}-${i}`}
                    className={`p-1.5 border-b border-r border-border-default last:border-r-0 ${
                      isLiveCol ? "bg-red-500/5" : ""
                    }`}
                  >
                    {slot && (
                      <>
                        <div className="text-[10px] font-semibold text-text-primary leading-tight">
                          {slot.title}
                        </div>
                        <div className="text-[9px] text-text-secondary">
                          {slot.meta}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
