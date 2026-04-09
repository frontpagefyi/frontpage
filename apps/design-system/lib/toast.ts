/** Fires a brief toast notification. DOM-based, no React state needed. */
export function toast(message: string, duration = 2000) {
  const el = document.createElement("div");
  el.textContent = message;
  el.style.cssText = `
    position:fixed;bottom:80px;right:16px;
    z-index:9999;padding:8px 16px;border-radius:9999px;
    font-size:13px;font-weight:500;
    background:var(--color-bg-elevated);color:var(--color-text-primary);
    border:1px solid var(--color-bg-overlay);
    box-shadow:0 4px 16px oklch(0% 0 0 / 0.3);
    pointer-events:none;
  `;
  document.body.appendChild(el);

  // Enter
  el.animate(
    [
      { opacity: 0, transform: "translateY(8px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 200, easing: "ease-out", fill: "forwards" },
  );

  // Exit after duration
  setTimeout(() => {
    const anim = el.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(-4px)" },
      ],
      { duration: 200, easing: "ease-in", fill: "forwards" },
    );
    anim.onfinish = () => el.remove();
  }, duration);
}
