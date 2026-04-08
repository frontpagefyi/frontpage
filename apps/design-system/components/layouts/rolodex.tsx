export function Rolodex() {
  return (
    <div className="flex justify-center p-6">
      <div className="relative h-[200px] w-[320px]" style={{ perspective: "600px" }}>
        {/* Card 3 - back */}
        <div
          className="absolute top-5 z-[3] w-full rounded-md p-4 shadow-md"
          style={{
            background: "oklch(92% 0.01 70)",
            color: "oklch(25% 0.02 40)",
            borderTop: "8px solid oklch(55% 0.15 150)",
            transformOrigin: "top center",
            transform: "rotateX(-16deg)",
            opacity: 0.4,
          }}
        >
          <div className="mb-1 font-serif text-base font-bold">
            Cellular automata music
          </div>
          <div className="text-[11px]" style={{ color: "oklch(50% 0.02 40)" }}>
            bytebard
          </div>
        </div>

        {/* Card 2 - middle */}
        <div
          className="absolute top-[30px] z-[4] w-full rounded-md p-4 shadow-md"
          style={{
            background: "oklch(92% 0.01 70)",
            color: "oklch(25% 0.02 40)",
            borderTop: "8px solid oklch(60% 0.15 300)",
            transformOrigin: "top center",
            transform: "rotateX(-8deg)",
            opacity: 0.7,
          }}
        >
          <div className="mb-1 font-serif text-base font-bold">
            WebGPU compute shaders
          </div>
          <div className="text-[11px]" style={{ color: "oklch(50% 0.02 40)" }}>
            shader_witch
          </div>
        </div>

        {/* Card 1 - front */}
        <div
          className="absolute top-10 z-[5] w-full rounded-md p-4 shadow-md"
          style={{
            background: "oklch(92% 0.01 70)",
            color: "oklch(25% 0.02 40)",
            borderTop: "8px solid var(--indigo-500, #6366f1)",
            transformOrigin: "top center",
            transform: "rotateX(0deg)",
          }}
        >
          <div className="mb-1 font-serif text-base font-bold">
            Just finished this isometric city
          </div>
          <div className="mb-2 text-[11px]" style={{ color: "oklch(50% 0.02 40)" }}>
            pixelweaver &middot; Creative Coding
          </div>
          <div
            className="text-xs leading-relaxed"
            style={{ color: "oklch(35% 0.02 40)" }}
          >
            Over 200 unique buildings, dynamic lighting system, and animated
            citizens going about their daily routines.
          </div>
          <div className="mt-2 text-[10px]" style={{ color: "oklch(60% 0.02 40)" }}>
            April 7, 2026 &middot; 287 likes
          </div>
        </div>

        {/* Nav buttons */}
        <div className="absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-300 bg-zinc-100 text-xs text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            &larr;
          </div>
          <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-300 bg-zinc-100 text-xs text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            &rarr;
          </div>
        </div>
      </div>
    </div>
  );
}
