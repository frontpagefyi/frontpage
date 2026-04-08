const pins = [
  { id: "isometric", title: "Isometric city", meta: "pixelweaver \u00B7 287\u2191", top: 30, left: 30, rotate: -1 },
  { id: "webgpu", title: "WebGPU compute shaders", meta: "shader_witch \u00B7 156\u2191", top: 20, left: 280, rotate: 1.5 },
  { id: "shader", title: "Shader playground", meta: "glsl_gang \u00B7 76\u2191", top: 30, left: 480, rotate: -2 },
  { id: "automata", title: "Cell automata music", meta: "bytebard \u00B7 203\u2191", top: 160, left: 100, rotate: 2 },
  { id: "fluid", title: "Fluid sim GLSL", meta: "flowstate \u00B7 54\u2191", top: 180, left: 350, rotate: -1 },
  { id: "challenge", title: "Challenge #47", meta: "admin \u00B7 98\u2191", top: 280, left: 200, rotate: 1 },
  { id: "perlin", title: "Perlin noise tut", meta: "noise_maker \u00B7 38\u2191", top: 300, left: 460, rotate: -3 },
];

// Red strings connecting related pins (by index pairs)
const strings: [number, number][] = [
  [0, 3], // isometric -> automata
  [1, 2], // webgpu -> shader
  [1, 4], // webgpu -> fluid
  [3, 5], // automata -> challenge
  [2, 6], // shader -> perlin
  [4, 5], // fluid -> challenge
];

export function CorkstringLayout() {
  return (
    <div className="px-6 py-5 max-w-[600px] mx-auto">
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, oklch(75% 0.08 70), oklch(65% 0.1 60))",
          height: 400,
        }}
      >
        {/* SVG string connections */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
          style={{ zIndex: 0 }}
        >
          {strings.map(([a, b], i) => {
            const pinA = pins[a];
            const pinB = pins[b];
            // Offset to center of pin card (~60px wide, ~30px tall)
            const x1 = pinA.left + 60;
            const y1 = pinA.top + 20;
            const x2 = pinB.left + 60;
            const y2 = pinB.top + 20;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="oklch(55% 0.2 25)"
                strokeWidth={1.5}
                opacity={0.6}
              />
            );
          })}
        </svg>

        {/* Pin cards */}
        {pins.map((pin) => (
          <div
            key={pin.id}
            className="absolute z-10"
            style={{
              top: pin.top,
              left: pin.left,
              transform: `rotate(${pin.rotate}deg)`,
            }}
          >
            {/* Red pushpin dot */}
            <div
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-500 z-20 shadow-sm"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
            />
            {/* Card */}
            <div className="bg-white/90 rounded px-3 py-2 shadow-md min-w-[100px]">
              <div className="text-xs font-bold text-gray-900">{pin.title}</div>
              <div className="text-[10px] text-gray-600">{pin.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
