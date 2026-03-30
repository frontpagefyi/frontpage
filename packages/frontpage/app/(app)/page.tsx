import { connection } from "next/server";
import { InfiniteList } from "@/lib/infinite-list";
import { PostCard } from "./_components/post-card";
import { resolveFeed } from "@/lib/data/feed-resolver";

const HOT_FEED_URI =
  "at://did:plc:klmr76mpewpv7rtm3xgpzd7x/fyi.frontpage.feed.generator/hot";

export default async function Home() {
  await connection();

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

async function getMorePostsAction(cursor: string | null) {
  "use server";
  const { posts, cursor: nextCursor } = await resolveFeed(
    HOT_FEED_URI,
    cursor ?? undefined,
  );

  return {
    content: (
      <>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            author={post.authorDid}
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
