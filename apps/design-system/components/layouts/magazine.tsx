export function MagazineLayout() {
  return (
    <div className="p-5">
      {/* Hero */}
      <div className="relative rounded-lg overflow-hidden mb-3">
        <div
          className="h-[200px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=800&q=80')",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="text-[16px] font-bold leading-tight text-white">
            Just finished this isometric city — 6 months of pixel work
          </div>
          <div className="text-[11px] text-white/70 mt-1">
            pixelweaver &middot; 287 likes &middot; 94 comments
          </div>
        </div>
      </div>

      {/* 3-card grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-bg-surface rounded-md overflow-hidden">
          <div
            className="h-[80px] bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80')",
            }}
          />
          <div className="p-2.5">
            <div className="text-[12px] font-semibold leading-tight mb-1">
              WebGPU compute shaders are here
            </div>
            <div className="text-[10px] text-text-muted">shader_witch &middot; 5h ago</div>
          </div>
        </div>

        <div className="bg-bg-surface rounded-md overflow-hidden">
          <div
            className="h-[80px] bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80')",
            }}
          />
          <div className="p-2.5">
            <div className="text-[12px] font-semibold leading-tight mb-1">
              Cellular automata music generator
            </div>
            <div className="text-[10px] text-text-muted">bytebard &middot; 8h ago</div>
          </div>
        </div>

        <div className="bg-bg-surface rounded-md overflow-hidden">
          <div
            className="h-[80px] bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80')",
            }}
          />
          <div className="p-2.5">
            <div className="text-[12px] font-semibold leading-tight mb-1">
              Weekly challenge #47: Landscapes
            </div>
            <div className="text-[10px] text-text-muted">admin &middot; 12h ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}
