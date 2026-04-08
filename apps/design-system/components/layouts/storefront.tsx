const products = [
  {
    title: "Isometric city \u2014 pixel work",
    price: "287 pts",
    reviews: 94,
    stars: 5,
    badge: "HOT",
    color: "bg-indigo-100",
  },
  {
    title: "WebGPU compute shaders",
    price: "156 pts",
    reviews: 47,
    stars: 4,
    color: "bg-cyan-100",
  },
  {
    title: "Cell automata music gen",
    price: "203 pts",
    reviews: 32,
    stars: 5,
    badge: "NEW",
    color: "bg-green-100",
  },
  {
    title: "Win98 screensavers p5.js",
    price: "134 pts",
    reviews: 63,
    stars: 4,
    color: "bg-orange-100",
  },
  {
    title: "Fluid sim Navier-Stokes",
    price: "54 pts",
    reviews: 29,
    stars: 4,
    color: "bg-purple-100",
  },
  {
    title: "Challenge #47: Landscapes",
    price: "98 pts",
    reviews: 18,
    stars: 4,
    color: "bg-amber-100",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <span className="text-amber-500 text-xs">
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  );
}

export function StorefrontLayout() {
  return (
    <div className="px-6 py-5 max-w-[600px] mx-auto">
      <div className="grid grid-cols-3 gap-3">
        {products.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-border-default bg-bg-surface overflow-hidden"
          >
            {/* Image placeholder */}
            <div className={`h-[90px] ${item.color} relative`}>
              {item.badge && (
                <div
                  className={`absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${
                    item.badge === "HOT"
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                >
                  {item.badge}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-2.5">
              <div className="text-xs font-semibold text-text-primary leading-tight mb-1">
                {item.title}
              </div>
              <div className="text-sm font-bold text-accent-primary mb-1">
                {item.price}
              </div>
              <div className="mb-2">
                <Stars count={item.stars} />
                <span className="text-[10px] text-text-secondary ml-1">
                  ({item.reviews} reviews)
                </span>
              </div>
              <div className="text-[10px] font-semibold text-accent-secondary cursor-pointer hover:underline">
                + Add to Reading List
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
