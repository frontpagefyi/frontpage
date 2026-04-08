const pairs = [
  {
    left: {
      title: "WebGPU is the future of creative coding",
      body: "1M particles at 60fps. Zero CPU. The browser just got serious. WebGL is dead, long live WebGPU.",
      author: "shader_witch",
      votes: 156,
    },
    right: {
      title: "WebGL still has years left in it",
      body: "WebGPU support is spotty. WebGL works everywhere, has mature tooling, and most creative projects don't need compute shaders.",
      author: "pragmatic_dev",
      votes: 89,
    },
  },
  {
    left: {
      title: "Pixel art is the highest form of digital art",
      body: "Every pixel is intentional. No hiding behind resolution. Pure craft.",
      author: "pixelweaver",
      votes: 142,
    },
    right: {
      title: "Generative art is more honest",
      body: "Algorithms reveal patterns humans can't see. Emergence over intention.",
      author: "bytebard",
      votes: 118,
    },
  },
];

export function VersusLayout() {
  return (
    <div className="p-4 space-y-4">
      {pairs.map((pair, i) => (
        <div key={i} className="relative flex gap-0 rounded-lg overflow-hidden border border-zinc-800">
          {/* Left side */}
          <div className="flex-1 bg-zinc-950 p-4">
            <h4 className="text-sm font-bold text-zinc-100 mb-2">{pair.left.title}</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">{pair.left.body}</p>
            <div className="text-[11px] text-zinc-500">
              {pair.left.author} &middot; {pair.left.votes}&uarr;
            </div>
          </div>

          {/* VS badge */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-red-900/50">
            VS
          </div>

          {/* Right side */}
          <div className="flex-1 bg-zinc-900 p-4 border-l border-zinc-800">
            <h4 className="text-sm font-bold text-zinc-100 mb-2">{pair.right.title}</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">{pair.right.body}</p>
            <div className="text-[11px] text-zinc-500">
              {pair.right.author} &middot; {pair.right.votes}&uarr;
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
