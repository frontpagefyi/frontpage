interface ColorSwatchProps {
  name: string;
  value: string;
  cssVar: string;
}

export function ColorSwatch({ name, value, cssVar }: ColorSwatchProps) {
  return (
    <div className="space-y-2">
      <div
        className="h-16 rounded-lg border border-bg-elevated"
        style={{ background: `var(${cssVar})` }}
      />
      <p className="text-xs font-medium text-text-primary">{name}</p>
      <p className="text-[10px] font-mono text-text-muted">{value}</p>
    </div>
  );
}
