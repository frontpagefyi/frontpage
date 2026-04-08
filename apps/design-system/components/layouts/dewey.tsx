const drawers = [
  { label: "Visual Art", code: "100-199" },
  { label: "GPU & Shaders", code: "200-299" },
  { label: "Generative", code: "300-399" },
  { label: "Tutorials", code: "400-499" },
  { label: "Challenges", code: "500-599" },
  { label: "Community", code: "600-699" },
];

export function DeweyLayout() {
  return (
    <div className="px-6 py-5 max-w-[560px] mx-auto">
      {/* Cabinet */}
      <div
        className="rounded-xl p-4 grid grid-cols-3 gap-2"
        style={{
          background: "linear-gradient(180deg, oklch(55% 0.08 60), oklch(45% 0.1 50))",
        }}
      >
        {drawers.map((d) => (
          <div
            key={d.code}
            className="rounded-lg px-3 py-3 text-center cursor-pointer"
            style={{
              background: "linear-gradient(180deg, oklch(60% 0.06 60), oklch(50% 0.08 55))",
              boxShadow: "inset 0 1px 0 oklch(70% 0.04 60), 0 2px 4px oklch(30% 0.05 50 / 0.3)",
            }}
          >
            <div className="text-xs font-bold text-white/90">{d.label}</div>
            <div className="text-[10px] text-white/60 mt-0.5">{d.code}</div>
            {/* Drawer handle */}
            <div
              className="mx-auto mt-2 rounded-full"
              style={{
                width: 24,
                height: 6,
                background: "linear-gradient(180deg, oklch(75% 0.04 70), oklch(55% 0.06 50))",
                boxShadow: "0 1px 2px oklch(30% 0.05 50 / 0.4)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Example index card */}
      <div
        className="mt-4 rounded-lg p-4 font-mono text-xs leading-relaxed"
        style={{
          background: "linear-gradient(180deg, oklch(95% 0.04 80), oklch(90% 0.06 75))",
          backgroundImage:
            "repeating-linear-gradient(transparent, transparent 22px, oklch(70% 0.04 220 / 0.2) 22px, oklch(70% 0.04 220 / 0.2) 23px)",
          boxShadow: "0 2px 8px oklch(0% 0 0 / 0.1)",
        }}
      >
        <div className="font-bold">100.1 &nbsp; ISOMETRIC CITY &mdash; 6 MONTHS OF PIXEL WORK</div>
        <div className="text-text-secondary mt-1">Author: pixelweaver</div>
        <div className="text-text-secondary">Date: April 7, 2026</div>
        <div className="text-text-secondary">
          Subject: Pixel art, Isometric, Urban, Dynamic lighting
        </div>
        <div className="text-text-secondary">
          Reactions: 287 likes &middot; 94 comments
        </div>
      </div>
    </div>
  );
}
