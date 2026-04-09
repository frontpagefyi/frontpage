import { getCommunities } from "@/lib/actions/communities";
import { getPostsByCommunity } from "@/lib/actions/posts";
import { FeedClient } from "./feed-client";

export default async function CommunityFeedPage() {
  const communities = await getCommunities();
  const initialPosts = communities.length > 0
    ? await getPostsByCommunity(communities[0].id)
    : [];

  return (
    <FeedClient
      communities={communities}
      initialPosts={initialPosts}
    />
  );
}
