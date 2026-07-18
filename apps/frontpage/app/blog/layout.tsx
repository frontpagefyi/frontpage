// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container mx-auto px-4 md:px-6 py-12 max-w-3xl">
      {children}
    </main>
  );
}
