const tracks = [
  { title: "1. Isometric City", dur: "5:30" },
  { title: "2. Cell Automata Music", dur: "3:20" },
  { title: "3. WebGPU Compute", dur: "4:10" },
  { title: "4. Win98 Screensavers", dur: "3:45" },
  { title: "5. Challenge #47", dur: "2:00" },
  { title: "6. Fluid Sim", dur: "3:15" },
  { title: "7. Perlin Noise", dur: "2:00" },
];

export function LinerNotes() {
  return (
    <div className="p-5">
      <div
        className="mx-auto grid min-h-[300px] max-w-[500px] grid-cols-2 overflow-hidden rounded-md"
        style={{ background: "oklch(12% 0.02 270)" }}
      >
        {/* Left side - prose */}
        <div
          className="p-5 text-xs leading-[1.8] text-zinc-400"
          style={{ borderRight: "1px solid oklch(20% 0.02 270)" }}
        >
          <p className="mb-3 font-serif">
            This week in Creative Coding was something special. pixelweaver
            finally dropped the isometric city project — six months in the
            making, and every pixel shows it.
          </p>
          <p className="mb-3 font-serif">
            shader_witch broke the particle ceiling with WebGPU. A million
            particles, zero CPU. The future arrived quietly in a Chrome Canary
            tab.
          </p>
          <p className="mb-3 font-serif">
            bytebard proved that math can sing. Conway&#39;s Game of Life as a
            MIDI synth — who knew cellular automata had melody in them?
          </p>
          <p className="font-serif italic text-zinc-500">
            Thanks for being part of this community. Keep creating.
          </p>
        </div>

        {/* Right side - tracklist */}
        <div className="p-5">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            This Week&#39;s Tracklist
          </div>
          {tracks.map((track) => (
            <div
              key={track.title}
              className="flex justify-between py-1 text-[11px]"
              style={{ borderBottom: "1px dotted oklch(25% 0.02 270)" }}
            >
              <span className="font-medium text-zinc-300">{track.title}</span>
              <span className="font-mono text-[10px] text-zinc-500">
                {track.dur}
              </span>
            </div>
          ))}
          <div className="mt-4 text-[10px] leading-relaxed text-zinc-500">
            Curated by Creative Coding Community
            <br />
            Cover art by pixelweaver
            <br />
            Mixed &amp; mastered by the algorithm
            <br />
            &copy; 2026 Frontpage Records
          </div>
        </div>
      </div>
    </div>
  );
}
