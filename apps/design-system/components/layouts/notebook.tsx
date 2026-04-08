const posts = [
  {
    title: "Just finished this isometric city — 6 months of pixel work",
    body: "Over 200 unique buildings, dynamic lighting system, and animated citizens going about their daily routines. Used a custom palette generator to keep everything cohesive across the whole cityscape. The hardest part was the z-ordering for overlapping buildings.",
    meta: "pixelweaver · 3h ago · 287 likes",
  },
  {
    title: "WebGPU compute shaders are here",
    body: "Running 1M particles at 60fps with zero CPU overhead. The browser just got serious about GPU compute. The API is surprisingly clean — feels like writing Metal shaders.",
    meta: "shader_witch · 5h ago · 156 likes",
  },
  {
    title: "Cellular automata music generator",
    body: "Each cell's state maps to a MIDI note. Conway's Game of Life becomes a generative synth. The emergent melodies are surprisingly musical.",
    meta: "bytebard · 8h ago · 203 likes",
  },
];

const marginNotes: Array<{
  author: string;
  text: string;
  highlight?: boolean;
  topOffset?: string;
}> = [
  {
    author: "shader_witch",
    text: "How did you handle the z-ordering? Painter's algorithm?",
  },
  {
    author: "pixelweaver",
    text: "Yes! Buildings split into front/back faces so characters walk behind them.",
    highlight: true,
  },
  {
    author: "bytebard",
    text: "Any repo link? Need this for my music visualizer.",
    topOffset: "mt-[60px]",
  },
  {
    author: "noise_maker",
    text: "Try mapping neighborhoods to chord progressions instead of single notes.",
    topOffset: "mt-10",
  },
];

export function NotebookLayout() {
  return (
    <div className="flex p-6 gap-0">
      {/* Main content column */}
      <div className="flex-1 max-w-[480px] py-5 pr-10 pl-5">
        {posts.map((post) => (
          <div key={post.title} className="mb-6">
            <div className="font-serif text-base font-bold leading-[1.3] mb-1.5">
              {post.title}
            </div>
            <div className="text-[13px] text-text-secondary leading-[1.7]">
              {post.body}
            </div>
            <div className="text-[11px] text-text-muted mt-1.5">
              {post.meta}
            </div>
          </div>
        ))}
      </div>

      {/* Margin notes column */}
      <div className="w-[200px] py-5 border-l border-bg-elevated">
        {marginNotes.map((note) => (
          <div
            key={`${note.author}-${note.text.slice(0, 20)}`}
            className={`text-[11px] px-3 py-2 mx-3 mb-2 border-l-2 text-text-secondary ${
              note.highlight
                ? "border-l-accent-primary"
                : "border-l-accent-secondary"
            } ${note.topOffset ?? ""}`}
          >
            <strong
              className={`text-[10px] ${note.highlight ? "text-accent-primary" : "text-accent-secondary"}`}
            >
              {note.author}
            </strong>
            <br />
            {note.text}
          </div>
        ))}
      </div>
    </div>
  );
}
