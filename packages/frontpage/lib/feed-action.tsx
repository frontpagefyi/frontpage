import { getFeed } from "@/lib/data/feed-resolver";
import { PostCard } from "@/app/(app)/_components/post-card";
import { FEED_URIS } from "./feed-constants";
import { AtUri, type AtUriString } from "@atproto/syntax";

const ALLOWED_FEED_URIS = new Set(
  Object.values(FEED_URIS).map((uri) => uri.toString()),
);

export async function getMoreFeedPostsAction(
  feedUriStr: AtUriString,
  cursor: string | null,
) {
  "use server";
  if (!ALLOWED_FEED_URIS.has(feedUriStr)) {
    throw new Error("Unknown feed");
  }

  const feedUri = new AtUri(feedUriStr);

  const result = await getFeed(feedUri, cursor ?? undefined);
  if (!result.ok) {
    throw new Error(result.error.message);
  }

  const { posts, cursor: nextCursor } = result.data;

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
