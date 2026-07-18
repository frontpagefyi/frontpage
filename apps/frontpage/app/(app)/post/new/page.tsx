import { NewPostForm } from "@/lib/components/new-post-form/new-post-form";
import { Suspense } from "react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "New post | Frontpage",
  robots: "noindex, nofollow",
};

export default function NewPostPage(props: PageProps<"/post/new">) {
  return (
    <main className="flex flex-col gap-3">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        New post
      </h2>
      <Suspense fallback={null}>
        <NewPostFormWithParams searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}

async function NewPostFormWithParams({
  searchParams,
}: {
  searchParams: PageProps<"/post/new">["searchParams"];
}) {
  const params = await searchParams;
  const defaultTitle =
    typeof params.title === "string"
      ? params.title
      : params.title?.[0];

  const defaultUrl =
    typeof params.url === "string"
      ? params.url
      : params.url?.[0];
  return <NewPostForm defaultTitle={defaultTitle} defaultUrl={defaultUrl} />;
}
