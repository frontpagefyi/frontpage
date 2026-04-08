import Link from "next/link";

const explorations = [
  {
    href: "/explorations/hybrid-forum",
    title: "Hybrid Forum + Threaded",
    description: "Forum table rows that expand inline to show full threaded discussions. Click a row to read, click again to collapse. Best of both worlds.",
    status: "Live",
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
      <p className="text-text-secondary mb-10 max-w-[520px]">
        Full-page interactive experiments. Each one takes a layout concept from the catalog and builds it out as a real, working prototype.
      </p>

      <div className="space-y-4">
        {explorations.map((exp) => (
          <Link
            key={exp.href}
            href={exp.href}
            className="block p-5 rounded-xl border border-bg-elevated bg-bg-surface hover:border-accent-secondary transition-colors no-underline group"
          >
            <div className="flex items-center gap-3 mb-1">
              <h2 className="font-serif text-lg font-bold group-hover:text-accent-secondary transition-colors">
                {exp.title}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wide text-accent-success bg-accent-success/10 px-2 py-0.5 rounded-full">
                {exp.status}
              </span>
            </div>
            <p className="text-sm text-text-secondary">{exp.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 p-5 rounded-xl border border-dashed border-bg-overlay text-center">
        <p className="text-sm text-text-muted">More explorations coming — comment views, post detail pages, community theming, mobile layouts...</p>
      </div>
    </main>
  );
}
