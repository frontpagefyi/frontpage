"use client";

import useSWR, { preload } from "swr";
import { type DID } from "../data/atproto/did";
import { HoverCardTrigger } from "./ui/hover-card";
import { type ReactNode } from "react";
import { ChatBubbleIcon, Link1Icon } from "@radix-ui/react-icons";
import { type ApiRouteResponse } from "../api-route";
import type { GET as GetHoverCardContent } from "@/app/api/hover-card-content/route";
import Link from "next/link";

export function UserHoverCardTrigger({
  children,
  asChild,
  did,
}: {
  children: ReactNode;
  asChild?: boolean;
  did: DID;
}) {
  return (
    <HoverCardTrigger
      asChild={asChild}
      onMouseEnter={() => {
        void preload(did, getHoverCardData);
      }}
    >
      {children}
    </HoverCardTrigger>
  );
}

export function UserHoverCardContent({ did }: { did: DID }) {
  const { data } = useSWR(did, getHoverCardData, {
    suspense: true,
    revalidateOnMount: false,
  });

  return (
    <>
      <Link
        href={`/profile/${data.handle ?? data.did}`}
        className="text-sm font-semibold"
      >
        @{data.handle ?? "handle.invalid"}
      </Link>
      <p
        className="text-sm flex gap-2 items-center"
        title={`${data.commentCount} comments`}
      >
        <ChatBubbleIcon /> {data.commentCount}
      </p>
      <p
        className="text-sm flex gap-2 items-center"
        title={`${data.postCount} posts`}
      >
        <Link1Icon /> {data.postCount}
      </p>
    </>
  );
}

async function getHoverCardData(
  did: DID,
): Promise<ApiRouteResponse<typeof GetHoverCardContent>> {
  const response = await fetch(`/api/hover-card-content?did=${did}`);
  return response.json() as Promise<
    ApiRouteResponse<typeof GetHoverCardContent>
  >;
}
