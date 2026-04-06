import { UserAvatar } from "./user-avatar";
import { HoverCard, HoverCardContent } from "@/lib/components/ui/hover-card";
import { type DID } from "../data/atproto/did";
import { getVerifiedHandle } from "../data/atproto/identity";
import {
  UserHoverCardContent,
  UserHoverCardTrigger,
} from "./user-hover-card-client";
import { ensureUser } from "../data/user";
import { parseReportForm } from "../data/db/report-shared";
import { createReport } from "../data/db/report";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { Suspense } from "react";
import { Separator } from "./ui/separator";
import { ReportDialogIcon } from "@/app/(app)/_components/report-dialog";
import { getSession } from "../auth";

type Props = {
  did: DID;
  children: React.ReactNode;
  asChild?: boolean;
};

export async function UserHoverCard({ did, children, asChild }: Props) {
  // Fetch this early on the server because it's almost certainly already cached this request
  const handle = await getVerifiedHandle(did);
  const session = await getSession();

  return (
    <HoverCard>
      <UserHoverCardTrigger did={did} asChild={asChild}>
        {children}
      </UserHoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex gap-4">
          <Link href={`/profile/${handle ?? did}`} className="shrink-0">
            <UserAvatar did={did} size="medium" />
          </Link>
          <div className="flex flex-col gap-1 basis-full">
            <Suspense fallback={<ContentFallback handle={handle} did={did} />}>
              <UserHoverCardContent did={did} />
            </Suspense>
          </div>
        </div>
        {session !== null && session.did !== did ? (
          <>
            <Separator className="my-2" />
            <div>
              <ReportDialogIcon
                reportAction={reportUserAction.bind(null, { did })}
              />
            </div>
          </>
        ) : null}
      </HoverCardContent>
    </HoverCard>
  );
}

function ContentFallback({ handle, did }: { handle: string | null; did: DID }) {
  return (
    <>
      <Link
        href={`/profile/${handle ?? did}`}
        className="text-sm font-semibold"
      >
        @{handle ?? "handle.invalid"}
      </Link>
      <Skeleton className="h-5 w-12" />
      <Skeleton className="h-5 w-12" />
    </>
  );
}

// TODO: Find a better place for this action, it doesn't belong as part of the hover card component as it's used elsewhere. Or maybe just duplicate it?
export async function reportUserAction(
  input: {
    did: DID;
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
    subjectUri: `at://${input.did}`,
    subjectDid: input.did,
  });
}
