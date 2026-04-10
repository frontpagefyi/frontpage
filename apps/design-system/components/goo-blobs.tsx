/**
 * Shared goo blob layer — renders the SVG filter + two blobs
 * at different speeds for a liquid stretch effect.
 */

interface GooBlobsProps {
  filterId: string;
  pill: { left: number; width: number };
  height?: string;
  className?: string;
  stdDeviation?: number;
}

export function GooBlobs({
  filterId,
  pill,
  height = "h-full",
  className = "rounded-full",
  stdDeviation = 4,
}: GooBlobsProps) {
  return (
    <>
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={stdDeviation} result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="absolute inset-0 pointer-events-none" style={{ filter: `url(#${filterId})` }}>
        {/* Main blob — moves fast */}
        <div
          className={`absolute top-0 ${height} ${className} bg-bg-interactive`}
          style={{
            left: pill.left,
            width: pill.width,
            transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
        {/* Trail blob — follows slower, creates the goo stretch */}
        <div
          className={`absolute top-0 ${height} ${className} bg-bg-interactive`}
          style={{
            left: pill.left,
            width: pill.width,
            transition: "left 0.5s cubic-bezier(0.2, 0, 0, 1), width 0.4s cubic-bezier(0.2, 0, 0, 1)",
          }}
        />
      </div>
    </>
  );
}
