import { Suspense } from "react";
import { connection } from "next/server";
import { InfiniteList } from "@/lib/infinite-list";
import { getMoreFeedPostsAction } from "@/lib/feed-action";
import { FeedLoadingSkeleton } from "./_components/feed-skeleton";

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ uri?: string }>;
}) {
  const { uri } = await searchParams;

  if (!uri) {
    return <p className="text-center text-gray-400">No feed URI provided</p>;
  }

  return (
    <Suspense fallback={<FeedLoadingSkeleton />}>
      <FeedContent uri={uri} />
    </Suspense>
  );
}

async function FeedContent({ uri }: { uri: string }) {
  await connection();

  // Server actions can't serialize undefined as params, so we use null
  // at the boundary and convert to undefined for resolveFeed
  const initialData = await getMoreFeedPostsAction(uri, null);

  return (
    <InfiniteList
      cacheKey={`feed:${uri}`}
      getMoreItemsAction={getMoreFeedPostsAction.bind(null, uri)}
      fallback={initialData}
      emptyMessage="No posts in this feed"
    />
  );
}
