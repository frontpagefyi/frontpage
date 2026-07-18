import { NewPostForm } from "@/lib/components/new-post-form/new-post-form";
import { type Metadata } from "next";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata: Metadata = {
  title: "New post | Frontpage",
  robots: "noindex, nofollow",
};

export default async function NewPostPage(props: PageProps<"/post/new">) {
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
