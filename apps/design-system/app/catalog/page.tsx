import { LayoutPreview } from "@/components/layout-preview";
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
import { CardStackLayout } from "@/components/layouts/card-stack";
import { BentoLayout } from "@/components/layouts/bento";
import { LetterboxdLayout } from "@/components/layouts/letterboxd";
import { NotebookLayout } from "@/components/layouts/notebook";
import { MapLayout } from "@/components/layouts/map";
import { DigestLayout } from "@/components/layouts/digest";
import { ShelfLayout } from "@/components/layouts/shelf";
import { TerminalLayout } from "@/components/layouts/terminal";
import { GalleryLayout } from "@/components/layouts/gallery";
import { DossierLayout } from "@/components/layouts/dossier";
import { StackedLayout } from "@/components/layouts/stacked";
import { MarqueeLayout } from "@/components/layouts/marquee";
import { KanbanLayout } from "@/components/layouts/kanban";
import { CalendarLayout } from "@/components/layouts/calendar";
import { InboxLayout } from "@/components/layouts/inbox";
import { AccordionLayout } from "@/components/layouts/accordion";
import { PolaroidLayout } from "@/components/layouts/polaroid";
import { VersusLayout } from "@/components/layouts/versus";
import { SubwayLayout } from "@/components/layouts/subway";
import { TreeLayout } from "@/components/layouts/tree";
import { MixtapeLayout } from "@/components/layouts/mixtape";
import { DashboardLayout } from "@/components/layouts/dashboard";
import { ClassifiedsLayout } from "@/components/layouts/classifieds";
import { ComicLayout } from "@/components/layouts/comic";
import { PostcardLayout } from "@/components/layouts/postcard";
import { YearbookLayout } from "@/components/layouts/yearbook";
import { JournalLayout } from "@/components/layouts/journal";
import { LobbyLayout } from "@/components/layouts/lobby";
import { StorefrontLayout } from "@/components/layouts/storefront";
import { TickerTapeLayout } from "@/components/layouts/ticker-tape";
import { CorkstringLayout } from "@/components/layouts/corkstring";
import { AquariumLayout } from "@/components/layouts/aquarium";
import { DeweyLayout } from "@/components/layouts/dewey";
import { VoicemailLayout } from "@/components/layouts/voicemail";
import { TvguideLayout } from "@/components/layouts/tvguide";
import { RecipeLayout } from "@/components/layouts/recipe";
import { PassportLayout } from "@/components/layouts/passport";
import { JukeboxLayout } from "@/components/layouts/jukebox";
import { VendingLayout } from "@/components/layouts/vending";
import { FridgeLayout } from "@/components/layouts/fridge";
import { RolodexLayout } from "@/components/layouts/rolodex";
import { SpeedDateLayout } from "@/components/layouts/speed-date";
import { EvidenceLayout } from "@/components/layouts/evidence";
import { MuseumLayout } from "@/components/layouts/museum";
import { AdventLayout } from "@/components/layouts/advent";
import { SlotMachineLayout } from "@/components/layouts/slot-machine";
import { WeatherLayout } from "@/components/layouts/weather";
import { LinerNotesLayout } from "@/components/layouts/liner-notes";
import { SuperlativesLayout } from "@/components/layouts/superlatives";
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
  { number: 11, name: "Card Stack / Tinder", vibe: "One post at a time", description: "Full-focus, one post at a time. Swipe or click through. Forces engagement instead of doom-scrolling.", component: CardStackLayout },
  { number: 12, name: "Mosaic / Bento", vibe: "Dashboard, varied tiles", description: "Different-sized tiles based on content type or engagement. More dashboard than feed.", component: BentoLayout },
  { number: 13, name: "Letterboxd / Review-Style", vibe: "Author-forward takes", description: "Big avatar, author name prominent, post framed as their \"take.\" Emphasizes the person over the content.", component: LetterboxdLayout },
  { number: 14, name: "Notebook / Margin Notes", vibe: "Shared Google Doc", description: "Main content center column, comments appear as annotations in the margins. Feels collaborative and intellectual.", component: NotebookLayout },
  { number: 15, name: "Map / Spatial Clusters", vibe: "Mind map that's alive", description: "Posts cluster by topic in a 2D space. Related posts are physically near each other.", component: MapLayout },
  { number: 16, name: "Digest / Newsletter", vibe: "Curated email newsletter", description: "Sections with headers: \"Top this week,\" \"Ongoing discussions.\" Not real-time — feels intentional. Anti-doomscroll.", component: DigestLayout },
  { number: 17, name: "Shelf / Library", vibe: "Books on a shelf", description: "Posts are \"books\" on shelves. Horizontal scrolling rows grouped by topic. Each spine shows title + author.", component: ShelfLayout },
  { number: 18, name: "Terminal / CLI", vibe: "Monospace everything", description: "Posts as log entries. Commands to sort, filter, search. Lean into the technical audience.", component: TerminalLayout },
  { number: 19, name: "Gallery Wall", vibe: "Instagram grid, art exhibition", description: "Image-first, text secondary. Big visual grid, hover reveals title and stats. Per-community layout choice.", component: GalleryLayout },
  { number: 20, name: "Dossier / Wiki-Forward", vibe: "Encyclopedia, not a feed", description: "Posts filed under topics. Default view is a table of contents, not chronological feed. Browse by subject, not time.", component: DossierLayout },
  { number: 21, name: "Stacked Panels", vibe: "iOS notification groups", description: "Posts grouped by thread/topic. See just the top card of each stack with a count. Tap to fan out.", component: StackedLayout },
  { number: 22, name: "Marquee / Carousel", vibe: "Featured + compact list", description: "Horizontal carousel for featured posts, compact list below. Two-tier information hierarchy.", component: MarqueeLayout },
  { number: 23, name: "Kanban / Board", vibe: "Trello, project board", description: "Posts organized in columns: New, Trending, Hall of Fame, Needs Reply. Great for project-oriented communities.", component: KanbanLayout },
  { number: 24, name: "Calendar / Journal", vibe: "Daily rhythm, accountability", description: "Posts in a calendar grid. Each day shows what was posted. See the rhythm of community activity.", component: CalendarLayout },
  { number: 25, name: "Inbox / Email", vibe: "Gmail for communities", description: "Posts have unread/read states, stars, archive. Feels personal — selective attention instead of infinite scroll.", component: InboxLayout },
  { number: 26, name: "Accordion / FAQ", vibe: "Collapsible, dense", description: "All posts collapsed to just titles. Click to expand inline. Incredibly compact for Q&A communities.", component: AccordionLayout },
  { number: 27, name: "Polaroid / Scrapbook", vibe: "Physical album, warm", description: "Posts are polaroid frames with handwritten captions. Scattered placement. Like flipping through a friend's album.", component: PolaroidLayout },
  { number: 28, name: "Split Screen / Versus", vibe: "Debate, compare, critique", description: "Two posts side by side for comparison or debate. Built-in structure for discourse.", component: VersusLayout },
  { number: 29, name: "Subway Map / Transit", vibe: "Ride a topic thread", description: "Posts as stations on colored transit lines. Each line is a topic. \"Ride\" a topic to see where it goes.", component: SubwayLayout },
  { number: 30, name: "Tree / File Explorer", vibe: "Obsidian sidebar, taxonomy", description: "Hierarchical expandable tree. Topics > subtopics > posts. For communities where taxonomy matters.", component: TreeLayout },
  { number: 31, name: "Mixtape / Playlist", vibe: "Spotify for posts", description: "Posts are \"tracks\" with read time as duration. Hit play to auto-scroll. For creative communities.", component: MixtapeLayout },
  { number: 32, name: "Dashboard / Mission Control", vibe: "Community as control room", description: "Activity sparkline, trending topics, top post spotlight, member count. Not a feed — a control room.", component: DashboardLayout },
  { number: 33, name: "Classified Ads / Bulletin", vibe: "Newspaper classifieds, retro", description: "Dense newspaper classifieds. Tiny text, category headers, dotted borders. Charming and retro.", component: ClassifiedsLayout },
  { number: 34, name: "Comic Strip / Panels", vibe: "Sequential panels, speech bubbles", description: "Posts as comic panels. Image-heavy posts fill the panel, text gets speech-bubble treatment.", component: ComicLayout },
  { number: 35, name: "Postcard", vibe: "Greetings from the community", description: "Each post is a postcard. Front: image. Back: handwritten text, author, stamp. Horizontal scroll.", component: PostcardLayout },
  { number: 36, name: "Yearbook / Directory", vibe: "Member-centric", description: "Grid of members with their latest post. Browse by person, not content. \"What's everyone up to?\"", component: YearbookLayout },
  { number: 37, name: "Scientific Journal", vibe: "Abstract, keywords, citations", description: "Posts formatted as abstracts: Title, Authors, Abstract, Keywords. Funny for memes, useful for research.", component: JournalLayout },
  { number: 38, name: "Lobby / Building Directory", vibe: "Floors and rooms", description: "Physical building metaphor. Floors = topics, rooms = threads. Elevator to jump between floors.", component: LobbyLayout },
  { number: 39, name: "Storefront / Marketplace", vibe: "Products for sale (but it's posts)", description: "Posts as products. Thumbnail, title, \"price\" (votes), \"reviews\" (comments), Add to Cart (save).", component: StorefrontLayout },
  { number: 40, name: "Ticker Tape Parade", vibe: "News chyron, stock ticker", description: "Continuous horizontal headlines at different speeds. Multiple rows. Chaotic, broadcast-TV energy.", component: TickerTapeLayout },
  { number: 41, name: "Corkboard + String", vibe: "Pepe Silvia conspiracy energy", description: "Like Pinboard but with red string connecting related posts. Follow the string to trace conversations.", component: CorkstringLayout },
  { number: 42, name: "Aquarium / Screensaver", vibe: "Posts as fish, pure vibes", description: "Posts floating in a space. They drift around, you click to read. Zero utility, maximum personality.", component: AquariumLayout },
  { number: 43, name: "Dewey Decimal / Card Catalog", vibe: "Library drawers, typewriter cards", description: "Physical library card catalog. Drawers by topic, typewriter-font index cards inside.", component: DeweyLayout },
  { number: 44, name: "Voicemail / Answering Machine", vibe: "You have 3 new messages", description: "Posts as voicemails. Timestamp, caller, duration. Hit play to \"listen\" (read). Retro answering machine.", component: VoicemailLayout },
  { number: 45, name: "TV Guide / Channel Listing", vibe: "'90s cable TV grid", description: "Channels (topics) as rows, time slots as columns. \"What's on right now.\" Very retro cable TV.", component: TvguideLayout },
  { number: 46, name: "Recipe Card / Index Box", vibe: "Handwritten recipes in a box", description: "Posts as recipe cards. Stained paper, handwritten look. Literal for recipe communities, charming for tutorials.", component: RecipeLayout },
  { number: 47, name: "Passport / Stamps", vibe: "Collect stamps by visiting posts", description: "Each visited post stamps your passport. Browse = travel. Gamification through exploration.", component: PassportLayout },
  { number: 48, name: "Jukebox", vibe: "Flip through, press play", description: "Retro jukebox. Flip through selections with a mechanical selector. Press a code to pick one.", component: JukeboxLayout },
  { number: 49, name: "Vending Machine", vibe: "Insert coin, get content", description: "Grid of items behind glass. Each slot has a code (A1, B2). Playful, absurd, memorable.", component: VendingLayout },
  { number: 50, name: "Refrigerator Door", vibe: "Magnets, notes, photos, warmth", description: "Magnets holding up notes, photos, drawings. Overlapping, messy, domestic. For close-knit communities.", component: FridgeLayout },
  { number: 51, name: "Rolodex / Contact Cards", vibe: "Flip through, tactile", description: "Flip through posts like a physical rolodex. Mechanical flip animation. Very tactile, very retro office.", component: RolodexLayout },
  { number: 52, name: "Elevator Pitch / Speed Dating", vibe: "15 seconds per post, go", description: "Timer-based. Each post gets 15 seconds, then auto-advances. Forces good hooks. Brutal but engaging.", component: SpeedDateLayout },
  { number: 53, name: "Police Evidence Board", vibe: "Pepe Silvia but make it useful", description: "Photos and documents pinned with labels like \"SUSPECT,\" \"EVIDENCE.\" Investigation metaphor.", component: EvidenceLayout },
  { number: 54, name: "Museum Exhibition", vibe: "Gallery labels, white space, quiet", description: "Posts as art pieces on a wall with gallery labels. Walk through rooms. Contemplative.", component: MuseumLayout },
  { number: 55, name: "Advent Calendar", vibe: "Open one door per day", description: "Numbered doors. One opens per day. Behind each is content. Perfect for daily challenges or countdowns.", component: AdventLayout },
  { number: 56, name: "Slot Machine", vibe: "Feeling lucky?", description: "Pull the lever, get a random post. Three reels: topic, author, mood. Pure chaos discovery.", component: SlotMachineLayout },
  { number: 57, name: "Weather Forecast", vibe: "Community vibes as weather", description: "Community activity as a weather map. Hot discussions are high-pressure zones, dying threads are cold fronts.", component: WeatherLayout },
  { number: 58, name: "Mixtape Liner Notes", vibe: "CD booklet, vinyl gatefold", description: "Inside of a CD booklet. Post text on one side, credits and tracklist on the other. Very 2003.", component: LinerNotesLayout },
  { number: 59, name: "Yearbook Superlatives", vibe: "Most Likely to Go Viral", description: "Posts categorized by community-voted superlatives. Rotates weekly. Social, playful, encouraging.", component: SuperlativesLayout },
  { number: 60, name: "Newspaper Obituaries", vibe: "RIP to dead threads", description: "For dead threads only. \"Here lies...\" with cause of death and survivors. The thread graveyard.", component: ObituariesLayout },
];

export default function CatalogPage() {
  return (
    <main className="py-12">
      <div className="max-w-[960px] mx-auto px-6 mb-12">
        <h1
          className="font-serif text-4xl font-bold mb-2"
          style={{ lineHeight: "1.2", letterSpacing: "-0.025em" }}
        >
          60 Layout Concepts
        </h1>
        <p className="text-text-secondary max-w-[600px]">
          Alternative ways to display community content that aren&apos;t Reddit-style cards. Each preview uses the same sample data rendered in a different layout paradigm.
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
            {layout.number}. {layout.name}
          </a>
        ))}
      </nav>

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
  );
}
