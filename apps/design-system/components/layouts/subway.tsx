const lines = [
  {
    name: "Visual Art",
    color: "bg-indigo-500",
    dotBorder: "border-indigo-500",
    top: "70px",
    left: "50px",
    width: "400px",
    stations: [
      { label: "Isometric city", detail: "pixelweaver \u00B7 287\u2191", left: "50px" },
      { label: "Win98 screensavers", detail: "retro_dev \u00B7 134\u2191", left: "220px" },
      { label: "Interactive pixels", detail: "touchpixel \u00B7 41\u2191", left: "420px" },
    ],
  },
  {
    name: "GPU",
    color: "bg-green-500",
    dotBorder: "border-green-500",
    top: "160px",
    left: "80px",
    width: "500px",
    stations: [
      { label: "WebGPU shaders", detail: "shader_witch \u00B7 156\u2191", left: "80px" },
      { label: "Shader playground", detail: "glsl_gang \u00B7 76\u2191", left: "290px", transfer: true },
      { label: "Fluid sim", detail: "flowstate \u00B7 54\u2191", left: "470px" },
    ],
  },
  {
    name: "Generative",
    color: "bg-amber-500",
    dotBorder: "border-amber-500",
    top: "250px",
    left: "30px",
    width: "450px",
    stations: [
      { label: "Cell automata music", detail: "bytebard \u00B7 203\u2191", left: "30px" },
      { label: "Perlin noise tut", detail: "noise_maker \u00B7 38\u2191", left: "230px" },
      { label: "Challenge #47", detail: "admin \u00B7 98\u2191", left: "420px" },
    ],
  },
];

export function SubwayLayout() {
  return (
    <div className="p-4">
      <div className="relative rounded-lg border border-zinc-800 bg-zinc-950 h-[340px] overflow-hidden">
        {/* Lines */}
        {lines.map((line) => (
          <div
            key={line.name}
            className={`absolute h-1 rounded-full ${line.color}`}
            style={{ top: line.top, left: line.left, width: line.width }}
          />
        ))}

        {/* Cross-line (vertical connector) */}
        <div
          className="absolute w-1 rounded-full bg-rose-400"
          style={{ top: "70px", left: "300px", height: "190px" }}
        />

        {/* Stations */}
        {lines.map((line) =>
          line.stations.map((station) => (
            <div
              key={station.label}
              className="absolute"
              style={{ top: `calc(${line.top} - 12px)`, left: station.left }}
            >
              <div
                className={`w-5 h-5 rounded-full border-[3px] ${line.dotBorder} ${
                  station.transfer ? "bg-rose-400" : "bg-zinc-950"
                }`}
              />
              <div className="mt-1">
                <div className="text-[11px] font-semibold text-zinc-200 whitespace-nowrap">
                  {station.label}
                </div>
                <div className="text-[9px] text-zinc-500 whitespace-nowrap">
                  {station.detail}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
