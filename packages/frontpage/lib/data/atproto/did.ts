import { cache } from "react";
import { z } from "zod";
import {
  CompositeDidDocumentResolver,
  PlcDidDocumentResolver,
  WebDidDocumentResolver,
} from "@atcute/identity-resolver";
import { type DidDocument, isAtprotoDid } from "@atcute/identity";
import { FRONTPAGE_APPVIEW_USER_AGENT } from "@/lib/constants";

type Brand<K, T> = K & { __brand: T };
export type DID = Brand<`did:${"plc" | "web"}:${string}`, "DID">;

export function isDid(s: string): s is DID {
  return isAtprotoDid(s);
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

const didResolver = new CompositeDidDocumentResolver({
  methods: {
    plc: new PlcDidDocumentResolver({
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
    }),

    web: new WebDidDocumentResolver({
      fetch: (request) => {
        const signal = AbortSignal.timeout(1500);
        return fetch(request, {
          headers: {
            "User-Agent": FRONTPAGE_APPVIEW_USER_AGENT,
          },
          signal,
          next: {
            revalidate: 60 * 60, // 1 hour
          },
        });
      },
    }),
  },
});

export const getDidDoc = cache(async (did: DID): Promise<DidDocument> => {
  const resolution = await didResolver.resolve(did);
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
