"use client";

import useSWRInfinite, { unstable_serialize } from "swr/infinite";
import { createContext, Fragment, type ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import { mutate, SWRConfig } from "swr";
import { Spinner } from "@/lib/components/ui/spinner";

export type Page<TCursor> = {
  content: ReactNode;
  nextCursor: TCursor | null;
  itemCount: number;
};

type Props<TCursor> = {
  getMoreItemsAction: (cursor: TCursor | null) => Promise<Page<TCursor>>;
  emptyMessage: string;
  cacheKey: string;
  fallback: Page<TCursor>;
  revalidateAll?: boolean;
};

export function revalidateInfiniteListPage<TCursor>(
  cacheKey: string,
  cursor: TCursor | null,
) {
  return mutate(unstable_serialize(() => [cacheKey, cursor]));
}

export function InfiniteList<TCursor>({ fallback, ...props }: Props<TCursor>) {
  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(() => [props.cacheKey, null])]: [fallback],
        },
      }}
    >
      <InfiniteListInner {...props} />
    </SWRConfig>
  );
}

export const InfiniteListContext = createContext<{
  revalidatePage: () => Promise<void>;
}>({
  revalidatePage: () => {
    throw new Error(
      "Cannot call InfiniteListContext.revalidate when not inside of an InfiniteList",
    );
  },
});

function InfiniteListInner<TCursor>({
  getMoreItemsAction,
  emptyMessage,
  cacheKey,
  revalidateAll = false,
}: Omit<Props<TCursor>, "fallback">) {
  const { data, size, setSize, mutate, isValidating, error } = useSWRInfinite(
    (_, previousPageData: Page<TCursor> | null) => {
      if (previousPageData && previousPageData.nextCursor === null) return null;
      return [cacheKey, previousPageData?.nextCursor ?? null];
    },
    ([_, cursor]) => {
      return getMoreItemsAction(cursor);
    },
    {
      revalidateOnMount: false,
      revalidateAll,
      onError: (err: unknown) => {
        console.error("Feed pagination error:", err);
      },
    },
  );
  const { ref: inViewRef } = useInView({
    onChange: (inView) => {
      if (inView && !isValidating) {
        void setSize(size + 1);
      }
    },
  });

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-gray-500">
        <p>Failed to load posts.</p>
        <button
          onClick={() => void mutate()}
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  const pages = data;

  return (
    <div className="space-y-6">
      {pages.map((page, indx) => {
        return (
          <Fragment key={String(pages[indx - 1]?.nextCursor ?? "initial")}>
            <InfiniteListContext.Provider
              value={{
                revalidatePage: async () => {
                  const currentCursor = pages[indx - 1]?.nextCursor;
                  await mutate(data, {
                    revalidate: (_data, key) =>
                      !currentCursor ||
                      (Array.isArray(key) && key[1] === currentCursor),
                  });
                },
              }}
            >
              {page.content}
            </InfiniteListContext.Provider>

            {indx === pages.length - 1 ? (
              page.nextCursor ? (
                <div
                  ref={inViewRef}
                  className="flex flex-col items-center gap-2 py-4 text-gray-400"
                >
                  <Spinner className="h-5 w-5" />
                  <p className="text-sm">Loading more posts...</p>
                </div>
              ) : page.itemCount === 0 && indx === 0 ? (
                <p className="text-center text-gray-400">{emptyMessage}</p>
              ) : (
                <p className="py-4 text-center text-sm text-gray-400">
                  You&apos;ve reached the end
                </p>
              )
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}
