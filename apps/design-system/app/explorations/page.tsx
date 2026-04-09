import Link from "next/link";
import { ArrowRight, Play, LayoutGrid } from "lucide-react";

const demos = [
  {
    href: "/explorations/community-feed",
    title: "Community Feed",
    description:
      "Sidebar navigation, community banners, feed posts with badges, atmosphere and wiki tabs, community theming.",
  },
  {
    href: "/explorations/threaded-forum",
    title: "Threaded Forum",
    description:
      "Full-page forum with sidebar, sticky threads, hot reply indicators, pagination, and community switching.",
  },
];

export default function ExplorationsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1
        className="font-serif text-4xl font-bold mb-2"
        style={{ lineHeight: "1.2", letterSpacing: "-0.025em" }}
      >
        Explorations
      </h1>
      <p className="text-text-secondary mb-12 max-w-[520px]">
        How should community content look, feel, and behave? Full-page demos to
        interact with, and layout concepts that explore the design space.
      </p>

      {/* ── Interactive Demos ── */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Play size={14} className="text-accent-secondary" />
          <h2 className="text-sm font-bold text-text-primary">
            Interactive Demos
          </h2>
        </div>
        <div className="space-y-2">
          {demos.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className="group flex items-center gap-4 p-4 rounded-xl border border-bg-elevated bg-bg-surface hover:border-accent-secondary/50 hover:bg-bg-elevated/40 transition-all no-underline"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold group-hover:text-accent-secondary transition-colors">
                  {demo.title}
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  {demo.description}
                </p>
              </div>
              <ArrowRight
                size={14}
                className="shrink-0 text-text-muted group-hover:text-accent-secondary group-hover:translate-x-0.5 transition-all"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Layout Concepts ── */}
      <section>
        <Link
          href="/explorations/layouts"
          className="group flex items-center gap-4 p-6 rounded-xl border border-bg-elevated bg-bg-surface hover:border-accent-primary/50 hover:bg-bg-elevated/40 transition-all no-underline"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-primary/10 shrink-0">
            <LayoutGrid size={18} className="text-accent-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold group-hover:text-accent-primary transition-colors">
              Layout Concepts
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              39 alternative ways to display community content — from forums and
              timelines to aquariums and obituaries.
            </p>
          </div>
          <ArrowRight
            size={14}
            className="shrink-0 text-text-muted group-hover:text-accent-primary group-hover:translate-x-0.5 transition-all"
          />
        </Link>
      </section>
    </main>
  );
}
