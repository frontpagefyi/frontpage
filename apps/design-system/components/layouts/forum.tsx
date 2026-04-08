const rows = [
  { pinned: true, title: "Community rules & getting started", author: "moderator", replies: 24, views: "1.2k", lastPost: "2h ago", avatar: "" },
  { pinned: false, title: "Just finished this isometric city — 6 months of pixel work", author: "pixelweaver", replies: 94, views: "3.4k", lastPost: "12m ago", avatar: "https://i.pravatar.cc/36?img=3" },
  { pinned: false, title: "Anyone tried the new WebGPU compute shaders?", author: "shader_witch", replies: 47, views: "891", lastPost: "34m ago", avatar: "https://i.pravatar.cc/36?img=5" },
  { pinned: false, title: "Made a cellular automata music generator", author: "bytebard", replies: 32, views: "654", lastPost: "1h ago", avatar: "https://i.pravatar.cc/36?img=8" },
  { pinned: false, title: "Weekly challenge #47: Generative landscapes", author: "admin", replies: 18, views: "412", lastPost: "2h ago", avatar: "https://i.pravatar.cc/36?img=14" },
  { pinned: false, title: "How I recreated the Windows 98 screensavers in p5.js", author: "retro_dev", replies: 63, views: "2.1k", lastPost: "3h ago", avatar: "https://i.pravatar.cc/36?img=18" },
  { pinned: false, title: "Seeking collaborators for open-source shader playground", author: "glsl_gang", replies: 11, views: "287", lastPost: "4h ago", avatar: "https://i.pravatar.cc/36?img=20" },
];

export function ForumLayout() {
  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-bg-elevated rounded-t-md border-b-2 border-accent-secondary text-[13px] font-bold">
        Creative Coding
        <div className="flex ml-auto gap-8 text-[10px] text-text-muted font-semibold uppercase">
          <span className="w-[60px]">Replies</span>
          <span className="w-[60px]">Views</span>
          <span className="w-[80px]">Last Post</span>
        </div>
      </div>

      {/* Rows */}
      {rows.map((row) => (
        <div
          key={row.title}
          className="flex items-center gap-3 px-4 py-2.5 border-b border-bg-elevated text-[13px] hover:bg-bg-elevated transition-colors"
        >
          {row.pinned ? (
            <span className="text-accent-primary text-[10px] font-bold">PINNED</span>
          ) : (
            <div
              className="w-[18px] h-[18px] rounded-full bg-indigo-500 shrink-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${row.avatar}')` }}
            />
          )}
          <span className="flex-1 font-semibold">
            {row.title}{" "}
            <small className="font-normal text-text-muted text-[11px]">by {row.author}</small>
          </span>
          <div className="flex gap-8 text-[11px] text-text-muted min-w-[200px] text-right">
            <span className="w-[60px] text-center">{row.replies}</span>
            <span className="w-[60px] text-center">{row.views}</span>
            <span className="w-[60px] text-center">{row.lastPost}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
