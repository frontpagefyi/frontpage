import Link from "next/link";
import { getVoteForPost } from "@/lib/data/db/vote";
import { ensureUser, getUser } from "@/lib/data/user";
import { TimeAgo } from "@/lib/components/time-ago";
import { VoteButton } from "./vote-button";
import { getVerifiedHandle } from "@/lib/data/atproto/identity";
import { UserHoverCard } from "@/lib/components/user-hover-card";
import type { DID } from "@/lib/data/atproto/did";
import { parseReportForm } from "@/lib/data/db/report-shared";
import { createReport } from "@/lib/data/db/report";
import { EllipsisDropdown } from "./ellipsis-dropdown";
import { revalidatePath } from "next/cache";
import { ReportDialogDropdownButton } from "./report-dialog";
import { DeleteButton } from "./delete-button";
import { ShareDropdownButton } from "./share-button";
import { createVote, deleteVote } from "@/lib/api/vote";
import { deletePost } from "@/lib/api/post";
import { invariant } from "@/lib/utils";
import * as fyi from "@repo/frontpage-atproto-client/fyi";

type PostProps = {
  id: number;
  title: string;
  body: string;
  url: string;
  votes: number;
  author: DID;
  createdAt: Date;
  commentCount: number;
  rkey: string;
  cid: string | null;
  isUpvoted: boolean;
};

export async function PostCard({
  id,
  title,
  url,
  body,
  votes,
  author,
  createdAt,
  commentCount,
  rkey,
  cid,
  isUpvoted,
}: PostProps) {
  const [handle, user] = await Promise.all([
    getVerifiedHandle(author),
    getUser(),
  ]);
  const postHref = `/post/${handle ?? author}/${rkey}`;

  return (
    // TODO: Make article route to postHref via onClick on card except innser links or buttons
    <article className="flex items-center gap-4 shadow-xs rounded-lg p-4 bg-white dark:bg-slate-900">
      <div className="flex flex-col items-center">
        <VoteButton
          disabled={!cid}
          voteAction={async () => {
            "use server";
            invariant(cid, "Vote action requires cid");
            await ensureUser();
            await createVote({
              rkey,
              cid,
              authorDid: author,
              collection: fyi.unravel.frontpage.post.$type,
            });
          }}
          unvoteAction={async () => {
            "use server";
            const user = await ensureUser();
            const vote = await getVoteForPost(id);
            if (!vote) {
              // TODO: Show error notification
              console.error("Vote not found for post", id);
              return;
            }
            await deleteVote({ authorDid: user.did, rkey: vote.rkey });
          }}
          initialState={
            (await getUser())?.did === author
              ? "authored"
              : isUpvoted
                ? "voted"
                : "unvoted"
          }
          votes={votes}
        />
      </div>
      <div className="w-full">
        <h2 className="mb-1 text-xl">
          <a
            href={url}
            rel="ugc noopener"
            className="hover:underline flex flex-wrap items-center gap-x-2"
          >
            {title}{" "}
            <span className="text-gray-500 dark:text-gray-400 font-normal text-sm md:text-base">
              ({new URL(url).host})
            </span>
          </a>
        </h2>
                <div>{body}</div>
        <div className="flex flex-nowrap text-gray-500 dark:text-gray-400 sm:gap-4 justify-between">
          <div className="flex flex-wrap items-center gap-x-4">
            <UserHoverCard did={author} asChild>
              <Link
                href={`/profile/${handle ?? author}`}
                className="hover:underline"
              >
                @{handle ?? "handle.invalid"}
              </Link>
            </UserHoverCard>
            {/* <span aria-hidden>•</span> */}
            <TimeAgo createdAt={createdAt} side="bottom" />
            {/* <span aria-hidden>•</span> */}
            <Link href={postHref} className="hover:underline">
              {commentCount} comments
            </Link>
          </div>

          {user ? (
            <EllipsisDropdown aria-label="Post actions">
              <ShareDropdownButton path={postHref} />
              <ReportDialogDropdownButton
                reportAction={reportPostAction.bind(null, {
                  rkey,
                  cid,
                  author,
                })}
              />
              {/* TODO: there's a bug here where delete shows on deleted posts */}
              {user?.did === author ? (
                <DeleteButton
                  deleteAction={deletePostAction.bind(null, rkey)}
                />
              ) : null}
            </EllipsisDropdown>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export async function deletePostAction(rkey: string) {
  "use server";
  const user = await ensureUser();
  await deletePost({ authorDid: user.did, rkey });

  revalidatePath("/");
}

export async function reportPostAction(
  input: {
    rkey: string;
    cid: string | null;
    author: DID;
  },
  formData: FormData,
) {
  "use server";
  await ensureUser();

  const formResult = parseReportForm(formData);
  if (!formResult.success) {
    throw new Error("Invalid form data");
  }

  await createReport({
    ...formResult.data,
    subjectUri: `at://${input.author}/${fyi.unravel.frontpage.post.$type}/${input.rkey}`,
    subjectDid: input.author,
    subjectCollection: fyi.unravel.frontpage.post.$type,
    subjectRkey: input.rkey,
    subjectCid: input.cid ?? undefined,
  });
}
