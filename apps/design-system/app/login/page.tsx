import { redirect } from "next/navigation";
import { getActiveUsername, getTeamUsers } from "@/lib/actions/auth";
import { LoginClient } from "./login-client";

export const metadata = {
  title: "Sign In • Frontpage",
};

export default async function LoginPage() {
  const current = await getActiveUsername();
  if (current) redirect("/explorations/community-feed");

  const users = await getTeamUsers();

  return <LoginClient users={users.map((u) => ({
    username: u.username,
    displayName: u.displayName,
    avatarUrl: u.avatarUrl,
    initials: u.initials,
    avatarBg: u.avatarBg,
  }))} />;
}
