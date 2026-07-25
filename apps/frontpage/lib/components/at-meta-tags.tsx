// Implements the AT Tags community proposal: https://tangled.org/chrisshank.com/at-tags/

type AtRecordUri = {
  authority: string;
  collection?: string;
  rkey?: string;
};

function toAtUri({ authority, collection, rkey }: AtRecordUri) {
  return `at://${[authority, collection, rkey].filter(Boolean).join("/")}`;
}

/** The primary ATProto record(s) this page renders — essential to the page's existence. */
export function AtCanonical(props: AtRecordUri) {
  return <meta name="at:canonical" content={toAtUri(props)} />;
}

/** Auxiliary ATProto record(s) this page references, which could be removed without eliminating the page. */
export function AtAlternate(props: AtRecordUri) {
  return <meta name="at:alternate" content={toAtUri(props)} />;
}

/** The DID of whoever authored this page's content. */
export function AtAuthor({ did }: { did: string }) {
  return <meta name="at:author" content={`at://${did}`} />;
}
