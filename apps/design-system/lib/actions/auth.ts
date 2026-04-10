"use server";

import { cookies } from "next/headers";
import { db } from "@/lib/db/store";
import type { UserProfileData } from "@/lib/db/schema";

const COOKIE_NAME = "fp_user";

export async function getActiveUser(): Promise<UserProfileData | null> {
  const jar = await cookies();
  const username = jar.get(COOKIE_NAME)?.value;
  if (!username) return null;
  return db.getUser(username) ?? null;
}

export async function getActiveUsername(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COOKIE_NAME)?.value ?? null;
}

export async function setActiveUser(username: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, username, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
  });
}

export async function clearActiveUser(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getTeamUsers() {
  return db.getTeamUsers();
}
