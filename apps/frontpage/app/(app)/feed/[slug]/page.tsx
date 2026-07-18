import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { InfiniteList } from "@/lib/infinite-list";
import { getMoreFeedPostsAction } from "@/lib/feed-action";
import { FeedSwitcherLayout } from "../../_components/feed-switcher";
import {
  FEED_REGISTRY,
  DEFAULT_FEED_SLUG,
  FEED_URIS,
} from "@/lib/feed-constants";
import type { Metadata } from "next";
import { isFeedSlug } from "@/lib/data/feed-resolver";
import { FeedLoadingSkeleton } from "../_components/feed-skeleton";

export async function generateMetadata(
  props: PageProps<"/feed/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  if (!isFeedSlug(slug)) notFound();
  const feed = FEED_REGISTRY.find((f) => f.slug === slug);
  if (!feed) notFound();
  return { title: `${feed.label} - Frontpage`, description: feed.description };
}

export default function FeedSlugPage(props: PageProps<"/feed/[slug]">) {
  return (
    <Suspense fallback={<FeedLoadingSkeleton />}>
      <FeedContent params={props.params} />
    </Suspense>
  );
}

async function FeedContent({
  params: paramsPromise,
}: {
  params: PageProps<"/feed/[slug]">["params"];
}) {
  const { slug } = await paramsPromise;

  if (slug === DEFAULT_FEED_SLUG) {
    redirect("/");
  }

  if (!isFeedSlug(slug)) {
    notFound();
  }

  const uri = FEED_URIS[slug];
  const initialData = await getMoreFeedPostsAction(uri.toString(), null);

  return (
    <FeedSwitcherLayout currentSlug={slug}>
      <InfiniteList
        cacheKey={`feed:${uri.toString()}`}
        getMoreItemsAction={getMoreFeedPostsAction.bind(null, uri.toString())}
        fallback={initialData}
        emptyMessage="No posts in this feed"
      />
    </FeedSwitcherLayout>
  );
}
