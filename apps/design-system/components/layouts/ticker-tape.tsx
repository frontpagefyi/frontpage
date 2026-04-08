const row1 = [
  { author: "pixelweaver", title: "Isometric city \u2014 6 months", score: "287\u2191" },
  { author: "bytebard", title: "Cell automata music", score: "203\u2191" },
  { author: "shader_witch", title: "WebGPU compute", score: "156\u2191" },
  { author: "retro_dev", title: "Win98 screensavers", score: "134\u2191" },
];

const row2 = [
  { author: "admin", title: "Challenge #47 open", score: "98\u2191" },
  { author: "glsl_gang", title: "Shader playground collab", score: "76\u2191" },
  { author: "flowstate", title: "Fluid sim", score: "54\u2191" },
  { author: "touchpixel", title: "Interactive pixels", score: "41\u2191" },
  { author: "noise_maker", title: "Perlin noise tut", score: "38\u2191" },
];

const row3 = [
  { author: "BREAKING", title: "New post every 12 minutes \u00B7 134 online", isBreaking: true },
  { author: "cast_shadows", title: "ASCII raytracer Rust", score: "29\u2191" },
];

function TickerItem({
  author,
  title,
  score,
  isBreaking,
}: {
  author: string;
  title: string;
  score?: string;
  isBreaking?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs whitespace-nowrap ${
        isBreaking
          ? "border-red-500"
          : "border-border-default"
      }`}
    >
      <strong className={isBreaking ? "text-red-500" : "text-text-primary"}>
        {author}
      </strong>
      <span className="text-text-secondary">{title}</span>
      {score && (
        <span className="text-accent-primary font-semibold">{score}</span>
      )}
    </span>
  );
}

export function TickerTapeLayout() {
  return (
    <div className="px-6 py-5 max-w-[600px] mx-auto">
      <div className="bg-bg-surface rounded-xl overflow-hidden relative">
        {/* Fade overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-bg-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-bg-surface to-transparent z-10 pointer-events-none" />

        {/* Header */}
        <div className="text-center py-2 text-[11px] font-bold text-accent-secondary tracking-widest">
          CREATIVE CODING &mdash; LIVE
        </div>

        {/* Row 1 */}
        <div className="overflow-hidden px-4 py-1.5">
          <div className="flex gap-2">
            {[...row1, ...row1].map((item, i) => (
              <TickerItem key={`r1-${i}`} {...item} />
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div className="overflow-hidden px-4 py-1.5">
          <div className="flex gap-2">
            {[...row2, ...row2].map((item, i) => (
              <TickerItem key={`r2-${i}`} {...item} />
            ))}
          </div>
        </div>

        {/* Row 3 */}
        <div className="overflow-hidden px-4 py-1.5 pb-3">
          <div className="flex gap-2">
            {[...row3, ...row3].map((item, i) => (
              <TickerItem key={`r3-${i}`} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
