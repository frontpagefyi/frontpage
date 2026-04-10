export default function FeedLoading() {
  return (
    <div className="flex h-dvh overflow-hidden bg-bg-base">
      {/* Sidebar skeleton — desktop */}
      <div className="hidden md:flex flex-col w-[72px] border-r border-bg-elevated py-4 px-2 gap-3">
        <div className="w-10 h-10 rounded-xl bg-bg-elevated animate-pulse mx-auto" />
        <div className="border-t border-bg-elevated mx-1 my-1" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-10 h-10 rounded-xl bg-bg-elevated animate-pulse mx-auto" />
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 overflow-hidden">
        {/* Banner skeleton */}
        <div className="hidden md:block h-48 bg-bg-elevated animate-pulse" />

        {/* Feed skeleton */}
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {/* Compose bar skeleton */}
          <div className="h-14 rounded-xl bg-bg-surface border border-bg-elevated animate-pulse" />

          {/* Post skeletons */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl bg-bg-surface border border-bg-elevated p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-bg-elevated animate-pulse" />
                <div className="h-3 w-24 rounded bg-bg-elevated animate-pulse" />
              </div>
              <div className="h-5 w-3/4 rounded bg-bg-elevated animate-pulse" />
              <div className="h-3 w-full rounded bg-bg-elevated animate-pulse" />
              <div className="h-3 w-2/3 rounded bg-bg-elevated animate-pulse" />
              <div className="flex gap-4 pt-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-3 w-12 rounded bg-bg-elevated animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
