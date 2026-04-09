import Link from "next/link";
import { Paintbrush, FlaskConical } from "lucide-react";

const sections = [
  {
    href: "/foundations",
    title: "Foundations",
    description: "Design tokens — colors, typography, spacing, radii. The building blocks everything else is built on.",
    icon: Paintbrush,
    color: "text-accent-primary",
  },
  {
    href: "/explorations",
    title: "Explorations",
    description: "Interactive demos and 39 layout concepts exploring alternatives to Reddit-style cards. From forums to aquariums.",
    icon: FlaskConical,
    color: "text-accent-secondary",
  },
];

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1
          className="font-serif text-5xl font-bold mb-3"
          style={{ lineHeight: "1.1", letterSpacing: "-0.03em" }}
        >
          Frontpage
          <br />
          <span className="text-text-muted">Design System</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-[480px]">
          Exploring how community content should look, feel, and behave on the AT Protocol.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map(({ href, title, description, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="group block p-6 rounded-xl border border-bg-elevated bg-bg-surface hover:border-accent-secondary/50 transition-all no-underline"
          >
            <Icon size={20} className={`${color} mb-3`} />
            <h2 className="font-serif text-lg font-bold mb-1 group-hover:text-accent-secondary transition-colors">
              {title}
            </h2>
            <p className="text-sm text-text-muted leading-relaxed">
              {description}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-bg-elevated">
        <p className="text-xs text-text-muted">
          Built with Next.js 16, React 19, Tailwind CSS 4, and Lucide icons.
          Tokens use OKLCH for perceptual uniformity. All components are typed TypeScript.
        </p>
      </div>
    </main>
  );
}
