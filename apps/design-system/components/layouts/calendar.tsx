const days = [
  { day: 1, posts: ["Perlin noise tut"] },
  { day: 2, posts: [] },
  { day: 3, posts: ["Win98 screensavers"] },
  { day: 4, posts: ["Fluid sim GLSL"] },
  { day: 5, posts: ["Challenge #47!", "3 submissions"], hot: [0] },
  { day: 6, posts: ["Shader playground"] },
  { day: 7, posts: ["Isometric city", "WebGPU shaders", "Cell automata"], today: true, hot: [0] },
  { day: 8, posts: [] },
  { day: 9, posts: [] },
  { day: 10, posts: [] },
  { day: 11, posts: [] },
  { day: 12, posts: [] },
];

export function CalendarLayout() {
  return (
    <div className="p-4">
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-100">April 2026</h3>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="cursor-pointer hover:text-zinc-300">&larr;</span>
            <span className="cursor-pointer hover:text-zinc-300">Today</span>
            <span className="cursor-pointer hover:text-zinc-300">&rarr;</span>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {/* Day labels */}
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
            <div
              key={label}
              className="px-2 py-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider text-center border-b border-zinc-800"
            >
              {label}
            </div>
          ))}

          {/* Empty cells for offset (April 2026 starts on Wednesday) */}
          <div className="min-h-[72px] border-b border-r border-zinc-800/50" />
          <div className="min-h-[72px] border-b border-r border-zinc-800/50" />

          {/* Day cells */}
          {days.map(({ day, posts, today, hot }) => (
            <div
              key={day}
              className={`min-h-[72px] border-b border-r border-zinc-800/50 p-1.5 ${
                today ? "bg-indigo-950/30 ring-1 ring-inset ring-indigo-500/40" : ""
              }`}
            >
              <div
                className={`text-[10px] font-semibold mb-0.5 ${
                  today ? "text-indigo-400" : "text-zinc-500"
                }`}
              >
                {day}
              </div>
              {posts.map((post, i) => (
                <div
                  key={i}
                  className={`text-[9px] leading-tight truncate mb-0.5 px-1 py-0.5 rounded ${
                    hot?.includes(i)
                      ? "bg-orange-500/20 text-orange-300 font-semibold"
                      : "text-zinc-400"
                  }`}
                >
                  {post}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
