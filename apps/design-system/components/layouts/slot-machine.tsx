const reels = [
  { label: "Topic", value: "Visual Art" },
  { label: "Author", value: "pixelweaver" },
  { label: "Mood", value: "\uD83D\uDD25 Hot" },
];

export function SlotMachineLayout() {
  return (
    <div className="p-6">
      <div
        className="mx-auto max-w-[360px] rounded-2xl p-5"
        style={{
          background:
            "linear-gradient(180deg, oklch(35% 0.06 25), oklch(25% 0.04 20))",
          border: "3px solid oklch(45% 0.08 30)",
        }}
      >
        {/* Title */}
        <div
          className="mb-3 text-center font-serif text-lg font-bold"
          style={{ color: "oklch(85% 0.12 60)" }}
        >
          &#127920; Lucky Post &#127920;
        </div>

        {/* Reels */}
        <div className="mb-4 flex justify-center gap-2">
          {reels.map((reel) => (
            <div
              key={reel.label}
              className="flex h-20 w-[100px] flex-col items-center justify-center overflow-hidden rounded-md"
              style={{
                background: "oklch(95% 0 0)",
                color: "oklch(15% 0 0)",
                border: "2px solid oklch(50% 0.04 30)",
              }}
            >
              <div
                className="text-[10px] font-bold uppercase"
                style={{ color: "oklch(60% 0 0)" }}
              >
                {reel.label}
              </div>
              <div className="px-1 text-center text-xs font-bold">
                {reel.value}
              </div>
            </div>
          ))}
        </div>

        {/* Pull lever button */}
        <div className="mx-auto mb-0 cursor-pointer rounded-full bg-red-600 px-8 py-2.5 text-center text-[13px] font-bold text-white">
          PULL THE LEVER
        </div>

        {/* Result card */}
        <div
          className="mt-3 rounded-md p-2.5 text-center"
          style={{ background: "oklch(20% 0.02 250)" }}
        >
          <div className="text-[13px] font-bold text-zinc-100">
            Isometric city — 6 months of pixel work
          </div>
          <div className="text-[10px] text-zinc-500">
            287&uarr; &middot; 94 comments &middot; pixelweaver
          </div>
        </div>
      </div>
    </div>
  );
}
