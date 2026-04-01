import { cache } from "react";
import { z } from "zod";
import {
  PlcDidDocumentResolver,
  WebDidDocumentResolver,
  CompositeDidDocumentResolver,
} from "@atcute/identity-resolver";
import {
  type DidDocument,
  isAtprotoDid,
  getPdsEndpoint,
} from "@atcute/identity";
import { FRONTPAGE_APPVIEW_USER_AGENT } from "@/lib/constants";
import { invariant } from "@/lib/utils";
import { assertPublicHostname } from "@/lib/data/ssrf";

type Brand<K, T> = K & { __brand: T };
export type DID =
  | Brand<`did:plc:${string}`, "DID">
  | Brand<`did:web:${string}`, "DID">;

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
          headers: { "User-Agent": FRONTPAGE_APPVIEW_USER_AGENT },
          next: {
            // TODO: Also revalidate this when we receive an identity change event
            // That would allow us to extend the revalidation time to 1 day
            revalidate: 60 * 60, // 1 hour
          },
        }),
    }),
    web: new WebDidDocumentResolver({
      fetch: async (input, init) => {
        // SSRF protection: did:web resolves by fetching https://<domain>/.well-known/did.json,
        // so a crafted did:web:localhost or did:web:169.254.x.x could hit internal services.
        const url =
          input instanceof URL
            ? input
            : new URL(typeof input === "string" ? input : input.url);
        await assertPublicHostname(url.hostname);

        return fetch(input, {
          ...init,
          headers: {
            ...Object.fromEntries(new Headers(init?.headers).entries()),
            "User-Agent": FRONTPAGE_APPVIEW_USER_AGENT,
          },
          signal: AbortSignal.timeout(5000),
          next: { revalidate: 60 * 60 },
          redirect: "error",
        });
      },
    }),
  },
});

export const getDidDoc = cache(resolveDidDoc);

export async function resolveDidDoc(did: DID): Promise<DidDocument> {
  const doc = await didResolver.resolve(did);
  invariant(
    doc.id === did,
    `DID document id mismatch: expected ${did}, got ${doc.id}`,
  );
  return doc;
}

export const getPdsUrl = cache(async (did: DID) => {
  const doc = await getDidDoc(did);
  return getPdsEndpoint(doc) ?? null;
});
