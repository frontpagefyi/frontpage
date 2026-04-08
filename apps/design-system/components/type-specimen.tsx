interface TypeSpecimenProps {
  family: string;
  cssClass: string;
  description: string;
}

const sizes = [
  { label: "3xl (30px)", className: "text-3xl" },
  { label: "2xl (24px)", className: "text-2xl" },
  { label: "xl (20px)", className: "text-xl" },
  { label: "lg (18px)", className: "text-lg" },
  { label: "base (16px)", className: "text-base" },
  { label: "sm (14px)", className: "text-sm" },
  { label: "xs (12px)", className: "text-xs" },
];

export function TypeSpecimen({ family, cssClass, description }: TypeSpecimenProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold font-serif">{family}</h3>
        <p className="text-sm text-text-muted">{description}</p>
      </div>
      <div className="space-y-2">
        {sizes.map(({ label, className }) => (
          <div key={label} className="flex items-baseline gap-4">
            <span className="text-[10px] font-mono text-text-muted w-24 shrink-0">
              {label}
            </span>
            <span className={`${className} ${cssClass} text-text-primary`}>
              The quick brown fox jumps over the lazy dog
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
