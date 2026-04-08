const articles = [
  {
    title: "On the Construction of Isometric Urban Environments: A Six-Month Study in Pixel Art",
    authors: "pixelweaver et al. \u00B7 Creative Coding Community \u00B7 April 2026",
    abstract:
      "We present a comprehensive isometric city comprising 200+ unique structures with dynamic lighting and animated NPCs. A custom palette generation algorithm ensures chromatic consistency across the full urban landscape. The primary challenge \u2014 z-ordering for overlapping geometries \u2014 was resolved using a modified painter\u2019s algorithm with per-building face splitting.",
    keywords: ["pixel-art", "isometric", "z-ordering", "palette-generation"],
  },
  {
    title: "Exploiting WebGPU Compute Shaders for Real-Time Particle Systems in Browser Environments",
    authors: "shader_witch \u00B7 GPU Studies Lab \u00B7 April 2026",
    abstract:
      "We demonstrate 10\u2076 particle simulations at 60fps with zero CPU overhead using WebGPU compute shaders in Chrome Canary. Results suggest a paradigm shift in browser-based creative computing.",
    keywords: ["WebGPU", "compute-shaders", "particle-systems", "real-time"],
  },
];

export function JournalLayout() {
  return (
    <div className="p-4">
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 space-y-8">
        {articles.map((article) => (
          <article key={article.title}>
            {/* Title */}
            <h3 className="font-serif text-base font-bold text-zinc-100 leading-snug mb-1">
              {article.title}
            </h3>

            {/* Authors */}
            <p className="font-serif italic text-xs text-zinc-400 mb-3">{article.authors}</p>

            {/* Abstract label */}
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Abstract
            </div>

            {/* Abstract body */}
            <p className="text-xs text-zinc-300 leading-relaxed mb-3">{article.abstract}</p>

            {/* Keywords */}
            <div className="flex flex-wrap gap-1.5">
              {article.keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2 py-0.5 text-[10px] font-medium text-zinc-400 border border-zinc-700 rounded-full"
                >
                  {kw}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
