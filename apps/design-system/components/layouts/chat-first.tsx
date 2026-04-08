const messages = [
  {
    author: "bytebard",
    avatar: "https://i.pravatar.cc/48?img=8",
    time: "11:58 AM",
    isLong: true,
    longTitle: "Made a cellular automata music generator",
    text: "Each cell's state maps to a MIDI note. Conway's Game of Life becomes a generative synth. Still working on the UI but the core is solid.",
    reactions: [
      { emoji: "\u2764\uFE0F", count: 203 },
      { emoji: "\uD83C\uDFB5", count: 34 },
    ],
  },
  {
    author: "noise_maker",
    avatar: "https://i.pravatar.cc/48?img=11",
    time: "12:15 PM",
    isLong: false,
    longTitle: null,
    text: "@bytebard have you tried mapping the cell neighborhoods to chord progressions instead of individual notes? might get more musical output",
    reactions: [],
  },
  {
    author: "pixelweaver",
    avatar: "https://i.pravatar.cc/48?img=3",
    time: "12:34 PM",
    isLong: true,
    longTitle: "Just finished this isometric city — 6 months of pixel work",
    text: "Finally done! Over 200 unique buildings, dynamic lighting system, and animated citizens. Used a custom palette generator to keep everything cohesive.",
    reactions: [
      { emoji: "\u2764\uFE0F", count: 287 },
      { emoji: "\uD83D\uDD25", count: 45 },
      { emoji: "\uD83C\uDFA8", count: 23 },
    ],
  },
  {
    author: "shader_witch",
    avatar: "https://i.pravatar.cc/48?img=5",
    time: "12:38 PM",
    isLong: false,
    longTitle: null,
    text: "@pixelweaver this is incredible. how did you handle the z-ordering for the isometric tiles?",
    reactions: [],
  },
  {
    author: "pixelweaver",
    avatar: "https://i.pravatar.cc/48?img=3",
    time: "12:40 PM",
    isLong: false,
    longTitle: null,
    text: "painter's algorithm with a custom sort — buildings get split into front/back faces so characters can walk behind them",
    reactions: [],
  },
];

export function ChatFirstLayout() {
  return (
    <div className="px-4 py-3 flex flex-col gap-1">
      {/* Date divider */}
      <div className="text-center text-[10px] text-text-muted my-2 relative">
        <span className="relative z-10 bg-bg-surface px-3">Today</span>
        <div className="absolute top-1/2 left-0 right-0 h-px bg-bg-elevated" />
      </div>

      {/* Messages */}
      {messages.map((msg, i) => (
        <div
          key={`${msg.author}-${i}`}
          className="flex gap-3 px-2 py-1 rounded-md hover:bg-bg-elevated transition-colors"
        >
          <div
            className="w-6 h-6 rounded-full bg-indigo-600 shrink-0 bg-cover bg-center mt-0.5"
            style={{ backgroundImage: `url('${msg.avatar}')` }}
          />
          <div className="flex-1">
            <div className="text-xs font-bold text-accent-secondary">
              {msg.author}
              <span className="font-normal text-text-muted text-[10px] ml-1.5">{msg.time}</span>
            </div>

            {msg.isLong ? (
              <div className="bg-bg-elevated rounded-md px-3 py-2.5 mt-1">
                <div className="font-bold text-sm text-text-primary mb-1">{msg.longTitle}</div>
                <div className="text-[13px] text-text-secondary leading-normal">{msg.text}</div>
              </div>
            ) : (
              <div className="text-[13px] text-text-secondary leading-normal mt-0.5">{msg.text}</div>
            )}

            {msg.reactions.length > 0 && (
              <div className="flex gap-1 mt-1">
                {msg.reactions.map((r) => (
                  <span
                    key={r.emoji}
                    className="text-[11px] px-1.5 py-0.5 rounded-full bg-bg-elevated border border-bg-overlay"
                  >
                    {r.emoji} {r.count}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
