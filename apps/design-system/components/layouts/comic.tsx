export function ComicLayout() {
  return (
    <div className="p-4">
      <div className="rounded-lg border border-zinc-800 bg-white p-3 overflow-hidden">
        <div className="flex gap-2">
          {/* Panel 1 — double wide */}
          <div className="relative flex-[2] border-[3px] border-zinc-900 rounded-sm overflow-hidden">
            <div className="h-[200px] bg-gradient-to-br from-pink-400 to-orange-300 opacity-70" />
            <div className="absolute bottom-0 left-0 right-0 bg-amber-100 border-t-2 border-zinc-900 px-2 py-1 text-[10px] font-bold text-zinc-800 text-center">
              Meanwhile, in Creative Coding...
            </div>
            <div className="absolute bottom-10 right-4 bg-white border-2 border-zinc-900 rounded-2xl rounded-br-none px-3 py-1.5 text-[11px] text-zinc-800 font-medium max-w-[160px]">
              6 months of pixel work and it&apos;s DONE!
            </div>
          </div>

          {/* Panel 2 */}
          <div className="relative flex-1 border-[3px] border-zinc-900 rounded-sm overflow-hidden">
            <div className="h-[200px] bg-gradient-to-br from-blue-400 to-cyan-300 opacity-70" />
            <div className="absolute top-2 left-2 bg-white border-2 border-zinc-900 rounded-2xl rounded-bl-none px-2.5 py-1.5 text-[10px] text-zinc-800 font-medium max-w-[120px]">
              WebGPU is insane. 1M particles!
            </div>
          </div>

          {/* Panel 3 */}
          <div className="relative flex-1 border-[3px] border-zinc-900 rounded-sm overflow-hidden">
            <div className="h-[200px] bg-gradient-to-br from-green-400 to-emerald-300 opacity-70" />
            <div className="absolute top-2 right-2 bg-white border-2 border-zinc-900 rounded-2xl rounded-br-none px-2.5 py-1.5 text-[10px] text-zinc-800 font-medium max-w-[120px]">
              I turned Game of Life into a synth
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
