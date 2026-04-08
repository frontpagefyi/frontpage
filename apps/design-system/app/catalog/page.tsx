import { LayoutPreview } from "@/components/layout-preview";
import { ForumLayout } from "@/components/layouts/forum";
import { TimelineLayout } from "@/components/layouts/timeline";
import { CompactListLayout } from "@/components/layouts/compact-list";
import { NewspaperLayout } from "@/components/layouts/newspaper";
import { ChatFirstLayout } from "@/components/layouts/chat-first";
import { BentoLayout } from "@/components/layouts/bento";
import { DigestLayout } from "@/components/layouts/digest";
import { TerminalLayout } from "@/components/layouts/terminal";
import { StackedLayout } from "@/components/layouts/stacked";
import { KanbanLayout } from "@/components/layouts/kanban";

const layouts = [
  { number: 1, name: "Forum / Bulletin Board", vibe: "phpBB energy", description: "Dense table rows. Title, author, reply count, last activity. Zero cards, zero images by default. Scannable and information-rich. Feels like coming home to a 2005 forum." },
  { number: 2, name: "Timeline / Stream", vibe: "Tumblr meets blog", description: "No card borders. Content flows vertically with subtle dividers. Images go full-width. Posts breathe. Feels like scrolling a curated blog, not browsing a feed." },
  { number: 5, name: "Compact List", vibe: "Hacker News, Lobste.rs", description: "Just titles, points, comment counts. Ultra-dense, zero decoration. Content speaks for itself. The most information per pixel of any layout." },
  { number: 6, name: "Newspaper Columns", vibe: "Editorial broadsheet", description: "Multi-column masonry. Lead story spans columns, smaller stories fill the grid. Feels editorial and curated. The layout itself communicates what matters." },
  { number: 9, name: "Chat-First Feed", vibe: "Discord meets forum", description: "The feed IS the chat. Posts are longer messages in a continuous stream. No separation between \"posts\" and \"discussion.\" Everything is one conversation." },
  { number: 12, name: "Mosaic / Bento", vibe: "Dashboard, varied tiles", description: "Different-sized tiles based on content type or engagement. Image posts get big visual tiles, text posts get compact ones. More dashboard than feed." },
  { number: 16, name: "Digest / Newsletter", vibe: "Curated email newsletter", description: "Looks like a curated newsletter. Sections with headers: \"Top this week,\" \"New voices,\" \"Ongoing discussions.\" Not real-time — feels intentional and edited. Anti-doomscroll." },
  { number: 18, name: "Terminal / CLI", vibe: "Monospace everything", description: "Posts as log entries. Commands to sort, filter, search. Lean into the technical audience. Could be a per-community theme option for hacker-type communities." },
  { number: 21, name: "Stacked Panels", vibe: "iOS notification groups", description: "Posts grouped by thread/topic. See just the top card of each stack with a count. Tap to fan out. Dramatically reduces visual noise while preserving all content." },
  { number: 23, name: "Kanban / Board", vibe: "Trello, project board", description: "Posts organized in columns: New, Trending, Hall of Fame, Needs Reply. Drag-like visual. Great for project-oriented or support communities." },
];

const components = [
  ForumLayout,
  TimelineLayout,
  CompactListLayout,
  NewspaperLayout,
  ChatFirstLayout,
  BentoLayout,
  DigestLayout,
  TerminalLayout,
  StackedLayout,
  KanbanLayout,
];

export default function CatalogPage() {
  return (
    <main className="py-12">
      <div className="max-w-[960px] mx-auto px-6 mb-12">
        <h1
          className="font-serif text-4xl font-bold mb-2"
          style={{ lineHeight: "1.2", letterSpacing: "-0.025em" }}
        >
          Layout Catalog
        </h1>
        <p className="text-text-secondary max-w-[600px]">
          10 alternative ways to display community content. Each preview uses the same sample data
          rendered in a different layout paradigm.
        </p>
      </div>

      {/* Sticky nav */}
      <nav className="sticky top-12 z-40 bg-bg-base border-b border-bg-elevated py-3 px-6 mb-8 flex gap-2 overflow-x-auto">
        {layouts.map((layout) => (
          <a
            key={layout.name}
            href={`#${layout.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-[11px] font-semibold text-text-muted px-2.5 py-1 rounded-full bg-bg-surface border border-bg-elevated whitespace-nowrap transition-colors hover:text-text-primary hover:border-accent-secondary"
          >
            {layout.name}
          </a>
        ))}
      </nav>

      {layouts.map((layout, i) => {
        const Component = components[i];
        return (
          <LayoutPreview
            key={layout.name}
            number={layout.number}
            name={layout.name}
            vibe={layout.vibe}
            description={layout.description}
          >
            <Component />
          </LayoutPreview>
        );
      })}
    </main>
  );
}
