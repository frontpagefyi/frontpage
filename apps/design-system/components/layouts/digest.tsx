export function DigestLayout() {
  return (
    <div className="max-w-[560px] mx-auto px-8 py-6">
      {/* Header */}
      <div className="text-center pb-4 border-b-2 border-accent-secondary mb-5">
        <h2 className="font-serif text-2xl font-bold">Creative Coding Weekly</h2>
        <div className="text-[11px] text-text-muted mt-1">Week of April 7, 2026 &middot; Issue #47</div>
      </div>

      {/* Top This Week */}
      <div className="mb-6">
        <div className="text-[11px] font-bold uppercase text-accent-secondary tracking-wide mb-3 pb-1 border-b border-bg-elevated">
          Top This Week
        </div>
        <div className="mb-3.5">
          <div className="font-bold text-sm leading-tight">
            Isometric city completed after 6 months of pixel work
          </div>
          <div className="text-xs text-text-secondary leading-normal mt-0.5">
            pixelweaver&apos;s magnum opus: 200 unique buildings, dynamic lighting, and animated citizens. The community&apos;s most-liked post this month.
          </div>
          <div className="text-[10px] text-text-muted mt-0.5">287 likes &middot; 94 comments &middot; pixelweaver</div>
        </div>
        <div className="mb-3.5">
          <div className="font-bold text-sm leading-tight">
            Cellular automata meets MIDI synthesis
          </div>
          <div className="text-xs text-text-secondary leading-normal mt-0.5">
            bytebard mapped Conway&apos;s Game of Life to musical notes. The emergent melodies are surprisingly listenable.
          </div>
          <div className="text-[10px] text-text-muted mt-0.5">203 likes &middot; 32 comments &middot; bytebard</div>
        </div>
      </div>

      {/* Hot Discussions */}
      <div className="mb-6">
        <div className="text-[11px] font-bold uppercase text-accent-secondary tracking-wide mb-3 pb-1 border-b border-bg-elevated">
          Hot Discussions
        </div>
        <div className="mb-3.5">
          <div className="font-bold text-sm leading-tight">
            WebGPU compute shaders &mdash; is this the future?
          </div>
          <div className="text-xs text-text-secondary leading-normal mt-0.5">
            47 replies debating whether WebGPU will replace WebGL for creative coding. Consensus: yes, but not yet.
          </div>
          <div className="text-[10px] text-text-muted mt-0.5">156 likes &middot; shader_witch started the thread</div>
        </div>
      </div>

      {/* Community Pulse */}
      <div className="mb-6">
        <div className="text-[11px] font-bold uppercase text-accent-secondary tracking-wide mb-3 pb-1 border-b border-bg-elevated">
          Community Pulse
        </div>
        <div className="text-center py-4 border border-dashed border-bg-overlay rounded-md text-xs text-text-muted">
          Challenge #47 is live: Generative Landscapes &middot; 18 entries &middot; 3 days remaining
        </div>
      </div>
    </div>
  );
}
