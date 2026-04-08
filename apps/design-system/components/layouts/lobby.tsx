const floors = [
  {
    num: 5,
    name: "Challenges & Events",
    rooms: "Rm 501: Challenge #47 Landscapes \u00B7 Rm 502: Past Winners Gallery",
    elevator: "up",
  },
  {
    num: 4,
    name: "GPU & Shaders",
    rooms: "Rm 401: WebGPU Compute \u00B7 Rm 402: Fluid Sim \u00B7 Rm 403: Shader Playground",
  },
  {
    num: 3,
    name: "Generative & Audio",
    rooms: "Rm 301: Cell Automata Music \u00B7 Rm 302: Perlin Noise Tutorial",
  },
  {
    num: 2,
    name: "Visual Art",
    rooms: "Rm 201: Isometric City \u00B7 Rm 202: Win98 Screensavers \u00B7 Rm 203: Interactive Pixels",
  },
  {
    num: 1,
    name: "Lobby & Info Desk",
    rooms: "Community Rules \u00B7 Getting Started \u00B7 134 visitors in building",
    elevator: "down",
    isLobby: true,
  },
];

export function LobbyLayout() {
  return (
    <div className="px-6 py-5 max-w-[560px] mx-auto">
      <div className="border border-border-default rounded-xl overflow-hidden bg-bg-surface">
        {floors.map((floor) => (
          <div
            key={floor.num}
            className="flex items-stretch border-b border-border-default last:border-b-0"
          >
            {/* Floor number */}
            <div className="w-12 flex-shrink-0 flex items-center justify-center bg-bg-elevated font-bold text-lg text-text-secondary border-r border-border-default">
              {floor.num}
            </div>

            {/* Floor content */}
            <div className="flex-1 px-4 py-3 min-w-0">
              <div
                className={`font-semibold text-sm ${floor.isLobby ? "text-accent-secondary" : "text-text-primary"}`}
              >
                {floor.name}
              </div>
              <div className="text-xs text-text-secondary mt-0.5 truncate">
                {floor.rooms}
              </div>
            </div>

            {/* Elevator column */}
            <div className="w-10 flex-shrink-0 flex items-center justify-center border-l border-border-default">
              {floor.elevator === "up" && (
                <div className="w-6 h-6 rounded bg-bg-elevated flex items-center justify-center text-xs text-text-secondary cursor-pointer hover:bg-accent-primary hover:text-white transition-colors">
                  &#9650;
                </div>
              )}
              {floor.elevator === "down" && (
                <div className="w-6 h-6 rounded bg-bg-elevated flex items-center justify-center text-xs text-text-secondary cursor-pointer hover:bg-accent-primary hover:text-white transition-colors">
                  &#9660;
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
