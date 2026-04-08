export function ZineLayout() {
  return (
    <div
      className="relative h-[420px] overflow-hidden bg-bg-base"
      style={{
        background: "repeating-linear-gradient(135deg, transparent, transparent 40px, var(--bg-elevated) 40px, var(--bg-elevated) 41px)",
      }}
    >
      {/* Piece 1: Big headline */}
      <div
        className="absolute p-4 border-2 border-accent-primary bg-bg-surface"
        style={{ top: 20, left: 40, width: 280, transform: "rotate(-1.5deg)" }}
      >
        <div className="text-[24px] font-black leading-none tracking-tight">ISOMETRIC CITY</div>
        <div className="text-[11px] text-text-secondary mt-1">
          6 months. 200 buildings. infinite patience.
        </div>
        <div className="text-[10px] text-text-muted mt-1.5">&mdash; pixelweaver</div>
      </div>

      {/* Tape element */}
      <div
        className="absolute w-10 h-3 bg-[oklch(80%_0.05_85/0.7)] rounded-sm z-10"
        style={{ top: 15, left: 160, transform: "rotate(-12deg)" }}
      />

      {/* Piece 2: Image with handwriting */}
      <div
        className="absolute bg-bg-surface overflow-hidden"
        style={{ top: 40, right: 60, width: 240, transform: "rotate(2deg)" }}
      >
        <div
          className="h-[100px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=400&q=80')",
          }}
        />
        <div className="p-2">
          <div className="font-serif italic text-[18px] text-accent-primary">
            pixel art is not dead
          </div>
        </div>
      </div>

      {/* Sticker */}
      <div
        className="absolute text-[28px] select-none"
        style={{ top: 140, left: 340, transform: "rotate(-8deg)" }}
      >
        &#9889;
      </div>

      {/* Piece 3: Cutout + handwriting */}
      <div
        className="absolute p-3 bg-bg-surface"
        style={{ top: 170, left: 80, width: 200, transform: "rotate(1deg)" }}
      >
        <div className="bg-bg-elevated px-2 py-1.5 rounded-sm border border-bg-elevated inline-block">
          <div className="text-[13px] font-bold">WebGPU COMPUTE</div>
          <div className="text-[10px] text-text-secondary">1M particles. 60fps. Zero CPU.</div>
        </div>
        <div
          className="font-serif italic text-[14px] text-accent-secondary mt-1.5"
          style={{ transform: "rotate(-3deg)" }}
        >
          shader_witch says: &ldquo;this changes everything&rdquo;
        </div>
      </div>

      {/* Tape element 2 */}
      <div
        className="absolute w-10 h-3 bg-[oklch(80%_0.05_85/0.7)] rounded-sm z-10"
        style={{ top: 170, right: 180, transform: "rotate(8deg)" }}
      />

      {/* Piece 4: Challenge highlight */}
      <div
        className="absolute p-3.5 bg-bg-elevated"
        style={{ top: 200, right: 40, width: 220, transform: "rotate(-2.5deg)" }}
      >
        <div className="text-[12px] font-bold mb-1">WEEKLY CHALLENGE #47</div>
        <div className="inline text-[16px] font-bold bg-accent-primary/20 px-1">
          Generative Landscapes
        </div>
        <div className="text-[10px] text-text-muted mt-1.5">
          submissions open &middot; 18 entries so far
        </div>
      </div>

      {/* Sticker 2 */}
      <div
        className="absolute text-[28px] select-none"
        style={{ top: 300, left: 30, transform: "rotate(15deg)" }}
      >
        &#127912;
      </div>

      {/* Piece 5: Music from math */}
      <div
        className="absolute p-2.5 bg-bg-surface border-b-[3px] border-accent-success"
        style={{ top: 310, left: 180, width: 260, transform: "rotate(0.5deg)" }}
      >
        <div className="font-serif italic text-[20px]">music from math</div>
        <div className="text-[11px] text-text-secondary">
          bytebard turned Conway&#39;s Game of Life into a MIDI synth
        </div>
      </div>

      {/* Sticker 3 */}
      <div
        className="absolute text-[28px] select-none"
        style={{ top: 280, right: 80, transform: "rotate(-5deg)" }}
      >
        &#128187;
      </div>
    </div>
  );
}
