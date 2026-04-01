export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #008080 0%, #004040 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Desktop icon strip */}
      <div className="fixed top-0 left-0 right-0 h-6 flex items-center px-1 gap-4 text-white text-xs" style={{ background: "transparent" }} />

      {/* Window chrome */}
      <div
        className="w-full max-w-md"
        style={{
          border: "2px solid",
          borderColor: "#ffffff #808080 #808080 #ffffff",
          boxShadow: "2px 2px 8px rgba(0,0,0,0.5)",
          background: "#d4d0c8",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-2 py-1 select-none"
          style={{
            background: "linear-gradient(to right, #000080, #1084d0)",
            height: "22px",
          }}
        >
          <div className="flex items-center gap-1">
            {/* Window icon */}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1" y="3" width="6" height="5" fill="#e8a000" />
              <rect x="9" y="3" width="6" height="5" fill="#e8a000" />
              <rect x="1" y="9" width="6" height="5" fill="#e8a000" />
              <rect x="9" y="9" width="6" height="5" fill="#e8a000" />
            </svg>
            <span
              className="text-white text-xs font-bold"
              style={{ fontFamily: "Arial, sans-serif", fontSize: "11px" }}
            >
              Frontpage — Sign In
            </span>
          </div>
          {/* Window control buttons */}
          <div className="flex items-center gap-0.5">
            {[
              { label: "−", title: "Minimize" },
              { label: "□", title: "Maximize" },
              { label: "✕", title: "Close" },
            ].map(({ label, title }) => (
              <button
                key={title}
                title={title}
                aria-label={title}
                className="flex items-center justify-center text-black font-bold leading-none cursor-default"
                style={{
                  width: "16px",
                  height: "14px",
                  fontSize: "10px",
                  background: "#d4d0c8",
                  border: "1px solid",
                  borderColor: "#ffffff #808080 #808080 #ffffff",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu bar */}
        <div
          className="flex items-center gap-0 px-1 text-black"
          style={{
            background: "#d4d0c8",
            borderBottom: "1px solid #808080",
            fontSize: "11px",
            fontFamily: "Arial, sans-serif",
            height: "20px",
          }}
        >
          {["File", "Edit", "View", "Help"].map((item) => (
            <button
              key={item}
              className="px-2 py-0 hover:bg-blue-800 hover:text-white cursor-default"
              style={{ fontSize: "11px", fontFamily: "Arial, sans-serif", background: "transparent", border: "none" }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Window body */}
        <div className="p-5" style={{ background: "#d4d0c8" }}>
          {children}
        </div>

        {/* Status bar */}
        <div
          className="flex items-center px-2"
          style={{
            background: "#d4d0c8",
            borderTop: "1px solid #808080",
            height: "20px",
            fontSize: "11px",
            fontFamily: "Arial, sans-serif",
            color: "#000000",
          }}
        >
          <div
            className="flex-1 px-1"
            style={{
              border: "1px solid",
              borderColor: "#808080 #ffffff #ffffff #808080",
              fontSize: "11px",
            }}
          >
            Ready
          </div>
        </div>
      </div>
    </div>
  );
}
