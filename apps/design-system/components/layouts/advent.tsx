const openDoors = [
  { day: 1, peek: "Perlin Noise" },
  { day: 2, peek: "Fluid Sim" },
  { day: 3, peek: "Win98" },
  { day: 4, peek: "ASCII Art" },
  { day: 5, peek: "Challenge!" },
  { day: 6, peek: "Shaders" },
];

const closedDoors = [8, 9, 10, 11, 12, 13, 14, 15];

export function Advent() {
  return (
    <div className="p-5">
      <div className="mx-auto grid max-w-[500px] grid-cols-5 gap-2">
        {/* Open doors (1-6) */}
        {openDoors.map((door) => (
          <div
            key={door.day}
            className="relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-md bg-purple-500 transition-transform hover:scale-105"
          >
            <div className="font-serif text-[10px] font-bold text-white">
              {door.day}
            </div>
            <div className="absolute bottom-1 px-1 text-center text-[10px] font-semibold leading-tight text-white">
              {door.peek}
            </div>
          </div>
        ))}

        {/* Today (day 7) */}
        <div className="flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-indigo-500 bg-zinc-100 transition-transform hover:scale-105 dark:bg-zinc-800">
          <div className="font-serif text-2xl font-bold text-zinc-400 dark:text-zinc-500">
            7
          </div>
        </div>

        {/* Closed doors (8-15) */}
        {closedDoors.map((day) => (
          <div
            key={day}
            className="flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 transition-transform hover:scale-105 dark:border-zinc-700 dark:bg-zinc-800"
          >
            <div className="font-serif text-2xl font-bold text-zinc-400 dark:text-zinc-500">
              {day}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
