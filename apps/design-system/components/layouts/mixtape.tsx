const tracks = [
  { num: 1, title: "Isometric city — 6 months of pixel work", artist: "pixelweaver", duration: "5:30", playing: true },
  { num: 2, title: "Cellular automata music generator", artist: "bytebard", duration: "3:20", playing: false },
  { num: 3, title: "WebGPU compute shaders", artist: "shader_witch", duration: "4:10", playing: false },
  { num: 4, title: "Windows 98 screensavers in p5.js", artist: "retro_dev", duration: "3:45", playing: false },
  { num: 5, title: "Challenge #47: Generative landscapes", artist: "admin", duration: "2:00", playing: false },
  { num: 6, title: "Fluid simulation with Navier-Stokes", artist: "flowstate", duration: "3:15", playing: false },
  { num: 7, title: "Perlin noise tutorial that makes sense", artist: "noise_maker", duration: "2:00", playing: false },
];

export function MixtapeLayout() {
  return (
    <div className="p-4">
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
        {/* Album header */}
        <div className="flex gap-4 p-4 bg-gradient-to-b from-zinc-800/50 to-transparent">
          <div className="w-24 h-24 rounded-md bg-gradient-to-br from-pink-400 to-orange-300 flex-shrink-0" />
          <div className="flex flex-col justify-center">
            <h3 className="text-sm font-bold text-zinc-100">Creative Coding — Hot This Week</h3>
            <p className="text-[11px] text-zinc-500 mt-1">
              7 tracks &middot; 24 min read time &middot; curated by community
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 rounded-full text-[11px] font-semibold text-white w-fit cursor-pointer hover:bg-indigo-500">
              &#9654; Play All
            </div>
          </div>
        </div>

        {/* Track list */}
        <div className="divide-y divide-zinc-800/50">
          {tracks.map((track) => (
            <div
              key={track.num}
              className={`flex items-center gap-3 px-4 py-2 hover:bg-zinc-800/30 cursor-pointer ${
                track.playing ? "bg-zinc-800/20" : ""
              }`}
            >
              {/* Track number or EQ bars */}
              <div className="w-5 flex-shrink-0 text-center">
                {track.playing ? (
                  <div className="flex items-end justify-center gap-[2px] h-3">
                    <div className="w-[3px] bg-indigo-400 rounded-full animate-pulse" style={{ height: "8px", animationDelay: "0s" }} />
                    <div className="w-[3px] bg-indigo-400 rounded-full animate-pulse" style={{ height: "12px", animationDelay: "0.2s" }} />
                    <div className="w-[3px] bg-indigo-400 rounded-full animate-pulse" style={{ height: "6px", animationDelay: "0.1s" }} />
                  </div>
                ) : (
                  <span className="text-xs text-zinc-500">{track.num}</span>
                )}
              </div>

              {/* Title */}
              <span
                className={`text-xs flex-1 min-w-0 truncate ${
                  track.playing ? "text-indigo-400 font-semibold" : "text-zinc-200"
                }`}
              >
                {track.title}
              </span>

              {/* Artist */}
              <span className="text-[11px] text-zinc-500 w-24 truncate flex-shrink-0">
                {track.artist}
              </span>

              {/* Duration */}
              <span className="text-[11px] text-zinc-500 flex-shrink-0">{track.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
