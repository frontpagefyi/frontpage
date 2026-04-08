const rows = [
  { sender: "pixelweaver", subject: "Isometric city — 6 months of pixel work", preview: "Over 200 unique buildings, dynamic lighting...", time: "3h", unread: true, starred: true },
  { sender: "shader_witch", subject: "WebGPU compute shaders", preview: "1M particles at 60fps with zero CPU overhead...", time: "5h", unread: true, starred: false },
  { sender: "bytebard", subject: "Cellular automata music generator", preview: "Each cell maps to a MIDI note...", time: "8h", unread: true, starred: true },
  { sender: "retro_dev", subject: "Windows 98 screensavers in p5.js", preview: "Recreated all the classics...", time: "12h", unread: false, starred: false },
  { sender: "admin", subject: "Weekly challenge #47", preview: "Generative landscapes, submissions open...", time: "1d", unread: false, starred: false },
  { sender: "glsl_gang", subject: "Shader playground — open call", preview: "Need help with editor and live-reload...", time: "1d", unread: false, starred: false },
  { sender: "flowstate", subject: "Fluid simulation with Navier-Stokes", preview: "Full solver in a fragment shader...", time: "2d", unread: false, starred: false },
];

export function InboxLayout() {
  return (
    <div className="p-4">
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800 bg-zinc-900/50">
          <button className="px-2.5 py-1 text-[11px] font-medium text-zinc-400 bg-zinc-800 rounded hover:text-zinc-200">
            Archive
          </button>
          <button className="px-2.5 py-1 text-[11px] font-medium text-zinc-400 bg-zinc-800 rounded hover:text-zinc-200">
            Mark Read
          </button>
          <span className="ml-auto text-[11px] text-zinc-500">1-7 of 42</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-zinc-800/50">
          {rows.map((row) => (
            <div
              key={row.sender}
              className={`flex items-center gap-3 px-3 py-2 hover:bg-zinc-800/30 cursor-pointer ${
                row.unread ? "bg-zinc-900/40" : ""
              }`}
            >
              {/* Checkbox */}
              <div className="w-3.5 h-3.5 rounded-sm border border-zinc-600 flex-shrink-0" />

              {/* Star */}
              <span
                className={`text-sm flex-shrink-0 ${
                  row.starred ? "text-amber-400" : "text-zinc-600"
                }`}
              >
                {row.starred ? "\u2605" : "\u2606"}
              </span>

              {/* Sender */}
              <span
                className={`text-xs w-24 flex-shrink-0 truncate ${
                  row.unread ? "font-bold text-zinc-100" : "text-zinc-400"
                }`}
              >
                {row.sender}
              </span>

              {/* Subject + preview */}
              <div className="flex-1 min-w-0 truncate">
                <span
                  className={`text-xs ${
                    row.unread ? "font-semibold text-zinc-100" : "text-zinc-300"
                  }`}
                >
                  {row.subject}
                </span>
                <span className="text-xs text-zinc-500"> — {row.preview}</span>
              </div>

              {/* Time */}
              <span className="text-[11px] text-zinc-500 flex-shrink-0">{row.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
