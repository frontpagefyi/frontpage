export function ClassifiedsLayout() {
  return (
    <div className="p-4">
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-2.5 border-b-2 border-double border-zinc-700 text-center">
          <h3 className="text-sm font-bold text-zinc-200 tracking-wider uppercase">
            Creative Coding Classifieds
          </h3>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-2 divide-x divide-dotted divide-zinc-700">
          {/* Left column */}
          <div className="p-3 space-y-2">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-dotted border-zinc-700 pb-1">
              Showcase
            </div>
            <div className="text-[11px] text-zinc-400 leading-snug border-b border-dotted border-zinc-800 pb-2">
              <strong className="text-zinc-200">ISOMETRIC CITY</strong> — 6mo pixel art project. 200+ buildings, dynamic lighting. See to believe. —pixelweaver (287&uarr;)
            </div>
            <div className="text-[11px] text-zinc-400 leading-snug border-b border-dotted border-zinc-800 pb-2">
              <strong className="text-zinc-200">WIN98 SCREENSAVERS</strong> — All the classics, recreated in p5.js. Maze, Starfield, Pipes. Nostalgic. —retro_dev (134&uarr;)
            </div>
            <div className="text-[11px] text-zinc-400 leading-snug border-b border-dotted border-zinc-800 pb-2">
              <strong className="text-zinc-200">CELL AUTOMATA SYNTH</strong> — Conway&apos;s Game of Life as MIDI generator. Surprisingly musical. —bytebard (203&uarr;)
            </div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-dotted border-zinc-700 pb-1 pt-1">
              Help Wanted
            </div>
            <div className="text-[11px] text-zinc-400 leading-snug">
              <strong className="text-zinc-200">SHADER PLAYGROUND</strong> — Open-source GLSL sandbox seeking contributors. Editor + live-reload exp. preferred. —glsl_gang
            </div>
          </div>

          {/* Right column */}
          <div className="p-3 space-y-2">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-dotted border-zinc-700 pb-1">
              Discussion
            </div>
            <div className="text-[11px] text-zinc-400 leading-snug border-b border-dotted border-zinc-800 pb-2">
              <strong className="text-zinc-200">WEBGPU COMPUTE</strong> — Anyone tried new shaders? 1M particles, 60fps, zero CPU. Game changer? Discuss. —shader_witch (156&uarr;)
            </div>
            <div className="text-[11px] text-zinc-400 leading-snug border-b border-dotted border-zinc-800 pb-2">
              <strong className="text-zinc-200">FLUID SIM</strong> — Navier-Stokes in a fragment shader. Interactive forces. Full solver. —flowstate (54&uarr;)
            </div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-dotted border-zinc-700 pb-1 pt-1">
              Challenges
            </div>
            <div className="text-[11px] text-zinc-400 leading-snug border-b border-dotted border-zinc-800 pb-2">
              <strong className="text-zinc-200">CHALLENGE #47</strong> — GENERATIVE LANDSCAPES. Submissions open. 18 entries so far. 3 days remain. —admin
            </div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-dotted border-zinc-700 pb-1 pt-1">
              Tutorials
            </div>
            <div className="text-[11px] text-zinc-400 leading-snug">
              <strong className="text-zinc-200">PERLIN NOISE</strong> — Finally a tutorial that makes sense. Step by step, no math PhD required. —noise_maker (38&uarr;)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
