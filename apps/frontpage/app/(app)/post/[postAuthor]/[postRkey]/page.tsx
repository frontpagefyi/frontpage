import { Comment } from "./_lib/comment";
import { getCommentsForPost } from "@/lib/data/db/comment";
import { Suspense } from "react";
import { type Metadata } from "next";
import { getVerifiedHandle } from "@/lib/data/atproto/identity";
import { type PostPageParams, getPostPageData } from "./_lib/page-data";
import { LinkAlternateAtUri } from "@/lib/components/link-alternate-at";
import { PrefetchOgImage } from "@/lib/og-client";

function getPagePath(params: PostPageParams) {
  return `/post/${params.postAuthor}/${params.postRkey}`;
}

export async function generateMetadata(
  props: PageProps<"/post/[postAuthor]/[postRkey]">,
): Promise<Metadata> {
  const params = await props.params;
  const { post } = await getPostPageData(params);

  const handle = await getVerifiedHandle(post.authorDid);
  const path = getPagePath(params);

  return {
    title: post.title,
    description: "Discuss this post on Frontpage.",
    alternates: {
      canonical: `https://frontpage.fyi${path}`,
    },
    openGraph: {
      title: post.title,
      description: `Discuss @${handle ?? "handle.invalid"}'s post on Frontpage.`,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: handle ? [`@${handle}`] : undefined,
      url: `https://frontpage.fyi${path}`,
      images: [
        {
          url: `${path}/og-image`,
        },
      ],
    },
  };
}

export default function PostPage(
  props: PageProps<"/post/[postAuthor]/[postRkey]">,
) {
  return (
    <Suspense>
      <PostContent params={props.params} />
    </Suspense>
  );
}

async function PostContent({
  params: paramsPromise,
}: {
  params: PageProps<"/post/[postAuthor]/[postRkey]">["params"];
}) {
  const params = await paramsPromise;
  const { post, authorDid } = await getPostPageData(params);
  const comments = await getCommentsForPost(post.id);

  return (
    <>
      <LinkAlternateAtUri
        authority={authorDid}
        collection={post.collection}
        rkey={post.rkey}
      />
      <PrefetchOgImage path={`${getPagePath(params)}/og-image`} />

      <div className="flex flex-col gap-6">
        {comments.length === 0 ? (
          <p className="text-center text-gray-400 my-8">No comments yet!</p>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              level={0}
              postAuthorParam={params.postAuthor}
              postRkey={post.rkey}
              allowReply={post.status === "live"}
            />
          ))
        )}
      </div>
    </>
  );
}
