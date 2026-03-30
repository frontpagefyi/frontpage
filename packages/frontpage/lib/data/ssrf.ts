import "server-only";

/**
 * Returns true if the given hostname resolves to a private / loopback address
 * or is otherwise unsuitable for outbound server-side requests (SSRF protection).
 *
 * This check is NOT gated on NODE_ENV — it applies in all environments.
 */
export function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase();

  // Loopback / local names
  if (
    h === "localhost" ||
    h.endsWith(".local") ||
    h === "0.0.0.0" ||
    h === "::1" ||
    h === "[::1]"
  ) {
    return true;
  }

  // IPv4 loopback  127.0.0.0/8
  if (h.startsWith("127.")) return true;

  // IPv4 private ranges
  if (h.startsWith("10.")) return true;
  if (h.startsWith("192.168.")) return true;

  // 172.16.0.0 – 172.31.255.255
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true;

  // Link-local
  if (h.startsWith("169.254.")) return true;

  // IPv6 link-local and unique-local (covers fe80::, fc00::, fd…)
  if (h.startsWith("fe80:") || h.startsWith("[fe80:")) return true;
  if (h.startsWith("fc00:") || h.startsWith("[fc00:")) return true;
  if (h.startsWith("fd") || h.startsWith("[fd")) return true;

  return false;
}
