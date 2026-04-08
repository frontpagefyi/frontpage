const sections = [
  {
    label: "Trending",
    sublabel: "12 posts",
    books: [
      {
        title: "Isometric City",
        gradient: "linear-gradient(180deg, var(--indigo-600), var(--indigo-800))",
        minHeight: 130,
      },
      {
        title: "WebGPU Shaders",
        gradient: "linear-gradient(180deg, oklch(45% 0.15 280), oklch(35% 0.12 280))",
        minHeight: 110,
      },
      {
        title: "Cellular MIDI",
        gradient: "linear-gradient(180deg, oklch(45% 0.15 150), oklch(35% 0.12 150))",
        minHeight: 140,
      },
      {
        title: "Win98 Screensavers",
        gradient: "linear-gradient(180deg, oklch(50% 0.12 40), oklch(40% 0.1 40))",
        minHeight: 100,
      },
      {
        title: "Fluid Simulation",
        gradient: "linear-gradient(180deg, oklch(40% 0.1 200), oklch(30% 0.08 200))",
        minHeight: 120,
      },
      {
        title: "Interactive Pixels",
        gradient: "linear-gradient(180deg, oklch(45% 0.1 320), oklch(35% 0.08 320))",
        minHeight: 115,
      },
      {
        title: "Perlin Noise",
        gradient: "linear-gradient(180deg, oklch(50% 0.15 80), oklch(40% 0.12 80))",
        minHeight: 105,
      },
    ],
  },
  {
    label: "Challenges",
    sublabel: "5 active",
    books: [
      {
        title: "#47 Landscapes",
        gradient: "linear-gradient(180deg, var(--accent-primary), oklch(55% 0.15 75))",
        minHeight: 120,
        width: 56,
      },
      {
        title: "#46 Sound",
        gradient: "linear-gradient(180deg, oklch(60% 0.12 200), oklch(45% 0.1 200))",
        minHeight: 110,
      },
      {
        title: "#45 Fractals",
        gradient: "linear-gradient(180deg, oklch(55% 0.12 340), oklch(40% 0.1 340))",
        minHeight: 100,
      },
    ],
  },
  {
    label: "Open Calls",
    sublabel: "2 projects",
    books: [
      {
        title: "Shader Playground",
        gradient: "linear-gradient(180deg, var(--accent-secondary), oklch(40% 0.15 280))",
        minHeight: 120,
        width: 56,
      },
      {
        title: "ASCII Raytracer",
        gradient: "linear-gradient(180deg, oklch(50% 0.12 120), oklch(38% 0.1 120))",
        minHeight: 105,
      },
    ],
  },
];

export function ShelfLayout() {
  return (
    <div className="p-5 overflow-hidden">
      {sections.map((section) => (
        <div key={section.label} className="mb-6">
          <div className="text-[13px] font-bold mb-2.5 flex items-center gap-2">
            {section.label}{" "}
            <small className="font-normal text-text-muted text-[11px]">
              · {section.sublabel}
            </small>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
            {section.books.map((book) => (
              <div
                key={book.title}
                className="shrink-0 rounded-[2px_4px_4px_2px] flex items-center justify-center [writing-mode:vertical-rl] [text-orientation:mixed] text-[10px] font-bold px-1 py-2 shadow-[2px_2px_4px_oklch(0%_0_0/0.3)] cursor-pointer transition-transform duration-150 hover:-translate-y-2 leading-[1.2] text-white"
                style={{
                  background: book.gradient,
                  minHeight: book.minHeight,
                  width: book.width ?? 48,
                }}
              >
                {book.title}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
