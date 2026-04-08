const entries = [
  {
    title: "Is Python Better Than Rust for Creative Coding?",
    dates: "March 12 \u2013 March 14, 2026 \u00B7 Lived fast, died young",
    body: "Born of a late-night shower thought, this thread started with passion and ended in a 200-comment flamewar. Neither side conceded. The thread was locked by moderators after someone compared Python\u2019s GIL to a war crime.",
    survived:
      "Survived by 200 comments, 3 banned accounts, and one really good benchmarking post buried at comment #38.",
  },
  {
    title: "Who Wants to Build a Creative Coding OS?",
    dates: "February 28 \u2013 March 1, 2026 \u00B7 Scope creep was the cause of death",
    body: "An ambitious project proposal that gained 89 upvotes in 4 hours. A Discord server was created. A Notion board was filled. Then everyone realized they\u2019d actually have to write an operating system. Silence followed.",
    survived:
      "Survived by an empty GitHub repo, a Figma file with 3 frames, and the memory of what could have been.",
  },
  {
    title: "Daily Creative Coding Streak \u2014 Day 1 of 365",
    dates: "January 1 \u2013 January 4, 2026 \u00B7 Cause: human nature",
    body: "Posted with tremendous energy on New Year\u2019s Day. Day 2 was solid. Day 3 was a screenshot of someone else\u2019s work with \u201Cinspired by this.\u201D Day 4 never came.",
    survived:
      'Survived by 0 of 365 planned posts and one comment that simply reads "lol same."',
  },
];

export function ObituariesLayout() {
  return (
    <div className="mx-auto max-w-[560px] p-5">
      {/* Header */}
      <div className="mb-4 border-b-2 border-zinc-400 pb-3 text-center dark:border-zinc-600">
        <h3 className="font-serif text-2xl font-bold italic text-zinc-900 dark:text-zinc-100">
          In Memoriam
        </h3>
        <div className="text-[11px] text-zinc-400 dark:text-zinc-500">
          Threads that have passed on &middot; Creative Coding
        </div>
      </div>

      {/* Obituary entries */}
      {entries.map((entry) => (
        <div
          key={entry.title}
          className="border-b border-zinc-200 py-4 dark:border-zinc-800"
        >
          <div className="mb-1 font-serif text-base font-bold text-zinc-900 dark:text-zinc-100">
            {entry.title}
          </div>
          <div className="mb-1.5 text-[11px] italic text-zinc-400 dark:text-zinc-500">
            {entry.dates}
          </div>
          <div className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            {entry.body}
          </div>
          <div className="mt-1.5 text-[11px] italic text-zinc-400 dark:text-zinc-500">
            {entry.survived}
          </div>
        </div>
      ))}
    </div>
  );
}
