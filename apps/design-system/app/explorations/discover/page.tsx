import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCommunities, getJoinedCommunities } from "@/lib/actions/communities";
import { DiscoverList } from "./discover-client";

export const metadata = {
  title: "Discover Communities • Frontpage",
};

export default async function DiscoverPage() {
  const communities = await getCommunities();
  const joined = await getJoinedCommunities();
  const joinedIds = new Set(joined.map((c) => c.id));

  return (
    <div className="min-h-dvh bg-bg-base text-text-primary">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/explorations/community-feed"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors mb-4 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to feed
          </Link>
          <h1 className="font-serif text-3xl font-bold">Discover Communities</h1>
          <p className="text-sm text-text-secondary mt-2">
            Find your people across the atmosphere.
          </p>
        </div>

        <DiscoverList communities={communities} initialJoined={joinedIds} />
      </div>
    </div>
  );
}
