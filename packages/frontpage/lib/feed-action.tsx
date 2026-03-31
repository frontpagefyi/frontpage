"use server";

import { resolveFeed } from "@/lib/data/feed-resolver";
import { PostCard } from "@/app/(app)/_components/post-card";
import { FEED_URIS } from "@/lib/constants";

const ALLOWED_FEED_URIS = new Set(Object.values(FEED_URIS));

export async function getMoreFeedPostsAction(
  feedUri: string,
  cursor: string | null,
) {
  if (!ALLOWED_FEED_URIS.has(feedUri)) {
    throw new Error("Unknown feed");
  }

  try {
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
      itemCount: posts.length,
      nextCursor: nextCursor ?? null,
    };
  } catch (err) {
    console.error("Failed to load feed page:", feedUri, err);
    throw err;
  }
}
