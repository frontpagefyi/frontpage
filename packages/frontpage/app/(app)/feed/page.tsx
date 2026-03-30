import { Suspense } from "react";
import { connection } from "next/server";
import { InfiniteList } from "@/lib/infinite-list";
import { PostCard } from "../_components/post-card";
import { resolveFeed } from "@/lib/data/feed-resolver";
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

async function getMoreFeedPostsAction(
  feedUri: string,
  cursor: string | null,
) {
  "use server";
  const { posts, cursor: nextCursor } = await resolveFeed(
    feedUri,
    cursor ?? undefined,
  );

  return {
    content: (
      <>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            author={post.authorDid as any}
            createdAt={post.createdAt}
            id={post.id}
            title={post.title}
            url={post.url}
            votes={post.voteCount}
            commentCount={post.commentCount}
            cid={post.cid}
            rkey={post.rkey}
            isUpvoted={post.userHasVoted}
          />
        ))}
      </>
    ),
    pageSize: posts.length,
    nextCursor: nextCursor ?? null,
  };
}
