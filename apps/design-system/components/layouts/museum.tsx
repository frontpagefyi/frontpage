const pieces = [
  {
    title: "Isometric City",
    artist: "pixelweaver, 2026",
    medium: "Pixel art on digital canvas",
    detail: "200 structures, dynamic lighting",
    bg: "url('https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=400&q=80') center/cover no-repeat",
  },
  {
    title: "Particle Field No. 7",
    artist: "shader_witch, 2026",
    medium: "WebGPU compute shader",
    detail: "1,000,000 particles, real-time",
    bg: "linear-gradient(135deg, oklch(45% 0.08 250), oklch(55% 0.06 270))",
  },
  {
    title: "Sonata for Automata",
    artist: "bytebard, 2026",
    medium: "Cellular automata, MIDI synthesis",
    detail: "Generative composition",
    bg: "linear-gradient(135deg, oklch(45% 0.08 150), oklch(55% 0.06 130))",
  },
];

export function MuseumLayout() {
  return (
    <div
      className="min-h-[340px] p-8"
      style={{ background: "oklch(97% 0 0)", color: "oklch(20% 0 0)" }}
    >
      <div className="flex flex-wrap justify-center gap-12">
        {pieces.map((piece) => (
          <div key={piece.title} className="max-w-[200px] text-center">
            {/* Frame */}
            <div
              className="mb-3"
              style={{
                border: "8px solid oklch(80% 0.01 50)",
                boxShadow: "0 4px 16px oklch(0% 0 0 / 0.1)",
              }}
            >
              <div className="h-[140px]" style={{ background: piece.bg }} />
            </div>

            {/* Placard */}
            <div
              className="p-2 text-left"
              style={{ borderLeft: "3px solid oklch(60% 0.01 50)" }}
            >
              <div className="font-serif text-[13px] font-bold italic">
                {piece.title}
              </div>
              <div className="text-[11px]" style={{ color: "oklch(50% 0 0)" }}>
                {piece.artist}
              </div>
              <div
                className="mt-0.5 text-[10px]"
                style={{ color: "oklch(60% 0 0)" }}
              >
                {piece.medium}
              </div>
              <div className="text-[10px]" style={{ color: "oklch(60% 0 0)" }}>
                {piece.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
