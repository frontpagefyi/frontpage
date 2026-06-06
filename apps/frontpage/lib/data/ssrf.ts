import "server-only";

/**
 * Reject hostnames that are literal IP addresses or localhost.
 * HTTPS enforcement (done by the caller) provides the remaining SSRF
 * protection: a domain resolving to a private IP won't have a valid
 * TLS certificate, so the handshake fails.
 *
 * Expects `url.hostname` (port already stripped by URL parser).
 */
export function assertPublicHostname(hostname: string): void {
  const h = hostname.toLowerCase();

  if (h === "localhost" || h.endsWith(".local")) {
    throw new Error(`Hostname is not allowed: ${hostname}`);
  }

  // Reject literal IPv4 (digits and dots) or IPv6 (contains colons).
  // Exotic formats (octal, hex, decimal) are normalised to dotted-decimal
  // by the WHATWG URL parser before reaching here.
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h) || h.includes(":")) {
    throw new Error(`IP addresses are not allowed: ${hostname}`);
  }
}
