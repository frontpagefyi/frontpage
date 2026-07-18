import Link from "next/link";
import { listBlogs, WHTWND_BLOG_COLLECTION } from "./blog-data";
import { BackLink } from "./_components";
import { Card, CardFooter, CardHeader } from "@/lib/components/ui/card";
import { Badge } from "@/lib/components/ui/badge";
import { UserAvatar } from "@/lib/components/user-avatar";
import { TimeAgo } from "@/lib/components/time-ago";
import { cacheLife } from "next/cache";
import { publicConfig } from "@/lib/config/public-config";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function Blog() {
  "use cache";
  cacheLife("minutes");
  const blogList = await listBlogs();
  return (
    <>
      <link
        rel="alternate"
        href={`at://${publicConfig.NEXT_PUBLIC_FRONTPAGE_DID}/${WHTWND_BLOG_COLLECTION}`}
      />
      <title>Frontpage Blog</title>

      <BackLink href="/">Home</BackLink>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 my-8">
        Frontpage Blog
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {blogList.map((post) => (
          <Link key={post.uri.rkey} href={`/blog/${post.slug}`}>
            <Card className="h-full">
              <CardHeader className="grow">
                <TimeAgo
                  createdAt={post.value.createdAt}
                  className="text-sm text-muted-foreground"
                />
                <h2 className="text-xl font-semibold line-clamp-2">
                  {post.value.title}
                </h2>
              </CardHeader>
              <CardFooter className="flex gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {post.additionalAuthors.length === 0 ? (
                      <UserAvatar
                        did={publicConfig.NEXT_PUBLIC_FRONTPAGE_DID}
                        size="small"
                      />
                    ) : (
                      post.additionalAuthors.map((author) => (
                        <UserAvatar did={author} size="small" key={author} />
                      ))
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
