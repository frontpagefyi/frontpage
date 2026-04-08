const reviews = [
  {
    author: "pixelweaver",
    handle: "@pixelweaver.bsky.social",
    avatar: "https://i.pravatar.cc/96?img=3",
    title: "Just finished this isometric city — 6 months of pixel work",
    body: "Over 200 unique buildings, dynamic lighting system, and animated citizens. Used a custom palette generator to keep everything cohesive across the whole cityscape.",
    stars: 5,
    likes: 287,
    comments: 94,
  },
  {
    author: "shader_witch",
    handle: "@shader-witch.bsky.social",
    avatar: "https://i.pravatar.cc/96?img=5",
    title: "Anyone tried the new WebGPU compute shaders?",
    body: "Running 1M particles at 60fps with zero CPU overhead. This changes everything for creative coding in the browser. The API is surprisingly clean too.",
    stars: 0,
    likes: 156,
    comments: 47,
  },
];

export function LetterboxdLayout() {
  return (
    <div className="px-8 py-5 max-w-[640px] mx-auto">
      {reviews.map((review) => (
        <div
          key={review.author}
          className="flex gap-4 py-5 border-b border-bg-elevated"
        >
          {/* Big avatar */}
          <div
            className="w-12 h-12 rounded-full bg-cover bg-center shrink-0"
            style={{ backgroundImage: `url('${review.avatar}')` }}
          />

          {/* Content */}
          <div className="flex-1">
            <div className="text-[16px] font-bold">{review.author}</div>
            <div className="text-[12px] text-text-muted">{review.handle}</div>

            <div className="text-[14px] font-bold mt-2 leading-tight">{review.title}</div>
            <div className="text-[13px] text-text-secondary leading-relaxed mt-1">
              {review.body}
            </div>

            {/* Star rating */}
            {review.stars > 0 && (
              <div className="flex gap-1 mt-2 text-accent-primary text-[14px]">
                {Array.from({ length: review.stars }, (_, i) => (
                  <span key={i}>&#9733;</span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-2 text-[11px] text-text-muted">
              <span>{review.likes} likes</span>
              <span>{review.comments} comments</span>
              <span>Share</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
