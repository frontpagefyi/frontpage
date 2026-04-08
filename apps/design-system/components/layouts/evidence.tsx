export function Evidence() {
  return (
    <div
      className="relative p-5"
      style={{ background: "oklch(18% 0.01 40)", minHeight: 380 }}
    >
      {/* SVG connection lines */}
      <svg
        className="pointer-events-none absolute inset-0 z-0"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        {/* key -> suspect */}
        <line
          x1="130"
          y1="70"
          x2="340"
          y2="80"
          stroke="#c0392b"
          strokeWidth="2"
          opacity="0.6"
        />
        {/* suspect -> lead */}
        <line
          x1="340"
          y1="80"
          x2="480"
          y2="240"
          stroke="#c0392b"
          strokeWidth="2"
          opacity="0.55"
        />
        {/* suspect -> witness */}
        <line
          x1="380"
          y1="70"
          x2="520"
          y2="60"
          stroke="#c0392b"
          strokeWidth="2"
          opacity="0.4"
        />
        {/* key -> timeline */}
        <line
          x1="130"
          y1="90"
          x2="160"
          y2="230"
          stroke="#c0392b"
          strokeWidth="2"
          opacity="0.5"
        />
        {/* timeline -> cold case */}
        <line
          x1="180"
          y1="250"
          x2="320"
          y2="330"
          stroke="#c0392b"
          strokeWidth="2"
          opacity="0.4"
        />
      </svg>

      {/* KEY EVIDENCE */}
      <div
        className="absolute max-w-[170px] shadow-lg"
        style={{
          top: 20,
          left: 30,
          transform: "rotate(-1deg)",
          background: "var(--bg-surface, #1c1c1c)",
        }}
      >
        <div
          className="absolute -top-2.5 left-2.5 rounded-sm px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white"
          style={{ background: "var(--accent-destructive, #dc2626)" }}
        >
          KEY EVIDENCE
        </div>
        <div
          className="border-[3px] border-white"
          style={{
            width: 150,
            height: 80,
            background:
              "linear-gradient(135deg, oklch(40% 0.08 250), oklch(50% 0.06 270))",
          }}
        />
        <div className="p-3 pt-2">
          <div className="text-[11px] font-bold text-zinc-200">
            Isometric city
          </div>
          <div className="text-[10px] text-zinc-500">
            pixelweaver &middot; 287&uarr;
          </div>
        </div>
      </div>

      {/* SUSPECT */}
      <div
        className="absolute max-w-[170px] shadow-lg"
        style={{
          top: 30,
          left: 280,
          transform: "rotate(1deg)",
          background: "var(--bg-surface, #1c1c1c)",
        }}
      >
        <div
          className="absolute -top-2.5 left-2.5 rounded-sm px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white"
          style={{ background: "var(--accent-primary, #6366f1)" }}
        >
          SUSPECT
        </div>
        <div className="p-3 pt-2">
          <div className="text-[11px] font-bold text-zinc-200">
            WebGPU compute shaders
          </div>
          <div className="text-[10px] text-zinc-500">
            shader_witch &middot; &quot;changes everything&quot;
          </div>
        </div>
      </div>

      {/* WITNESS */}
      <div
        className="absolute max-w-[170px] shadow-lg"
        style={{
          top: 20,
          right: 30,
          transform: "rotate(-2deg)",
          background: "var(--bg-surface, #1c1c1c)",
        }}
      >
        <div
          className="absolute -top-2.5 left-2.5 rounded-sm px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white"
          style={{ background: "var(--accent-secondary, #a855f7)" }}
        >
          WITNESS
        </div>
        <div className="p-3 pt-2">
          <div className="text-[11px] font-bold text-zinc-200">
            Cell automata music
          </div>
          <div className="text-[10px] text-zinc-500">
            bytebard &middot; &quot;surprisingly musical&quot;
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div
        className="absolute max-w-[170px] shadow-lg"
        style={{
          top: 190,
          left: 80,
          transform: "rotate(1.5deg)",
          background: "var(--bg-surface, #1c1c1c)",
        }}
      >
        <div
          className="absolute -top-2.5 left-2.5 rounded-sm px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide"
          style={{
            background: "var(--accent-warning, #eab308)",
            color: "var(--text-inverse, #000)",
          }}
        >
          TIMELINE
        </div>
        <div className="p-3 pt-2">
          <div className="text-[11px] font-bold text-zinc-200">
            Challenge #47: Landscapes
          </div>
          <div className="text-[10px] text-zinc-500">3 days remaining</div>
        </div>
      </div>

      {/* LEAD */}
      <div
        className="absolute max-w-[170px] shadow-lg"
        style={{
          top: 200,
          right: 60,
          transform: "rotate(-1deg)",
          background: "var(--bg-surface, #1c1c1c)",
        }}
      >
        <div
          className="absolute -top-2.5 left-2.5 rounded-sm px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white"
          style={{ background: "oklch(50% 0.1 180)" }}
        >
          LEAD
        </div>
        <div className="p-3 pt-2">
          <div className="text-[11px] font-bold text-zinc-200">
            Shader playground (open call)
          </div>
          <div className="text-[10px] text-zinc-500">
            glsl_gang seeking accomplices
          </div>
        </div>
      </div>

      {/* COLD CASE */}
      <div
        className="absolute max-w-[170px] shadow-lg"
        style={{
          bottom: 20,
          left: 250,
          transform: "rotate(2deg)",
          background: "var(--bg-surface, #1c1c1c)",
        }}
      >
        <div
          className="absolute -top-2.5 left-2.5 rounded-sm px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white"
          style={{ background: "var(--text-muted, #71717a)" }}
        >
          COLD CASE
        </div>
        <div className="p-3 pt-2">
          <div className="text-[11px] font-bold text-zinc-200">
            Win98 screensavers
          </div>
          <div className="text-[10px] text-zinc-500">
            retro_dev &middot; case reopened
          </div>
        </div>
      </div>
    </div>
  );
}
