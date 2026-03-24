"use client";

import {
  startTransition,
  useActionState,
  useId,
  useState,
  useTransition,
} from "react";
import { newPostAction } from "./_action";
import { Label } from "@/lib/components/ui/label";
import { Input } from "@/lib/components/ui/input";
import { Button } from "@/lib/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/lib/components/ui/alert";
import { Spinner } from "@/lib/components/ui/spinner";
import {
  MAX_POST_TITLE_LENGTH,
  MAX_POST_URL_LENGTH,
} from "@/lib/data/db/constants";
import { InputLengthIndicator } from "@/lib/components/input-length-indicator";
import type { ApiRouteResponse } from "@/lib/api-route";
import type { GET as GetFetchLinkOgApiRoute } from "@/app/api/fetch-link-og/route";
import { ReloadIcon, ResetIcon } from "@radix-ui/react-icons";

type TitleState =
  | {
      value: string;
      isAutomaticallyFetched: false;
    }
  | {
      value: string;
      isAutomaticallyFetched: true;
      previousTitle: string;
    };

export function NewPostForm({
  defaultTitle,
  defaultUrl,
}: {
  defaultTitle?: string;
  defaultUrl?: string;
}) {
  const [state, action, isPending] = useActionState(newPostAction, null);
  const [isUrlPending, startUrlTransition] = useTransition();
  const id = useId();
  const [title, setTitle] = useState<TitleState>({
    value: defaultTitle ?? "",
    isAutomaticallyFetched: false,
  });
  const [url, setUrl] = useState(defaultUrl ?? "");

  function updateTitleFromUrl(url: string) {
    startUrlTransition(async () => {
      const newTitle = await fetchTitleFromUrl(url);
      if (newTitle) {
        setTitle({
          value: newTitle,
          isAutomaticallyFetched: true,
          previousTitle: title.value,
        });
      }
    });
  }

  return (
    <form
      action={action}
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => {
          action(new FormData(e.currentTarget));
        });
      }}
      className="flex flex-col gap-3"
    >
      <div>
        <Label htmlFor={`${id}-title`}>Title</Label>
        <div className="relative">
          <Input
            name="title"
            className="pr-10"
            id={`${id}-title`}
            value={title.value}
            onChange={(e) => {
              setTitle({
                value: e.currentTarget.value,
                isAutomaticallyFetched: false,
              });
            }}
            disabled={isUrlPending}
          />
          {!isUrlPending && !url ? null : (
            <div className="absolute right-0 top-0">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  if (title.isAutomaticallyFetched) {
                    // Undo automatic title fetching and revert to previous title
                    setTitle({
                      value: title.previousTitle,
                      isAutomaticallyFetched: false,
                    });
                  } else {
                    // Refetch title from URL
                    updateTitleFromUrl(url);
                  }
                }}
                disabled={
                  !url || isUrlPending || isPending || !URL.canParse(url)
                }
                aria-busy={isUrlPending}
                title="Fetch title from URL"
              >
                {isUrlPending ? (
                  <Spinner />
                ) : url ? (
                  title.isAutomaticallyFetched ? (
                    <ResetIcon />
                  ) : (
                    <ReloadIcon />
                  )
                ) : null}
              </Button>
            </div>
          )}
        </div>
        <InputLengthIndicator
          length={title.value.length}
          maxLength={MAX_POST_TITLE_LENGTH}
        />
      </div>
      <div>
        <Label htmlFor={`${id}-url`}>URL</Label>
        <Input
          name="url"
          id={`${id}-url`}
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.currentTarget.value);
            if (!title.value) {
              updateTitleFromUrl(e.currentTarget.value);
            }
          }}
        />
        <InputLengthIndicator
          length={url.length}
          maxLength={MAX_POST_URL_LENGTH}
        />
      </div>
      <Button
        type="submit"
        disabled={
          isPending ||
          title.value.length > MAX_POST_TITLE_LENGTH ||
          url.length > MAX_POST_URL_LENGTH
        }
      >
        {isPending ? <Spinner className="mr-2" /> : null} Submit
      </Button>
      {state?.error ? (
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
    </form>
  );
}

async function fetchTitleFromUrl(url: string) {
  if (!url || !URL.canParse(url)) {
    return null;
  }
  const response = await fetch(
    "/api/fetch-link-og?url=" + encodeURIComponent(url),
  );
  if (!response.ok) {
    throw new Error("Failed to fetch title");
  }
  const data = (await response.json()) as ApiRouteResponse<
    typeof GetFetchLinkOgApiRoute
  >;
  return data.title;
}
