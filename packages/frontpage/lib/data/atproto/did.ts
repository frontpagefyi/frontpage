import { cache } from "react";
import { z } from "zod";
import { PlcDidDocumentResolver } from "@atcute/identity-resolver";
import type { DidDocument } from "@atcute/identity";
import { FRONTPAGE_APPVIEW_USER_AGENT } from "@/lib/constants";
import { isPrivateHost } from "@/lib/data/ssrf";

type Brand<K, T> = K & { __brand: T };
export type DID = Brand<`did:${string}`, "DID">;

export function isDid(s: string): s is DID {
  if (s.startsWith("did:plc:")) {
    // did:plc: must have a non-empty identifier after the prefix
    return s.length > "did:plc:".length;
  }
  if (s.startsWith("did:web:")) {
    const host = s.slice("did:web:".length);
    // Reject empty host, path traversal, and slashes
    if (host.length === 0 || host.includes("/") || host.includes("..")) {
      return false;
    }
    return true;
  }
  return false;
}

export const didSchema = z.string().refine((s) => isDid(s), {
  message: "Invalid DID",
});

export function parseDid(s: string): DID | null {
  if (!isDid(s)) {
    return null;
  }
  return s;
}

const didResolver = new PlcDidDocumentResolver({
  apiUrl: process.env.PLC_DIRECTORY_URL ?? "https://plc.directory",
  fetch: (request) =>
    fetch(request, {
      headers: {
        "User-Agent": FRONTPAGE_APPVIEW_USER_AGENT,
      },
      next: {
        // TODO: Also revalidate this when we receive an identity change event
        // That would allow us to extend the revalidation time to 1 day
        revalidate: 60 * 60, // 1 hour
      },
    }),
});

async function resolveDidWeb(did: string): Promise<DidDocument> {
  // did:web:example.com → https://example.com/.well-known/did.json
  const host = did.replace("did:web:", "");

  // Security: reject private IPs and localhost in all environments
  if (isPrivateHost(host)) {
    throw new Error(`Refusing to resolve did:web for private host: ${host}`);
  }

  const url = `https://${host}/.well-known/did.json`;
  const response = await fetch(url, {
    headers: { "User-Agent": FRONTPAGE_APPVIEW_USER_AGENT },
    signal: AbortSignal.timeout(5000),
    next: { revalidate: 60 * 60 }, // 1 hour
    redirect: "error", // reject redirects (SSRF protection)
  });

  if (!response.ok) {
    throw new Error(`Failed to resolve ${did}: ${response.status}`);
  }

  return response.json() as Promise<DidDocument>;
}

export const getDidDoc = cache(async (did: DID): Promise<DidDocument> => {
  if (did.startsWith("did:web:")) {
    return resolveDidWeb(did);
  }
  // After the did:web early return, this is always did:plc
  const resolution = await didResolver.resolve(did as `did:plc:${string}`);
  return resolution;
});

export const getPdsUrl = cache(async (did: DID) => {
  const plc = await getDidDoc(did);
  const service = plc.service?.find(
    (s) => s.type === "AtprotoPersonalDataServer",
  );

  // TODO: Investigate and handle the other possible types of serviceEndpoint (eg. Record<string, string>)
  return typeof service?.serviceEndpoint === "string"
    ? service.serviceEndpoint
    : null;
});
