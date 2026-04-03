import { connection } from "next/server";
import { InfiniteList } from "@/lib/infinite-list";
import { getMoreFeedPostsAction } from "@/lib/feed-action";
import { FeedSwitcherLayout } from "./_components/feed-switcher";
import { HOT_FEED_URI } from "@/lib/feed-constants";

export default async function Home() {
  await connection();

  const getMorePostsAction = getMoreFeedPostsAction.bind(null, HOT_FEED_URI);
  const initialData = await getMorePostsAction(null);

  return (
    <FeedSwitcherLayout>
      <InfiniteList
        cacheKey={`feed:${HOT_FEED_URI.toString()}`}
        getMoreItemsAction={getMorePostsAction}
        emptyMessage="No posts remaining"
        fallback={initialData}
      />
    </FeedSwitcherLayout>
  );
}
