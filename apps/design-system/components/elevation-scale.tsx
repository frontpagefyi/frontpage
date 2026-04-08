const elevations = [
  { level: 0, label: "Flat", shadow: "none" },
  { level: 1, label: "Raised", shadow: "0 1px 2px oklch(0 0 0 / 0.05)" },
  {
    level: 2,
    label: "Card",
    shadow: "0 2px 4px oklch(0 0 0 / 0.06), 0 1px 2px oklch(0 0 0 / 0.04)",
  },
  {
    level: 3,
    label: "Dropdown",
    shadow: "0 4px 8px oklch(0 0 0 / 0.08), 0 2px 4px oklch(0 0 0 / 0.04)",
  },
  {
    level: 4,
    label: "Modal",
    shadow:
      "0 8px 24px oklch(0 0 0 / 0.12), 0 4px 8px oklch(0 0 0 / 0.06)",
  },
];

export function ElevationScale() {
  return (
    <div className="flex gap-6">
      {elevations.map((e) => (
        <div key={e.level} className="flex flex-col items-center gap-2">
          <div
            className="bg-bg-surface rounded-lg"
            style={{
              width: 120,
              height: 80,
              boxShadow: e.shadow,
            }}
          />
          <span className="text-xs font-mono text-text-muted">
            Level {e.level}
          </span>
          <span className="text-xs text-text-secondary">{e.label}</span>
        </div>
      ))}
    </div>
  );
}
