const posts = [
  {
    author: "pixelweaver",
    avatar: "https://i.pravatar.cc/48?img=3",
    time: "3h ago",
    title: "Just finished this isometric city — 6 months of pixel work",
    body: null,
    hasImage: true,
    likes: 287,
    comments: 94,
  },
  {
    author: "shader_witch",
    avatar: "https://i.pravatar.cc/48?img=5",
    time: "5h ago",
    title: "Anyone tried the new WebGPU compute shaders?",
    body: "Just got my hands on the latest Chrome Canary build and the performance improvements are insane. Running 1M particles at 60fps with zero CPU overhead...",
    hasImage: false,
    likes: 156,
    comments: 47,
  },
  {
    author: "bytebard",
    avatar: "https://i.pravatar.cc/48?img=8",
    time: "8h ago",
    title: "Made a cellular automata music generator",
    body: "Each cell's state maps to a MIDI note. Conway's Game of Life becomes a generative synth. Link in thread.",
    hasImage: false,
    likes: 203,
    comments: 32,
  },
];

export function TimelineLayout() {
  return (
    <div className="px-12 py-6 max-w-[640px] mx-auto">
      {posts.map((post, i) => (
        <div
          key={post.title}
          className={`py-6 ${i < posts.length - 1 ? "border-b border-bg-elevated" : ""}`}
        >
          {/* Meta */}
          <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
            <div
              className="w-6 h-6 rounded-full bg-indigo-600 shrink-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${post.avatar}')` }}
            />
            <strong className="text-text-primary">{post.author}</strong>
            <span>&middot; {post.time}</span>
          </div>

          {/* Title */}
          <div className="font-serif text-lg font-semibold leading-tight mb-2">
            {post.title}
          </div>

          {/* Image placeholder */}
          {post.hasImage && (
            <div
              className="w-full h-[140px] rounded-md mb-3 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=800&q=80')",
                backgroundColor: "var(--indigo-700)",
              }}
            />
          )}

          {/* Body */}
          {post.body && (
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              {post.body}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-4 text-xs text-text-muted">
            <span>{post.likes} likes</span>
            <span>{post.comments} comments</span>
            <span>Share</span>
          </div>
        </div>
      ))}
    </div>
  );
}
