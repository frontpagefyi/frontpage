import { connection } from "next/server";
import { InfiniteList } from "@/lib/infinite-list";
import { getMoreFeedPostsAction } from "@/lib/feed-action";
import { FeedSwitcherLayout } from "./_components/feed-switcher";
import { HOT_FEED_URI } from "@/lib/feed-constants";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function Home() {
  await connection();

  const getMorePostsAction = getMoreFeedPostsAction.bind(
    null,
    HOT_FEED_URI.toString(),
  );
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
