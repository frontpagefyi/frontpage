"use client";

import { useEffect } from "react";

export default function FeedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Feed error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <p className="text-gray-500">Something went wrong loading this feed.</p>
      {error.digest && (
        <p className="text-xs text-gray-400">Ref: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
      >
        Try again
      </button>
    </div>
  );
}
