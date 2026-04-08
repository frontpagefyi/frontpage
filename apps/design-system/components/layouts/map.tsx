const clusterLabels = [
  { label: "VISUAL ART", className: "top-5 left-[60px]" },
  { label: "GPU / SHADERS", className: "top-5 right-[120px]" },
  { label: "GENERATIVE", className: "bottom-10 left-[200px]" },
];

const nodes = [
  {
    title: "Isometric city — 6 months",
    meta: "pixelweaver · 287 likes",
    className: "top-[50px] left-10",
  },
  {
    title: "Win98 screensavers in p5.js",
    meta: "retro_dev · 134 likes",
    className: "top-[120px] left-[120px]",
  },
  {
    title: "WebGPU compute shaders",
    meta: "shader_witch · 156 likes",
    className: "top-[50px] right-[60px]",
  },
  {
    title: "Fluid sim with Navier-Stokes",
    meta: "flowstate · 54 likes",
    className: "top-[140px] right-[100px]",
  },
  {
    title: "Cellular automata music",
    meta: "bytebard · 203 likes",
    className: "bottom-20 left-40",
  },
  {
    title: "Challenge #47: Landscapes",
    meta: "admin · 98 likes",
    className: "bottom-[60px] left-[380px]",
  },
  {
    title: "Shader playground (open call)",
    meta: "glsl_gang · 76 likes",
    className: "top-[230px] left-[340px]",
  },
];

export function MapLayout() {
  return (
    <div
      className="h-[380px] relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 25% 35%, oklch(20% 0.04 270 / 0.8), transparent 30%),
          radial-gradient(circle at 70% 60%, oklch(20% 0.04 200 / 0.8), transparent 30%),
          radial-gradient(circle at 50% 80%, oklch(20% 0.04 320 / 0.6), transparent 25%),
          var(--bg-base)
        `,
      }}
    >
      {/* Cluster labels */}
      {clusterLabels.map((cluster) => (
        <div
          key={cluster.label}
          className={`absolute text-[10px] font-bold uppercase text-text-muted tracking-[1px] ${cluster.className}`}
        >
          {cluster.label}
        </div>
      ))}

      {/* Nodes */}
      {nodes.map((node) => (
        <div
          key={node.title}
          className={`absolute bg-bg-surface border border-bg-elevated rounded-md px-2.5 py-2 text-[11px] max-w-[160px] shadow-[0_2px_8px_oklch(0%_0_0/0.2)] transition-[transform,box-shadow] duration-150 hover:scale-105 hover:shadow-[0_4px_16px_oklch(0%_0_0/0.3)] hover:z-10 ${node.className}`}
        >
          <div className="font-bold leading-[1.2] mb-0.5">{node.title}</div>
          <div className="text-[10px] text-text-muted">{node.meta}</div>
        </div>
      ))}
    </div>
  );
}
