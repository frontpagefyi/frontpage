import { getProfile, getProfilePosts } from "@/lib/actions/users";
import { getSavedPosts } from "@/lib/actions/posts";
import { getActiveUsername } from "@/lib/actions/auth";
import { ProfileClient } from "./profile-client";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return {
    title: `${username} • Frontpage`,
  };
}

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { username } = await params;
  const { tab } = await searchParams;
  const profile = await getProfile(username);
  if (!profile) notFound();

  const activeUsername = await getActiveUsername();
  const isOwnProfile = activeUsername === username;

  const posts = await getProfilePosts(username);
  const savedPosts = isOwnProfile ? await getSavedPosts() : [];

  return (
    <ProfileClient
      profile={profile}
      posts={posts}
      savedPosts={savedPosts}
      isOwnProfile={isOwnProfile}
      initialTab={tab === "saved" ? "saved" : undefined}
    />
  );
}
