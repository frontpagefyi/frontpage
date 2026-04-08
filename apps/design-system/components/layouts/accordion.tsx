const items = [
  {
    title: "Just finished this isometric city — 6 months of pixel work",
    votes: 287,
    replies: 94,
    open: true,
    body: "Over 200 unique buildings, dynamic lighting system, and animated citizens. Used a custom palette generator to keep everything cohesive across the whole cityscape. The hardest part was the z-ordering for overlapping buildings.",
  },
  { title: "Anyone tried the new WebGPU compute shaders?", votes: 156, replies: 47, open: false },
  { title: "Made a cellular automata music generator", votes: 203, replies: 32, open: false },
  { title: "How I recreated the Windows 98 screensavers in p5.js", votes: 134, replies: 63, open: false },
  { title: "Weekly challenge #47: Generative landscapes", votes: 98, replies: 18, open: false },
  { title: "Seeking collaborators for open-source shader playground", votes: 76, replies: 11, open: false },
  { title: "Real-time fluid simulation with Navier-Stokes in GLSL", votes: 54, replies: 29, open: false },
];

export function AccordionLayout() {
  return (
    <div className="p-4">
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden divide-y divide-zinc-800/50">
        {items.map((item) => (
          <div key={item.title}>
            <div className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-zinc-800/30">
              <span
                className={`text-[10px] text-zinc-500 flex-shrink-0 transition-transform ${
                  item.open ? "rotate-90" : ""
                }`}
              >
                &#9654;
              </span>
              <span className="text-xs font-medium text-zinc-200 flex-1 min-w-0 truncate">
                {item.title}
              </span>
              <div className="flex items-center gap-3 text-[11px] text-zinc-500 flex-shrink-0">
                <span>{item.votes}&uarr;</span>
                <span>{item.replies} replies</span>
              </div>
            </div>
            {item.open && item.body && (
              <div className="px-4 pb-3 pl-9 text-xs text-zinc-400 leading-relaxed">
                {item.body}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
