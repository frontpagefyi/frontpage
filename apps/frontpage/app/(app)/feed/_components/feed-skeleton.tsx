import { Skeleton } from "@/lib/components/ui/skeleton";

export function FeedLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </div>
  );
}

function PostSkeleton() {
  return (
    <div className="flex items-center gap-4 shadow-xs rounded-lg p-4 bg-white dark:bg-slate-900">
      <div className="flex flex-col items-center">
        <Skeleton className="size-5" />
        <Skeleton className="h-4 w-6 mt-1" />
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}
