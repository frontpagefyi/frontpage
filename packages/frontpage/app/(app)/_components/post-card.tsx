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
import { nsids } from "@/lib/data/atproto/repo";

type PostProps = {
  id: number;
  title: string;
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
    <article
      className="win95-raised"
      style={{
        background: "#d4d0c8",
        marginBottom: "4px",
        padding: "4px 6px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontFamily: "'Comic Sans MS', cursive",
      }}
    >
      {/* Vote column */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "44px" }}>
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
              collection: nsids.FyiUnravelFrontpagePost,
            });
          }}
          unvoteAction={async () => {
            "use server";
            const user = await ensureUser();
            const vote = await getVoteForPost(id);
            if (!vote) {
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

      {/* Content column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: "2px" }}>
          <a
            href={url}
            rel="ugc noopener"
            style={{ color: "#0000ee", textDecoration: "underline", fontSize: "14px", fontWeight: "bold", wordBreak: "break-word" }}
          >
            {title}
          </a>
          {" "}
          <span style={{ color: "#808080", fontSize: "11px", fontFamily: "monospace" }}>
            ({new URL(url).host})
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", fontSize: "11px", color: "#404040", alignItems: "center" }}>
          <span>📧</span>
          <UserHoverCard did={author} asChild>
            <Link
              href={`/profile/${handle ?? author}`}
              style={{ color: "#551a8b", textDecoration: "underline" }}
            >
              @{handle ?? "handle.invalid"}
            </Link>
          </UserHoverCard>
          <span>|</span>
          <TimeAgo createdAt={createdAt} side="bottom" />
          <span>|</span>
          <Link href={postHref} style={{ color: "#0000ee", textDecoration: "underline" }}>
            💬 {commentCount} comments
          </Link>

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
    subjectUri: `at://${input.author}/${nsids.FyiUnravelFrontpagePost}/${input.rkey}`,
    subjectDid: input.author,
    subjectCollection: nsids.FyiUnravelFrontpagePost,
    subjectRkey: input.rkey,
    subjectCid: input.cid ?? undefined,
  });
}
