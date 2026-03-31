import "server-only";

import { lookup } from "node:dns/promises";

/**
 * Resolve hostname via DNS and reject if it points to a private/loopback IP.
 * Call this before making outbound fetch requests to untrusted hosts.
 *
 * Note: there is a small TOCTOU window between this check and the actual
 * fetch connection (DNS could change). Native fetch does not support custom
 * agents/dispatchers that would eliminate this gap. This still catches the
 * vast majority of real SSRF attacks.
 */
export async function assertPublicHostname(hostname: string): Promise<void> {
  if (isPrivateHost(hostname)) {
    throw new Error(`Hostname is a private address: ${hostname}`);
  }

  const { address } = await lookup(hostname);
  if (isPrivateHost(address)) {
    throw new Error(
      `Hostname ${hostname} resolves to private address: ${address}`,
    );
  }
}

/**
 * Returns true if the given hostname or IP is private / loopback.
 */
export function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase();

  // Loopback / local names
  if (
    h === "localhost" ||
    h.endsWith(".local") ||
    h === "0.0.0.0" ||
    h === "0" ||
    h === "::1" ||
    h === "[::1]" ||
    h === "::" ||
    h === "[::]"
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

  // IPv6-mapped IPv4 private ranges (::ffff:10.0.0.1, [::ffff:127.0.0.1])
  const mappedMatch = h.match(/^\[?::ffff:([\d.]+)\]?$/);
  if (mappedMatch && mappedMatch[1]) {
    return isPrivateHost(mappedMatch[1]);
  }

  return false;
}
