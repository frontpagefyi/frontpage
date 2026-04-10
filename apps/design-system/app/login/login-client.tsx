"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { setActiveUser } from "@/lib/actions/auth";
import { Loader2 } from "lucide-react";

interface UserOption {
  username: string;
  displayName: string;
  avatarUrl?: string;
  initials: string;
  avatarBg: string;
}

export function LoginClient({ users }: { users: UserOption[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleSelect = (username: string) => {
    setSelected(username);
    startTransition(async () => {
      await setActiveUser(username);
      router.push("/explorations/community-feed");
    });
  };

  return (
    <div className="min-h-dvh bg-bg-base text-text-primary flex items-center justify-center px-4">
      <div
        className="w-full max-w-sm"
        style={{ animation: "composer-enter 0.4s cubic-bezier(0.4, 0, 0.2, 1) both" }}
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-bold">Welcome to Frontpage</h1>
          <p className="text-sm text-text-muted mt-2">Pick a profile to get started</p>
        </div>

        <div className="space-y-2">
          {users.map((user) => (
            <button
              key={user.username}
              onClick={() => handleSelect(user.username)}
              disabled={pending}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border transition-all ${
                selected === user.username
                  ? "border-accent-secondary bg-accent-secondary/10"
                  : "border-bg-elevated bg-bg-surface hover:border-[oklch(100%_0_0_/_0.12)] hover:shadow-[0_2px_12px_oklch(0%_0_0_/_0.1)]"
              } ${pending && selected !== user.username ? "opacity-50" : ""}`}
            >
              <Avatar
                initials={user.initials}
                bg={user.avatarBg}
                src={user.avatarUrl}
                size={40}
              />
              <div className="text-left flex-1">
                <p className="text-sm font-bold">{user.displayName}</p>
                <p className="text-xs text-text-muted">@{user.username}</p>
              </div>
              {pending && selected === user.username ? (
                <Loader2 size={16} className="animate-spin text-accent-secondary" />
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
