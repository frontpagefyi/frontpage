const entries = [
  { score: 287, title: "Just finished this isometric city — 6 months of pixel work", author: "pixelweaver", time: "3h ago", comments: 94 },
  { score: 203, title: "Made a cellular automata music generator", author: "bytebard", time: "8h ago", comments: 32 },
  { score: 156, title: "Anyone tried the new WebGPU compute shaders?", author: "shader_witch", time: "5h ago", comments: 47 },
  { score: 134, title: "How I recreated the Windows 98 screensavers in p5.js", author: "retro_dev", time: "12h ago", comments: 63 },
  { score: 98, title: "Weekly challenge #47: Generative landscapes", author: "admin", time: "1d ago", comments: 18 },
  { score: 76, title: "Seeking collaborators for open-source shader playground", author: "glsl_gang", time: "1d ago", comments: 11 },
];

export function TerminalLayout() {
  return (
    <div className="font-mono" style={{ background: "oklch(8% 0.01 270)" }}>
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{ background: "oklch(15% 0.01 270)" }}
      >
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
        <span className="text-[11px] text-text-muted ml-2">frontpage &mdash; creative-coding</span>
      </div>

      {/* Body */}
      <div className="p-3">
        <div className="text-[11px] leading-[1.8]">
          <span className="text-accent-success">$ </span>
          <span className="text-text-primary">fp feed --sort hot --community creative-coding</span>
        </div>
        <div className="text-[11px] leading-[1.8] text-text-muted">
          Fetching posts... 134 users online
        </div>

        {/* Divider */}
        <div className="border-t my-2" style={{ borderColor: "oklch(20% 0.01 270)" }} />

        {/* Entries */}
        {entries.map((entry) => (
          <div key={entry.title}>
            <div className="text-[11px] leading-[1.8]">
              <span className="text-accent-primary">
                [{String(entry.score).padStart(3, "\u00A0")}&uarr;]
              </span>{" "}
              <span className="text-accent-secondary underline cursor-pointer">{entry.title}</span>
            </div>
            <div className="text-[11px] leading-[1.8] text-text-muted pl-[56px]">
              {entry.author} &middot; {entry.time} &middot; {entry.comments} comments
            </div>
          </div>
        ))}

        {/* Divider */}
        <div className="border-t my-2" style={{ borderColor: "oklch(20% 0.01 270)" }} />

        {/* Prompt */}
        <div className="text-[11px] leading-[1.8]">
          <span className="text-accent-success">$ </span>
          <span className="text-text-primary opacity-50">_</span>
        </div>
      </div>
    </div>
  );
}
