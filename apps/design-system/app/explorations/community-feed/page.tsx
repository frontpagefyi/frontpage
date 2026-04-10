import { redirect } from "next/navigation";
import { getCommunities, getJoinedCommunities } from "@/lib/actions/communities";
import { getPostsByCommunity, getThread } from "@/lib/actions/posts";
import { getActiveUser } from "@/lib/actions/auth";
import { FeedClient } from "./feed-client";

export const metadata = {
  title: "Community Feed • Frontpage",
};

export default async function CommunityFeedPage({
  searchParams,
}: {
  searchParams: Promise<{ community?: string; post?: string; sort?: string }>;
}) {
  const user = await getActiveUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const allCommunities = await getCommunities();
  const joinedCommunities = await getJoinedCommunities();

  // Sidebar shows joined communities (+ Frontpage home always)
  const home = allCommunities.find((c) => c.id === "comm_home");
  const sidebarCommunities = home
    ? [home, ...joinedCommunities.filter((c) => c.id !== "comm_home")]
    : joinedCommunities;

  const communityId = params.community ?? "comm_home";
  const activeCommunity = allCommunities.find((c) => c.id === communityId) ?? sidebarCommunities[0];

  const initialPosts = await getPostsByCommunity(communityId);
  const initialComments = params.post
    ? await getThread(params.post)
    : [];

  return (
    <FeedClient
      communities={sidebarCommunities}
      activeCommunity={activeCommunity}
      initialPosts={initialPosts}
      initialPostId={params.post}
      initialComments={initialComments}
      initialSort={(params.sort as "hot" | "new" | "top") ?? "hot"}
      activeUser={{
        username: user.username,
        displayName: user.displayName,
        initials: user.initials,
        avatarBg: user.avatarBg,
        avatarUrl: user.avatarUrl,
      }}
    />
  );
}
