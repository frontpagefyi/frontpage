const awards = [
  {
    label: "\uD83C\uDFC6 Post of the Week",
    winner: "pixelweaver",
    post: "Isometric city \u2014 6 months of pixel work",
    votes: "287 votes",
  },
  {
    label: "\uD83D\uDD25 Hottest Take",
    winner: "shader_witch",
    post: "WebGPU compute shaders change everything",
    votes: "156 votes \u00B7 47 debates",
  },
  {
    label: "\uD83C\uDFA7 Most Creative",
    winner: "bytebard",
    post: "Cellular automata as a music generator",
    votes: "203 votes",
  },
  {
    label: "\uD83D\uDD52 Best Throwback",
    winner: "retro_dev",
    post: "Win98 screensavers recreated in p5.js",
    votes: '134 votes \u00B7 "pure nostalgia"',
  },
  {
    label: "\uD83E\uDD1D Community MVP",
    winner: "admin",
    post: "Keeping Challenge #47 running strong",
    votes: "voted by moderators",
  },
  {
    label: "\uD83C\uDF31 Rising Star",
    winner: "noise_maker",
    post: "Perlin noise tutorial that makes sense",
    votes: "38 votes \u00B7 first post!",
  },
];

export function Superlatives() {
  return (
    <div className="p-5">
      <div className="mx-auto grid max-w-[600px] grid-cols-2 gap-3">
        {awards.map((award) => (
          <div
            key={award.label}
            className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-700 dark:bg-zinc-800"
          >
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-indigo-500">
              {award.label}
            </div>
            <div className="mb-1 font-serif text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {award.winner}
            </div>
            <div className="text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
              {award.post}
            </div>
            <div className="mt-1.5 text-[10px] text-zinc-400 dark:text-zinc-500">
              {award.votes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
