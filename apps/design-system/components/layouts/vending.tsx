const slots = [
  { code: "A1", title: "Isometric City", color: "bg-indigo-100" },
  { code: "A2", title: "WebGPU", color: "bg-cyan-100" },
  { code: "A3", title: "Cell Music", color: "bg-green-100" },
  { code: "B1", title: "Win98", color: "bg-orange-100" },
  { code: "B2", title: "Fluid Sim", color: "bg-purple-100" },
  { code: "B3", title: "Challenge", color: "bg-amber-100" },
];

const keys = ["A", "B", "C", "1", "2", "3"];

export function VendingLayout() {
  return (
    <div className="px-6 py-5 max-w-[400px] mx-auto">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, oklch(30% 0.02 250), oklch(22% 0.03 260))",
          boxShadow: "0 4px 20px oklch(0% 0 0 / 0.3)",
        }}
      >
        {/* Glass window */}
        <div
          className="mx-4 mt-4 rounded-xl p-3"
          style={{
            background: "oklch(25% 0.01 240)",
            boxShadow:
              "inset 0 2px 8px oklch(0% 0 0 / 0.3), inset 0 0 0 1px oklch(50% 0.02 240 / 0.2)",
          }}
        >
          <div className="grid grid-cols-3 gap-2">
            {slots.map((s) => (
              <div
                key={s.code}
                className="rounded-lg p-2 text-center cursor-pointer hover:bg-white/10 transition-colors"
                style={{ background: "oklch(30% 0.01 250)" }}
              >
                <div className="text-[9px] font-bold font-mono text-white/40 mb-1">
                  {s.code}
                </div>
                <div className={`${s.color} h-10 rounded mx-auto mb-1`} />
                <div className="text-[10px] text-white/70 font-medium">
                  {s.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keypad */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-1.5 max-w-[160px] mx-auto">
            {keys.map((k) => (
              <div
                key={k}
                className="h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white/70 cursor-pointer hover:bg-white/10 transition-colors"
                style={{
                  background: "oklch(35% 0.02 260)",
                  boxShadow: "0 2px 4px oklch(0% 0 0 / 0.2)",
                }}
              >
                {k}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
