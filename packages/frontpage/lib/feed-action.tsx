"use server";

import { resolveFeed } from "@/lib/data/feed-resolver";
import { PostCard } from "@/app/(app)/_components/post-card";

export async function getMoreFeedPostsAction(
  feedUri: string,
  cursor: string | null,
) {
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
