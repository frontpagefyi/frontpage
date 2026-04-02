import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { InfiniteList } from "@/lib/infinite-list";
import { getMoreFeedPostsAction } from "@/lib/feed-action";
import { FeedSwitcherLayout } from "../../_components/feed-switcher";
import { FEED_REGISTRY, DEFAULT_FEED_SLUG, isFeedSlug } from "@/lib/feed-registry";
import { FEED_URIS } from "@/lib/constants";
import type { Metadata } from "next";

export async function generateMetadata(
  props: PageProps<"/feed/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  if (!isFeedSlug(slug)) notFound();
  const feed = FEED_REGISTRY.find((f) => f.slug === slug);
  if (!feed) notFound();
  return { title: `${feed.label} - Frontpage`, description: feed.description };
}

export default async function FeedSlugPage(props: PageProps<"/feed/[slug]">) {
  await connection();
  const { slug } = await props.params;

  if (slug === DEFAULT_FEED_SLUG) {
    redirect("/");
  }

  if (!isFeedSlug(slug)) {
    notFound();
  }

  const uri = FEED_URIS[slug];

  const initialData = await getMoreFeedPostsAction(uri, null);

  return (
    <FeedSwitcherLayout currentSlug={slug}>
      <InfiniteList
        cacheKey={`feed:${uri}`}
        getMoreItemsAction={getMoreFeedPostsAction.bind(null, uri)}
        fallback={initialData}
        emptyMessage="No posts in this feed"
      />
    </FeedSwitcherLayout>
  );
}
