const topics = [
  { name: "GPU / WebGPU", count: 4, active: true },
  { name: "Pixel Art", count: 3 },
  { name: "Generative Music", count: 2 },
  { name: "Challenges", count: 5 },
  { name: "Tutorials", count: 8 },
  { name: "Open Source", count: 3 },
  { name: "Showoffs", count: 12 },
  { name: "Meta / Community", count: 2 },
];

const entries = [
  {
    title: "Anyone tried the new WebGPU compute shaders?",
    body: "Running 1M particles at 60fps with zero CPU overhead. The browser just got serious about GPU compute.",
    meta: "shader_witch · 5h ago · 156 likes · 47 replies",
  },
  {
    title: "Real-time fluid simulation with Navier-Stokes in GLSL",
    body: "Full Navier-Stokes solver running in a fragment shader. Interactive — click to add forces.",
    meta: "flowstate · 1d ago · 54 likes · 29 replies",
  },
  {
    title: "Seeking collaborators for open-source shader playground",
    body: "Building a browser-based GLSL sandbox. Need help with the editor and live-reload system.",
    meta: "glsl_gang · 2d ago · 76 likes · 11 replies",
  },
];

export function DossierLayout() {
  return (
    <div className="flex h-[380px]">
      {/* Table of contents sidebar */}
      <div className="w-[220px] p-4 bg-bg-elevated border-r border-bg-overlay overflow-y-auto">
        <div className="text-[11px] font-bold uppercase text-text-muted mb-2 tracking-[0.5px]">
          Topics
        </div>
        {topics.map((topic) => (
          <div
            key={topic.name}
            className={`text-xs px-2.5 py-2 rounded-md cursor-pointer transition-colors duration-150 flex items-center gap-2 ${
              topic.active
                ? "bg-accent-secondary text-white"
                : "hover:bg-bg-overlay"
            }`}
          >
            {topic.name}
            <span
              className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${
                topic.active
                  ? "bg-white/20 text-white"
                  : "text-text-muted bg-bg-surface"
              }`}
            >
              {topic.count}
            </span>
          </div>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 px-6 py-5 overflow-y-auto">
        <h3 className="font-serif text-lg font-bold mb-1">GPU / WebGPU</h3>
        <div className="text-[11px] text-text-muted mb-4">
          4 posts · Most recent: 5h ago
        </div>
        {entries.map((entry) => (
          <div
            key={entry.title}
            className="py-3 border-b border-bg-elevated"
          >
            <div className="font-semibold text-[13px] mb-1">
              {entry.title}
            </div>
            <div className="text-xs text-text-secondary leading-normal">
              {entry.body}
            </div>
            <div className="text-[10px] text-text-muted mt-1">
              {entry.meta}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
