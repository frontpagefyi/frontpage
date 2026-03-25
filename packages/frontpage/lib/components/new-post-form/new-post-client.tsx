"use client";

import {
  type ReactNode,
  startTransition,
  useActionState,
  useId,
  useState,
  useTransition,
} from "react";
import { newPostAction } from "./new-post-action";
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
import { SimpleTooltip } from "@/lib/components/ui/tooltip";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";

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

export function NewPostFormWrapper({ children }: { children: ReactNode }) {
  const [state, action, isPending] = useActionState(newPostAction, null);

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
      {children}
      <Button type="submit" disabled={isPending}>
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

export type NewPostFieldsProps = {
  defaultTitle?: string;
  defaultUrl?: string;
};

export function NewPostFields({
  defaultTitle,
  defaultUrl,
}: NewPostFieldsProps) {
  const id = useId();
  const [title, setTitle] = useState(defaultTitle ?? "");
  const [url, setUrl] = useState(defaultUrl ?? "");
  return (
    <>
      <div>
        <Label htmlFor={`${id}-title`}>Title</Label>
        <Input
          name="title"
          id={`${id}-title`}
          value={title}
          onChange={(e) => {
            setTitle(e.currentTarget.value);
          }}
        />
        <InputLengthIndicator
          length={title.length}
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
          }}
        />
        <InputLengthIndicator
          length={url.length}
          maxLength={MAX_POST_URL_LENGTH}
        />
      </div>
    </>
  );
}

export function NewPostFields_autoTitleUi({
  defaultTitle,
  defaultUrl,
}: NewPostFieldsProps) {
  const formStatus = useFormStatus();
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
    <>
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
              <SimpleTooltip
                content={
                  title.isAutomaticallyFetched ? "Undo" : "Fetch title from URL"
                }
              >
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
                  // We are not disabling the button when isUrlPending so that focus is preserved when the user clicks the button
                  // It's ok to disable it in other cases because the user has almost certainly focused something other than this button at the time
                  disabled={!url || formStatus.pending || !URL.canParse(url)}
                  aria-busy={isUrlPending}
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
              </SimpleTooltip>
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
              // If title is empty, automatically fetch title from URL as user types/pastes URL
              updateTitleFromUrl(e.currentTarget.value);
            }
          }}
        />
        <InputLengthIndicator
          length={url.length}
          maxLength={MAX_POST_URL_LENGTH}
        />
      </div>
    </>
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
    console.error(`Failed to fetch title from URL: ${url}`);
    toast.error(
      "Failed to fetch URL metadata, please check the URL and try again or enter the title manually.",
    );
    return null;
  }
  const data = (await response.json()) as ApiRouteResponse<
    typeof GetFetchLinkOgApiRoute
  >;
  return data.title;
}
