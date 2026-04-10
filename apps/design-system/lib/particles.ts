const HEART_COLORS = [
  "oklch(55% 0.22 20)",
  "oklch(65% 0.20 30)",
  "oklch(60% 0.18 350)",
  "oklch(70% 0.15 15)",
  "oklch(55% 0.25 10)",
  "oklch(50% 0.20 340)",
  "oklch(62% 0.22 25)",
];

/** Spawn heart particle burst around a container element. */
export function spawnHeartParticles(
  container: HTMLElement,
  scale: "sm" | "md" = "md",
) {
  const fontSize = scale === "sm" ? [8, 4] : [10, 6];
  const dist = scale === "sm" ? [20, 20] : [25, 30];

  for (let i = 0; i < 7; i++) {
    const angle = (Math.PI * 2 * i) / 7 + (Math.random() - 0.5) * 0.5;
    const d = dist[0] + Math.random() * dist[1];
    const el = document.createElement("span");
    el.textContent = "♥";
    el.style.cssText = `
      position:absolute;left:50%;top:50%;pointer-events:none;
      font-size:${fontSize[0] + Math.random() * fontSize[1]}px;
      color:${HEART_COLORS[i]};z-index:10;
      --hx:${Math.cos(angle) * d}px;--hy:${Math.sin(angle) * d}px;
      --hs:${0.3 + Math.random() * 0.7};--hr:${Math.random() * 90 - 45}deg;
      animation:heart-float ${0.9 + Math.random() * 0.4}s ease-out forwards;
    `;
    container.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}
