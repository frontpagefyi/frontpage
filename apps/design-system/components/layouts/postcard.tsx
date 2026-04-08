const postcards = [
  {
    gradient: "from-pink-400 to-orange-300",
    stamp: "\uD83D\uDDFA",
    greeting: "Greetings from Pixel City!",
    body: "6 months of work, 200 buildings, and it's finally done. Wish you were here!",
    from: "pixelweaver",
  },
  {
    gradient: "from-blue-400 to-cyan-300",
    stamp: "\u26A1",
    greeting: "From the GPU mines",
    body: "1M particles at 60fps. The browser is now a supercomputer. Send help (and more VRAM).",
    from: "shader_witch",
  },
  {
    gradient: "from-green-400 to-emerald-300",
    stamp: "\uD83C\uDFB5",
    greeting: "Sounds from the Grid",
    body: "Conway's Game of Life makes surprisingly good music. Each cell is a note!",
    from: "bytebard",
  },
  {
    gradient: "from-amber-400 to-red-300",
    stamp: "\uD83D\uDCBE",
    greeting: "Nostalgia Trip",
    body: "Remember the maze screensaver? It's back, and it's in JavaScript now.",
    from: "retro_dev",
  },
];

export function PostcardLayout() {
  return (
    <div className="p-4">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {postcards.map((pc) => (
          <div
            key={pc.from}
            className="flex-shrink-0 w-64 rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden"
          >
            {/* Image + stamp */}
            <div className={`relative h-32 bg-gradient-to-br ${pc.gradient}`}>
              <div className="absolute top-2 right-2 text-xl bg-white/80 rounded px-1">
                {pc.stamp}
              </div>
            </div>

            {/* Text */}
            <div className="p-3">
              <div className="font-serif italic text-sm text-zinc-200 mb-1">
                {pc.greeting}
              </div>
              <div className="font-serif italic text-[11px] text-zinc-400 leading-relaxed mb-2">
                {pc.body}
              </div>
              <div className="font-serif italic text-xs text-zinc-500">
                — {pc.from}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
