export function SpeedDate() {
  return (
    <div className="mx-auto max-w-[480px] p-5 text-center">
      {/* Main card */}
      <div className="mb-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-8 dark:border-zinc-700 dark:bg-zinc-800">
        {/* Timer circle */}
        <div className="relative mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-full border-[3px] border-purple-500 font-mono text-lg font-bold text-purple-500">
          12
          <div
            className="absolute inset-[-3px] rounded-full border-[3px] border-transparent"
            style={{ borderTopColor: "var(--accent-primary, #6366f1)" }}
          />
        </div>

        <div className="mb-2 font-serif text-xl font-bold">
          Just finished this isometric city
        </div>
        <div className="mb-3 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
          6 months of pixel work. 200 unique buildings, dynamic lighting,
          animated citizens. Custom palette generator for chromatic consistency
          across the whole cityscape.
        </div>
        <div className="text-xs text-zinc-400 dark:text-zinc-500">
          pixelweaver &middot; 287 likes &middot; 94 comments
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-3">
        <div className="cursor-pointer rounded-full bg-zinc-200 px-6 py-2.5 text-xs font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
          Next &rarr;
        </div>
        <div className="cursor-pointer rounded-full bg-purple-500 px-6 py-2.5 text-xs font-bold text-white">
          Stay Longer
        </div>
      </div>
    </div>
  );
}
