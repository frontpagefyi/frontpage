import { cache } from "react";
import { type DID, getDidDoc, isDid } from "./did";
import {
  CompositeHandleResolver,
  DohJsonHandleResolver,
  WellKnownHandleResolver,
} from "@atcute/identity-resolver";
import { FRONTPAGE_APPVIEW_USER_AGENT } from "@/lib/constants";
import { isValidHandle } from "@atproto/syntax";

const handleResolver = new CompositeHandleResolver({
  strategy: "both",
  methods: {
    dns: new DohJsonHandleResolver({
      dohUrl: "https://cloudflare-dns.com/dns-query",
      fetch: (request) =>
        fetch(request, {
          headers: {
            "User-Agent": FRONTPAGE_APPVIEW_USER_AGENT,
            Accept: "application/dns-json",
          },
          next: {
            revalidate: 60 * 60 * 24, // 24 hours
          },
        }),
    }),
    http: new WellKnownHandleResolver({
      fetch: (request) => {
        const signal = AbortSignal.timeout(1500);
        return fetch(request, {
          signal,
          headers: {
            "User-Agent": FRONTPAGE_APPVIEW_USER_AGENT,
          },
          next: {
            revalidate: 60 * 60 * 24, // 24 hours
          },
        });
      },
    }),
  },
});

const getVerifiedDidFromHandle = cache(async (handle: string) => {
  if (!isValidHandle(handle)) {
    return null;
  }
  const did = await handleResolver.resolve(handle).catch(() => null);

  if (!did) return null;

  if (!isDid(did)) {
    return null;
  }

  const didDoc = await getDidDoc(did);
  const didDocHandle = didDoc.alsoKnownAs
    ?.find((handle) => handle.startsWith("at://"))
    ?.replace("at://", "");

  if (!didDocHandle) return null;

  return didDocHandle.toLowerCase() === handle.toLowerCase() ? did : null;
});

/**
 * Returns the DID of the the handle or the DID itself if it's a DID. Or null if the handle doesn't resolve to a DID.
 */
export const getDidFromHandleOrDid = cache(async (handleOrDid: string) => {
  const decodedHandleOrDid = decodeURIComponent(handleOrDid);
  if (isDid(decodedHandleOrDid)) {
    return decodedHandleOrDid;
  }

  return getVerifiedDidFromHandle(decodedHandleOrDid);
});

export const getVerifiedHandle = cache(async (did: DID) => {
  const didDoc = await getDidDoc(did);
  const didDocHandle = didDoc.alsoKnownAs
    ?.find((handle) => handle.startsWith("at://"))
    ?.replace("at://", "");

  if (!didDocHandle) return null;

  const resolvedDid = await getVerifiedDidFromHandle(didDocHandle);

  return resolvedDid ? didDocHandle : null;
});
