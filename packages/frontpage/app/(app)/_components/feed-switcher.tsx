"use client";

import { Button } from "@/lib/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import { ChevronDownIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const FEEDS = [
  { label: "Hot", slug: "hot" },
  { label: "New", slug: "new" },
  { label: "Top", slug: "top" },
] as const;

const DEFAULT_FEED = FEEDS[0];

export function FeedSwitcher({
  currentSlug = "hot",
}: {
  currentSlug?: string;
}) {
  const current = FEEDS.find((f) => f.slug === currentSlug) ?? DEFAULT_FEED;

  return (
    <div className="mb-4 flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1 text-base">
            {current.label}
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {FEEDS.map((feed) => (
            <DropdownMenuItem key={feed.slug} asChild>
              <Link
                href={feed.slug === "hot" ? "/" : `/feed/${feed.slug}`}
                className={feed.slug === currentSlug ? "font-medium" : ""}
              >
                {feed.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <a
        href="https://bsky.app/profile/frontpage.fyi"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        @frontpage.fyi <OpenInNewWindowIcon className="inline" />
      </a>
    </div>
  );
}
