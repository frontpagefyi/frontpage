const rows = [
  { time: "12:34", author: "pixelweaver", text: "Just finished this isometric city \u2014 6 months of pixel work", up: 287, comments: 94 },
  { time: "12:21", author: "shader_witch", text: "Anyone tried the new WebGPU compute shaders?", up: 156, comments: 47 },
  { time: "11:58", author: "bytebard", text: "Made a cellular automata music generator", up: 203, comments: 32 },
  { time: "11:34", author: "retro_dev", text: "How I recreated the Windows 98 screensavers in p5.js", up: 134, comments: 63 },
  { time: "11:12", author: "admin", text: "Weekly challenge #47: Generative landscapes", up: 98, comments: 18 },
  { time: "10:47", author: "glsl_gang", text: "Seeking collaborators for open-source shader playground", up: 76, comments: 11 },
  { time: "10:23", author: "flowstate", text: "Real-time fluid simulation with Navier-Stokes in GLSL", up: 54, comments: 29 },
  { time: "09:58", author: "touchpixel", text: "I made every pixel on my screen interactive", up: 41, comments: 15 },
];

export function TickerLayout() {
  return (
    <div className="font-mono p-3">
      {/* Live feed header bar */}
      <div className="flex items-center gap-3 px-3 py-2 bg-bg-elevated rounded-t-md border-b border-accent-secondary text-[10px] text-accent-primary font-semibold">
        CREATIVE CODING &mdash; LIVE FEED
        <span className="ml-auto text-text-muted">134 online</span>
      </div>

      {/* Rows */}
      {rows.map((row) => (
        <div
          key={row.time + row.author}
          className="flex items-baseline gap-3 px-3 py-2 text-[11px] border-b border-bg-elevated transition-colors hover:bg-bg-elevated"
        >
          <span className="text-text-muted min-w-[48px] text-[10px]">{row.time}</span>
          <span className="text-accent-secondary min-w-[80px]">{row.author}</span>
          <span className="text-text-primary flex-1">{row.text}</span>
          <span className="text-text-muted text-[10px] flex gap-2">
            <span>{row.up}&uarr;</span>
            <span>{row.comments}&para;</span>
          </span>
        </div>
      ))}
    </div>
  );
}
