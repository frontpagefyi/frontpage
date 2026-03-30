"use client";

export default function FeedError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <p className="text-gray-500">Failed to load feed.</p>
      <button onClick={reset} className="text-sm text-blue-500 hover:underline">
        Try again
      </button>
    </div>
  );
}
