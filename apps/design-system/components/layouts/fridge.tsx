const items = [
  {
    type: "note" as const,
    title: "isometric city!!",
    body: "6 months and it's done. so proud of this one.",
    clipColor: "oklch(60% 0.2 25)",
    bgColor: "oklch(95% 0.06 80)",
    top: 20,
    left: 30,
    rotate: -2,
  },
  {
    type: "photo" as const,
    caption: "webgpu particles!!!",
    clipColor: "oklch(65% 0.15 70)",
    photoColor: "bg-cyan-100",
    top: 30,
    left: 250,
    rotate: 1.5,
  },
  {
    type: "note" as const,
    title: "reminder:",
    body: "challenge #47 due in 3 days!!",
    clipColor: "oklch(55% 0.15 150)",
    bgColor: "oklch(92% 0.04 150)",
    top: 20,
    left: 430,
    rotate: -1,
  },
  {
    type: "note" as const,
    title: "game of life = music???",
    body: "bytebard is a genius. each cell is a MIDI note.",
    clipColor: "oklch(65% 0.15 40)",
    bgColor: "oklch(95% 0.04 40)",
    top: 180,
    left: 100,
    rotate: 2,
  },
  {
    type: "photo" as const,
    caption: "win98 forever",
    clipColor: "rgb(99 102 241)",
    photoColor: "bg-orange-100",
    top: 200,
    left: 380,
    rotate: -2.5,
  },
  {
    type: "note" as const,
    title: "need help!",
    body: "shader playground looking for contributors \u2014 talk to glsl_gang",
    clipColor: "oklch(65% 0.15 320)",
    bgColor: "oklch(93% 0.03 290)",
    top: 310,
    left: 200,
    rotate: 0.5,
  },
];

export function FridgeLayout() {
  return (
    <div className="px-6 py-5 max-w-[600px] mx-auto">
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, oklch(90% 0.02 220), oklch(85% 0.03 230))",
          height: 420,
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: item.top,
              left: item.left,
              transform: `rotate(${item.rotate}deg)`,
            }}
          >
            {/* Magnet clip */}
            <div
              className="w-8 h-3 rounded-sm mx-auto mb-0.5 relative z-10"
              style={{
                background: item.clipColor,
                boxShadow: "0 1px 3px oklch(0% 0 0 / 0.2)",
              }}
            />

            {item.type === "note" ? (
              <div
                className="rounded px-3 py-2 max-w-[150px]"
                style={{
                  background: item.bgColor,
                  boxShadow: "0 2px 6px oklch(0% 0 0 / 0.1)",
                }}
              >
                <div className="font-serif italic text-xs font-bold text-gray-800">
                  {item.title}
                </div>
                <div className="font-serif italic text-[10px] text-gray-600 mt-0.5 leading-snug">
                  {item.body}
                </div>
              </div>
            ) : (
              <div>
                <div
                  className={`${item.photoColor} rounded w-[120px] h-[80px]`}
                  style={{ boxShadow: "0 2px 6px oklch(0% 0 0 / 0.1)" }}
                />
                <div className="font-serif italic text-[10px] text-gray-600 mt-1 text-center">
                  {item.caption}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
