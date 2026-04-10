"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Users, Check } from "lucide-react";
import { toggleJoin } from "@/lib/actions/communities";

interface DiscoverCommunity {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  banner: {
    bannerImage?: string;
    members: string;
    online: number;
  };
}

export function DiscoverList({
  communities,
  initialJoined,
}: {
  communities: DiscoverCommunity[];
  initialJoined: Set<string>;
}) {
  const router = useRouter();
  const [joined, setJoined] = useState(initialJoined);
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();

  const handleJoin = (e: React.MouseEvent, communityId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setPending((p) => new Set([...p, communityId]));
    startTransition(async () => {
      const isJoined = await toggleJoin(communityId);
      setJoined((prev) => {
        const next = new Set(prev);
        if (isJoined) next.add(communityId);
        else next.delete(communityId);
        return next;
      });
      setPending((p) => { const next = new Set(p); next.delete(communityId); return next; });
    });
  };

  const handleCardClick = (communityId: string) => {
    router.push(`/explorations/community-feed?community=${communityId}`);
  };

  return (
    <div className="space-y-4">
      {communities.map((community) => {
        const isJoined = joined.has(community.id);
        const isPending = pending.has(community.id);
        const isHome = community.id === "comm_home";

        return (
          <div
            key={community.id}
            onClick={() => handleCardClick(community.id)}
            className="block rounded-xl bg-bg-surface border border-bg-elevated overflow-hidden hover:translate-y-[-2px] hover:border-[oklch(100%_0_0_/_0.12)] hover:shadow-[0_4px_20px_oklch(0%_0_0_/_0.15)] motion-safe:transition-all motion-safe:duration-200 cursor-pointer"
          >
            {community.banner.bannerImage ? (
              <div className="relative h-32">
                <Image
                  src={community.banner.bannerImage}
                  alt={community.name}
                  fill
                  sizes="768px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-surface/80 to-transparent" />
              </div>
            ) : null}

            <div className="px-5 pb-5 -mt-8 relative">
              <div className="flex items-end gap-3 mb-3">
                {community.icon ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden ring-4 ring-bg-surface shrink-0">
                    <Image
                      src={community.icon}
                      alt={community.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif text-lg font-bold leading-tight">
                    {community.name}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
                    <span className="flex items-center gap-1">
                      <Users size={11} /> {community.banner.members} members
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-success inline-block" />
                      {community.banner.online} online
                    </span>
                  </div>
                </div>
                {!isHome ? (
                  <button
                    onClick={(e) => handleJoin(e, community.id)}
                    disabled={isPending}
                    className={`relative shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold overflow-hidden active:scale-[0.95] ${isPending ? "opacity-60" : ""}`}
                    style={{ transition: "transform 0.2s" }}
                  >
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, oklch(40% 0.08 259), oklch(45% 0.1 290), oklch(42% 0.07 259))",
                        boxShadow: isJoined ? "none" : "inset 0 1px 0 oklch(100% 0 0 / 0.1), 0 1px 8px oklch(45% 0.1 290 / 0.3)",
                        opacity: isJoined ? 0 : 1,
                        transition: "opacity 0.4s ease",
                      }}
                    />
                    <span
                      className="absolute inset-0 rounded-full border border-text-muted/30 bg-bg-surface/40"
                      style={{
                        opacity: isJoined ? 1 : 0,
                        transition: "opacity 0.4s ease",
                      }}
                    />
                    <span
                      className="relative z-10 flex items-center gap-1"
                      style={{
                        color: isJoined ? "var(--color-text-secondary)" : "white",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {isJoined ? <><Check size={12} /> Joined</> : "Join"}
                    </span>
                  </button>
                ) : null}
              </div>

              {community.description ? (
                <p className="text-sm text-text-secondary leading-relaxed">
                  {community.description}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
