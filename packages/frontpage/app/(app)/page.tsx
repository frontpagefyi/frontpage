import { Suspense } from "react";
import { connection } from "next/server";
import { InfiniteList } from "@/lib/infinite-list";
import { getMoreFeedPostsAction } from "@/lib/feed-action";
import { HOT_FEED_URI } from "@/lib/constants";
import { FeedSwitcher } from "./_components/feed-switcher";
import { FeedLoadingSkeleton } from "./feed/_components/feed-skeleton";

export default function Home() {
  return (
    <>
      <FeedSwitcher />
      <Suspense fallback={<FeedLoadingSkeleton />}>
        <HomeContent />
      </Suspense>
    </>
  );
}

async function HomeContent() {
  await connection();

  const getMorePostsAction = getMoreFeedPostsAction.bind(null, HOT_FEED_URI);
  const initialData = await getMorePostsAction(null);

  return (
    <InfiniteList
      cacheKey="posts"
      getMoreItemsAction={getMorePostsAction}
      emptyMessage="No posts remaining"
      fallback={initialData}
    />
  );
}
