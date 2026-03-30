"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/lib/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Spinner } from "@/lib/components/ui/spinner";

const FEEDS = [
  { label: "Hot", slug: "hot" },
  { label: "New", slug: "new" },
  { label: "Top", slug: "top" },
] as const;

const DEFAULT_FEED = FEEDS[0];

function feedHref(slug: string) {
  return slug === "hot" ? "/" : `/feed/${slug}`;
}

export function FeedSwitcher({
  currentSlug = "hot",
}: {
  currentSlug?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticSlug, setOptimisticSlug] = useState(currentSlug);
  const current = FEEDS.find((f) => f.slug === optimisticSlug) ?? DEFAULT_FEED;

  return (
    <div className="mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1 text-base">
            {current.label}
            {isPending ? <Spinner className="h-3 w-3" /> : <ChevronDownIcon />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {FEEDS.map((feed) => (
            <DropdownMenuItem
              key={feed.slug}
              className={feed.slug === optimisticSlug ? "font-medium" : ""}
              onSelect={() => {
                setOptimisticSlug(feed.slug);
                startTransition(() => {
                  router.push(feedHref(feed.slug));
                });
              }}
            >
              {feed.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
