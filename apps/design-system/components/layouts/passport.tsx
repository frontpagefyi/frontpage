const stamps = [
  { name: "Pixel City", date: "Apr 7", color: "rgb(99 102 241)", rotate: -5, opacity: 1 },
  { name: "WebGPU Labs", date: "Apr 7", color: "oklch(60% 0.15 150)", rotate: 3, opacity: 1 },
  { name: "Music Gen", date: "Apr 7", color: "oklch(55% 0.2 260)", rotate: -2, opacity: 1 },
  { name: "Retro Zone", date: "Apr 6", color: "oklch(60% 0.15 350)", rotate: 4, opacity: 1 },
  { name: "Challenge", date: "?", color: "oklch(65% 0.15 70)", rotate: -3, opacity: 0.4 },
  { name: "???", date: "unvisited", color: "oklch(60% 0 0)", rotate: 1, opacity: 0.3, dashed: true },
];

export function PassportLayout() {
  return (
    <div className="px-6 py-5 max-w-[480px] mx-auto">
      <div
        className="rounded-xl p-6"
        style={{
          background: "linear-gradient(180deg, oklch(93% 0.03 80), oklch(88% 0.05 75))",
          boxShadow: "0 2px 12px oklch(0% 0 0 / 0.1)",
        }}
      >
        {/* Passport header */}
        <div className="text-center text-xs font-bold text-gray-500 tracking-widest mb-5 uppercase">
          Community Passport &middot; Creative Coding
        </div>

        {/* Stamps */}
        <div className="flex flex-wrap gap-4 justify-center">
          {stamps.map((s) => (
            <div
              key={s.name}
              className="flex flex-col items-center justify-center px-4 py-3 rounded-[50%] border-2"
              style={{
                borderColor: s.color,
                borderStyle: s.dashed ? "dashed" : "solid",
                color: s.color,
                transform: `rotate(${s.rotate}deg)`,
                opacity: s.opacity,
                minWidth: 90,
                minHeight: 60,
              }}
            >
              <div className="text-xs font-bold">{s.name}</div>
              <div className="text-[10px] opacity-70">{s.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
