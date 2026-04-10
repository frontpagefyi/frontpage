import { getCommunities } from "@/lib/actions/communities";
import { getPostsByCommunity, getThread } from "@/lib/actions/posts";
import { FeedClient } from "./feed-client";

export default async function CommunityFeedPage({
  searchParams,
}: {
  searchParams: Promise<{ community?: string; post?: string }>;
}) {
  const params = await searchParams;
  const communities = await getCommunities();

  const communityId = params.community ?? communities[0]?.id ?? "comm_home";
  const initialIndex = Math.max(0, communities.findIndex((c) => c.id === communityId));

  const initialPosts = await getPostsByCommunity(communityId);
  const initialComments = params.post
    ? await getThread(params.post)
    : [];

  return (
    <FeedClient
      communities={communities}
      initialPosts={initialPosts}
      initialIndex={initialIndex}
      initialPostId={params.post}
      initialComments={initialComments}
    />
  );
}
