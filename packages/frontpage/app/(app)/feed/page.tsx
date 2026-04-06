import { isDid } from "@/lib/data/atproto/did";
import { getVerifiedHandle } from "@/lib/data/atproto/identity";
import { resolveFeed } from "@/lib/data/feed-resolver";
import { getMoreFeedPostsAction } from "@/lib/feed-action";
import { InfiniteList } from "@/lib/infinite-list";
import { AtUri } from "@atproto/syntax";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function FeedPage({ searchParams }: PageProps<"/feed">) {
  let uriParam = (await searchParams).uri;
  uriParam = Array.isArray(uriParam) ? uriParam[0] : uriParam;
  if (!uriParam) {
    redirect("/feed/hot");
  }
  let uri;
  try {
    uri = new AtUri(uriParam);
  } catch (_) {
    return <div className="p-4">Invalid URI</div>;
  }

  const [initialData, feedResult] = await Promise.all([
    getMoreFeedPostsAction(uri.toString(), null),
    resolveFeed(uri),
  ]);

  if (!feedResult.ok) {
    return (
      <div className="p-4">Error loading feed: {feedResult.error.message}</div>
    );
  }

  const handle = isDid(uri.host)
    ? ((await getVerifiedHandle(uri.host)) ?? "handle.invalid")
    : uri.host;

  const { displayName, description } = feedResult.data;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{displayName}</h1>
        <sub className="text-sm">
          <Link
            href={`/profile/${uri.host}`}
            className="text-indigo-600 hover:underline dark:text-indigo-400"
          >
            @{handle}
          </Link>
        </sub>
        {description ? <p className="text-gray-600">{description}</p> : null}
      </div>
      <InfiniteList
        cacheKey={`feed:${uri.toString()}`}
        getMoreItemsAction={getMoreFeedPostsAction.bind(null, uri.toString())}
        fallback={initialData}
        emptyMessage="No posts in this feed"
      />
    </div>
  );
}
