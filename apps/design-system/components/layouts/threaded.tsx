export function ThreadedLayout() {
  return (
    <div className="px-8 py-5 max-w-[680px] mx-auto">
      {/* Thread 1 — with replies */}
      <div className="mb-5">
        <div className="border-l-[3px] border-accent-secondary pl-4 pb-3">
          <div className="text-[15px] font-bold leading-tight mb-1">
            Anyone tried the new WebGPU compute shaders?
          </div>
          <div className="text-[13px] text-text-secondary leading-relaxed">
            Just got my hands on the latest Chrome Canary build. Running 1M particles at 60fps with
            zero CPU overhead. This changes everything for creative coding in the browser.
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-text-muted">
            <div
              className="w-[18px] h-[18px] rounded-full bg-cover bg-center shrink-0"
              style={{ backgroundImage: "url('https://i.pravatar.cc/36?img=5')" }}
            />
            shader_witch &middot; 5h ago &middot; 47 replies
          </div>
        </div>

        {/* Replies */}
        <div className="ml-6 mt-2 space-y-2">
          <div className="border-l border-bg-elevated pl-3 py-1.5 text-[12px]">
            <strong className="text-text-primary">pixelweaver</strong>{" "}
            <span className="text-text-secondary">
              Have you tried the storage buffer approach? I got 2M particles that way.
            </span>
            <div className="text-[10px] text-text-muted mt-1">4h ago &middot; 12 likes</div>
          </div>
          <div className="border-l border-bg-elevated pl-3 py-1.5 text-[12px]">
            <strong className="text-text-primary">bytebard</strong>{" "}
            <span className="text-text-secondary">
              This is exactly what I need for my music visualizer. Any repo link?
            </span>
            <div className="text-[10px] text-text-muted mt-1">3h ago &middot; 5 likes</div>
          </div>
          <div className="border-l border-bg-elevated pl-3 py-1.5 text-[12px]">
            <strong className="text-text-primary">shader_witch</strong>{" "}
            <span className="text-text-secondary">
              @bytebard pushing it up now, will share in 20min
            </span>
            <div className="text-[10px] text-text-muted mt-1">3h ago &middot; 8 likes</div>
          </div>
        </div>
      </div>

      {/* Thread 2 — collapsed */}
      <div className="mb-5">
        <div className="border-l-[3px] border-accent-secondary pl-4 pb-3">
          <div className="text-[15px] font-bold leading-tight mb-1">
            Made a cellular automata music generator
          </div>
          <div className="text-[13px] text-text-secondary leading-relaxed">
            Each cell maps to a MIDI note. Conway&#39;s Game of Life becomes a generative synth.
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-text-muted">
            <div
              className="w-[18px] h-[18px] rounded-full bg-cover bg-center shrink-0"
              style={{ backgroundImage: "url('https://i.pravatar.cc/36?img=8')" }}
            />
            bytebard &middot; 8h ago &middot; 32 replies
          </div>
        </div>
      </div>
    </div>
  );
}
