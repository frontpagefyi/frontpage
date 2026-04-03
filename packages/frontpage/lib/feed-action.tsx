import { getFeed } from "@/lib/data/feed-resolver";
import { PostCard } from "@/app/(app)/_components/post-card";
import { FEED_URIS } from "./feed-constants";
import type { AtUri } from "@atproto/syntax";

const ALLOWED_FEED_URIS = Object.values(FEED_URIS);

export async function getMoreFeedPostsAction(
  feedUri: AtUri,
  cursor: string | null,
) {
  "use server";
  if (!ALLOWED_FEED_URIS.some((uri) => uri.toString() === feedUri.toString())) {
    throw new Error("Unknown feed");
  }

  const result = await getFeed(feedUri, cursor ?? undefined);
  if (!result.ok) {
    throw new Error(result.error.message);
  }

  const { posts, cursor: nextCursor } = result;

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
}
