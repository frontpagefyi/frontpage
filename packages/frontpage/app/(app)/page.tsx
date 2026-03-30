import { connection } from "next/server";
import { InfiniteList } from "@/lib/infinite-list";
import { getMoreFeedPostsAction } from "@/lib/feed-action";
import { HOT_FEED_URI } from "@/lib/data/feed-constants";

export default async function Home() {
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
