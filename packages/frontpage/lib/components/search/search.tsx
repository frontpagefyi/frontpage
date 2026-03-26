"use client";
import { type ApiRouteResponse } from "@/lib/api-route";
import type {
  CommentResult,
  PostResult,
  GET as SearchApiRoute,
} from "@/app/api/search/route";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Button } from "../ui/button";
import {
  MagnifyingGlassIcon,
  ChatBubbleIcon,
  FileIcon,
  ExternalLinkIcon,
  ArrowUpIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { CommandGroup, CommandLoading, CommandSeparator } from "cmdk";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<SearchResponse["results"]>([]);

  console.log(items);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const postItems: PostResult[] = [];
  const commentItems: CommentResult[] = [];
  for (const item of items) {
    if (item.type === "post") {
      postItems.push(item);
    } else if (item.type === "comment") {
      commentItems.push(item);
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <MagnifyingGlassIcon />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search">
        <CommandInput
          placeholder="Search posts, comments, profiles..."
          isPending={isPending}
          onValueChange={(value) => {
            startTransition(async () => {
              if (value.trim() === "") {
                setItems([]);
                return;
              }

              const results = await fetchSearch(value);
              setItems(results.results);
            });
          }}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {postItems.length > 0 && (
            <CommandGroup heading="Posts">
              {postItems.map((post) => (
                <PostResultItem key={post.id} post={post} />
              ))}
            </CommandGroup>
          )}

          {commentItems.length > 0 ? (
            <>
              <CommandSeparator />
              <CommandGroup heading="Comments">
                {commentItems.map((comment) => (
                  <CommentResultItem key={comment.id} comment={comment} />
                ))}
              </CommandGroup>
            </>
          ) : null}
        </CommandList>
      </CommandDialog>
    </>
  );
}

function PostResultItem({ post }: { post: PostResult }) {
  return (
    <CommandItem
      className="flex flex-col items-start gap-2 py-3 px-3"
      value={post.id.toString()}
    >
      <div className="flex items-start justify-between w-full gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <FileIcon className="size-4 text-primary shrink-0" />
            <span className="font-medium text-foreground truncate text-sm leading-tight">
              {post.title}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 ml-6">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <ExternalLinkIcon className="size-3" />
              {new URL(post.url).hostname.replace("www.", "")}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between w-full ml-6">
        <div className="flex items-center gap-2">
          <img
            src={post.author.avatarUrl || null}
            alt=""
            className="size-5 rounded-full"
          />
          <span className="text-xs text-muted-foreground">
            @{post.author.handle}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ArrowUpIcon className="size-3" />
            {/* {post.voteCount} */}9
          </span>
          <span className="flex items-center gap-1">
            <ChatBubbleIcon className="size-3" />
            {post.commentCount}
          </span>
          {/* <span>{post.timestamp}</span> */}
        </div>
      </div>
    </CommandItem>
  );
}

function CommentResultItem({ comment }: { comment: CommentResult }) {
  return (
    <CommandItem className="flex flex-col items-start gap-2 py-3 px-3">
      <div className="flex items-start gap-3 w-full">
        <ChatBubbleIcon className="size-4 text-primary shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
            {comment.contentExcerpt}
          </p>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            on: {comment.postTitle}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between w-full ml-7">
        <div className="flex items-center gap-2">
          <img
            src={comment.author.avatarUrl || null}
            alt=""
            className="size-5 rounded-full"
          />
          <span className="text-xs text-muted-foreground">
            @{comment.author.handle}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ChatBubbleIcon className="size-3" />
            {comment.replyCount} replies
          </span>
          {/* <span>{comment.timestamp}</span> */}
        </div>
      </div>
    </CommandItem>
  );
}

export type SearchResponse = ApiRouteResponse<typeof SearchApiRoute>;

async function fetchSearch(query: string): Promise<SearchResponse> {
  let response;
  try {
    response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  } catch (error) {
    console.error("Search request failed", error);
    return { results: [] };
  }
  if (!response.ok) {
    throw new Error("Search request failed");
  }
  return response.json() as Promise<SearchResponse>;
}
