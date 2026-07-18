import { Suspense } from "react";
import { InfiniteList } from "@/lib/infinite-list";
import { getMoreFeedPostsAction } from "@/lib/feed-action";
import { FeedSwitcherLayout } from "./_components/feed-switcher";
import { HOT_FEED_URI } from "@/lib/feed-constants";
import { FeedLoadingSkeleton } from "./feed/_components/feed-skeleton";

export default function Home() {
  const getMorePostsAction = getMoreFeedPostsAction.bind(
    null,
    HOT_FEED_URI.toString(),
  );

  return (
    <FeedSwitcherLayout>
      <Suspense fallback={<FeedLoadingSkeleton />}>
        <HomeFeed getMorePostsAction={getMorePostsAction} />
      </Suspense>
    </FeedSwitcherLayout>
  );
}

async function HomeFeed({
  getMorePostsAction,
}: {
  getMorePostsAction: typeof getMoreFeedPostsAction;
}) {
  const initialData = await getMorePostsAction(null);
  return (
    <InfiniteList
      cacheKey={`feed:${HOT_FEED_URI.toString()}`}
      getMoreItemsAction={getMorePostsAction}
      emptyMessage="No posts remaining"
      fallback={initialData}
    />
  );
}
