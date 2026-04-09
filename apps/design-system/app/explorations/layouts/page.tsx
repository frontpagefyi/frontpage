import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutPreview } from "@/components/layout-preview";
import { CatalogToc } from "@/components/catalog-toc";
import { ForumLayout } from "@/components/layouts/forum";
import { TimelineLayout } from "@/components/layouts/timeline";
import { MagazineLayout } from "@/components/layouts/magazine";
import { ThreadedLayout } from "@/components/layouts/threaded";
import { CompactListLayout } from "@/components/layouts/compact-list";
import { NewspaperLayout } from "@/components/layouts/newspaper";
import { PinboardLayout } from "@/components/layouts/pinboard";
import { TickerLayout } from "@/components/layouts/ticker";
import { ChatFirstLayout } from "@/components/layouts/chat-first";
import { ZineLayout } from "@/components/layouts/zine";
import { BentoLayout } from "@/components/layouts/bento";
import { LetterboxdLayout } from "@/components/layouts/letterboxd";
import { NotebookLayout } from "@/components/layouts/notebook";
import { MapLayout } from "@/components/layouts/map";
import { DigestLayout } from "@/components/layouts/digest";
import { TerminalLayout } from "@/components/layouts/terminal";
import { GalleryLayout } from "@/components/layouts/gallery";
import { DossierLayout } from "@/components/layouts/dossier";
import { StackedLayout } from "@/components/layouts/stacked";
import { MarqueeLayout } from "@/components/layouts/marquee";
import { KanbanLayout } from "@/components/layouts/kanban";
import { InboxLayout } from "@/components/layouts/inbox";
import { AccordionLayout } from "@/components/layouts/accordion";
import { TreeLayout } from "@/components/layouts/tree";
import { MixtapeLayout } from "@/components/layouts/mixtape";
import { ClassifiedsLayout } from "@/components/layouts/classifieds";
import { ComicLayout } from "@/components/layouts/comic";
import { PostcardLayout } from "@/components/layouts/postcard";
import { YearbookLayout } from "@/components/layouts/yearbook";
import { JournalLayout } from "@/components/layouts/journal";
import { LobbyLayout } from "@/components/layouts/lobby";
import { StorefrontLayout } from "@/components/layouts/storefront";
import { TickerTapeLayout } from "@/components/layouts/ticker-tape";
import { AquariumLayout } from "@/components/layouts/aquarium";
import { RolodexLayout } from "@/components/layouts/rolodex";
import { SpeedDateLayout } from "@/components/layouts/speed-date";
import { EvidenceLayout } from "@/components/layouts/evidence";
import { LinerNotesLayout } from "@/components/layouts/liner-notes";
import { ObituariesLayout } from "@/components/layouts/obituaries";

const layouts = [
  { number: 1, name: "Forum / Bulletin Board", vibe: "phpBB energy", description: "Dense table rows. Title, author, reply count, last activity. Zero cards, zero images by default. Scannable and information-rich.", component: ForumLayout },
  { number: 2, name: "Timeline / Stream", vibe: "Tumblr meets blog", description: "No card borders. Content flows vertically with subtle dividers. Images go full-width. Posts breathe.", component: TimelineLayout },
  { number: 3, name: "Magazine / Editorial", vibe: "Flipboard, Apple News", description: "Top post gets hero treatment. Next posts are medium cards in a grid. Visual hierarchy communicates importance.", component: MagazineLayout },
  { number: 4, name: "Threaded / Conversation", vibe: "Discourse, mailing list", description: "Title is prominent, inline replies cascade underneath. Discussion is the primary content, not a secondary action.", component: ThreadedLayout },
  { number: 5, name: "Compact List", vibe: "Hacker News, Lobste.rs", description: "Just titles, points, comment counts. Ultra-dense, zero decoration. Content speaks for itself.", component: CompactListLayout },
  { number: 6, name: "Newspaper Columns", vibe: "Editorial broadsheet", description: "Multi-column masonry. Lead story spans columns, smaller stories fill the grid. The layout itself communicates what matters.", component: NewspaperLayout },
  { number: 7, name: "Spatial / Pinboard", vibe: "Corkboard in a coffee shop", description: "Posts pinned at different positions, slightly rotated. Feels physical and tactile. Chaos with intent.", component: PinboardLayout },
  { number: 8, name: "Ticker / River", vibe: "Bloomberg terminal, RSS river", description: "Single-line items flowing like an RSS feed. Title + author + time, that's it. Maximum information density.", component: TickerLayout },
  { number: 9, name: "Chat-First Feed", vibe: "Discord meets forum", description: "The feed IS the chat. Posts are longer messages in a continuous stream. Everything is one conversation.", component: ChatFirstLayout },
  { number: 10, name: "Zine / Collage", vibe: "MySpace chaos energy", description: "Intentionally messy. Overlapping elements, mixed sizes, handwritten annotations. Wild but memorable.", component: ZineLayout },
  { number: 11, name: "Mosaic / Bento", vibe: "Dashboard, varied tiles", description: "Different-sized tiles based on content type or engagement. More dashboard than feed.", component: BentoLayout },
  { number: 12, name: "Letterboxd / Review-Style", vibe: "Author-forward takes", description: "Big avatar, author name prominent, post framed as their \"take.\" Emphasizes the person over the content.", component: LetterboxdLayout },
  { number: 13, name: "Notebook / Margin Notes", vibe: "Shared Google Doc", description: "Main content center column, comments appear as annotations in the margins. Feels collaborative and intellectual.", component: NotebookLayout },
  { number: 14, name: "Map / Spatial Clusters", vibe: "Mind map that's alive", description: "Posts cluster by topic in a 2D space. Related posts are physically near each other.", component: MapLayout },
  { number: 15, name: "Digest / Newsletter", vibe: "Curated email newsletter", description: "Sections with headers: \"Top this week,\" \"Ongoing discussions.\" Not real-time — feels intentional. Anti-doomscroll.", component: DigestLayout },
  { number: 16, name: "Terminal / CLI", vibe: "Monospace everything", description: "Posts as log entries. Commands to sort, filter, search. Lean into the technical audience.", component: TerminalLayout },
  { number: 17, name: "Gallery Wall", vibe: "Instagram grid, art exhibition", description: "Image-first, text secondary. Big visual grid, hover reveals title and stats. Per-community layout choice.", component: GalleryLayout },
  { number: 18, name: "Dossier / Wiki-Forward", vibe: "Encyclopedia, not a feed", description: "Posts filed under topics. Default view is a table of contents, not chronological feed. Browse by subject, not time.", component: DossierLayout },
  { number: 19, name: "Stacked Panels", vibe: "iOS notification groups", description: "Posts grouped by thread/topic. See just the top card of each stack with a count. Tap to fan out.", component: StackedLayout },
  { number: 20, name: "Marquee / Carousel", vibe: "Featured + compact list", description: "Horizontal carousel for featured posts, compact list below. Two-tier information hierarchy.", component: MarqueeLayout },
  { number: 21, name: "Kanban / Board", vibe: "Trello, project board", description: "Posts organized in columns: New, Trending, Hall of Fame, Needs Reply. Great for project-oriented communities.", component: KanbanLayout },
  { number: 22, name: "Inbox / Email", vibe: "Gmail for communities", description: "Posts have unread/read states, stars, archive. Feels personal — selective attention instead of infinite scroll.", component: InboxLayout },
  { number: 23, name: "Accordion / FAQ", vibe: "Collapsible, dense", description: "All posts collapsed to just titles. Click to expand inline. Incredibly compact for Q&A communities.", component: AccordionLayout },
  { number: 24, name: "Tree / File Explorer", vibe: "Obsidian sidebar, taxonomy", description: "Hierarchical expandable tree. Topics > subtopics > posts. For communities where taxonomy matters.", component: TreeLayout },
  { number: 25, name: "Mixtape / Playlist", vibe: "Spotify for posts", description: "Posts are \"tracks\" with read time as duration. Hit play to auto-scroll. For creative communities.", component: MixtapeLayout },
  { number: 26, name: "Classified Ads / Bulletin", vibe: "Newspaper classifieds, retro", description: "Dense newspaper classifieds. Tiny text, category headers, dotted borders. Charming and retro.", component: ClassifiedsLayout },
  { number: 27, name: "Comic Strip / Panels", vibe: "Sequential panels, speech bubbles", description: "Posts as comic panels. Image-heavy posts fill the panel, text gets speech-bubble treatment.", component: ComicLayout },
  { number: 28, name: "Postcard", vibe: "Greetings from the community", description: "Each post is a postcard. Front: image. Back: handwritten text, author, stamp. Horizontal scroll.", component: PostcardLayout },
  { number: 29, name: "Yearbook / Directory", vibe: "Member-centric", description: "Grid of members with their latest post. Browse by person, not content. \"What's everyone up to?\"", component: YearbookLayout },
  { number: 30, name: "Scientific Journal", vibe: "Abstract, keywords, citations", description: "Posts formatted as abstracts: Title, Authors, Abstract, Keywords. Funny for memes, useful for research.", component: JournalLayout },
  { number: 31, name: "Lobby / Building Directory", vibe: "Floors and rooms", description: "Physical building metaphor. Floors = topics, rooms = threads. Elevator to jump between floors.", component: LobbyLayout },
  { number: 32, name: "Storefront / Marketplace", vibe: "Products for sale (but it's posts)", description: "Posts as products. Thumbnail, title, \"price\" (votes), \"reviews\" (comments), Add to Cart (save).", component: StorefrontLayout },
  { number: 33, name: "Ticker Tape Parade", vibe: "News chyron, stock ticker", description: "Continuous horizontal headlines at different speeds. Multiple rows. Chaotic, broadcast-TV energy.", component: TickerTapeLayout },
  { number: 34, name: "Aquarium / Screensaver", vibe: "Posts as fish, pure vibes", description: "Posts floating in a space. They drift around, you click to read. Zero utility, maximum personality.", component: AquariumLayout },
  { number: 35, name: "Rolodex / Contact Cards", vibe: "Flip through, tactile", description: "Flip through posts like a physical rolodex. Mechanical flip animation. Very tactile, very retro office.", component: RolodexLayout },
  { number: 36, name: "Elevator Pitch / Speed Dating", vibe: "15 seconds per post, go", description: "Timer-based. Each post gets 15 seconds, then auto-advances. Forces good hooks. Brutal but engaging.", component: SpeedDateLayout },
  { number: 37, name: "Police Evidence Board", vibe: "Pepe Silvia but make it useful", description: "Photos and documents pinned with labels like \"SUSPECT,\" \"EVIDENCE.\" Investigation metaphor.", component: EvidenceLayout },
  { number: 38, name: "Mixtape Liner Notes", vibe: "CD booklet, vinyl gatefold", description: "Inside of a CD booklet. Post text on one side, credits and tracklist on the other. Very 2003.", component: LinerNotesLayout },
  { number: 39, name: "Newspaper Obituaries", vibe: "RIP to dead threads", description: "For dead threads only. \"Here lies...\" with cause of death and survivors. The thread graveyard.", component: ObituariesLayout },
];

const tocItems = layouts.map((l) => ({
  number: l.number,
  name: l.name,
  id: l.name.toLowerCase().replace(/\s+/g, "-"),
}));

export default function LayoutsPage() {
  return (
    <div className="flex gap-0">
      {/* Sidebar TOC */}
      <aside className="hidden lg:block w-56 shrink-0 pl-6 pt-12">
        <CatalogToc items={tocItems} />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 py-12">
        <div className="max-w-[960px] mx-auto px-6 mb-12">
          <Link
            href="/explorations"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors mb-4"
          >
            <ArrowLeft size={12} />
            Explorations
          </Link>
          <h1
            className="font-serif text-4xl font-bold mb-2"
            style={{ lineHeight: "1.2", letterSpacing: "-0.025em" }}
          >
            Layout Concepts
          </h1>
          <p className="text-text-secondary max-w-[600px]">
            39 alternative ways to display community content that aren&apos;t
            Reddit-style cards. Each preview uses the same sample data rendered
            in a different layout paradigm.
          </p>
        </div>

        {layouts.map((layout) => (
          <LayoutPreview
            key={layout.number}
            number={layout.number}
            name={layout.name}
            vibe={layout.vibe}
            description={layout.description}
          >
            <layout.component />
          </LayoutPreview>
        ))}
      </main>
    </div>
  );
}
