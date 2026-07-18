import { Comment } from "../../_lib/comment";
import Link from "next/link";
import { type Metadata } from "next";
import { getVerifiedHandle } from "@/lib/data/atproto/identity";
import { type CommentPageParams, getCommentPageData } from "./_lib/page-data";
import { LinkAlternateAtUri } from "@/lib/components/link-alternate-at";
import { PrefetchOgImage } from "@/lib/og-client";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}

function getPagePath(params: CommentPageParams) {
  return `/post/${params.postAuthor}/${params.postRkey}/${params.commentAuthor}/${params.commentRkey}`;
}

export async function generateMetadata(
  props: PageProps<"/post/[postAuthor]/[postRkey]/[commentAuthor]/[commentRkey]">,
): Promise<Metadata> {
  const params = await props.params;
  const { comment, post } = await getCommentPageData(params);

  const handle = await getVerifiedHandle(comment.authorDid);
  const handleDisplay = handle ?? "handle.invalid";
  const path = getPagePath(params);

  return {
    title:
      comment.status === "live"
        ? `@${handleDisplay}'s comment on "${truncateText(post.title, 15)}"`
        : "Deleted comment",
    description:
      comment.status === "live" ? truncateText(comment.body, 47) : null,
    alternates: {
      canonical: `https://frontpage.fyi${path}`,
    },
    openGraph:
      comment.status === "live"
        ? {
            title: `@${handleDisplay}'s comment on Frontpage`,
            description: truncateText(comment.body, 47),
            type: "article",
            publishedTime: comment.createdAt.toISOString(),
            authors: handle ? [`@${handle}`] : undefined,
            url: `https://frontpage.fyi${path}`,
            images: [
              {
                url: `${path}/og-image`,
              },
            ],
          }
        : undefined,
  };
}

export default async function CommentPage(
  props: PageProps<"/post/[postAuthor]/[postRkey]/[commentAuthor]/[commentRkey]">,
) {
  const params = await props.params;
  const { comment, post } = await getCommentPageData(params);

  return (
    <>
      <LinkAlternateAtUri
        authority={comment.authorDid}
        collection={comment.collection}
        rkey={comment.rkey}
      />
      <PrefetchOgImage path={`${getPagePath(params)}/og-image`} />
      <div className="flex justify-end">
        <Link
          href={`/post/${params.postAuthor}/${params.postRkey}`}
          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          See all comments
        </Link>
      </div>
      <Comment
        comment={comment}
        postAuthorParam={params.postAuthor}
        postRkey={post.rkey}
        allowReply={post.status === "live"}
      />
    </>
  );
}
