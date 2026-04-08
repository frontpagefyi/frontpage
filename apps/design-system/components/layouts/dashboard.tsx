const recentActivity = [
  { text: 'pixelweaver posted "Isometric city"', time: "3h" },
  { text: 'shader_witch posted "WebGPU shaders"', time: "5h" },
  { text: 'bytebard posted "Cell automata music"', time: "8h" },
  { text: 'retro_dev posted "Win98 screensavers"', time: "12h" },
];

const trendingTags = [
  { tag: "webgpu", size: "text-base", weight: "font-bold", color: "text-orange-400" },
  { tag: "pixel-art", size: "text-sm", weight: "font-semibold", color: "text-zinc-300" },
  { tag: "generative", size: "text-[13px]", weight: "font-normal", color: "text-zinc-400" },
  { tag: "glsl", size: "text-[11px]", weight: "font-normal", color: "text-zinc-500" },
  { tag: "challenge", size: "text-xs", weight: "font-normal", color: "text-zinc-400" },
  { tag: "midi", size: "text-[10px]", weight: "font-normal", color: "text-zinc-500" },
];

const sparkBars = [40, 55, 35, 70, 60, 85, 100];

export function DashboardLayout() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-4 gap-2">
        {/* Members */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Members</div>
          <div className="text-2xl font-bold text-zinc-100 mt-1">2,847</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">+23 this week</div>
        </div>

        {/* Online */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Online Now</div>
          <div className="text-2xl font-bold text-green-400 mt-1">134</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">4.7% of members</div>
        </div>

        {/* Posts Today */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Posts Today</div>
          <div className="text-2xl font-bold text-zinc-100 mt-1">12</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">&#9650; 40% vs yesterday</div>
        </div>

        {/* Trending Tags */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Trending Tags</div>
          <div className="flex flex-wrap gap-1.5">
            {trendingTags.map((t) => (
              <span key={t.tag} className={`${t.size} ${t.weight} ${t.color}`}>
                {t.tag}
              </span>
            ))}
          </div>
        </div>

        {/* Activity sparkline — wide */}
        <div className="col-span-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Activity (7 days)</div>
          <div className="flex items-end gap-1 h-16">
            {sparkBars.map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-indigo-500/60 rounded-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Top Post */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Top Post</div>
          <div className="text-[13px] font-bold text-zinc-100 mb-1">Isometric city</div>
          <div className="text-[11px] text-zinc-500">287&uarr; &middot; 94 comments</div>
        </div>

        {/* Recent Activity — wide + tall-ish */}
        <div className="col-span-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Recent Activity</div>
          <div className="space-y-1.5">
            {recentActivity.map((a) => (
              <div key={a.text} className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-300 truncate">{a.text}</span>
                <span className="text-zinc-500 flex-shrink-0 ml-2">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
