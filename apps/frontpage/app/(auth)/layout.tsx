import { Card } from "@/lib/components/ui/card";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center py-[10vh] px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6">{children}</Card>
    </div>
  );
}
