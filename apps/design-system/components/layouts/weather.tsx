const zones = [
  {
    label: "ISOMETRIC CITY",
    icon: "\uD83D\uDD25",
    detail: "287\u2191 HOT",
    top: 60,
    left: 40,
    size: 100,
    color: "var(--accent-destructive, #dc2626)",
  },
  {
    label: "WEBGPU",
    icon: "\u26A1",
    detail: "156\u2191 STORMY",
    top: 50,
    right: 100,
    size: 90,
    color: "var(--accent-primary, #6366f1)",
  },
  {
    label: "AUTOMATA",
    icon: "\uD83C\uDF31",
    detail: "203\u2191 WARM",
    top: 130,
    left: 200,
    size: 80,
    color: "var(--accent-success, #22c55e)",
  },
  {
    label: "RETRO",
    icon: "\u2601\uFE0F",
    detail: "MILD",
    top: 140,
    right: 40,
    size: 70,
    color: "var(--text-muted, #71717a)",
  },
];

const forecast = [
  { day: "Mon", icon: "\uD83D\uDD25", temp: "Hot" },
  { day: "Tue", icon: "\u26C5", temp: "Warm" },
  { day: "Wed", icon: "\u26C5", temp: "Warm" },
  { day: "Thu", icon: "\uD83C\uDF2A\uFE0F", temp: "Stormy" },
  { day: "Fri", icon: "\uD83D\uDD25", temp: "HOT" },
];

export function WeatherLayout() {
  return (
    <div className="p-5">
      <div
        className="relative mx-auto min-h-[280px] max-w-[600px] rounded-2xl p-5"
        style={{
          background:
            "linear-gradient(135deg, oklch(22% 0.04 240), oklch(18% 0.03 220))",
        }}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-base text-zinc-100">
            Community Forecast
          </h3>
          <span className="text-[11px] text-zinc-500">
            Mon Apr 7 &middot; Updated 12:00
          </span>
        </div>

        {/* Weather zones */}
        {zones.map((zone) => (
          <div
            key={zone.label}
            className="absolute flex flex-col items-center justify-center rounded-full border-2 p-2 text-center text-[10px]"
            style={{
              top: zone.top,
              left: zone.left,
              right: zone.right,
              width: zone.size,
              height: zone.size,
              borderColor: zone.color,
              color: zone.color,
            }}
          >
            <div className="mb-0.5 text-2xl">{zone.icon}</div>
            <div className="text-[10px] font-bold">{zone.label}</div>
            <div className="text-[10px]">{zone.detail}</div>
          </div>
        ))}

        {/* 5-day forecast bar */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
          {forecast.map((day) => (
            <div
              key={day.day}
              className="rounded-md px-2.5 py-2 text-center text-[10px]"
              style={{ background: "oklch(25% 0.02 240)" }}
            >
              <div className="mb-0.5 font-semibold text-zinc-200">
                {day.day}
              </div>
              <div className="text-base">{day.icon}</div>
              <div className="text-zinc-500">{day.temp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
