import { getProfile, getProfilePosts } from "@/lib/actions/users";
import { ProfileClient } from "./profile-client";
import { notFound } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfile(username);
  if (!profile) notFound();

  const posts = await getProfilePosts(username);

  return <ProfileClient profile={profile} posts={posts} />;
}
