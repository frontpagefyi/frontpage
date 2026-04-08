const spacingTokens = [
  { name: "1", value: "4px" },
  { name: "2", value: "8px" },
  { name: "3", value: "12px" },
  { name: "4", value: "16px" },
  { name: "6", value: "24px" },
  { name: "8", value: "32px" },
  { name: "10", value: "40px" },
  { name: "12", value: "48px" },
  { name: "16", value: "64px" },
];

export function SpacingScale() {
  return (
    <div className="space-y-2">
      {spacingTokens.map(({ name, value }) => (
        <div key={name} className="flex items-center gap-4">
          <span className="text-xs font-mono text-text-muted w-24 shrink-0 text-right whitespace-nowrap">
            {name} ({value})
          </span>
          <div
            className="h-4 rounded bg-indigo-500"
            style={{ width: value }}
          />
        </div>
      ))}
    </div>
  );
}
