export function NewspaperLayout() {
  return (
    <div className="p-5">
      {/* Masthead */}
      <div className="text-center py-3 pb-4 border-b-[3px] border-double border-text-muted mb-4">
        <h2 className="font-serif text-[28px] font-bold tracking-tight">Creative Coding</h2>
        <div className="text-[11px] text-text-muted">Monday, April 7, 2026 &middot; 2,847 members</div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-4">
        {/* Lead story */}
        <div className="row-span-2">
          <div
            className="h-[160px] rounded-md mb-3 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=800&q=80')",
              backgroundColor: "var(--indigo-700)",
            }}
          />
          <div className="pb-3 border-b border-bg-elevated mb-3">
            <div className="font-serif font-bold text-xl leading-tight mb-1">
              Isometric city completed after 6 months of pixel work
            </div>
            <div className="text-xs text-text-secondary leading-normal">
              Local artist pixelweaver reveals the culmination of a half-year endeavor in pixel art, featuring over 200 unique buildings, dynamic lighting, and animated citizens going about their daily routines.
            </div>
            <div className="text-[10px] text-text-muted mt-1">By pixelweaver &middot; 287 likes</div>
          </div>
        </div>

        {/* Column 2 */}
        <div>
          <div className="pb-3 border-b border-bg-elevated mb-3">
            <div className="font-serif font-bold text-[13px] leading-tight mb-1">
              WebGPU compute shaders change everything
            </div>
            <div className="text-xs text-text-secondary leading-normal">
              1M particles at 60fps with zero CPU overhead &mdash; the browser just got serious.
            </div>
            <div className="text-[10px] text-text-muted mt-1">shader_witch &middot; 156 likes</div>
          </div>
          <div className="pb-3">
            <div className="font-serif font-bold text-[13px] leading-tight mb-1">
              Weekly challenge: Generative landscapes
            </div>
            <div className="text-xs text-text-secondary leading-normal">
              Challenge #47 is live. Theme: landscapes generated from real-world data.
            </div>
            <div className="text-[10px] text-text-muted mt-1">admin &middot; 98 likes</div>
          </div>
        </div>

        {/* Column 3 */}
        <div>
          <div className="pb-3 border-b border-bg-elevated mb-3">
            <div className="font-serif font-bold text-[13px] leading-tight mb-1">
              Cellular automata meets MIDI synthesis
            </div>
            <div className="text-xs text-text-secondary leading-normal">
              Conway&apos;s Game of Life as a music generator. Each cell state maps to a note.
            </div>
            <div className="text-[10px] text-text-muted mt-1">bytebard &middot; 203 likes</div>
          </div>
          <div className="pb-3">
            <div className="font-serif font-bold text-[13px] leading-tight mb-1">
              Open call: Shader playground contributors
            </div>
            <div className="text-xs text-text-secondary leading-normal">
              New open-source project needs help building a browser-based GLSL sandbox.
            </div>
            <div className="text-[10px] text-text-muted mt-1">glsl_gang &middot; 76 likes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
