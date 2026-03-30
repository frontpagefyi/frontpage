import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { InfiniteList } from "@/lib/infinite-list";
import { getMoreFeedPostsAction } from "@/lib/feed-action";
import { FeedSwitcher } from "../../_components/feed-switcher";
import { FEED_URIS } from "@/lib/constants";

export default async function FeedSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "hot") {
    redirect("/");
  }

  const uri = FEED_URIS[slug as keyof typeof FEED_URIS];

  if (!uri) {
    notFound();
  }

  await connection();

  const initialData = await getMoreFeedPostsAction(uri, null);

  return (
    <>
      <FeedSwitcher currentSlug={slug} />
      <InfiniteList
        cacheKey={`feed:${uri}`}
        getMoreItemsAction={getMoreFeedPostsAction.bind(null, uri)}
        fallback={initialData}
        emptyMessage="No posts in this feed"
      />
    </>
  );
}
