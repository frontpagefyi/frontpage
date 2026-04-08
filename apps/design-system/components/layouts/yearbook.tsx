const members = [
  { name: "pixelweaver", handle: "@pixelweaver", latest: "Isometric city — 6 months of pixel work", initials: "PW", color: "bg-pink-500" },
  { name: "shader_witch", handle: "@shader_witch", latest: "WebGPU compute shaders — 1M particles", initials: "SW", color: "bg-indigo-500" },
  { name: "bytebard", handle: "@bytebard", latest: "Cellular automata music generator", initials: "BB", color: "bg-emerald-500" },
  { name: "retro_dev", handle: "@retro_dev", latest: "Win98 screensavers in p5.js", initials: "RD", color: "bg-amber-500" },
  { name: "flowstate", handle: "@flowstate", latest: "Fluid sim with Navier-Stokes", initials: "FS", color: "bg-cyan-500" },
  { name: "glsl_gang", handle: "@glsl_gang", latest: "Seeking shader playground collabs", initials: "GG", color: "bg-violet-500" },
  { name: "noise_maker", handle: "@noise_maker", latest: "Perlin noise tutorial", initials: "NM", color: "bg-rose-500" },
  { name: "admin", handle: "@admin", latest: "Challenge #47: Landscapes", initials: "AD", color: "bg-zinc-500" },
];

export function YearbookLayout() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-4 gap-3">
        {members.map((m) => (
          <div
            key={m.handle}
            className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-center"
          >
            {/* Avatar circle */}
            <div
              className={`w-14 h-14 rounded-full ${m.color} mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold`}
            >
              {m.initials}
            </div>
            <div className="text-xs font-semibold text-zinc-200">{m.name}</div>
            <div className="text-[10px] text-zinc-500 mb-1.5">{m.handle}</div>
            <div className="text-[10px] text-zinc-400 leading-snug line-clamp-2">
              {m.latest}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
