export default function Home() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Frontpage Design System</h1>
      <div className="grid grid-cols-5 gap-4">
        {["bg-base", "bg-surface", "bg-elevated", "bg-overlay", "bg-interactive"].map(
          (name) => (
            <div key={name} className="space-y-2">
              <div
                className="h-16 rounded-lg border border-bg-elevated"
                style={{ background: `var(--color-${name})` }}
              />
              <p className="text-xs text-text-muted">{name}</p>
            </div>
          )
        )}
      </div>
    </main>
  );
}
