const radii = [
  { name: "--radius-sm", value: "4px", css: "var(--radius-sm)" },
  { name: "--radius-md", value: "8px", css: "var(--radius-md)" },
  { name: "--radius-lg", value: "12px", css: "var(--radius-lg)" },
  { name: "--radius-xl", value: "16px", css: "var(--radius-xl)" },
  { name: "--radius-full", value: "9999px", css: "var(--radius-full)" },
];

export function RadiusScale() {
  return (
    <div className="flex gap-6">
      {radii.map((r) => (
        <div key={r.name} className="flex flex-col items-center gap-2">
          <div
            className="bg-bg-elevated border border-bg-overlay"
            style={{
              width: 80,
              height: 80,
              borderRadius: r.css,
            }}
          />
          <span className="text-xs font-mono text-text-muted">{r.name}</span>
          <span className="text-xs text-text-secondary">{r.value}</span>
        </div>
      ))}
    </div>
  );
}
