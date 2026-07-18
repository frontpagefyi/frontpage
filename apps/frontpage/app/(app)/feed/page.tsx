import { getFeed } from "@/lib/data/feed-resolver";
import { AtUri } from "@atproto/syntax";
import { redirect } from "next/navigation";

// Deliberate block: reads searchParams to redirect or fetch a feed by URI.
export const instant = false;

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

  const posts = await getFeed(uri);

  return <pre>{JSON.stringify(posts, null, 2)}</pre>;
}
