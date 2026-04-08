const weights = [
  { value: 400, name: "Regular" },
  { value: 500, name: "Medium" },
  { value: 600, name: "Semibold" },
  { value: 700, name: "Bold" },
];

interface WeightSpecimenProps {
  family: string;
  cssClass: string;
}

export function WeightSpecimen({ family, cssClass }: WeightSpecimenProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text-secondary">{family}</h3>
      <div className="grid gap-4">
        {weights.map((w) => (
          <div key={w.value} className="space-y-1">
            <span className="text-xs font-mono text-text-muted">
              {w.value} {w.name}
            </span>
            <p
              className={`${cssClass} text-base text-text-primary`}
              style={{ fontWeight: w.value }}
            >
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
