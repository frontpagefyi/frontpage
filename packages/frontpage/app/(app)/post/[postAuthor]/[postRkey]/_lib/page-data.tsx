import "server-only";
import { getDidFromHandleOrDid } from "@/lib/data/atproto/identity";
import { getPost } from "@/lib/data/db/post";
import { notFound } from "next/navigation";
import { nsids } from "@/lib/data/atproto/repo";

export type PostPageParams = Awaited<
  PageProps<"/post/[postAuthor]/[postRkey]">["params"]
>;

export async function getPostPageData(params: PostPageParams) {
  const authorDid = await getDidFromHandleOrDid(params.postAuthor);
  if (!authorDid) {
    notFound();
  }
  const [unravelPost, frontpagePost] = await Promise.all([
    getPost({
      actor: authorDid,
      collection: nsids.FyiUnravelFrontpagePost,
      rkey: params.postRkey,
    }),
    getPost({
      actor: authorDid,
      collection: nsids.FyiFrontpageFeedPost,
      rkey: params.postRkey,
    }),
  ]);

  // Choosing frontpagePost over unravelPost if both exist
  // This shouldn't happen in regular usage, only if a user creates a post on purpose with an existing rkey
  const post = frontpagePost ?? unravelPost;
  if (!post) {
    notFound();
  }

  return { post, authorDid };
}
