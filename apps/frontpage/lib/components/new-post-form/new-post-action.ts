"use server";

import { createPost } from "@/lib/api/post";
import { getVerifiedHandle } from "@/lib/data/atproto/identity";
import {
  MAX_POST_TITLE_LENGTH,
  MAX_POST_URL_LENGTH,
} from "@/lib/data/db/constants";
import { DataLayerError } from "@/lib/data/error";
import { ensureUser } from "@/lib/data/user";
import { redirect } from "next/navigation";

export async function newPostAction(_prevState: unknown, formData: FormData) {
  "use server";
  const user = await ensureUser();
  const title = formData.get("title");
  const url = formData.get("url");

  if (typeof title !== "string" || typeof url !== "string" || !title || !url) {
    return { error: "Provide a title and url." };
  }

  if (title.length > MAX_POST_TITLE_LENGTH) {
    return { error: "Title too long" };
  }

  if (!URL.canParse(url) || url.length > MAX_POST_URL_LENGTH) {
    return { error: "Invalid URL" };
  }

  try {
    const [{ rkey }, handle] = await Promise.all([
      createPost({ authorDid: user.did, title, url }),
      getVerifiedHandle(user.did),
    ]);

    redirect(`/post/${handle ?? user.did}/${rkey}`);
  } catch (error) {
    if (!(error instanceof DataLayerError)) throw error;
    return { error: "Failed to create post" };
  }
}
