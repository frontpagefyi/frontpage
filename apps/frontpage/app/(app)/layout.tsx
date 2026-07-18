import { getSession, signOut } from "@/lib/auth";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/lib/components/ui/button";
import { isAdmin } from "@/lib/data/user";
import { BellIcon } from "@radix-ui/react-icons";
import { ThemeToggleMenuGroup } from "./_components/theme-toggle";
import { getVerifiedHandle } from "@/lib/data/atproto/identity";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import { UserAvatar } from "@/lib/components/user-avatar";
import { revalidatePath } from "next/cache";
import { NotificationIndicator } from "./_components/notification-indicator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/components/ui/dialog";
import { AUTH_SCOPES } from "@repo/frontpage-oauth";
import { redirect } from "next/navigation";
import { NewPostForm } from "@/lib/components/new-post-form/new-post-form";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 md:px-6 pt-4 pb-8 md:py-12 max-w-3xl">
      {/* Scope guard: redirects to /reauthenticate if OAuth scopes are outdated */}
      <Suspense>
        <ScopeGuard />
      </Suspense>
      <div className="flex place-content-between items-center mb-8">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/frontpage-logo.svg" alt="Frontpage" className="h-12" />
        </Link>

        <div className="flex items-center gap-4">
          <Suspense>
            <LoginOrLogout />
          </Suspense>
        </div>
      </div>

      <div className="mb-6">{children}</div>
    </div>
  );
}

async function ScopeGuard() {
  const session = await getSession();
  // If the current session has different scopes than AUTH_SCOPES, redirect to reauthenticate.
  // Don't redirect if the request is for the reauthenticate page or oauth callback.
  if (session && session.scope !== AUTH_SCOPES) {
    redirect("/reauthenticate");
  }
  return null;
}

async function LoginOrLogout() {
  const session = await getSession();

  if (!session) {
    return (
      <Button variant="outline" asChild>
        <Link href="/login">Login</Link>
      </Button>
    );
  }

  // "New post" button is rendered here (session-gated) rather than in the layout
  // function so the nav bar static shell has no blocking session reads.
  const newPostButton = (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New post</DialogTitle>
        </DialogHeader>
        <NewPostForm />
      </DialogContent>
    </Dialog>
  );

  const handle = await getVerifiedHandle(session.did);

  return (
    <>
      {newPostButton}
      <NotificationIndicator>
        <Button asChild variant="outline" size="icon">
          <Link href="/notifications" aria-label="Notifications">
            <BellIcon />
          </Link>
        </Button>
      </NotificationIndicator>
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="User menu">
          <UserAvatar did={session.did} size="smedium" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side="bottom" align="end">
          <DropdownMenuLabel className="truncate">
            {handle ?? "handle.invalid"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={`/profile/${handle ?? session.did}`}
              className="cursor-pointer"
            >
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/about" className="cursor-pointer">
              About
            </Link>
          </DropdownMenuItem>
          <Suspense fallback={null}>
            {isAdmin().then((isAdmin) =>
              isAdmin ? (
                <DropdownMenuItem asChild>
                  <Link href="/moderation" className="cursor-pointer">
                    Moderation
                  </Link>
                </DropdownMenuItem>
              ) : null,
            )}
          </Suspense>
          <ThemeToggleMenuGroup />
          <DropdownMenuSeparator />
          <form
            action={async () => {
              "use server";
              await signOut();
              revalidatePath("/", "layout");
            }}
          >
            <DropdownMenuItem asChild>
              <button
                type="submit"
                className="w-full text-start cursor-pointer"
              >
                Logout
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
