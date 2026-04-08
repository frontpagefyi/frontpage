const messages = [
  { caller: "pixelweaver", time: "Today, 12:34 PM", dur: "5:30", isNew: true },
  { caller: "shader_witch", time: "Today, 12:21 PM", dur: "4:10", isNew: true },
  { caller: "bytebard", time: "Today, 11:58 AM", dur: "3:20", isNew: true },
  { caller: "retro_dev", time: "Yesterday", dur: "3:45", isNew: false },
  { caller: "admin", time: "Yesterday", dur: "2:00", isNew: false },
];

export function VoicemailLayout() {
  return (
    <div className="px-6 py-5 max-w-[480px] mx-auto">
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, oklch(25% 0.01 250), oklch(20% 0.02 260))",
          boxShadow: "0 4px 20px oklch(0% 0 0 / 0.3)",
        }}
      >
        {/* LCD Display */}
        <div
          className="mx-4 mt-4 rounded-lg px-4 py-3 font-mono text-xs"
          style={{
            background: "oklch(25% 0.08 150)",
            color: "oklch(75% 0.15 150)",
            boxShadow: "inset 0 2px 6px oklch(0% 0 0 / 0.3)",
          }}
        >
          <div className="flex items-center justify-between">
            <span>CREATIVE CODING</span>
            <span className="text-red-400">&#9679; 3 NEW</span>
          </div>
          <div className="mt-1 text-[10px] opacity-70">
            MON APR 7 &middot; 5 MESSAGES
          </div>
        </div>

        {/* Message list */}
        <div className="px-4 py-3 space-y-1.5">
          {messages.map((msg) => (
            <div
              key={`${msg.caller}-${msg.time}`}
              className="flex items-center gap-3 rounded-lg px-3 py-2"
              style={{
                background: "oklch(28% 0.01 250)",
                borderLeft: msg.isNew
                  ? "3px solid oklch(60% 0.2 25)"
                  : "3px solid transparent",
              }}
            >
              {/* Play button */}
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs flex-shrink-0 cursor-pointer hover:bg-white/20">
                &#9654;
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white/90">
                  {msg.caller}
                </div>
                <div className="text-[10px] text-white/50">{msg.time}</div>
              </div>

              {/* Duration */}
              <div className="text-xs font-mono text-white/50 flex-shrink-0">
                {msg.dur}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
