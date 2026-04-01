import { getSession, signOut } from "@/lib/auth";
import Link from "next/link";
import { Suspense } from "react";
import { isAdmin } from "@/lib/data/user";
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
import { FRONTPAGE_ATPROTO_HANDLE } from "@/lib/constants";
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

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If the current session has different scopes than the AUTH_SCOPES, redirect to reauthenticate
  // Don't redirect if the request is for the reauthenticate page or oauth callback
  if (session && session.scope !== AUTH_SCOPES) {
    redirect("/reauthenticate");
  }

  return (
    <div style={{ background: "#c0c0c0", minHeight: "100vh", fontFamily: "'Comic Sans MS', cursive" }}>
      {/* Marquee banner */}
      <div style={{ background: "#000080", color: "#ffff00", padding: "2px 0", overflow: "hidden", fontSize: "12px" }}>
        <div className="animate-marquee whitespace-nowrap inline-block">
          &nbsp;&nbsp;&nbsp;🌐 Welcome to FRONTPAGE.FYI — Your #1 Source for Links on the Information Superhighway! 🔥 Best viewed in Netscape Navigator 3.0 at 800x600 resolution 💾 NEW POSTS ADDED DAILY 🎉 You are visitor #1,337,420 &nbsp;&nbsp;&nbsp;
        </div>
      </div>

      {/* Window chrome */}
      <div style={{ maxWidth: "760px", margin: "12px auto", border: "2px solid #000" }}>

        {/* Title bar */}
        <div className="titlebar">
          <span>🌐 Frontpage.fyi — The Web&apos;s Best Links</span>
          <div style={{ display: "flex", gap: "4px" }}>
            <button style={{ width: "16px", height: "14px", background: "#c0c0c0", border: "1px solid #000", fontSize: "9px", lineHeight: 1, cursor: "pointer", color: "#000" }} aria-hidden>_</button>
            <button style={{ width: "16px", height: "14px", background: "#c0c0c0", border: "1px solid #000", fontSize: "9px", lineHeight: 1, cursor: "pointer", color: "#000" }} aria-hidden>□</button>
            <button style={{ width: "16px", height: "14px", background: "#c0c0c0", border: "1px solid #000", fontSize: "9px", lineHeight: 1, cursor: "pointer", color: "#000" }} aria-hidden>✕</button>
          </div>
        </div>

        {/* Menu bar */}
        <div style={{ background: "#d4d0c8", borderBottom: "1px solid #808080", padding: "2px 6px", display: "flex", gap: "16px", fontSize: "13px" }}>
          {["File", "Edit", "View", "Go", "Bookmarks", "Options", "Help"].map((item) => (
            <span key={item} style={{ cursor: "default", textDecoration: "underline", color: "#000" }}>{item}</span>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ background: "#d4d0c8", borderBottom: "2px solid #808080", padding: "4px 6px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/frontpage-logo.svg" alt="Frontpage" style={{ height: "36px", imageRendering: "pixelated" }} />
          </Link>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "11px", color: "#000" }}>Location:</span>
            <div className="win95-inset" style={{ flex: 1, background: "#fff", padding: "2px 4px", fontSize: "12px", fontFamily: "monospace", color: "#000080" }}>
              http://www.frontpage.fyi/
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {session ? (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="win95-btn">📝 New Post</button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New post</DialogTitle>
                  </DialogHeader>
                  <NewPostForm />
                </DialogContent>
              </Dialog>
            ) : null}
            <Suspense>
              <LoginOrLogout />
            </Suspense>
          </div>
        </div>

        {/* Main content area */}
        <div style={{ background: "#d4d0c8", padding: "8px" }}>
          {/* Page header banner */}
          <div className="win95-raised" style={{ background: "#000080", color: "#ffffff", padding: "6px 10px", marginBottom: "8px", textAlign: "center" }}>
            <span style={{ fontFamily: "'Comic Sans MS', cursive", fontSize: "20px", fontWeight: "bold", letterSpacing: "2px" }}>
              ★ FRONTPAGE.FYI ★
            </span>
            <div style={{ fontSize: "11px", marginTop: "2px", color: "#ffff00" }}>
              A Federated Link Aggregator for the Information Superhighway
            </div>
          </div>

          <hr style={{ margin: "6px 0" }} />

          <div style={{ marginBottom: "8px" }}>{children}</div>

          <hr style={{ margin: "8px 0" }} />
        </div>

        {/* Status bar */}
        <div style={{ background: "#d4d0c8", borderTop: "2px solid #fff", padding: "2px 6px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#000" }}>
          <div className="win95-inset" style={{ padding: "1px 6px", fontSize: "11px" }}>
            Made by{" "}
            <a
              href={`https://bsky.app/profile/${FRONTPAGE_ATPROTO_HANDLE}`}
              style={{ color: "#0000ee", textDecoration: "underline" }}
            >
              @frontpage.fyi
            </a>
          </div>
          <div className="win95-inset" style={{ padding: "1px 6px", fontSize: "11px" }}>
            🌐 Document: Done
          </div>
        </div>

      </div>

      {/* Under construction footer */}
      <div style={{ textAlign: "center", padding: "8px", fontSize: "11px", color: "#404040" }}>
        ⚠️ This site is Under Construction ⚠️ | Best viewed at 800×600 | © 1997 Frontpage.fyi
      </div>
    </div>
  );
}

async function LoginOrLogout() {
  const session = await getSession();

  if (!session) {
    return (
      <Link href="/login">
        <button className="win95-btn">🔑 Login</button>
      </Link>
    );
  }

  const handle = await getVerifiedHandle(session.did);

  return (
    <>
      <NotificationIndicator>
        <Link href="/notifications" aria-label="Notifications">
          <button className="win95-btn" style={{ minWidth: "auto", padding: "3px 8px" }}>🔔</button>
        </Link>
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
