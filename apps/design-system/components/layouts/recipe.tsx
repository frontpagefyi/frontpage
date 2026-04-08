const recipes = [
  {
    title: "Isometric City Recipe",
    prep: "6 months",
    serves: 287,
    body: "Ingredients: 200 buildings, 1 palette generator, dynamic lighting, animated NPCs. Mix with patience. Bake for 6 months.",
    color: "border-indigo-500",
    rotate: -1,
  },
  {
    title: "WebGPU Particle Soup",
    prep: "4 hrs",
    serves: 156,
    body: "Combine 1M particles with compute shaders. Heat to 60fps. Serve with zero CPU overhead. Best enjoyed in Chrome Canary.",
    color: "border-amber-500",
    rotate: 0.5,
  },
  {
    title: "Cellular Automata Jam",
    prep: "8 hrs",
    serves: 203,
    body: "Map Conway\u2019s Game of Life to MIDI notes. Let the cells ferment into surprising melodies. Season with chord progressions.",
    color: "border-green-500",
    rotate: -0.5,
  },
];

export function RecipeLayout() {
  return (
    <div className="px-6 py-5 max-w-[600px] mx-auto">
      <div className="flex gap-4">
        {recipes.map((r) => (
          <div
            key={r.title}
            className={`flex-1 rounded-lg border-t-4 ${r.color} p-4`}
            style={{
              background: "linear-gradient(180deg, oklch(95% 0.03 80), oklch(92% 0.04 75))",
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 22px, oklch(70% 0.04 220 / 0.15) 22px, oklch(70% 0.04 220 / 0.15) 23px)",
              transform: `rotate(${r.rotate}deg)`,
              boxShadow: "0 2px 8px oklch(0% 0 0 / 0.1)",
            }}
          >
            <div className="font-serif italic text-sm font-bold text-gray-800 mb-2">
              {r.title}
            </div>
            <div className="flex gap-3 text-[10px] text-gray-500 mb-2">
              <span>Prep: {r.prep}</span>
              <span>Serves: {r.serves}</span>
            </div>
            <div className="text-xs text-gray-700 leading-relaxed">
              {r.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
