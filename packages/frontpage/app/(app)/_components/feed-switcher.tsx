"use client";

import { type ReactNode, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/lib/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Spinner } from "@/lib/components/ui/spinner";
import { FeedLoadingSkeleton } from "../feed/_components/feed-skeleton";
import {
  FEED_REGISTRY,
  DEFAULT_FEED_SLUG,
  type FeedSlug,
} from "@/lib/feed-registry";

function feedHref(slug: FeedSlug) {
  return slug === DEFAULT_FEED_SLUG ? "/" : `/feed/${slug}`;
}

export function FeedSwitcherLayout({
  currentSlug = DEFAULT_FEED_SLUG,
  children,
}: {
  currentSlug?: FeedSlug;
  children: ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticSlug, setOptimisticSlug] = useOptimistic(currentSlug);

  const current =
    FEED_REGISTRY.find((f) => f.slug === optimisticSlug) ?? FEED_REGISTRY[0];

  return (
    <>
      <div className="mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 text-base">
              {current.label}
              {isPending ? (
                <Spinner className="h-3 w-3" />
              ) : (
                <ChevronDownIcon />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup value={optimisticSlug}>
              {FEED_REGISTRY.map((feed) => (
                <DropdownMenuRadioItem
                  key={feed.slug}
                  value={feed.slug}
                  onSelect={() => {
                    startTransition(() => {
                      setOptimisticSlug(feed.slug);
                      router.push(feedHref(feed.slug));
                    });
                  }}
                >
                  {feed.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isPending ? <FeedLoadingSkeleton /> : children}
    </>
  );
}
