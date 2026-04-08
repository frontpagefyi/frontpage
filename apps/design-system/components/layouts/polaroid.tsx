const polaroids = [
  { caption: "isometric city!! \u2665", rotation: "-3deg", top: "20px", left: "40px", gradient: "from-pink-400 to-orange-300" },
  { caption: "webgpu particles", rotation: "2deg", top: "30px", left: "240px", gradient: "from-blue-400 to-cyan-300" },
  { caption: "win98 vibes", rotation: "-1.5deg", top: "40px", left: "auto", right: "60px", gradient: "from-amber-400 to-red-300" },
  { caption: "cellular music", rotation: "1deg", top: "200px", left: "100px", gradient: "from-green-400 to-emerald-300" },
  { caption: "fluid sim wow", rotation: "-2.5deg", top: "190px", left: "auto", right: "120px", gradient: "from-violet-400 to-purple-300" },
];

export function PolaroidLayout() {
  return (
    <div className="p-4">
      <div className="relative rounded-lg bg-amber-950/20 border border-amber-900/30 h-[400px] overflow-hidden">
        {polaroids.map((p) => (
          <div
            key={p.caption}
            className="absolute bg-white p-2 pb-10 shadow-lg shadow-black/30"
            style={{
              top: p.top,
              left: p.left !== "auto" ? p.left : undefined,
              right: p.right,
              transform: `rotate(${p.rotation})`,
            }}
          >
            <div
              className={`w-[130px] h-[110px] bg-gradient-to-br ${p.gradient} rounded-sm`}
            />
            <div className="absolute bottom-2 left-0 right-0 text-center font-serif italic text-sm text-zinc-600">
              {p.caption}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
