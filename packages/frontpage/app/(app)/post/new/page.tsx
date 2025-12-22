import { type Metadata } from "next";
import { NewPostForm } from "./_client";

export const metadata: Metadata = {
  title: "New post | Frontpage",
  robots: "noindex, nofollow",
};

export default async function NewPost(props: PageProps<"/post/new">) {
  const searchParams = await props.searchParams;
  const defaultTitle =
    typeof searchParams.title === "string"
      ? searchParams.title
      : searchParams.title?.[0];

  const defaultUrl =
    typeof searchParams.url === "string"
      ? searchParams.url
      : searchParams.url?.[0];
  return (
    <main className="flex flex-col gap-3">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        New post
      </h2>
      <NewPostForm defaultTitle={defaultTitle} defaultUrl={defaultUrl} />
    </main>
  );
}
