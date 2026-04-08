interface LayoutPreviewProps {
  number: number;
  name: string;
  vibe: string;
  description: string;
  children: React.ReactNode;
}

export function LayoutPreview({ number, name, vibe, description, children }: LayoutPreviewProps) {
  return (
    <section className="max-w-[960px] mx-auto mb-12 px-6" id={name.toLowerCase().replace(/\s+/g, "-")}>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-mono text-xs text-accent-secondary font-semibold">
          {String(number).padStart(2, "0")}
        </span>
        <h2 className="font-serif text-2xl font-bold">{name}</h2>
        <span className="text-xs text-text-muted italic">{vibe}</span>
      </div>
      <p className="text-sm text-text-secondary mb-4 max-w-[640px]">{description}</p>
      <div className="bg-bg-surface border border-bg-elevated rounded-xl overflow-hidden min-h-[320px] relative">
        {children}
      </div>
    </section>
  );
}
