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
    <div className="flex gap-3">
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="size-5" />
        <Skeleton className="h-4 w-6" />
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}
