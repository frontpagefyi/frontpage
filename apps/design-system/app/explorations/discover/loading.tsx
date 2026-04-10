export default function DiscoverLoading() {
  return (
    <div className="min-h-dvh bg-bg-base">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-3 w-20 rounded bg-bg-elevated animate-pulse mb-4" />
          <div className="h-8 w-64 rounded bg-bg-elevated animate-pulse" />
          <div className="h-4 w-48 rounded bg-bg-elevated animate-pulse mt-2" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl bg-bg-surface border border-bg-elevated overflow-hidden">
              <div className="h-32 bg-bg-elevated animate-pulse" />
              <div className="px-5 pb-5 pt-3 space-y-2">
                <div className="h-5 w-40 rounded bg-bg-elevated animate-pulse" />
                <div className="h-3 w-32 rounded bg-bg-elevated animate-pulse" />
                <div className="h-4 w-full rounded bg-bg-elevated animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
