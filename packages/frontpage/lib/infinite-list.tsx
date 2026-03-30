"use client";

import useSWRInfinite, { unstable_serialize } from "swr/infinite";
import { createContext, Fragment, type ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import { mutate, SWRConfig } from "swr";
import { Spinner } from "@/lib/components/ui/spinner";

export type Page<TCursor> = {
  content: ReactNode;
  nextCursor: TCursor | null;
  pageSize: number;
};

type Props<TCursor> = {
  getMoreItemsAction: (cursor: TCursor | null) => Promise<Page<TCursor>>;
  emptyMessage: string;
  cacheKey: string;
  fallback: Page<TCursor> | Promise<Page<TCursor>>;
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
      <InfinteListInner {...props} />
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

function InfinteListInner<TCursor>({
  getMoreItemsAction,
  emptyMessage,
  cacheKey,
  revalidateAll = false,
}: Omit<Props<TCursor>, "fallback">) {
  const { data, size, setSize, mutate, isValidating } = useSWRInfinite(
    (_, previousPageData: Page<TCursor> | null) => {
      if (previousPageData && !previousPageData.pageSize) return null; // reached the end
      return [cacheKey, previousPageData?.nextCursor ?? null];
    },
    ([_, cursor]) => {
      return getMoreItemsAction(cursor);
    },
    { revalidateOnMount: false, revalidateAll },
  );
  const { ref: inViewRef } = useInView({
    onChange: (inView) => {
      if (inView && !isValidating) {
        void setSize(size + 1);
      }
    },
  });

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
          <Fragment key={String(page.nextCursor)}>
            <InfiniteListContext.Provider
              value={{
                revalidatePage: async () => {
                  const currentCursor = pages[indx - 1]?.nextCursor;
                  await mutate(data, {
                    revalidate: (_data, args) =>
                      !currentCursor ||
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
                      (args as any)[1] === currentCursor,
                  });
                },
              }}
            >
              {page.content}
            </InfiniteListContext.Provider>

            {indx === pages.length - 1 ? (
              page.pageSize === 0 ? (
                <p className="text-center text-gray-400">{emptyMessage}</p>
              ) : (
                <div ref={inViewRef} className="flex flex-col items-center gap-2 py-4 text-gray-400">
                  <Spinner className="h-5 w-5" />
                  <p className="text-sm">Loading more posts...</p>
                </div>
              )
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}
